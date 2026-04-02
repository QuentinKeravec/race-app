"use client"

import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDraggable} from "@heroui/modal";
import React from "react";
import {Button} from "@heroui/button";

interface CustomModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    isLoading?: boolean;
    ids: (string | number)[];
    onDelete: () => void;
}

export function CustomDeleteModal({isOpen, onOpenChange, isLoading, ids, onDelete}: CustomModalProps) {
    const targetRef = React.useRef(null);
    const {moveProps} = useDraggable({targetRef, canOverflow: true, isDisabled: !isOpen});

    return (
        <Modal
            backdrop="transparent"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            ref={targetRef}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader {...moveProps}>削除の確認</ModalHeader>
                        <ModalBody>
                            {ids.length}件のアイテムを削除してもよろしいですか？
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>キャンセル</Button>
                            <Button color="danger" isLoading={isLoading} onPress={onDelete}>削除する</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}