'use client'

import {CustomTable} from "@/components/ui/CustomTable";
import {Chip} from "@heroui/chip";
import React, {useState} from "react";
import {title} from "@/components/primitives";
import {useDisclosure} from "@heroui/modal";
import {CustomEditModal} from "@/components/ui/CustomEditModal";
import {AddRaceForm} from "@/components/ui/AddRaceForm";
import {useRouter} from "next/navigation";
import {Divider} from "@heroui/divider";
import {TableSkeleton} from "@/components/ui/TableSkeleton";
import {CustomDeleteModal} from "@/components/ui/CustomDeleteModal";
import {Selection} from "@heroui/table";
import {useDeleteRaces, useRaces} from "@/hooks/useRaces";
import {useEvents} from "@/hooks/useEvents";
import {useStatuses} from "@/hooks/useStatuses";

const COLUMNS = [
    {name: "名前", uid: "name", sortable: true},
    {name: "イベント", uid: "event", sortable: true},
    {name: "ステータス", uid: "status", sortable: true},
];

export default function RacesPage() {
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
    const router = useRouter();
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [idsToDelete, setIdsToDelete] = React.useState<(string | number)[]>([]);
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));

    // DB
    const { data: races, isLoading: isLoadingRaces } = useRaces();
    const { mutate } = useDeleteRaces();
    const { data: events } = useEvents();
    const { data: status, isLoading: isLoadingStatus } = useStatuses();

    const statusOptions = React.useMemo(() => {
        return status?.map(s => ({ name: s.label, uid: s.id })) || [];
    }, [status]);

    const handleOpenAdd = async () => {
        onAddOpen();
    };

    const handlePrepareDelete = (ids: (string | number)[]) => {
        setIdsToDelete(ids);
        onDeleteOpen();
    };

    const handleConfirmDelete = () => {
        mutate(idsToDelete, {
            onSuccess: () => {
                setSelectedKeys(new Set([]));
                onDeleteClose();
            }
        });
    };

    if (isLoadingRaces || isLoadingStatus) {
        return <TableSkeleton />;
    }

    return (
        <section className="flex flex-col gap-6 py-8">
            <div className="flex flex-col items-start gap-2 px-2">
                <h1 className={title({size: "sm"})}>
                    レース
                </h1>
            </div>
            <Divider />
            <CustomTable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                data={races || []}
                columns={COLUMNS}
                statusOptions={statusOptions}
                searchKey="name"
                initialVisibleColumns={["name", "event", "status"]}
                onAdd={handleOpenAdd}
                onDelete={handlePrepareDelete}
                onRowAction={(id: React.Key) => router.push(`/races/${id}`)}
                searchLabel="名前"
                renderCell={(item, columnKey) => {
                    const cellValue = (item as Record<string, any>)[columnKey as string];

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
                            return cellValue;
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
                    events={events || []}
                    status={status || []}
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