"use client"

import React from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export default function LoginForm() {
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
                color="primary"
                type="submit"
                isLoading={loading}
                className="mt-2"
            >
                ログイン
            </Button>
        </form>
    )
}