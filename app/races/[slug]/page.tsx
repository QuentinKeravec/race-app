import {Card, CardBody, CardHeader,} from "@heroui/card";
import {Button} from "@heroui/button";
import {Progress} from "@heroui/progress";
import {Chip} from "@heroui/chip";
import {Divider} from "@heroui/divider";
import {User} from "@heroui/user";
import {CustomBreadcrumbs} from "@/components/ui/CustomBreadcumbs";
import {Metadata} from "next";
import {createClient} from "@/utils/client";

interface RacePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RacePageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createClient();
    const { data: race } = await supabase.from('races').select('name').eq('slug', slug).single();

    return {
        title: race?.name,
        description: `Détails et gestion de la course : ${race?.name}.`
    };
}

export default async function RaceAdminDetail({ params }: RacePageProps) {
    const { slug } = await params;

    const raceName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{ slug }</h1>
                    <CustomBreadcrumbs
                        parentLabel="レース一覧"
                        link="/races"
                        childrenLabel={raceName}
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="flat" color="primary">Modifier</Button>
                    <Button color="primary" shadow>Publier les résultats</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none bg-primary/10 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-primary">Inscriptions</p>
                        <h3 className="text-2xl font-bold">842 / 1000</h3>
                        <Progress size="sm" value={84.2} color="primary" className="mt-2" />
                    </CardBody>
                </Card>

                <Card className="border-none bg-success/10 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-success">Budget (Collecté)</p>
                        <h3 className="text-2xl font-bold">¥1,250,000</h3>
                        <p className="text-tiny text-success-600 mt-2">Target: ¥1.5M</p>
                    </CardBody>
                </Card>

                <Card className="border-none bg-warning/10 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-warning">Bénévoles</p>
                        <h3 className="text-2xl font-bold">42 / 60</h3>
                        <p className="text-tiny text-warning-600 mt-2">18 manquants</p>
                    </CardBody>
                </Card>

                <Card className="border-none bg-default-100 shadow-none">
                    <CardBody className="p-4">
                        <p className="text-small font-medium text-default-500">Status</p>
                        <div className="mt-1">
                            <Chip color="primary" variant="dot">Préparation</Chip>
                        </div>
                        <p className="text-tiny mt-2">J-12 avant le départ</p>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <Card className="lg:col-span-2">
                    <CardHeader className="flex justify-between px-6 py-4">
                        <h4 className="font-bold text-lg">Checklist Logistique</h4>
                        <Button size="sm" variant="light" color="primary">Ajouter une tâche</Button>
                    </CardHeader>
                    <Divider />
                    <CardBody className="px-6 space-y-4">
                        {[
                            { task: "Permis préfectoral (Police)", status: "OK", color: "success" },
                            { task: "Commande ravitaillement (Bananes/Eau)", status: "En attente", color: "warning" },
                            { task: "Installation Arches & Barrières", status: "À faire", color: "default" },
                            { task: "Vérification Chronométrie (Puces)", status: "OK", color: "success" }
                        ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-divider last:border-none">
                                <span className="text-default-700">{item.task}</span>
                                <Chip size="sm" variant="flat" color={item.color as any}>{item.status}</Chip>
                            </div>
                        ))}
                    </CardBody>
                </Card>

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
            </div>
        </div>
    );
}