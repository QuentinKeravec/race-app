import {Card, CardBody} from "@heroui/card";
import {Progress} from "@heroui/progress";
import {Chip} from "@heroui/chip";
import {CustomBreadcrumbs} from "@/components/ui/CustomBreadcumbs";
import {Metadata} from "next";
import RaceTabs from "@/components/races/RaceTabs";
import ImportParticipants from "@/components/participants/ImportParticipants";
import {getRaceBySlug} from "@/utils/races/queries";
import {getEvents} from "@/utils/events/queries";
import {getStatuses} from "@/utils/statuses/queries";

interface RacePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RacePageProps): Promise<Metadata> {
    const { slug } = await params;
    const race = await getRaceBySlug(slug);

    return {
        title: race?.name,
        description: `Détails et gestion de la course : ${race?.name}.`
    };
}

export default async function RaceDetailsPage({ params }: RacePageProps) {
    const { slug } = await params;

    const [race, events, status] = await Promise.all([
        getRaceBySlug(slug),
        getEvents(),
        getStatuses()
    ]);


    return (
        <div className="max-w-7xl mx-auto p-2 space-y-8">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{ race?.name }</h1>
                    <CustomBreadcrumbs
                        parentLabel="レース一覧"
                        link="/races"
                        childrenLabel={race?.name}
                    />
                </div>
                <div className="flex gap-3">
                    <ImportParticipants raceId={race?.id}/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="border-none bg-primary/40 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-primary">申込者数</p>
                        <h3 className="text-2xl font-bold">{race.participants} / {race.registrations} 名</h3>
                        <Progress size="sm" value={84.2} color="primary" className="mt-2" />
                    </CardBody>
                </Card>

                <Card className="border-none bg-warning/40 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-warning">ボランティア人数</p>
                        <h3 className="text-2xl font-bold">0 / {race.volunteers} 名</h3>
                        <p className="text-tiny text-warning-600 mt-2">18 manquants</p>
                    </CardBody>
                </Card>

                <Card className="border-none bg-danger/40 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-default-500">ステータス</p>
                        <div className="mt-1">
                            <Chip color="warning" variant="faded" size="lg">{race.status}</Chip>
                        </div>
                        <p className="text-tiny mt-2">開始日：{race.displayDate}</p>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {race && <RaceTabs race={race} events={events} status={status}/>}
            </div>
        </div>
    );
}