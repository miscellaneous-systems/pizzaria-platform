"use server";

import { getToken } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

export type PaymentMethod = "MONEY" | "PIX" | "CARD";

export async function finishOrderAction(
    orderId: string,
    paymentMethod: PaymentMethod,
    tip: number = 0
) {
    if (!orderId) {
        return { success: false, error: "Falha ao finalizar pedido" };
    }

    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "Falha ao finalizar pedido" };
        }

        await apiClient("/order/finish", {
            method: "PUT",
            body: JSON.stringify({
                order_id: orderId,
                paymentMethod,
                tip: tip ?? 0,
            }),
            token,
        });

        revalidatePath("/dashboard");
        return { success: true, error: null };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao finalizar pedido";
        return { success: false, error: message };
    }
}