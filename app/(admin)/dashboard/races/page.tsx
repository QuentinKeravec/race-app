import {title} from "@/components/primitives";
import {Divider} from "@heroui/divider";
import RaceList from "@/components/races/RaceList";
import {Metadata} from "next";
import {getRaces} from "@/utils/races/queries";
import {getEvents} from "@/utils/events/queries";
import {getStatuses} from "@/utils/statuses/queries";

export const metadata: Metadata = {
    title: "レース一覧 - Course",
    description: "全てのレース管理画面",
};

export default async function RacesPage() {
    const [racesRes, eventsRes, statusesRes] = await Promise.all([
        getRaces(),
        getEvents(),
        getStatuses(),
    ]);

    const statusOptions = statusesRes.map(s => ({
        name: s.label,
        uid: s.id.toString()
    }));

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col items-start px-2">
                <h1 className={title({ size: "sm" })}>
                    レース一覧
                </h1>
            </div>
            <Divider />

            <RaceList
                initialRaces={racesRes}
                events={eventsRes}
                statuses={statusesRes}
                statusOptions={statusOptions}
            />
        </section>
    );
}