'use client'

import {CustomTable} from "@/components/ui/CustomTable";
import {Chip} from "@heroui/chip";
import React, {useEffect, useState} from "react";
import {createClient} from "@/utils/client";
import {title} from "@/components/primitives";
import {Race} from "@/types/Race";
import {Event} from "@/types/Event";
import {Status} from "@/types/Status";
import {TableActions} from "@/components/ui/TableActions";
import {useDisclosure} from "@heroui/modal";
import {CustomModal} from "@/components/ui/CustomModal";
import {AddRaceForm} from "@/components/ui/AddRaceForm";
import {useRouter} from "next/navigation";
import {Divider} from "@heroui/divider";

const COLUMNS = [
    {name: "名前", uid: "name", sortable: true},
    {name: "イベント", uid: "event", sortable: true},
    {name: "ステータス", uid: "status", sortable: true},
];

const RACE_STATUS_OPTIONS = [
    {name: "開催中", uid: "active"},
    {name: "終了", uid: "finished"},
    {name: "準備中", uid: "upcoming"},
];

export default function RacesPage() {
    const [races, setRaces] = useState<Race[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [status, setStatus] = useState<Status[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const supabase = createClient();
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const FORM_ID = "add-race-form";
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        if (!isMounted) return;

        const fetchData = async () => {
            const [racesData, eventsData, statusData] = await Promise.all([
                supabase
                    .from('races')
                    .select(`
                        id,
                        name,
                        events(name),
                        race_statuses(name)
                    `),
                supabase.from('events').select('id, name'),
                supabase.from('race_statuses').select('id, name')
            ]);

            if (racesData.error || eventsData.error) {
                throw new Error(racesData.error?.message || eventsData.error?.message);
            }
            const races = racesData.data?.map(race => ({
                id: race.id,
                name: race.name,
                eventName: race.events?.name || '不明',
                status: race.race_statuses?.name || '不明'
            })) || [];
            const events = eventsData.data || [];
            const status = statusData.data || [];

            if (races) setRaces(races);
            if (events) setEvents(events);
            if (status) setStatus(status);
        }
        fetchData();
    }, [isMounted])

    const handleOpenAddModal = async () => {
        onOpen();
    };

    if (!isMounted) return null;

    return (
        <section className="flex flex-col gap-6 py-8">
            <div className="flex flex-col items-start gap-2 px-2">
                <h1 className={title({size: "sm"})}>
                    レース管理
                </h1>
            </div>
            <Divider />
            <CustomTable
                data={races}
                columns={COLUMNS}
                statusOptions={RACE_STATUS_OPTIONS}
                searchKey="name"
                initialVisibleColumns={["name", "event", "status"]}
                onAdd={handleOpenAddModal}
                onRowAction={(id: React.Key) => router.push(`/races/${id}`)}
                searchLabel="名前"
                renderCell={(item, columnKey) => {
                    switch (columnKey) {
                        case "name":
                            return <p className="font-bold">{item.name}</p>;
                        case "event":
                            return <p className="font-bold">{item.eventName}</p>;
                        case "status":
                            return (
                                <Chip className="capitalize" color={item.status === "開催中" ? "success" : "danger"}
                                      size="sm" variant="flat">
                                    {item.status}
                                </Chip>
                            );
                        default:
                            return (item as any)[columnKey];
                    }
                }}
            />

            <CustomModal
                title={mode === 'add' ? "レースを追加" : "レースを編集"}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                formId={FORM_ID}
            >
                <AddRaceForm id={FORM_ID} events={events} status={status} onClose={onClose}/>
            </CustomModal>

        </section>
    );
}