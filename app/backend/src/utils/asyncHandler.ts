import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: Function) => {
   return (req: Request, res: Response, next: NextFunction) => {
      Promise
         .resolve( fn(req, res, next))
         .catch((error) => next(error));
   }
}

export { asyncHandler };