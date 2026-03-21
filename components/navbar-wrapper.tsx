"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Link } from "@heroui/link";

export function NavbarWrapper({ children, user }: { children: React.ReactNode, user: any }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login";

    if (user && !isAuthPage) {
        return (
            <div className="flex min-h-screen bg-background">
                <aside className="hidden md:block w-64 fixed h-full p-4">
                    <Sidebar />
                </aside>
                <main className="flex-1 md:ml-64 p-8">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-6 px-6 flex-grow">
                {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
                <Link
                    isExternal
                    className="flex items-center gap-1 text-current"
                    href="https://heroui.com?utm_source=next-app-template"
                    title="heroui.com homepage"
                >
                    <span className="text-default-600">Powered by</span>
                    <p className="text-primary">HeroUI</p>
                </Link>
            </footer>
        </div>
    );
}