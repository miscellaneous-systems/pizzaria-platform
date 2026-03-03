import prismaClient from "../../prisma/index";

interface AddItemOrderProps {
    order_id: string;
    product_id: string;
    amount: number;
}

class AddItemOrderService {
    async execute({ order_id, product_id, amount }: AddItemOrderProps) {
        try {
            const order = await prismaClient.order.findUnique({
                where: {
                    id: order_id,
                },
            });

            if (!order) {
                throw new Error("Pedido não encontrado");
            }

            const productExists = await prismaClient.product.findUnique({
                where: {
                    id: product_id,
                    disabled: false,
                },
            });

            if (!productExists) {
                throw new Error("Produto não encontrado");
            }

            const item = await prismaClient.item.create({
                data: {
                    order_id: order_id,
                    product_id: product_id,
                    amount: amount,
                },
                select: {
                    id: true,
                    amount: true,
                    order_id: true,
                    product_id: true,
                    createdAt: true,
                    product: {
                        select: {
                            name: true,
                            price: true,
                            description: true,
                            banner: true,
                        },
                    }
                },
            });

            return item;


        } catch (error) {
            console.log(error);
            throw new Error("Erro ao adicionar item ao pedido");
        }
    }
}

export { AddItemOrderService };