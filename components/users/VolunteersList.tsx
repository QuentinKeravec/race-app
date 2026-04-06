'use client';

import React, {useEffect, useState} from "react";
import {Selection} from "@heroui/table";
import {useDisclosure} from "@heroui/modal";
import {Chip} from "@heroui/chip";

import {CustomTable} from "@/components/ui/CustomTable";
import {CustomDeleteModal} from "@/components/ui/CustomDeleteModal";
import {TableSkeleton} from "@/components/ui/TableSkeleton";
import {useDeleteParticipants} from "@/hooks/useParticipants";
import {useVolunteers} from "@/hooks/useUsers";
import {User} from "@heroui/user";
import {CustomEditModal} from "@/components/ui/CustomEditModal";
import {AddUserForm} from "@/components/users/AddUserForm";

interface VolunteersListProps {
    raceId: string;
}

export default function VolunteersList({ raceId }: VolunteersListProps) {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddChange, onClose: onAddClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange, onClose: onDeleteClose } = useDisclosure();

    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data: volunteers } = useVolunteers(raceId);
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
                        setIdsToDelete(volunteers.map(r => String(r.id)));
                    } else {
                        setIdsToDelete(Array.from(keys).map(k => String(k)));
                    }
                }}
                data={volunteers || []}
                columns={[
                    {name: "ボランティア", uid: "fullName", sortable: true},
                ]}
                searchKey="fullName"
                initialVisibleColumns={["fullName"]}
                onAdd={onAddOpen}
                onDelete={(ids) => {
                    const stringIds = ids.map(id => String(id));

                    setIdsToDelete(stringIds);
                    onDeleteOpen();
                }}
                searchLabel="名前"
                renderCell={(item, columnKey) => {
                    const cellValue = (item as Record<string, any>)[columnKey as string];

                    switch (columnKey) {
                        case "fullName":
                            return (
                                <User
                                    avatarProps={{radius: "lg", src: item.avatarUrl ?? undefined}}
                                    description={item.email}
                                    name={cellValue}
                                >
                                    {item.email}
                                </User>
                            );
                        default:
                            return cellValue;
                    }
                }}
                sortButtonLabel="ロール"
                filterKey="roleId"
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