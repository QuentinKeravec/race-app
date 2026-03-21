"use client"

import React from "react";
import {Card, CardHeader, CardBody } from "@heroui/card";
import { createClient } from "@/utils/client";
import { Divider } from "@heroui/divider";
import { title } from "@/components/primitives";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
            alert(error.message);
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md p-4">
                <CardHeader className="flex flex-col gap-1 items-start">
                    <h1 className={title({ size: "sm" })}>ログイン</h1>
                    <p className="text-default-500 text-small">
                        管理インターフェースにアクセスする
                    </p>
                </CardHeader>
                <Divider />
                <CardBody>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <Input
                            isRequired
                            label="メール"
                            placeholder="japan@email.com"
                            type="email"
                            variant="bordered"
                            value={email}
                            onValueChange={setEmail}
                        />
                        <Input
                            isRequired
                            label="パスワード"
                            placeholder="********"
                            type="password"
                            variant="bordered"
                            value={password}
                            onValueChange={setPassword}
                        />
                        <Button
                            color="success"
                            type="submit"
                            isLoading={loading}
                            className="mt-2"
                            variant="flat"
                        >
                            ログイン
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}