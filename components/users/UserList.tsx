'use client';

import React, {useEffect, useState} from "react";
import {Selection} from "@heroui/table";
import {useDisclosure} from "@heroui/modal";
import {User} from "@heroui/user";

import {CustomTable} from "@/components/ui/CustomTable";
import {CustomEditModal} from "@/components/ui/CustomEditModal";
import {AddUserForm} from "@/components/users/AddUserForm";
import {CustomDeleteModal} from "@/components/ui/CustomDeleteModal";
import {TableSkeleton} from "@/components/ui/TableSkeleton";
import {TransformedUser} from "@/types/profile";
import {useDeleteUsers, useUsers} from "@/hooks/useUsers";
import {Chip} from "@heroui/chip";


interface UserListProps {
    initialUsers: TransformedUser[];
    roles: { id: string, label: string }[];
    roleOptions: { name: string; uid: string }[];
}

export default function UserList({ initialUsers, roles, roleOptions }: UserListProps) {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddChange, onClose: onAddClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange, onClose: onDeleteClose } = useDisclosure();

    const [isFormLoading, setIsFormLoading] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data: users } = useUsers(initialUsers);
    const { mutate: deleteUsers, isPending } = useDeleteUsers();

    const handleConfirmDelete = async () => {
        if (!users) return;

        let usersToDelete: TransformedUser[];

        if (selectedKeys === "all") {
            usersToDelete = users;
        } else {
            usersToDelete = users?.filter((u) => selectedKeys.has(u.id));
        }

        if (usersToDelete.length === 0) return;

        deleteUsers(usersToDelete, {
            onSuccess: (result) => {
                setSelectedKeys(new Set([]));
                onDeleteClose();
            }
        });
    }

    if (!isClient) return <TableSkeleton />;

    return (
        <>
            <CustomTable
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                    setSelectedKeys(keys);

                    if (keys === "all") {
                        setIdsToDelete(initialUsers.map(r => String(r.id)));
                    } else {
                        setIdsToDelete(Array.from(keys).map(k => String(k)));
                    }
                }}
                data={users}
                columns={[
                    {name: "ユーザー", uid: "fullName", sortable: true},
                    {name: "ロール", uid: "userRole", sortable: true},
                ]}
                statusOptions={roleOptions}
                searchKey="fullName"
                initialVisibleColumns={["fullName", "userRole"]}
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
                        case "userRole":
                            return (
                                <Chip
                                    className="capitalize"
                                    color={item.userRole === "管理者" ? "primary" : "warning"}
                                    size="md"
                                    variant="flat"
                                >
                                    {item.userRole}
                                </Chip>
                            );
                        default:
                            return cellValue;
                    }
                }}
                sortButtonLabel="ロール"
                filterKey="roleId"
            />

            <CustomEditModal
                title="レースを追加"
                isOpen={isAddOpen}
                onOpenChange={onAddChange}
                formId="user-form"
                isLoading={isFormLoading}
            >
                <AddUserForm
                    id="user-form"
                    roles={roles}
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