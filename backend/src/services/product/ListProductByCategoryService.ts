import prismaClient from "../../prisma";

interface ListProductByCategoryServiceProps {
    category_id: string;
}

class ListProductByCategoryService {
    async execute({ category_id }: ListProductByCategoryServiceProps) {
        try {
            const categoryExists = await prismaClient.category.findUnique({
                where: {
                    id: category_id,
                },
            });

            if (!categoryExists) {
                throw new Error("Categoria não encontrada");
            }

            const products = await prismaClient.product.findMany({
                where: {
                    category_id: category_id,
                    disabled: false,
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                    disabled: true,
                    category_id: true,
                    createdAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return products;
        } catch (error) {        
            console.log(error);
            throw new Error("Falha ao listar produtos por categoria");
        }
    }
}

export { ListProductByCategoryService };
