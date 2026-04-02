import {Card, CardBody, CardHeader,} from "@heroui/card";
import {Button} from "@heroui/button";
import {Progress} from "@heroui/progress";
import {Chip} from "@heroui/chip";
import {Divider} from "@heroui/divider";
import {User} from "@heroui/user";
import {CustomBreadcrumbs} from "@/components/ui/CustomBreadcumbs";
import {Metadata} from "next";
import {createClient} from "@/utils/client";
import RaceTabs from "@/components/races/RaceTabs";
import ImportParticipants from "@/components/participants/ImportParticipants";

interface RacePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RacePageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createClient();
    const { data: race } = await supabase.from('races').select('id, name').eq('slug', slug).single();

    return {
        title: race?.name,
        description: `Détails et gestion de la course : ${race?.name}.`
    };
}

export default async function RaceDetailsPage({ params }: RacePageProps) {
    const { slug } = await params;

    const supabase = createClient();
    const { data: race } = await supabase.from('races').select('id, name').eq('slug', slug).single();

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">

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
                <Card className="border-none bg-primary/10 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-primary">Inscriptions</p>
                        <h3 className="text-2xl font-bold">842 / 1000</h3>
                        <Progress size="sm" value={84.2} color="primary" className="mt-2" />
                    </CardBody>
                </Card>

                <Card className="border-none bg-warning/10 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-warning">Bénévoles</p>
                        <h3 className="text-2xl font-bold">42 / 60</h3>
                        <p className="text-tiny text-warning-600 mt-2">18 manquants</p>
                    </CardBody>
                </Card>

                <Card className="border-none bg-secondary/10 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-default-500">Status</p>
                        <div className="mt-1">
                            <Chip color="primary" variant="dot">Préparation</Chip>
                        </div>
                        <p className="text-tiny mt-2">J-12 avant le départ</p>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="px-6 py-4">
                        <h4 className="font-bold text-lg">Responsables Zone</h4>
                    </CardHeader>
                    <Divider />
                    <CardBody className="px-6 space-y-6">
                        <User
                            name="Responsable Sécurité"
                            description="Point de départ / Arrivée"
                            avatarProps={{ src: "https://i.pravatar.cc/150?u=a042581f4e29026024d" }}
                        />
                        <User
                            name="Chef Ravitaillement"
                            description="KM 10 / KM 21"
                            avatarProps={{ src: "https://i.pravatar.cc/150?u=a04258114e29026702d" }}
                        />
                        <User
                            name="Coordinateur Bénévoles"
                            description="Gestion des flux"
                            avatarProps={{ src: "https://i.pravatar.cc/150?u=a04258114e29026708c" }}
                        />
                    </CardBody>
                </Card>

                {race && <RaceTabs raceId={race.id} />}
            </div>
        </div>
    );
}