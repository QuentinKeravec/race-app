import * as z from "zod";

export const raceSchema = z.object({
    name: z.string().min(3, "名前は3文字以上で入力してください"),
    slug: z.string({
        required_error: "URLは5ローマ字以上で入力してください",
    }).min(5, "URLは5ローマ字以上で入力してください"),
    distanceMeters: z
        .coerce
        .number({
            required_error: "距離を入力してください",
            invalid_type_error: "数字を入力してください",
        })
        .positive("距離は正の数で入力してください"),
    startTime: z.string({
        required_error: "日付の形式が正しくありません",
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: "日付の形式が正しくありません",
    }),
    eventId: z.string().min(1, "イベントを選択してください"),
    statusId: z.string().min(1, "ステータスを選択してください"),
    registrations: z
        .coerce
        .number({
            required_error: "申し込み定員を入力してください",
            invalid_type_error: "数字を入力してください",
        })
        .positive("申し込み定員は正の数で入力してください"),
    volunteers: z
        .coerce
        .number({
            required_error: "ボランティア定員を入力してください",
            invalid_type_error: "数字を入力してください",
        })
        .positive("ボランティア定員は正の数で入力してください"),
});

export type RaceFormValues = z.infer<typeof raceSchema>;
