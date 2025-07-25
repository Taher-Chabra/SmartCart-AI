import { Request, Response } from "express";
declare const registerUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const loginUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
export { registerUser, loginUser };
