export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Si è verificato un errore imprevisto',
    errors: err.errors || undefined,
  });
};
