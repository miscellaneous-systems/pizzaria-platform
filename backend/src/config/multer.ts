import multer from "multer";
import { Request } from "express";
// Usar o memoryStorage para armazenar o arquivo em memória e enviar direto para o cloudinary

export default {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (_req: Request, file: Express.Multer.File, cb: any) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (allowedMimeTypes.includes(file.mimetype)) {
            return cb(null, true);
        }
        else{
            return cb(new Error('Invalid file type, use jpeg, png or jpg'), false);
        }
    },
};