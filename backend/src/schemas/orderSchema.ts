import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        table: z.number({ message: "A mesa deve ser um número" }).int({ message: "A mesa deve ser um número inteiro" }).positive({ message: "A mesa deve ser um número positivo" }),
        name: z.string().optional(),
    }),
});


export const addItemOrderSchema = z.object({
    body: z.object({
        order_id: z.string({ message: "ID do pedido é obrigatório" }),
        product_id: z.string({ message: "ID do produto é obrigatório" }),
        amount: z.number({ message: "A quantidade é obrigatória" }).int({ message: "A quantidade deve ser um número inteiro" }).positive({ message: "A quantidade deve ser um número positivo" }),
    }),
});

export const removeItemSchema = z.object({
    query: z.object({
        item_id: z.string({ message: "ID do item é obrigatório" }).min(1, { message: "ID do item é obrigatório" }),
    }),
});

export const detailOrderSchema = z.object({
    query: z.object({
        order_id: z.string({ message: "ID do pedido é obrigatório" }).min(1, { message: "ID do pedido é obrigatório" }),
    }),
});

export const sendOrderSchema = z.object({
    body: z.object({
        order_id: z.string({ message: "ID do pedido é obrigatório" }).min(1, { message: "ID do pedido é obrigatório" }),
        name: z.string({ message: "O nome é obrigatório" }).min(1, { message: "O nome é obrigatório" }),
    }),
});

export const finishOrderSchema = z.object({
    body: z.object({
        order_id: z.string({ message: "ID do pedido é obrigatório" }).min(1, { message: "ID do pedido é obrigatório" }),
    }),
}); 

export const deleteOrderSchema = z.object({
    query: z.object({
        order_id: z.string({ message: "ID do pedido é obrigatório" }).min(1, { message: "ID do pedido é obrigatório" }),
    }),
});
