"use server";

import { getToken } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function finishOrderAction(orderId: string) {
    if(!orderId) {
        return { success: false, error: "Falha ao finalizar pedido" };
    }

    try {
        const token = await getToken();

        if(!token) {
            return { success: false, error: "Falha ao finalizar pedido" };
        }

        const data = {
            order_id: orderId,
        }

        await apiClient("/order/finish", {
            method: "Put",
            body: JSON.stringify(data),
            token: token,
        });

    }catch(error) {
        return { success: false, error: "Falha ao finalizar pedido" };
    }
    finally {

        revalidatePath("/dashboard");

        return { success: true, error: null };
    }
}