import { z } from "zod";

export const dailyCashFlowSchema = z.object({
    query: z.object({
        date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data deve estar no formato YYYY-MM-DD" 
        })
        .optional(),
    })
})