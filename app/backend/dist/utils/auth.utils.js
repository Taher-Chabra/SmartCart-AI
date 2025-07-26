"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResponseData = void 0;
const user_model_1 = require("../models/user.model");
const tokens_utils_1 = require("../utils/tokens.utils");
const authResponseData = async (user) => {
    const { accessToken, refreshToken } = await (0, tokens_utils_1.generateSecretTokens)(user._id);
    const loggedInUser = await user_model_1.User.findById(user._id).select("-password -refreshToken");
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };
    return {
        accessToken,
        refreshToken,
        loggedInUser,
        cookieOptions
    };
};
exports.authResponseData = authResponseData;
