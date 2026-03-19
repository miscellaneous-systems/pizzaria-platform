import prismaClient from "../../prisma/index";

interface ListOrdersServiceProps {
    draft?: string;
    status?: string;
}

class ListOrdersService {
    async execute ({ draft, status }: ListOrdersServiceProps) {
        const where: { draft?: boolean; status?: boolean } = {};

        if (draft === "true") {
            where.draft = true;
        } else if (draft === "false") {
            where.draft = false;
        }

        if (status === "true") {
            where.status = true;
        } else if (status === "false") {
            where.status = false;
        }

        // Preserva o comportamento antigo quando nenhum filtro e passado.
        if (draft === undefined && status === undefined) {
            where.draft = false;
        }

        const orders = await prismaClient.order.findMany({
            where,
            select: {
                id: true,
                table: true,
                name: true,
                status: true,
                draft: true,
                createdAt: true,
                items: {
                    select: {
                        id: true,
                        amount: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                description: true,
                                banner: true,
                            },
                        },
                    },
                },
        }});

        return orders;
    }
}

export { ListOrdersService };
