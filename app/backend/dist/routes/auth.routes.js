"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.route('/register')
    .post(auth_controller_1.registerUser);
router.route('/login').post(passport_1.default.authenticate('local', { session: false }), auth_controller_1.localUserLogin);
router.route('/login-google').get(passport_1.default.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.route('/google/callback').get(passport_1.default.authenticate('google', { session: false }), auth_controller_1.googleUserLogin);
exports.default = router;
