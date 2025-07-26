"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecretTokens = void 0;
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
// Function to generate access and refresh tokens for a user
const generateSecretTokens = async (userId) => {
    try {
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Failed to generate tokens");
    }
};
exports.generateSecretTokens = generateSecretTokens;
