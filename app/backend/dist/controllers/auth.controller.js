"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleUserLogin = exports.localUserLogin = exports.registerUser = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const auth_utils_1 = require("../utils/auth.utils");
const authSuccessCallback = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // This callback is intended to be used after authentication strategies - LocalStrategy, GoogleStrategy have validated the user's credentials and attached the user object to `req.user`.
    const user = req.user; // Passport populates req.user
    if (!user) {
        throw new ApiError_1.ApiError(401, "Authentication failed. User not found!");
    }
    const { accessToken, refreshToken, loggedInUser, cookieOptions } = await (0, auth_utils_1.authResponseData)(user);
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse_1.ApiResponse(200, { user: loggedInUser }, "User logged in successfully"));
});
// Register a new User
const registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { fullName, username, email, password, role } = req.body;
    if (!fullName || !username || !email || !password) {
        throw new ApiError_1.ApiError(400, "All fields are required!");
    }
    const existingUser = await user_model_1.User.findOne({
        $or: [{ username }, { email }]
    });
    if (existingUser) {
        throw new ApiError_1.ApiError(400, "User with this credentials already exists!");
    }
    const newUser = await user_model_1.User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        role
    });
    const createdUser = await user_model_1.User.findById(newUser._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError_1.ApiError(500, "Failed to create user!");
    }
    return res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, createdUser, "User registered successfully"));
});
exports.registerUser = registerUser;
// Login User
const localUserLogin = authSuccessCallback;
exports.localUserLogin = localUserLogin;
const googleUserLogin = authSuccessCallback;
exports.googleUserLogin = googleUserLogin;
