'use client';

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Selection} from "@heroui/table";
import {useDisclosure} from "@heroui/modal";

import {CustomTable} from "@/components/ui/CustomTable";
import {CustomEditModal} from "@/components/ui/CustomEditModal";
import {AddEventForm} from "@/components/events/AddEventForm";
import {CustomDeleteModal} from "@/components/ui/CustomDeleteModal";
import {TableSkeleton} from "@/components/ui/TableSkeleton";
import {Event} from "@/types/event";
import {useDeleteEvents, useEvents} from "@/hooks/useEvents";

interface EventListProps {
    initialEvents: Event[];
}

export default function EventList({ initialEvents }: EventListProps) {
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

    const { data: events } = useEvents(initialEvents);
    const { mutate: deleteEvents, isPending } = useDeleteEvents();

    const handleConfirmDelete = () => {
        deleteEvents(idsToDelete, {
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
                        setIdsToDelete(initialEvents.map(r => String(r.id)));
                    } else {
                        setIdsToDelete(Array.from(keys).map(k => String(k)));
                    }
                }}
                data={events||[]}
                columns={[
                    {name: "名前", uid: "name", sortable: true},
                ]}
                searchKey="name"
                initialVisibleColumns={["name"]}
                onAdd={onAddOpen}
                onDelete={(ids) => {
                    const stringIds = ids.map(id => String(id));

                    setIdsToDelete(stringIds);
                    onDeleteOpen();
                }}
                onRowAction={(id) => {
                    const event = initialEvents.find(r => r.id.toString() === id.toString());
                    if (event) {
                        router.push(`/events/${event.slug}`);
                    }
                }}
                searchLabel="名前"
                renderCell={(item: any, columnKey) => {
                    switch (columnKey) {
                        case "name":
                            return <p className="font-bold">{item.name}</p>;
                        default:
                            return item[columnKey as string];
                    }
                }}
            />

            <CustomEditModal
                title="イベントを追加"
                isOpen={isAddOpen}
                onOpenChange={onAddChange}
                formId="event-form"
                isLoading={isFormLoading}
            >
                <AddEventForm
                    id="event-form"
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