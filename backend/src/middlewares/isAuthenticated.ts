import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
    sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {

    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ 
            message: "Não autorizado, token ausente" 
        });
    }

    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token!, process.env.JWT_SECRET as string) as Payload;

        req.user_id = sub;

        return next();
    }catch (err) {
        res.status(401).json({ 
            error: "Não autorizado, token inválido" 
        });
    }
}