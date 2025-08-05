export const isAuthorized = (role) => {
    return (req, res, next) => {
        if (req.user.role!== role) {
            return next(new Error("You are not authorized to access this resource", { cause: 403 }));
        }
    }
}