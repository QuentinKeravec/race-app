"use client"

import React from "react";
import {createClient} from "@/utils/supabase/client";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {useRouter} from "next/navigation";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/modal";
import {LockKeyhole, Mail} from 'lucide-react';

export default function LoginModal() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <>
            <Modal isOpen={true} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-4">管理インターフェースにアクセスする</ModalHeader>
                            <form onSubmit={handleLogin} className="flex flex-col gap-1">
                            <ModalBody>
                                    <Input
                                        isRequired
                                        endContent={
                                            <Mail className="text-2xl text-default-400 pointer-events-none shrink-0" />
                                        }
                                        label="メール"
                                        placeholder="example@gmail.com"
                                        variant="bordered"
                                        onValueChange={setEmail}
                                    />
                                    <Input
                                        isRequired
                                        endContent={
                                            <LockKeyhole className="text-2xl text-default-400 pointer-events-none shrink-0" />
                                        }
                                        label="パスワード"
                                        placeholder="********"
                                        type="password"
                                        variant="bordered"
                                        onValueChange={setPassword}
                                    />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    isLoading={loading}
                                    type="submit"
                                >
                                    ログイン
                                </Button>
                            </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}