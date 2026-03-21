"use client"

import React from "react"
import {Button} from "@heroui/button"
import {EllipsisVertical, Eye, PencilLine, Trash} from 'lucide-react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/dropdown"
import {cn} from "@heroui/theme";

interface TableActionsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function TableActions({onView, onEdit, onDelete}: TableActionsProps) {
    const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                    <EllipsisVertical size={20} className="text-default-300"/>
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions" variant="faded">
                <DropdownItem
                    key="view"
                    onPress={onView}
                    startContent={<Eye className={iconClasses} size={20}/>}
                >
                    詳細
                </DropdownItem>
                <DropdownItem
                    key="edit"
                    onPress={onEdit}
                    startContent={<PencilLine className={iconClasses} size={20}/>}
                >
                    編集
                </DropdownItem>
                <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onPress={onDelete}
                    startContent={<Trash className={cn(iconClasses, "text-danger")} size={20}/>}
                >
                    削除
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}