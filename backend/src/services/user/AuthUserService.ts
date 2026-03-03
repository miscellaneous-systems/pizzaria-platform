import { compare } from "bcryptjs";
import  prismaClient from "../../prisma/index";
import { sign } from "jsonwebtoken";
import 'dotenv/config';


interface AuthUserProps {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthUserProps) {
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        });

        if(!user){
            throw new Error("Usuário/E-mail não encontrado");
        }

        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch){
            throw new Error("Senha incorreta");
        }

        // Gerar token JWT
        const token = sign({
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET as string, {
            subject: user.id,
            expiresIn: "30d"
        })

        return{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        };
    }
}

export { AuthUserService };