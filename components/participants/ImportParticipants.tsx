'use client'

import React, { useRef } from 'react';
import Papa from 'papaparse';
import {Button} from "@heroui/button";
import {Upload} from "lucide-react";
import {TransformedParticipant, ParticipantCSV} from "@/types/participants";
import {useUpsertParticipants} from "@/hooks/useParticipants";
import {addToast} from "@heroui/toast";

export default function ImportParticipants({ raceId, existingParticipants }: { raceId: string, existingParticipants: TransformedParticipant[] }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate, isPending } = useUpsertParticipants();

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse<ParticipantCSV>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const data = results.data.map(participant  => ({
                    ...participant,
                    race_id: raceId,
                    checked_in: participant.checked_in === 'true'
                }));

                const dataToUpsert = data.filter(newP => {
                    const existing = existingParticipants?.find(ep => ep.runnetId === newP.runnet_id);

                    if (!existing) return true;

                    return (
                        existing.fullName !== newP.full_name ||
                        existing.tshirtSize !== newP.tshirt_size ||
                        existing.checkedIn !== newP.checked_in
                    );
                });

                if (dataToUpsert.length === 0) {
                    addToast({
                        title: "情報",
                        description: "すべてのデータは最新の状態です。",
                        color: "primary",
                    });
                    return;
                }

                mutate({raceId, data: dataToUpsert}, {
                    onSuccess: () => {
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }
                });
            }
        });
    };

    return (
        <div className="flex items-center gap-4">
            <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
            />

            <Button
                color="primary"
                variant="flat"
                onPress={handleButtonClick}
                isLoading={isPending}
                startContent={!isPending && <Upload size={18} />}
            >
                {isPending ? "インポート中..." : "参加者をインポート(.csv)"}
            </Button>
        </div>
    );
}