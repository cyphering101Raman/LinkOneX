import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const requireAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) throw new ApiError(401, "Not authenticated");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        throw new ApiError(401, "Invalid token");
    }
};
