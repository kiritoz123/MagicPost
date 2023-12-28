const authentication = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            msg: "You are not logged in!",
        });
    }
    next();
}

const authorization = (allowedRoles) => {
    return (req, res, next) => {
        const role = req.session.user.role;
        if (role && allowedRoles.includes(role)) {
          next(); // User is authorized, proceed to the next middleware or route handler
        } else {
          res.status(403).json({msg: "You are not authorized to access this page."});
        }
      };
}

module.exports = {
    authentication,
    authorization,
}