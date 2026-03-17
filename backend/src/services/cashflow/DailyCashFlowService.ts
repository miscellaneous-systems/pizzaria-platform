import prismaClient from "../../prisma/index";

interface DailyCashFlowServiceProps {
    date?: string;
}

class DailyCashFlowService {
    async execute({ date }: DailyCashFlowServiceProps) {
        try {
            const targetDate = date ? new Date(`${date}T00:00:00`) : new Date();

            if (isNaN(targetDate.getTime())) {
                throw new Error("Data inválida");
            }

            const startOfDay = new Date(targetDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59, 999);

            const orders = await prismaClient.order.findMany({
                where: {
                    status: true,
                    createdAt: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    paymentMethod: true,
                    tip: true,
                    createdAt: true,
                    items: {
                        select: {
                            amount: true,
                            product: {
                                select: {
                                    price: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            let total = 0;
            let totalMoney = 0;
            let totalPix = 0;
            let totalCard = 0;
            let totalTip = 0;

            const ordersWithTotal = orders.map((order) => {
                const orderTotal = order.items.reduce((sum, item) => {
                    return sum + item.product.price * item.amount;
                }, 0);

                if (order.paymentMethod === "MONEY") totalMoney += orderTotal;
                else if (order.paymentMethod === "PIX") totalPix += orderTotal;
                else if (order.paymentMethod === "CARD") totalCard += orderTotal;

                total += orderTotal;
                totalTip += order.tip;

                return {
                    id: order.id,
                    table: order.table,
                    name: order.name,
                    paymentMethod: order.paymentMethod,
                    tip: order.tip,
                    total: orderTotal,
                    createdAt: order.createdAt,
                };
            });

            return {
                date: targetDate.toISOString().split("T")[0],
                total,
                totalMoney,
                totalPix,
                totalCard,
                totalTip,
                ordersCount: orders.length,
                orders: ordersWithTotal,
            };

        } catch (error) {
            console.error("Error fetching daily cash flow:", error);
            throw new Error("Falha ao buscar fluxo de caixa diário");
        }
    }
}

export { DailyCashFlowService };