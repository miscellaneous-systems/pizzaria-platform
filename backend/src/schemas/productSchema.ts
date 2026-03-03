import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: "O nome é obrigatório" }),
        price: z.string().min(1, { message: "O preço é obrigatório" }).regex(/^\d+$/),
        description: z.string().min(1, { message: "A descrição é obrigatória" }),
        category_id: z.string({ message: "ID da categoria é obrigatório" }),
    }),
});

export const listProductSchema = z.object({
    query: z.object({
        disabled: z.string().optional()
    })
});

export const listProductByCategorySchema = z.object({
    query: z.object({
        category_id: z.string({ message: "ID da categoria é obrigatório" }),
    }),
});
