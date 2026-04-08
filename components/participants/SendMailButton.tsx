'use client'

import {useSendEmails} from "@/hooks/useEmails";
import {Button} from "@heroui/button";
import {TransformedParticipant} from "@/types/participants";
import {addToast} from "@heroui/toast";
import {useQueryClient} from "@tanstack/react-query";

interface SendMailButtonProps {
    race: { id: string, name: string, eventName: string },
    existingParticipants: TransformedParticipant[]
}

export function SendMailButton({ race, existingParticipants }: SendMailButtonProps) {
    const { sendAllMails, isLoading, progress } = useSendEmails();
    const queryClient = useQueryClient();

    const handlePress = async () => {
        const count = await sendAllMails(existingParticipants, race);

        queryClient.invalidateQueries({ queryKey: ["participants", race.id] });

        if (count > 0) {
            addToast({
                title: "送信完了",
                description: `${count} 件のメール送信を完了しました。`,
                color: "success",
            });
        } else {
            addToast({
                title: "情報",
                description: "送信対象の参加者はいませんでした。",
                color: "primary",
            });
        }
    };

    return (
        <div className="flex flex-col gap-2 items-center">
            <Button
                color="primary"
                variant="bordered"
                isLoading={isLoading}
                onPress={handlePress}
            >
                {isLoading ? `送信中... (${progress.current}/${progress.total})` : "メールを送る"}
            </Button>

            {isLoading && (
                <p className="text-tiny text-default-500">
                    ブラウザを閉じないでください
                </p>
            )}
        </div>
    );
}