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

    //role: z.enum(["admin", "user", "moderator"]).default("user"),
});

export type UserFormValues = z.infer<typeof userSchema>;