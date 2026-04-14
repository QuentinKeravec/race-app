import {Card, CardBody, CardHeader} from "@heroui/card";
import {CustomBreadcrumbs} from "@/components/ui/CustomBreadcumbs";
import {Metadata} from "next";
import {getEventBySlug} from "@/utils/events/queries";
import {getRaces} from "@/utils/races/queries";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

interface EventPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
    const { slug } = await params;
    const race = await getEventBySlug(slug);

    return {
        title: "イベント一覧 > " + race?.name + " - Course",
        description: `Détails et gestion de la course : ${race?.name}.`
    };
}

export default async function EventDetailsPage({ params }: EventPageProps) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { slug } = await params;

    const [event, race] = await Promise.all([
        getEventBySlug(slug),
        getRaces()
    ]);

    if (!user) {
        redirect("/");
    }

    return (
        <div className="max-w-7xl mx-auto p-2 space-y-8">

            <div className="flex flex-col sm:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{ event?.name }</h1>
                    <CustomBreadcrumbs
                        parentLabel="レース一覧"
                        link="/races"
                        childrenLabel={event?.name}
                    />
                </div>
            </div>

            <Card className="p-4">
                <CardHeader className="flex justify-center px-6 py-4">
                </CardHeader>

                <CardBody className="px-6 space-y-4">
                </CardBody>
            </Card>
        </div>
    );
}