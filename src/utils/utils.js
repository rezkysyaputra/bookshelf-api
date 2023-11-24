const postSuccessResponse = (books, message) => {
  return {
    status: 'success',
    message: message,
    data: {
      books,
    },
  };
};
const getSuccessResponse = (books) => {
  return {
    status: 'success',
    data: {
      books,
    },
  };
};

const messageSuccessResponse = (message) => {
  return {
    status: 'success',
    message: message,
  };
};
const errorResponse = (message) => {
  return {
    status: 'fail',
    message: message,
  };
};

export {
  getSuccessResponse,
  postSuccessResponse,
  errorResponse,
  messageSuccessResponse,
};
