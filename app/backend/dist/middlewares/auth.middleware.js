"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWTAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const user_model_1 = require("../models/user.model");
exports.verifyJWTAuth = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new ApiError_1.ApiError(401, 'Unauthorized Request: No token provided');
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken || typeof decodedToken === 'string') {
            throw new ApiError_1.ApiError(401, 'Unauthorized Request: Invalid token');
        }
        const user = await user_model_1.User.findById(decodedToken._id).select('-password -refreshToken');
        if (!user) {
            throw new ApiError_1.ApiError(401, 'Unauthorized Request: Invalid token');
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new ApiError_1.ApiError(401, error?.message || "Invalid Access Token");
    }
});
