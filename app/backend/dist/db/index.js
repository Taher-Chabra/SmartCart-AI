"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants");
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose_1.default.connect(`${process.env.MONGO_URI}/${constants_1.DB_NAME}`);
        console.log(`MongoDB Connected!! DB Host: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred', error);
        }
        process.exit(1);
    }
};
exports.default = connectDB;
