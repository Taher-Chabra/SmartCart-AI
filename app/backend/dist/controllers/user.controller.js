"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
// Generate secret tokens for user authentication
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
const loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError_1.ApiError(400, "Email and password are required!");
    }
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(401, "Invalid email or password!");
    }
    const checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
        throw new ApiError_1.ApiError(401, "Incorrect password!");
    }
    const { accessToken, refreshToken } = await generateSecretTokens(user._id);
    const loggedInUser = await user_model_1.User
        .findById(user._id)
        .select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse_1.ApiResponse(200, { user: loggedInUser }, "User logged in successfully"));
});
exports.loginUser = loginUser;
