import * as z from "zod";

export const userSchema = z.object({
    fullName: z
        .string()
        .min(3, "名前は3文字以上で入力してください")
        .max(50, "名前が長すぎます"),

    email: z
        .string()
        .email("メールアドレスの形式が正しくありません")
        .min(1, "メールアドレスは必須項目です"),

    password: z
        .string()
        .min(8, "パスワードは8文字以上で入力してください")
        .regex(/[A-Z]/, "大文字を1文字以上含めてください")
        .regex(/[0-9]/, "大文字を1文字以上含めてください"),

    avatar_url: z.any()
        .refine((files) => files?.length > 0, "Une image est requise")
        .refine((files) => files?.[0]?.size <= 5000000, `Taille max 5MB`)
        .refine(
            (files) => ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
            "Seuls les formats .jpg, .png et .webp sont acceptés"
        ),
    //role: z.enum(["admin", "user", "moderator"]).default("user"),
});

export type UserFormValues = z.infer<typeof userSchema>;