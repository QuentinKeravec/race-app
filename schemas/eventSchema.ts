import * as z from "zod";

export const eventSchema = z.object({
    name: z.string().min(3, "名前は3文字以上で入力してください"),
    slug: z.string().min(5, "URLは5ローマ字以上で入力してください"),
});

export type EventFormValues = z.infer<typeof eventSchema>;