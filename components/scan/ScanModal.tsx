'use client'

import {Modal, ModalBody, ModalContent, useDisclosure} from "@heroui/modal";
import {Button} from "@heroui/button";
import {ScanQrCode} from 'lucide-react';
import {User} from "@supabase/auth-js";
import CheckInScan from "@/components/scan/CheckInScan";
import {TransformedRace} from "@/types/race";

interface ScanModalProps {
    user: User,
    race: TransformedRace
}

export default function ScanModal({ user, race }: ScanModalProps) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Button
                onPress={onOpen}
                startContent={<ScanQrCode />}
            >
                チェックイン
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
                <ModalContent>
                    <ModalBody>
                        <CheckInScan user={user} race={race}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
