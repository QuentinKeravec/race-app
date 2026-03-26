"use client"

import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDraggable} from "@heroui/modal";
import {Divider} from "@heroui/divider";
import React from "react";
import {Button} from "@heroui/button";

interface CustomModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    formId?: string;
    children: React.ReactNode;
    title: string;
    isLoading?: boolean;
}

export function CustomEditModal({isOpen, onOpenChange, formId, children, title, isLoading}: CustomModalProps) {
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
                        <ModalHeader {...moveProps} className="flex flex-col gap-1">{title}</ModalHeader>
                        <Divider />
                        <ModalBody className="p-4">
                            {children}
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                閉じる
                            </Button>
                            <Button
                                color="success"
                                type="submit"
                                form={formId}
                                isLoading={isLoading}
                            >
                                確定
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}