"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createCategory } from "@/actions/categories";
import { useRouter } from 'next/navigation'

export function CategoryForm() {


    const [open, setOpen] = useState(false);
    const router = useRouter();

    async function handleCreateCategory(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const result = await createCategory(formData);

        if (result.success) {
            setOpen(false);
            router.refresh();
            return;
        } else {
            alert(result.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="bg-brand-primary hover:bg-brand-primary font-semibold">
                <Button>
                    <PlusIcon className="w-5 h-5" />
                    Nova Categoria
                </Button>
            </DialogTrigger>
            <DialogContent className="p-6 bg-app-card text-white">
                <DialogHeader>
                    <DialogTitle>
                        Nova Categoria
                    </DialogTitle>
                    <DialogDescription>
                        Criando nova categoria...
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleCreateCategory}>
                    <div>
                        <Label htmlFor="category" className="mb-2">Nome</Label>
                        <Input id="name" name="name" required placeholder="Digite o nome da categoria"
                            className="border-app-border bg-app-background text-white"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary">
                        Criar Categoria
                    </Button>
                </form>



            </DialogContent>
        </Dialog>
    )
}