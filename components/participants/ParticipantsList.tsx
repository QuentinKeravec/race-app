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
import {MailModal} from "@/components/mails/MailModal";
import {useSendEmails} from "@/hooks/useEmails";
import {useQueryClient} from "@tanstack/react-query";
import {addToast} from "@heroui/toast";
import {TransformedRace} from "@/types/race";

interface ParticipantsListProps {
    race: TransformedRace;
}

export default function ParticipantsList({ race }: ParticipantsListProps) {
    const queryClient = useQueryClient();

    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isSendOpen, onOpen: onSendOpen, onOpenChange: onSendChange, onClose: onSendClose } = useDisclosure();

    const [ids, setIds] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data: participants } = useParticipants(race.id);
    const { mutate: deleteParticipants, isPending } = useDeleteParticipants();
    const { sendAllMails, isLoading, progress } = useSendEmails();

    const handleConfirmDelete = () => {
        deleteParticipants({raceId: race.id, ids: ids}, {
            onSuccess: (result) => {
                if (!result?.error) {
                    setSelectedKeys(new Set([]));
                    onDeleteClose();
                }
            }
        });
    };

    const handleConfirmSend = async () => {
        if (!participants) return;
        const count = await sendAllMails(participants, race, ids);

        queryClient.invalidateQueries({ queryKey: ["participants", race.id] });

        if (count > 0) {
            addToast({
                title: "送信完了",
                description: `${count}通のメール送信を完了しました。`,
                color: "success",
            });
        } else {
            addToast({
                title: "情報",
                description: "送信対象の参加者はいませんでした。",
                color: "primary",
            });
        }
        onSendClose();
    };

    if (!isClient) return <TableSkeleton />;

    return (
        <>
            <CustomTable
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                    setSelectedKeys(keys);

                    if (keys === "all") {
                        setIds(participants?.map(r => String(r.id)) ?? []);
                    } else {
                        setIds(Array.from(keys).map(k => String(k)));
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

                    setIds(stringIds);
                    onDeleteOpen();
                }}
                searchLabel="氏名"
                addButton={false}
                emailButton={true}
                onSend={(ids) => {
                    const stringIds = ids.map(id => String(id));

                    setIds(stringIds);
                    onSendOpen();
                }}
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
                ids={ids}
            />

            <MailModal
                isOpen={isSendOpen}
                onOpenChange={onSendChange}
                onSend={handleConfirmSend}
                isLoading={isLoading}
                progress={progress}
                ids={ids}
            />
        </>
    );
}