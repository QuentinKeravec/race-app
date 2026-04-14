"use client";

import {Sidebar} from "@/components/sidebar";
import {useState} from "react";
import {Button} from "@heroui/button";
import {Menu, LayoutGrid} from "lucide-react";
import {Drawer, DrawerContent} from "@heroui/drawer";
import LoginModal from "@/components/ui/LoginModal";
import {User} from "@supabase/auth-js";

export function CustomSidebar({ children, user }: { children: React.ReactNode, user: User | null}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <aside className="hidden md:block w-72 fixed inset-y-0 left-0 border-r border-divider">
                <Sidebar />
            </aside>

            <div className="flex-1 flex flex-col">
                <nav className="md:hidden sticky top-0 z-40 w-full border-b border-divider bg-background/70 backdrop-blur-md px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutGrid size={20} className="text-primary"/>
                        <span className="font-bold">ダッシュボード</span>
                    </div>

                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => setIsMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </Button>
                </nav>

                <main className="flex-1 md:ml-72 p-6">
                    {children}
                </main>
            </div>

            <Drawer
                isOpen={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                placement="left"
                size="xs"
                classNames={{
                    base: "max-w-[280px]"
                }}
            >
                <DrawerContent>
                    {(onClose) => (
                        <div className="h-full">
                            <Sidebar onAction={() => setIsMenuOpen(false)} />
                        </div>
                    )}
                </DrawerContent>
            </Drawer>

            {!user && (
                <LoginModal />
            )}
        </div>
    );
}