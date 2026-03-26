import * as z from "zod";

export const raceSchema = z.object({
    name: z.string().min(3, "名前は3文字以上で入力してください"),
    eventId: z.string().min(1, "イベントを選択してください"),
    statusId: z.string().min(1, "ステータスを選択してください"),
});

export type RaceFormValues = z.infer<typeof raceSchema>;
