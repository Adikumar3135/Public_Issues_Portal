import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.slice(7).trim();
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.sub);


        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid or inactive account"
            });
        }
        req.user = user;

        next();


    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        next(error);
    }
}

export function allowRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication Required"
            });
        }
        
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        next();
    };
}

