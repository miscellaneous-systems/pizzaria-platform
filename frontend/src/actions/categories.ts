"use server"

import { apiClient } from "@/lib/api";
import { Category } from "@/lib/types";
import { getToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
    try{
    const name = formData.get("name") as string;
    const token = await getToken();

    const data = {
        name: name,
    }

    await apiClient<Category>("/category", {
        method: "POST",
        body: JSON.stringify(data),
        token: token,
    });

    revalidatePath("/dashboard/categories");

    return{success: true, error: ""}
    } catch (error) {
        if(error instanceof Error) {
            return{success: false, error: error.message}
        }
        return{success: false, error: "Erro ao criar categoria"}
    }
}