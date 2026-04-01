'use client';

import React, {useEffect, useState} from "react";
import {Selection} from "@heroui/table";
import {useDisclosure} from "@heroui/modal";
import {Chip} from "@heroui/chip";

import {CustomTable} from "@/components/ui/CustomTable";
import {CustomDeleteModal} from "@/components/ui/CustomDeleteModal";
import {TableSkeleton} from "@/components/ui/TableSkeleton";
import {useDeleteRaces, useParticipants} from "@/hooks/useRaces";
import {CustomEditModal} from "@/components/ui/CustomEditModal";
import {AddParticipantForm} from "@/components/races/AddParticipantForm";

interface RaceListProps {
    raceId: string;
}

export default function ParticipantsList({ raceId }: RaceListProps) {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddChange, onClose: onAddClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange, onClose: onDeleteClose } = useDisclosure();

    const [isFormLoading, setIsFormLoading] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data: participants } = useParticipants(raceId);
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
                        setIdsToDelete(participants.map(r => String(r.id)));
                    } else {
                        setIdsToDelete(Array.from(keys).map(k => String(k)));
                    }
                }}
                data={participants||[]}
                columns={[
                    { name: "氏名", uid: "fullName", sortable: true },
                    { name: "Runnet id", uid: "runnetId", sortable: true },
                    { name: "Tシャツのサイズ", uid: "tShirtSize", sortable: true },
                    { name: "チェックイン", uid: "checkIn", sortable: true },
                ]}
                searchKey="fullName"
                initialVisibleColumns={["fullName", "runnetId", "tShirtSize", "checkIn"]}
                onAdd={onAddOpen}
                onDelete={(ids) => {
                    const stringIds = ids.map(id => String(id));

                    setIdsToDelete(stringIds);
                    onDeleteOpen();
                }}
                searchLabel="氏名"
                renderCell={(item: any, columnKey) => {
                    switch (columnKey) {
                        case "fullName":
                            return <p className="font-bold">{item.fullName}</p>;
                        case "event":
                            return <p className="font-bold">{item.eventName || "N/A"}</p>;
                        case "status":
                            return (
                                <Chip
                                    className="capitalize"
                                    color={item.status === "開催中" ? "success" : "danger"}
                                    size="sm"
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
                title="参加者を追加"
                isOpen={isAddOpen}
                onOpenChange={onAddChange}
                formId="participant-form"
                isLoading={isFormLoading}
            >
                <AddParticipantForm
                    id="participant-form"
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