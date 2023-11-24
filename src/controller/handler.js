import { nanoid } from 'nanoid';
import bookValidation from '../validation/validation.js';
import { client } from '../server.js';
import {
  errorResponse,
  getSuccessResponse,
  messageSuccessResponse,
  postSuccessResponse,
} from '../utils/utils.js';

export const addBookHandler = async (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;

  // Validation Book
  try {
    await bookValidation.validateAsync({
      ...request.payload,
    });
    console.log('Validation Success');
  } catch (error) {
    console.error('Validation error: ', error.message);
    return h.response({ status: 'fail', message: error.message }).code(400);
  }

  // Push Book
  const query =
    'INSERT INTO books( id, name, year, author, summary, publisher, pageCount, readPage, finished, reading) VALUES($1, $2, $3, $4, $5, $6 , $7, $8, $9, $10) RETURNING *';
  const values = [
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
  ];

  try {
    const result = await client.query(query, values);
    console.log('Buku ditambahkan:', result.rows[0]);

    // Response Success
    return h
      .response(postSuccessResponse(id, 'Buku berhasil ditambahkan'))
      .code(201);
  } catch (error) {
    console.error(error.message);
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};

export const getAllBooksHandler = async (request, h) => {
  const { name, reading, finished } = request.query;
  console.log(name);

  let result;
  const query =
    'SELECT id, name, publisher FROM books WHERE LOWER(name) LIKE LOWER($1) OR reading = $2 OR finished= $3';

  try {
    if (name || reading || finished) {
      result = await client.query(query, [`%${name}%`, reading, finished]);
    } else {
      result = await client.query('SELECT id, name, publisher FROM books');
    }
    if (result.rows.length === 0) {
      throw Error('Buku tidak ditemukan');
    }

    console.log(result.rows);
    return h.response(getSuccessResponse(result.rows)).code(200);
  } catch (error) {
    console.error('Internal Server Error: ', error.message);
    return h.response(errorResponse(error.message)).code(400);
  }
};

export const getBookByIdHandler = async (request, h) => {
  const { bookId } = request.params;
  const query = 'SELECT * FROM books WHERE id = $1';

  try {
    const result = await client.query(query, [bookId]);

    // Check ID if available
    if (!result.rows[0]) {
      throw new Error('Buku tidak ditemukan');
    }
    // Response Success
    return h.response(getSuccessResponse(result.rows[0]));
  } catch (error) {
    console.error('Internal Server Error: ', error.message);
    return h
      .response({
        status: 'fail',
        message: error.message,
      })
      .code(404);
  }
};

export const editBookByIdHandler = async (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validation
  try {
    await bookValidation.validateAsync({ ...request.payload });
    console.log('Validation Success');
  } catch (error) {
    console.error('Validation error: ', error.message);
    return h.response({ status: 'fail', message: error.message }).code(400);
  }

  // Updated
  try {
    const query =
      'UPDATE books SET name = $1, year = $2, author = $3, summary = $4, publisher = $5, pageCount = $6, readPage = $7, reading = $8, updatedAt = CURRENT_TIMESTAMP WHERE id = $9  RETURNING *';
    const values = [
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      bookId,
    ];

    const result = await client.query(query, values);
    if (!result.rowCount) {
      throw new Error('Gagal memperbarui buku. Id tidak ditemukan');
    }
    console.log(result.rows[0]);
    return h
      .response(messageSuccessResponse('Buku berhasil diperbarui'))
      .code(200);
  } catch (error) {
    console.error('Internal Server Error: ', error.message);
    return h.response(errorResponse(error.message)).code(404);
  }
};

export const deleteBookByIdhandler = async (request, h) => {
  const { bookId } = request.params;
  const query = 'DELETE FROM books WHERE id = $1';
  try {
    const result = await client.query(query, [bookId]);

    // Check ID if available
    if (result.rowCount === 0) {
      throw new Error('Buku gagal dihapus. Id tidak ditemukan');
    }

    console.log(result.rows);

    return h
      .response(messageSuccessResponse('Buku berhasil dihapus'))
      .code(200);
  } catch (error) {
    console.log('Internal Server Error: ', error.message);
    return h.response(errorResponse(error.message)).code(404);
  }
};
