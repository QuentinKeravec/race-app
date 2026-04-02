'use client'

import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import {createClient} from "@/utils/client";
import {Button} from "@heroui/button";
import {Upload} from "lucide-react";
import {ParticipantCSV} from "@/types/participants";

export default function ImportParticipants({ raceId }: { raceId: string }) {
    const supabase = createClient();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);

        Papa.parse<ParticipantCSV>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const participantsToImport = results.data.map(participant  => ({
                    ...participant,
                    race_id: raceId,
                    checked_in: participant.checked_in === 'true'
                }));

                const { error } = await supabase
                    .from('participants')
                    .upsert(participantsToImport, { onConflict: 'race_id, runnet_id' });

                if (error) alert("エラー : " + error.message);
                else alert("インポートが完了しました");

                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
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
                isLoading={uploading}
                startContent={!uploading && <Upload size={18} />}
            >
                {uploading ? "Importation..." : "参加者をインポート(.csv)"}
            </Button>
        </div>
    );
}