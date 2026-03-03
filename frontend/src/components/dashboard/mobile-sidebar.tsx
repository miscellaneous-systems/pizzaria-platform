"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Package, Tags, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const menuItems = [
    {
        title: "Pedidos",
        href: "/dashboard",
        icon: ShoppingCart,
    },
    {
        title: "Produtos",
        href: "/dashboard/products",
        icon: Package,
    },
    {
        title: "Categorias",
        href: "/dashboard/categories",
        icon: Tags,
    }
];

export function MobileSidebar() {
    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <header className="sticky top-0 z-50 border-b border-app-border bg-app-card">
                <div className="h-16 flex items-center justify-between px-4">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size={"icon"}>
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="w-72 p-0 bg-app-sidebar border-app-border">
                            <SheetHeader className="border-b border-app-border p-6">
                                <SheetTitle className="text-xl text-white font-bold">
                                    Menu
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col flex-1 p-4 space-y-4">
                                {menuItems.map((menu) => {
                                    const Icon = menu.icon;
                                    const isActive = pathname === menu.href;

                                    return (
                                        <Link
                                            href={menu.href}
                                            key={menu.title}
                                            className={cn("flex item-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors durantion-300 text-white",
                                                isActive ? "bg-brand-primary text-white" : "hover:bg-gray-600"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {menu.title}
                                        </Link>
                                    )
                                })}
                            </nav>
                            <div className="absolute w-full bottom-0 border-t border-app-border p-4">
                                <form action={logoutAction}>
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        className="w-full justify-start gap-3 text-white hover:text-white hover:bg-transparent"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sair
                                    </Button>
                                </form>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-lg font-bold">
                        Pizza<span className="text-brand-primary">Hub</span>
                    </h1>
                    <div className="w-10"></div>
                </div>
            </header>
        </div>
    )
} 