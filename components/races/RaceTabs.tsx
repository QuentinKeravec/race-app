'use client'

import {Tab, Tabs} from "@heroui/tabs";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Card, CardBody, CardHeader} from "@heroui/card";
import {useState, useTransition} from "react";
import ParticipantsList from "@/components/races/ParticipantsList";

export default function RaceTabs ({ raceId }: { raceId: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentTab = searchParams.get("tab") || "participants";

    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState("participants");

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
        <Card className="lg:col-span-3">
            <CardHeader className="flex justify-center px-6 py-4">
                <Tabs
                    selectedKey={currentTab}
                    onSelectionChange={handleTabChange}
                    disabledKeys={isPending ? ["participants", "inventory", "b"] : []}
                    color="primary"
                    classNames={{ tabList: "gap-6", cursor: "w-full" }}
                    radius="md"
                >
                    <Tab key="participants" title="参加者" />
                    <Tab key="inventory" title="在庫" />
                    <Tab key="b" title="Inventaire" />
                </Tabs>
            </CardHeader>

            <CardBody className="px-6 space-y-4">
                {selected === "participants" && <ParticipantsList raceId={raceId}/>}
                {selected === "b" && <p>Contenu de la Musique...</p>}
                {selected === "inventory" && <p>Contenu des Vidéos...</p>}
            </CardBody>
        </Card>
    );
}