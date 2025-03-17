import createHttpError from "http-errors";

export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const httpError = createHttpError(404, "Bad Request", {
        error: error.details,
      });
      next(httpError);
    }
  };
}
