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

interface ParticipantsListProps {
    raceId: string;
}

export default function ParticipantsList({ raceId }: ParticipantsListProps) {
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange, onClose: onDeleteClose } = useDisclosure();

    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data: participants } = useParticipants(raceId);
    const { mutate: deleteParticipants, isPending } = useDeleteParticipants();

    const handleConfirmDelete = () => {
        deleteParticipants({raceId, ids: idsToDelete}, {
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
                    { name: "メール", uid: "email", sortable: true },
                    { name: "Runnet id", uid: "runnetId", sortable: true },
                    { name: "Tシャツのサイズ", uid: "tshirtSize", sortable: true },
                    { name: "チェックイン", uid: "checkedIn", sortable: true },
                    { name: "確認メール送信日時", uid: "displayDate", sortable: true }
                ]}
                searchKey="fullName"
                initialVisibleColumns={["fullName", "email", "runnetId", "tshirtSize", "checkedIn", "displayDate"]}
                onDelete={(ids) => {
                    const stringIds = ids.map(id => String(id));

                    setIdsToDelete(stringIds);
                    onDeleteOpen();
                }}
                searchLabel="氏名"
                addButton={false}
                renderCell={(item: any, columnKey) => {
                    switch (columnKey) {
                        case "fullName":
                            return <p className="font-bold">{item.fullName}</p>;
                        case "event":
                            return <p className="font-bold">{item.eventName || "N/A"}</p>;
                        case "tshirtSize":
                            return <p className="font-bold">{item.tshirtSize}</p>;
                        case "displayDate":
                            return <p className="font-bold">{item.displayDate}</p>;
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