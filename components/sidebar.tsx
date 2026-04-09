"use client";

import React from "react";
import {Listbox, ListboxItem} from "@heroui/listbox";
import {usePathname, useRouter} from "next/navigation";
import {createClient} from "@/utils/supabase/client";
import {ThemeSwitch} from "@/components/theme-switch";
import {Balloon, LayoutGrid, LogOut, MapPinned, UserRound} from 'lucide-react';
import NextLink from "next/link";
import {Divider} from "@heroui/divider";

interface SidebarProps {
    onAction? : () => void;
}

export const Sidebar = ({ onAction }: SidebarProps) => {
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
            key: "/dashboard/events",
            label: "イベント",
            icon: <Balloon size={20}/>,
        },
        {
            key: "/dashboard/races",
            label: "レース",
            icon: <MapPinned size={20}/>,
        },
        {
            key: "/dashboard/users",
            label: "ユーザー",
            icon: <UserRound size={20}/>,
        },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <div className="flex flex-col h-full bg-background border-r border-divider py-6 px-4">
            <div className="px-4 mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <LayoutGrid size={22} className="text-primary"/>
                </div>
                <h2 className="text-xl font-bold text-default-800">
                    ダッシュボード
                </h2>
            </div>

            <div className="flex-1">
                <Listbox
                    aria-label="Main Menu"
                    variant="flat"
                    onAction={(key) => {
                        router.push(key as string);

                        if (onAction) {
                            onAction();
                        }
                    }}
                    selectedKeys={[pathname]}
                    itemClasses={{
                        base: "px-4 py-3 rounded-xl gap-3 data-[hover=true]:bg-default-100",
                        title: "text-medium",
                    }}
                >
                    {menuItems.map((item) => (
                        <ListboxItem
                            key={item.key}
                            as={NextLink}
                            href={item.key}
                            startContent={item.icon}
                            className={
                                pathname === item.key
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-default-600"
                            }
                        >
                            {item.label}
                        </ListboxItem>
                    ))}
                </Listbox>
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-4">
                <Divider className="my-2 opacity-50" />

                <div className="px-4 py-2">
                    <ThemeSwitch />
                </div>

                <Listbox aria-label="Auth actions" onAction={handleLogout}>
                    <ListboxItem
                        key="logout"
                        className="text-danger px-4 py-3 rounded-xl"
                        color="danger"
                        startContent={<LogOut size={20}/>}
                    >
                        ログアウト
                    </ListboxItem>
                </Listbox>
            </div>
        </div>
    );
};