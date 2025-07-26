import { Request, Response } from "express";
declare const registerUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const localUserLogin: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const googleUserLogin: (req: Request, res: Response, next: import("express").NextFunction) => void;
export { registerUser, localUserLogin, googleUserLogin };
