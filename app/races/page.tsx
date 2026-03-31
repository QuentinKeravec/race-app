import {createClient} from '@/utils/client';
import {title} from "@/components/primitives";
import {Divider} from "@heroui/divider";
import RaceList from "@/components/races/RaceList";
import {Metadata} from "next";
import {transformRace} from "@/utils/transformers";

export const metadata: Metadata = {
    title: "レース一覧",
    description: "全てのレース管理画面",
};

export default async function RacesPage() {
    const supabase = createClient();

    const [racesRes, eventsRes, statusesRes] = await Promise.all([
        supabase.from("races")
            .select(`
                    *,
                    events ( name ),
                    race_statuses ( id, label )
            `),
        supabase.from('events').select('*'),
        supabase.from('race_statuses').select('*'),
    ]);


    const events = eventsRes.data || [];
    const statuses = statusesRes.data || [];
    const transformedRaces = (racesRes.data || []).map(transformRace);

    const statusOptions = statuses.map(s => ({
        name: s.label,
        uid: s.id.toString()
    }));

    return (
        <section className="flex flex-col gap-6 py-8">
            <div className="flex flex-col items-start gap-2 px-2">
                <h1 className={title({ size: "sm" })}>
                    レース一覧
                </h1>
            </div>
            <Divider />

            <RaceList
                initialRaces={transformedRaces}
                events={events}
                statuses={statuses}
                statusOptions={statusOptions}
            />
        </section>
    );
}