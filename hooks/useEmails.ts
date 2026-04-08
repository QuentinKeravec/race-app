import {useState} from "react";
import {TransformedParticipant} from "@/types/participants";
import {markAsEmailSent} from "@/utils/participants/actions";

export function useSendEmails() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const sendAllMails = async (participants: TransformedParticipant[], race: { name: string, eventName: string }) => {
        const toSend = participants.filter(p => !p.checkedIn);
        setIsLoading(true);
        setProgress({ current: 0, total: toSend.length });

        for (let i = 0; i < toSend.length; i++) {
            const p = toSend[i];
            try {
                const res = await fetch('/api/send-pass', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: p.email,
                        fullName: p.fullName,
                        participantId: p.id,
                        runnetId: p.runnetId,
                        event: race.eventName,
                        race: race.name,
                    }),
                });

                if (!res.ok) {
                    throw new Error(`失敗: ${p.email}`);
                } else {
                    await markAsEmailSent(p.id);
                }

                setProgress(prev => ({ ...prev, current: i + 1 }));
            } catch (error) {
                console.error(error);
            }
        }

        setIsLoading(false);
        return toSend.length;
    };

    return { sendAllMails, isLoading, progress };
}