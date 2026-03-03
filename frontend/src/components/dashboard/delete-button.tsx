"use client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";

interface DeleteButtonProductProps {
    productId: string;
}

export function DeleteButtonProduct({ productId }: DeleteButtonProductProps) {
    const router = useRouter();

    async function handleDeleteProduct() {
        const result = await deleteProductAction(productId);

        if(result.success) {
            alert("Produto deletado com sucesso");
            router.refresh();
        } else {
            alert(result.error);
        }
    }

    return (
        <Button variant="destructive" onClick={handleDeleteProduct}>
            <Trash className="w-5 h-5" />
        </Button>
    )
}