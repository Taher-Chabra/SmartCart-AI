"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = __importDefault(require("./db"));
const app_1 = require("./app");
(0, db_1.default)()
    .then(() => {
    const PORT = process.env.PORT || 8000;
    app_1.app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    app_1.app.on('error', (err) => {
        console.error('Error starting the Server:', err);
    });
})
    .catch((error) => {
    console.error('MongoDB connection failed:', error);
});
