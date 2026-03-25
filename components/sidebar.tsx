"use client";

import React from "react";
import {Listbox, ListboxItem} from "@heroui/listbox";
import {Card} from "@heroui/card";
import {usePathname, useRouter} from "next/navigation";
import {createClient} from "@/utils/client";
import {ThemeSwitch} from "@/components/theme-switch";
import {Balloon, LayoutGrid, LogOut, MapPinned, UserRound} from 'lucide-react';
import NextLink from "next/link";

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const menuItems = [
        {
            key: "/dashboard",
            label: "ダッシュボード",
            icon: <LayoutGrid size={20}/>,
        },
        {
            key: "/events",
            label: "イベント",
            icon: <Balloon size={20}/>,
        },
        {
            key: "/races",
            label: "レース",
            icon: <MapPinned size={20}/>,
        },
        {
            key: "/users",
            label: "ユーザー",
            icon: <UserRound size={20}/>,
        },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <Card className="h-[calc(100vh-2rem)] w-64 p-4 flex flex-col justify-between sticky top-4">
            <div className="flex flex-col gap-6">
                <div className="px-2 py-4 flex items-center gap-2">
                    <LayoutGrid size={20} className="text-success"/>
                    <h2 className="text-xl font-bold">
                        ダッシュボード
                    </h2>
                </div>

                <Listbox
                    aria-label="Main Menu"
                    variant="flat"
                    onAction={(key) => router.push(key as string)}
                    selectedKeys={[pathname]}
                    classNames={{
                        base: "p-0",
                    }}
                >
                    {menuItems.map((item) => (
                        <ListboxItem
                            key={item.key}
                            as={NextLink}
                            href={item.key}
                            startContent={item.icon}
                            className={`${
                                pathname === item.key
                                    ? "bg-success/10 text-success font-semibold"
                                    : ""
                            }`}
                        >
                            {item.label}
                        </ListboxItem>
                    ))}
                </Listbox>
            </div>

            <div className="border-t border-default-100 pt-4">
                <Listbox>
                    <ListboxItem>
                        <ThemeSwitch/>
                    </ListboxItem>
                </Listbox>
                <Listbox aria-label="Auth actions" onAction={handleLogout}>
                    <ListboxItem
                        key="logout"
                        className="text-danger"
                        color="danger"
                        startContent={<LogOut size={20}/>}
                    >
                        ログアウト
                    </ListboxItem>
                </Listbox>
            </div>
        </Card>
    );
};