export const formatValidationErrors = (backendErrors) => {
  const formattedErrors = {};
  backendErrors.forEach(error => {
    if (!formattedErrors[error.param]) {
      formattedErrors[error.param] = [];
    }
    formattedErrors[error.param].push(error.msg);
  });
  return formattedErrors;
};