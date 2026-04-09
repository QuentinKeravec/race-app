"use client";

import {Sidebar} from "@/components/sidebar";
import {useState} from "react";
import {Button} from "@heroui/button";
import {Menu, LayoutGrid} from "lucide-react";
import {Drawer, DrawerContent} from "@heroui/drawer";
import LoginForm from "@/components/ui/LoginForm";

export function CustomSidebar({ children, user }: { children: React.ReactNode, user: any }) {
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/10 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">ようこそ</h2>
                        <p className="mb-6 text-gray-600">管理インターフェースにアクセスする</p>
                        <LoginForm />
                    </div>
                </div>
            )}
        </div>
    );
}