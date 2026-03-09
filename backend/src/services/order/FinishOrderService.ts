import prismaClient from "../../prisma/index";

interface FinishOrderProps {
    order_id: string;
    paymentMethod: string;
    tip: number;
}

class FinishOrderService {
    async execute({ order_id, paymentMethod, tip }: FinishOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({
            where: {
                id: order_id
            }
        }); 

        if (!order) {
            throw new Error("Pedido não encontrado");
        }

        const updatedStatus = await prismaClient.order.update({
            where: {
                id: order_id
            },
            data: {
                status: true,
                paymentMethod: paymentMethod as "MONEY" | "PIX" | "CARD",
                tip: tip
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

        return updatedStatus;
    }
        catch (error) {
            console.error("Error finishing order:", error);
            throw new Error("Falha ao finalizar pedido");
        }
    }
}

export { FinishOrderService }