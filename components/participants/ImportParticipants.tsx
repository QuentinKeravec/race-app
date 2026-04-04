'use client'

import React, { useRef } from 'react';
import Papa from 'papaparse';
import {Button} from "@heroui/button";
import {Upload} from "lucide-react";
import {ParticipantCSV} from "@/types/participants";
import {useUpsertParticipants} from "@/hooks/useParticipants";

export default function ImportParticipants({ raceId }: { raceId: string }) {
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
                const participantsToImport = results.data.map(participant  => ({
                    ...participant,
                    race_id: raceId,
                    checked_in: participant.checked_in === 'true'
                }));

                mutate(participantsToImport, {
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