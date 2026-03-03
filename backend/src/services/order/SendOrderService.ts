import prismaClient from "../../prisma/index";

interface SendOrderProps {
    order_id: string;
    name: string;
}

class SendOrderService {
    async execute({ order_id, name }: SendOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({
            where: {
                id: order_id
            }
        }); 

        if (!order) {
            throw new Error("Pedido não encontrado");
        }

        const updatedOrder = await prismaClient.order.update({
            where: {
                id: order_id
            },
            data: {
                draft: false,
                name: name
            },
            select: {
                id: true,
                table: true,
                name: true,
                draft: true,
                status: true,
                createdAt: true
            }
        });

        return updatedOrder;}
        catch (error) {
            console.error("Error updating order:", error);
            throw new Error("Falha ao atualizar pedido");
        }
    }
}

export { SendOrderService }