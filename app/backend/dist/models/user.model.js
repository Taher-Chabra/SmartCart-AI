"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const phoneSchema = new mongoose_1.default.Schema({
    countryCode: String,
    number: { type: String, trim: true },
}, { _id: false });
const addressSchema = new mongoose_1.default.Schema({
    line1: { type: String, trim: true },
    city: { type: String, trim: true },
    state: String,
    country: String,
    zip: String,
    landmark: String,
}, { _id: false });
const UserSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    phone: phoneSchema,
    address: addressSchema,
    role: {
        type: String,
        enum: ['customer', 'admin', 'seller'],
        default: 'customer',
    },
    avatar: {
        type: String,
    },
    wishlist: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Product',
            unique: true,
        },
    ],
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    cart: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            variants: {
                type: Map,
                of: String,
            },
        },
    ],
    orderHistory: [
        {
            orderId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Order',
                required: true,
            },
            orderDate: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    refreshToken: {
        type: String,
    },
}, { timestamps: true });
UserSchema.pre('save', async function (next) {
    const user = this;
    try {
        if (!user.isModified('password'))
            return next();
        const salt = await bcrypt_1.default.genSalt(10);
        user.password = await bcrypt_1.default.hash(user.password, salt);
        next();
    }
    catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});
UserSchema.methods.comparePassword = async function (newPassowrd) {
    return await bcrypt_1.default.compare(newPassowrd, this.password);
};
UserSchema.methods.generateAccessToken = function () {
    const payload = {
        _id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
    };
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    };
    return jsonwebtoken_1.default.sign(payload, tokenSecret, options);
};
UserSchema.methods.generateRefreshToken = function () {
    const payload = {
        _id: this._id,
    };
    const tokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    };
    return jsonwebtoken_1.default.sign(payload, tokenSecret, options);
};
exports.User = mongoose_1.default.model('User', UserSchema);
