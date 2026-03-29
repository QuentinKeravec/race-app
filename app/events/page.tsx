import React from "react";
import {title} from "@/components/primitives";
import {Divider} from "@heroui/divider";
import EventList from "@/components/events/EventList";
import {createClient} from "@/utils/client";

export default async function EventsPage() {
    const supabase = createClient();

    const eventsRes = await supabase.from('events').select(`
        id,
        name,
        slug`);
    const events = eventsRes.data || [];

    return (
        <section className="flex flex-col gap-6 py-8">
            <div className="flex flex-col items-start gap-2 px-2">
                <h1 className={title({size: "sm"})}>
                    イベント
                </h1>
            </div>
            <Divider />

            <EventList
                initialEvents={events}
            />
        </section>
    );
}