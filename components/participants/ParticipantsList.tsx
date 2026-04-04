'use client';

import React, {useEffect, useState} from "react";
import {Selection} from "@heroui/table";
import {useDisclosure} from "@heroui/modal";
import {Chip} from "@heroui/chip";

import {CustomTable} from "@/components/ui/CustomTable";
import {CustomDeleteModal} from "@/components/ui/CustomDeleteModal";
import {TableSkeleton} from "@/components/ui/TableSkeleton";
import {useDeleteParticipants} from "@/hooks/useParticipants";
import {useParticipants} from "@/hooks/useParticipants";

interface RaceListProps {
    raceId: string;
}

export default function ParticipantsList({ raceId }: RaceListProps) {
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange, onClose: onDeleteClose } = useDisclosure();

    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data: participants } = useParticipants(raceId);
    const { mutate: deleteParticipants, isPending } = useDeleteParticipants(idsToDelete);

    const handleConfirmDelete = () => {
        deleteParticipants(idsToDelete, {
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
                        setIdsToDelete(participants?.map(r => String(r.id)) ?? []);
                    } else {
                        setIdsToDelete(Array.from(keys).map(k => String(k)));
                    }
                }}
                data={participants||[]}
                columns={[
                    { name: "氏名", uid: "fullName", sortable: true },
                    { name: "Runnet id", uid: "runnetId", sortable: true },
                    { name: "Tシャツのサイズ", uid: "tshirtSize", sortable: true },
                    { name: "チェックイン", uid: "checkedIn", sortable: true },
                ]}
                searchKey="fullName"
                initialVisibleColumns={["fullName", "runnetId", "tshirtSize", "checkedIn"]}
                onDelete={(ids) => {
                    const stringIds = ids.map(id => String(id));

                    setIdsToDelete(stringIds);
                    onDeleteOpen();
                }}
                searchLabel="氏名"
                addButon={false}
                renderCell={(item: any, columnKey) => {
                    switch (columnKey) {
                        case "fullName":
                            return <p className="font-bold">{item.fullName}</p>;
                        case "event":
                            return <p className="font-bold">{item.eventName || "N/A"}</p>;
                        case "tshirtSize":
                            return <p className="font-bold">{item.tshirtSize}</p>;
                        case "checkedIn":
                            return (
                                <Chip
                                    className="capitalize"
                                    color={item.checkedIn === true ? "success" : "danger"}
                                    size="sm"
                                    variant="flat"
                                >
                                    {item.checkedIn === true ? "承認済み" : "未承認"}
                                </Chip>
                            );
                        default:
                            return item[columnKey as string];
                    }
                }}
            />

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