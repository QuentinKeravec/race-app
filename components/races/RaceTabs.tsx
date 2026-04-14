'use client'

import {Tab, Tabs} from "@heroui/tabs";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Card, CardBody, CardHeader} from "@heroui/card";
import {useState, useTransition} from "react";
import ParticipantsList from "@/components/participants/ParticipantsList";
import VolunteersList from "@/components/users/VolunteersList";
import {EditRaceForm} from "@/components/races/EditRaceForm";
import {Event} from "@/types/event";
import {Statuses} from "@/types/statuses";
import {TransformedRace} from "@/types/race";

interface RaceTabsProps {
    race: TransformedRace;
    events: Event[];
    status: Statuses[];
}

export default function RaceTabs ({ race, events, status }: RaceTabsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialTab = searchParams.get("tab") || "volunteers";

    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState(initialTab);

    const handleTabChange = (key: React.Key) => {
        const tabKey = key.toString();

        setSelected(tabKey);

        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", tabKey);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        })
    };

    return (
        <Card className="p-4">
            <CardHeader className="flex justify-center px-6 py-4">
                <Tabs
                    selectedKey={initialTab}
                    onSelectionChange={handleTabChange}
                    disabledKeys={isPending ? ["volunteers", "participants", "inventory", "infos"] : []}
                    color="primary"
                    classNames={{ tabList: "gap-6", cursor: "w-full" }}
                    radius="md"
                >
                    <Tab key="volunteers" title="ボランティア" />
                    <Tab key="participants" title="参加者" />
                    <Tab key="inventory" title="在庫" />
                    <Tab key="infos" title="詳細" />
                </Tabs>
            </CardHeader>

            <CardBody className="px-6 space-y-4">
                {selected === "volunteers" && <VolunteersList raceId={race.id}/>}
                {selected === "participants" && <ParticipantsList race={race}/>}
                {selected === "inventory" && <p>Contenu des Vidéos...</p>}
                {selected === "infos" && <EditRaceForm race={race} events={events} status={status}/>}
            </CardBody>
        </Card>
    );
}