'use client';

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Selection} from "@heroui/table";
import {useDisclosure} from "@heroui/modal";
import {Chip} from "@heroui/chip";

import {CustomTable} from "@/components/ui/CustomTable";
import {CustomEditModal} from "@/components/ui/CustomEditModal";
import {AddRaceForm} from "@/components/races/AddRaceForm";
import {CustomDeleteModal} from "@/components/ui/CustomDeleteModal";
import {TableSkeleton} from "@/components/ui/TableSkeleton";
import {Tables} from "@/types/supabase";
import {TransformedRace} from "@/types/race";
import {useDeleteRaces, useRaces} from "@/hooks/useRaces";

interface RaceListProps {
    initialRaces: TransformedRace[];
    events: Tables<"events">[];
    statuses: Tables<"race_statuses">[];
    statusOptions: { name: string; uid: string }[];
}

export default function RaceList({ initialRaces, events, statuses, statusOptions }: RaceListProps) {
    const router = useRouter();
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddChange, onClose: onAddClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange, onClose: onDeleteClose } = useDisclosure();

    const [isFormLoading, setIsFormLoading] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data: races } = useRaces(initialRaces);
    const { mutate: deleteRaces, isPending } = useDeleteRaces();

    const handleConfirmDelete = () => {
        deleteRaces(idsToDelete, {
            onSuccess: (result) => {
                if (!result?.error) {
                    setSelectedKeys(new Set([]));
                    onDeleteClose();
                }
            }
        });
    };

    if (!isClient) return <TableSkeleton />;

    return (
        <>
            <CustomTable
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                    setSelectedKeys(keys);

                    if (keys === "all") {
                        setIdsToDelete(initialRaces.map(r => String(r.id)));
                    } else {
                        setIdsToDelete(Array.from(keys).map(k => String(k)));
                    }
                }}
                data={races||[]}
                columns={[
                    { name: "名前", uid: "name", sortable: true },
                    { name: "イベント", uid: "event", sortable: true },
                    { name: "開始時間", uid: "displayDate", sortable: true },
                    { name: "距離", uid: "distanceMeters", sortable: true },
                    { name: "ステータス", uid: "status", sortable: true },
                ]}
                statusOptions={statusOptions}
                searchKey="name"
                initialVisibleColumns={["name", "event", "status", "distanceMeters", "displayDate"]}
                onAdd={onAddOpen}
                onDelete={(ids) => {
                    const stringIds = ids.map(id => String(id));

                    setIdsToDelete(stringIds);
                    onDeleteOpen();
                }}
                onRowAction={(id) => {
                    const race = races?.find(r => r.id.toString() === id.toString());
                    if (race) {
                        router.push(`/dashboard/races/${race.slug}`);
                    }
                }}
                searchLabel="名前"
                renderCell={(item: any, columnKey) => {
                    switch (columnKey) {
                        case "name":
                            return <p className="font-bold">{item.name}</p>;
                        case "event":
                            return <p className="font-bold">{item.eventName || "N/A"}</p>;
                        case "distanceMeters":
                            return <span>{item.distanceMeters.toFixed(3)} km</span>
                        case "status":
                            return (
                                <Chip
                                    className="capitalize"
                                    color={item.status === "開催中" ? "success" : "danger"}
                                    size="md"
                                    variant="flat"
                                >
                                    {item.status}
                                </Chip>
                            );
                        default:
                            return item[columnKey as string];
                    }
                }}
            />

            <CustomEditModal
                title="レースを追加"
                isOpen={isAddOpen}
                onOpenChange={onAddChange}
                formId="race-form"
                isLoading={isFormLoading}
            >
                <AddRaceForm
                    id="race-form"
                    events={events}
                    status={statuses}
                    onClose={onAddClose}
                    onLoadingChange={setIsFormLoading}
                />
            </CustomEditModal>

            <CustomDeleteModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteChange}
                onDelete={handleConfirmDelete}
                isLoading={isPending}
                ids={idsToDelete}
            />
        </>
    );
}