import { nanoid } from 'nanoid';
import pg from 'pg';

const { Client } = pg;

export const client = new Client({
  user: 'rezky',
  host: 'localhost',
  database: 'bookshelf',
  password: 'admin',
  port: 5432,
});

export const addBook = async (book) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = book;

  const id = nanoid(16);
  const finished = pageCount === readPage;

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
  const result = await client.query(query, values);
  return result;
};

export const getAllBooks = async (reqQuery) => {
  const { name, reading, finished } = reqQuery;

  let result;
  const query =
    'SELECT id, name, publisher FROM books WHERE LOWER(name) LIKE LOWER($1) OR reading = $2 OR finished= $3';

  if (name || reading || finished) {
    result = await client.query(query, [`%${name}%`, reading, finished]);
    if (!result.rowCount) {
      throw Error('Buku tidak ditemukan');
    }
  } else {
    result = await client.query('SELECT id, name, publisher FROM books');
  }

  return result;
};

export const getBookById = async (id) => {
  const { bookId } = id;
  const query = 'SELECT * FROM books WHERE id = $1';

  const result = await client.query(query, [bookId]);

  if (!result.rowCount) {
    throw Error('Buku tidak ditemukan');
  }
  return result;
};

export const editBookById = async (id, book) => {
  const { bookId } = id;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = book;

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
    throw Error('Gagal memperbarui buku. Id tidak ditemukan');
  }
  return result;
};

export const deleteBookById = async (id) => {
  const { bookId } = id;
  const query = 'DELETE FROM books WHERE id = $1';

  const result = await client.query(query, [bookId]);
  if (!result.rowCount) {
    throw new Error('Buku gagal dihapus. Id tidak ditemukan');
  }
  return result.rows;
};
