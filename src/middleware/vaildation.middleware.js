export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(
        (detail) => detail.message
      );
      return next(
        new Error(`Validation error: ${errorMessages.join(", ")}`, {
          cause: 400,
        })
      );
    }
    return next();
  };
};
