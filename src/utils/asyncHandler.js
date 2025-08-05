export const asyncHandler = (controller) => (req, res, next) => {
  return controller(req, res, next).catch(next);
};
