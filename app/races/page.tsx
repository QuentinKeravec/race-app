import { createClient } from '@/utils/client';
import { title } from "@/components/primitives";
import { Divider } from "@heroui/divider";
import RaceList from "@/components/races/RaceList";

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

    const formatter = new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tokyo',
    });

    const transformedRaces = (racesRes.data || []).map((race: any) => ({
        id: race.id,
        name: race.name,
        slug: race.slug,
        distanceMeters: race.distance_meters ? (race.distance_meters / 1000).toFixed(3) : "0",
        startTime: race.start_time ? formatter.format(new Date(race.start_time)) : "不明",
        eventName: (Array.isArray(race.events) ? race.events[0]?.name : race.events?.name) ?? "不明",
        status: (Array.isArray(race.race_statuses) ? race.race_statuses[0]?.label : race.race_statuses?.label) ?? "不明",
        statusId: (Array.isArray(race.race_statuses) ? race.race_statuses[0]?.id : race.race_statuses?.id) ?? "",
    }));

    const statusOptions = statuses.map(s => ({
        name: s.label,
        uid: s.id.toString()
    }));

    return (
        <section className="flex flex-col gap-6 py-8">
            <div className="flex flex-col items-start gap-2 px-2">
                <h1 className={title({ size: "sm" })}>
                    レース
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