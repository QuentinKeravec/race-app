"use client"

import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDraggable} from "@heroui/modal";
import React from "react";
import {Button} from "@heroui/button";

interface MailModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    isLoading?: boolean;
    ids: (string | number)[];
    onSend: () => void;
    progress: { current: number, total: number }
}

export function MailModal({isOpen, onOpenChange, isLoading, ids, onSend, progress}: MailModalProps) {
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
                            選択した{ids.length}名にメールを送信しますか？
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>キャンセル</Button>
                            <Button color="primary" isLoading={isLoading} onPress={onSend}>
                                {isLoading ? `送信中... (${progress.current}/${progress.total})` : "メールを送る"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}