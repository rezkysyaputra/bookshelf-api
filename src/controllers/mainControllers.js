import bookValidation from '../validation/validation.js';
import {
  errorResponse,
  getSuccessResponse,
  messageSuccessResponse,
  postSuccessResponse,
} from '../utils/utils.js';
import {
  addBook,
  deleteBookById,
  editBookById,
  getAllBooks,
  getBookById,
} from '../models/bookModel.js';

export const addBookHandler = async (request, h) => {
  const newBook = request.payload;
  // Validation Book
  try {
    await bookValidation.validateAsync(newBook);
    console.log('Validation Success');
  } catch (error) {
    console.error('Validation error: ', error.message);
    return h.response({ status: 'fail', message: error.message }).code(400);
  }

  // Push Book
  try {
    const book = await addBook(newBook);
    // Response Success
    return h
      .response(postSuccessResponse(book.id, 'Buku berhasil ditambahkan'))
      .code(201);
  } catch (error) {
    console.error(error.message);
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};

export const getAllBooksHandler = async (request, h) => {
  try {
    const result = await getAllBooks(request.query);

    return h.response(getSuccessResponse(result.rows)).code(200);
  } catch (error) {
    console.error('Internal Server Error: ', error.message);
    return h.response(errorResponse(error.message)).code(400);
  }
};

export const getBookByIdHandler = async (request, h) => {
  try {
    const result = await getBookById(request.params);

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
  // Validation
  try {
    await bookValidation.validateAsync(request.payload);
    console.log('Validation Success');
  } catch (error) {
    console.error('Validation error: ', error.message);
    return h.response({ status: 'fail', message: error.message }).code(400);
  }

  // Updated
  try {
    await editBookById(request.params, request.payload);
    return h
      .response(messageSuccessResponse('Buku berhasil diperbarui'))
      .code(200);
  } catch (error) {
    console.error('Internal Server Error: ', error.message);
    return h.response(errorResponse(error.message)).code(404);
  }
};

export const deleteBookByIdhandler = async (request, h) => {
  try {
    await deleteBookById(request.params);

    return h
      .response(messageSuccessResponse('Buku berhasil dihapus'))
      .code(200);
  } catch (error) {
    console.log('Internal Server Error: ', error.message);
    return h.response(errorResponse(error.message)).code(404);
  }
};
