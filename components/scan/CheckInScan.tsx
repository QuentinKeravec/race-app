'use client'

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"; // Import direct du moteur
import { createClient } from "@/utils/supabase/client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";
import { Camera, OctagonMinus } from 'lucide-react';
import {User} from "@supabase/auth-js";
import {TransformedParticipant} from "@/types/participants";
import {getParticipantById} from "@/utils/participants/queries";
import {TransformedRace} from "@/types/race";
import {updateCheckInParticipant} from "@/utils/participants/actions";
import {useQueryClient} from "@tanstack/react-query";

interface CheckInScanProps {
    user: User,
    race: TransformedRace
}

export default function CheckInScan({ user, race }: CheckInScanProps) {
    const queryClient = useQueryClient();
    const [scannedParticipant, setScannedParticipant] = useState<TransformedParticipant | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const html5QrCodeRef = useRef<Html5Qrcode | null>(null); // Référence persistante au moteur

    const readerElementId = "reader";

    useEffect(() => {
        if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode(readerElementId, {
                formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
                verbose: false
            });
        }

        return () => {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().catch(err => console.error("カメラのエラー:", err));
            }
        };
    }, []);

    const startScanning = async () => {
        if (!html5QrCodeRef.current) return;
        setCameraError(null);
        setIsLoading(true);

        try {
            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 300, height: 300 },
                    aspectRatio: 1.0
                },
                onScanSuccess,
                onScanError
            );
            setIsScanning(true);
        } catch (err: any) {
            setCameraError("カメラの起動に失敗しました。権限を確認してください");
            addToast({ title: "カメラの起動に失敗しました。", color: "danger" });
        } finally {
            setIsLoading(false);
        }
    };

    const stopScanning = async () => {
        if (!html5QrCodeRef.current || !html5QrCodeRef.current.isScanning) return;

        setIsLoading(true);
        try {
            await html5QrCodeRef.current.stop();
            setIsScanning(false);
        } catch (err) {
            console.error("エラー", err);
        } finally {
            setIsLoading(false);
        }
    };

    const onScanSuccess = async (decodedText: string) => {
        if (scannedParticipant || isLoading) return;

        if (navigator.vibrate) navigator.vibrate(50);

        await stopScanning();

        setIsLoading(true);
        const data = await getParticipantById(decodedText);

        if (!data) {
            addToast({ title: "登録されていないQRコードです。", color: "danger" });
            setTimeout(startScanning, 1500);
        } else {
            setScannedParticipant(data);
        }
        setIsLoading(false);
    };

    const onScanError = (errorMessage: string) => {
        //
    };

    const handleConfirmCheckin = async () => {
        if (!scannedParticipant) return;
        setIsLoading(true);

        const { error } = await updateCheckInParticipant(scannedParticipant.id, user.id);

        if (error) {
            addToast({ title: "エラーが発生しました。", color: "danger" });
        } else {
            addToast({ title: `${scannedParticipant.fullName} 様、チェックイン完了`, color: "success" });

            queryClient.invalidateQueries({ queryKey: ["participants", race.id] });
            setScannedParticipant(null);
            startScanning();
        }
        setIsLoading(false);
    };

    const handleCancelScan = () => {
        setScannedParticipant(null);
        startScanning();
    };

    return (
        <div className="max-w-xl mx-auto p-4 flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-center">参加者チェックイン</h1>

            <Card className="border-2 border-neutral-800 bg-black overflow-hidden relative min-h-[400px]">

                <div
                    id={readerElementId}
                    className={`w-full aspect-square ${isScanning ? 'block' : 'hidden'}`}
                >
                </div>

                {!isScanning && !scannedParticipant && (
                    <CardBody className="flex flex-col items-center justify-center gap-6 p-10 text-center">
                        <Camera className="w-20 h-20 text-neutral-700" />
                        {cameraError ? (
                            <p className="text-danger font-bold">{cameraError}</p>
                        ) : (
                            <p className="text-neutral-400">下のボタンを押して、カメラを起動してください。</p>
                        )}
                        <Button
                            color="primary"
                            size="lg"
                            startContent={<Camera />}
                            isLoading={isLoading}
                            onPress={startScanning}
                        >
                            スキャンを開始
                        </Button>
                    </CardBody>
                )}

                {isLoading && !isScanning && !scannedParticipant && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <Spinner label="確認中..." size="lg" />
                    </div>
                )}

                {scannedParticipant && (
                    <CardBody className="p-6 bg-neutral-900 flex flex-col gap-6 justify-center">
                        <CardHeader className="flex flex-col gap-1 p-0 items-start">
                            <h2 className="text-3xl font-bold text-neutral-400">{scannedParticipant.fullName} 様</h2>
                            <p className="text-sm text-neutral-400">ID: {scannedParticipant.runnetId} / 種目: {race.name || "N/A"}</p>
                        </CardHeader>

                        {scannedParticipant.checkedAt ? (
                            <>
                            <div className="bg-danger-500/20 text-danger border border-danger p-4 rounded-xl text-center font-bold">
                                ⚠️ チェックイン済みです。<br />
                                ({scannedParticipant.checkedAtDisplayDate} に実施)
                            </div>
                            <div className="flex gap-3">
                                <Button fullWidth size="lg" color="primary" onPress={handleCancelScan}>
                                    戻る
                                </Button>
                            </div>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Button fullWidth size="lg" color="danger" variant="flat" onPress={handleCancelScan}>
                                    キャンセル
                                </Button>
                                <Button fullWidth size="lg" color="success" isLoading={isLoading} onPress={handleConfirmCheckin}>
                                    チェックイン確定
                                </Button>
                            </div>
                        )}
                    </CardBody>
                )}
            </Card>

            {isScanning && (
                <Button
                    color="danger"
                    variant="bordered"
                    startContent={<OctagonMinus />}
                    onPress={stopScanning}
                >
                    カメラを停止
                </Button>
            )}
        </div>
    );
}