import {z} from "zod";

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string({ message: "O nome é obrigatório e deve ser um texto" }).min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
    }),
});
