import path from 'path';
import multer from 'multer';

const uploadDir = path.resolve(__dirname, '../../public/temp');

const storage = multer.diskStorage({
   destination: function (
      req: Express.Request, 
      file: Express.Multer.File, 
      cb: (error: Error | null, destination: string) => void
   ) {
      cb(null, uploadDir)
   },

   filename: function (
      req: Express.Request, 
      file: Express.Multer.File, 
      cb: (error: Error | null, filename: string) => void
   ) {
      const prefix = file.fieldname === 'avatar' ? 'avatar_' : 'product_';
      cb(null, prefix + file.originalname.toLowerCase());
   }
})

export const upload = multer({ storage });