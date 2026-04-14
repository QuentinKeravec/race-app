import {getParticipantById} from "@/utils/participants/queries";
import {Card, CardHeader, CardBody} from "@heroui/card";
import {Divider} from "@heroui/divider";
import {QRCodeDisplay} from "@/components/ui/QRCodeDisplay";
import {Metadata} from "next";

interface PassPageProps {
    params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
    title: "参加確認証 - Course",
    description: "レースの参加確認証",
};

export default async function PassPage({ params }: PassPageProps) {
    const { id } = await params;
    const participant = await getParticipantById(id);

    if (!participant) {
        return <div className="p-10 text-center">参加証が見つかりませんでした。</div>;
    }

    const qrValue = participant.id;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="max-w-[400px] w-full shadow-xl">
                <CardHeader className="flex flex-col gap-1 items-center bg-primary text-white py-6">
                    <p className="text-tiny uppercase font-bold opacity-80">参加証</p>
                    <h1 className="text-xl font-bold">{participant.raceName}</h1>
                </CardHeader>

                <CardBody className="flex flex-col items-center gap-6 py-8">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">お名前</p>
                        <h2 className="text-2xl font-bold">{participant.fullName} 様</h2>
                        <p className="text-gray-400 text-xs">RUNNET ID: {participant.runnetId}</p>
                    </div>

                    <Divider />

                    <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-gray-100">
                        <QRCodeDisplay value={qrValue} />
                    </div>

                    <div className="text-center bg-blue-50 p-4 rounded-lg w-full">
                        <p className="text-blue-700 text-sm font-bold">
                            受付でこの画面をご提示ください
                        </p>
                    </div>

                    <p className="text-gray-400 text-[10px] text-center italic">
                        ヒント：電波の弱い場所では、スクリーンショットの保存をおすすめします。
                    </p>
                </CardBody>
            </Card>
        </div>
    );
}