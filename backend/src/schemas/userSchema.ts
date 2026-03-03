import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
        name:z.string({ message:"O nome deve ser um texto"}).min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
        email:z.email({ message: "E-mail inválido" }),
        password:z.string({message: "A senha é obrigatória"}).min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),  
    }),
});

export const authUserSchema = z.object({
    body: z.object({
        email: z.email({ message: "E-mail inválido" }),
        password: z
        .string({message: "A senha é obrigatória"})
        .min(1, { message: "A senha é obrigatória" }),
    }),
});
