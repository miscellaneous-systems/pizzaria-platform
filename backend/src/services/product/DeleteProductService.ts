import prismaClient from "../../prisma/index"; 


interface DeleteProductServiceProps {
    product_id: string;
}

class DeleteProductService {
    async execute({ product_id }: DeleteProductServiceProps) {
        try {
           await prismaClient.product.update({
                where: {
                    id: product_id,
                },
                data: {
                    disabled: true,
                }
            });
                
            return { message: "Produto desativado com sucesso" }; 

        } catch (error) {
            console.log(error);
            throw new Error("Erro ao desativar produto");
        }
    }   
}

export { DeleteProductService };