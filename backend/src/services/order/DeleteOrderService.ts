import prismaClient from "../../prisma/index";

interface DeleteOrderProps {
    order_id: string;
}

class DeleteOrderService {
    async execute({ order_id }: DeleteOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({
            where: {
                id: order_id
            }
        }); 

        if (!order) {
            throw new Error("Pedido não encontrado");
        }

        await prismaClient.order.delete({
            where: {
                id: order_id
            },
        });

        return { message: "Pedido excluído com sucesso" };
    }
        catch (error) {
            console.error("Error deleting order:", error);
            throw new Error("Falha ao excluir pedido");
        }
    }
}

export { DeleteOrderService }