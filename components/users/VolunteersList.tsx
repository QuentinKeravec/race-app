'use client';

import React, {useEffect, useState} from "react";
import {Selection} from "@heroui/table";
import {useDisclosure} from "@heroui/modal";

import {CustomTable} from "@/components/ui/CustomTable";
import {CustomDeleteModal} from "@/components/ui/CustomDeleteModal";
import {TableSkeleton} from "@/components/ui/TableSkeleton";
import {useDeleteVolunteers} from "@/hooks/useUsers";
import {useVolunteersByRaceId} from "@/hooks/useUsers";
import {User} from "@heroui/user";
import {CustomEditModal} from "@/components/ui/CustomEditModal";
import {AddVolunteerForm} from "@/components/users/AddVolunteerForm";

interface VolunteersListProps {
    raceId: string;
}

export default function VolunteersList({ raceId }: VolunteersListProps) {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddChange, onClose: onAddClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange, onClose: onDeleteClose } = useDisclosure();

    const [isFormLoading, setIsFormLoading] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data: volunteers } = useVolunteersByRaceId(raceId);
    const { mutate: deleteVolunteers, isPending } = useDeleteVolunteers();

    const handleConfirmDelete = () => {
        deleteVolunteers({raceId, ids: idsToDelete}, {
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

            <CustomEditModal
                title="ボランティアを追加"
                isOpen={isAddOpen}
                onOpenChange={onAddChange}
                formId="volunteer-form"
                isLoading={isFormLoading}
            >
                <AddVolunteerForm
                    raceId={raceId}
                    id="volunteer-form"
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