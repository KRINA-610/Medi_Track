const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).send({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded;  // { _id, role } available in all routes
        next();
    } catch (error) {
        res.status(401).send({ message: "Invalid or expired token." });
    }
};

module.exports = auth;