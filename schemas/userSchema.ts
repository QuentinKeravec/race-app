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
        .optional()
        .refine((files) => {
            if (!files || files.length === 0) return true;
            return files[0]?.size <= 5000000;
        }, "ファイルサイズは5MB以下にしてください")
        .refine((files) => {
            if (!files || files.length === 0) return true;
            return ["image/jpeg", "image/png", "image/webp"].includes(files[0]?.type);
        }, ".jpg, .png, .webp形式のみアップロード可能です"),
    roleId: z.string().min(1, "ロールを選択してください"),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const volunteerSchema = z.object({
    volunteerId: z
        .any()
        .transform((val) => {
            if (val instanceof Set) return Array.from(val) as string[];
            if (typeof val === "string") return val.split(",").filter(Boolean);
            return val;
        })
        .pipe(
            z.array(z.string()).min(1, "少なくとも1人を選択してください")
        ),
});

export type VolunteerFormValues = z.infer<typeof volunteerSchema>;