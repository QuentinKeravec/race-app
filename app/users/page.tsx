'use client'

import {CustomTable} from "@/components/ui/CustomTable";
import React, {useState} from "react";
import {title} from "@/components/primitives";
import {useDisclosure} from "@heroui/modal";
import {CustomEditModal} from "@/components/ui/CustomEditModal";
import {useRouter} from "next/navigation";
import {Divider} from "@heroui/divider";
import {TableSkeleton} from "@/components/ui/TableSkeleton";
import {CustomDeleteModal} from "@/components/ui/CustomDeleteModal";
import {Selection} from "@heroui/table";
import {useDeleteUsers, useUsers} from "@/hooks/useUsers";
import {AddUserForm} from "@/components/users/AddUserForm";
import {User} from "@heroui/user";
import {UserProfile} from "@/types/profile";

const COLUMNS = [
    {name: "ユーザー", uid: "full_name", sortable: true},
];

export default function UsersPage() {
    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onOpenChange: onAddChange,
        onClose: onAddClose
    } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onOpenChange: onDeleteChange,
        onClose: onDeleteClose
    } = useDisclosure();
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [idsToDelete, setIdsToDelete] = React.useState<(string | number)[]>([]);
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));

    // DB
    const { data: users, isLoading, error } = useUsers();
    const { mutate: deleteUsers } = useDeleteUsers();

    const handleOpenAdd = async () => {
        onAddOpen();
    };

    const handlePrepareDelete = (ids: (string | number)[]) => {
        setIdsToDelete(ids);
        onDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        if (!users) return;

        let usersToDelete: UserProfile[] = [];

        if (selectedKeys === "all") {
            usersToDelete = users;
        } else {
            usersToDelete = users?.filter((u) => selectedKeys.has(u.id));
        }

        if (usersToDelete.length === 0) return;

        deleteUsers({ users: usersToDelete });
        setSelectedKeys(new Set([]));
        onDeleteClose();
    }

    if (isLoading) return <TableSkeleton />;
    if (error) return <p>ユーザーの読み込み中にエラーが発生しました</p>;

    return (
        <section className="flex flex-col gap-6 py-8">
            <div className="flex flex-col items-start gap-2 px-2">
                <h1 className={title({size: "sm"})}>
                    ユーザー
                </h1>
            </div>
            <Divider />
            <CustomTable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                data={users || []}
                columns={COLUMNS}
                searchKey="full_name"
                initialVisibleColumns={["full_name", "email"]}
                onAdd={handleOpenAdd}
                onDelete={handlePrepareDelete}
                searchLabel="名前"
                renderCell={(item, columnKey) => {
                    const cellValue = (item as Record<string, any>)[columnKey as string];

                    switch (columnKey) {
                        case "full_name":
                            return (
                                <User
                                    avatarProps={{radius: "lg", src: item.avatar_url ?? undefined}}
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
            />

            <CustomEditModal
                title="ユーザーを追加"
                isOpen={isAddOpen}
                onOpenChange={onAddChange}
                formId="user-form"
                isLoading={isFormLoading}
            >
                <AddUserForm
                    id="user-form"
                    onClose={onAddClose}
                    onLoadingChange={setIsFormLoading}
                />
            </CustomEditModal>

            <CustomDeleteModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteChange}
                onDelete={handleConfirmDelete}
                isLoading={isFormLoading}
                ids={idsToDelete}
            />
        </section>
    );
}