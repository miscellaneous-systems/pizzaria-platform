"use client"; 

import {useActionState, useEffect} from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import { Label} from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";


export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, null);
    const router = useRouter();

    useEffect(() => {
        if(state?.success && state?.redirectTo){
            router.replace(state.redirectTo);
        }
    }, [state, router]);


    return (
       <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
        <CardHeader>
            <CardTitle className="text-white text-center text-3xl font-bold sm:text-4xl">
                Pizza<span className="text-brand-primary">Hub</span>
            </CardTitle>
            <CardDescription className="text-white text-center text-sm font-medium">Faça login para continuar</CardDescription>
        </CardHeader>
        <CardContent>
            <form className="space-y-4" action={formAction}>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input 
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder="Digite seu email" 
                    required
                    className="text-white bg-app-card border border-app-border"/>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Senha</Label>
                    <Input 
                    type="password" 
                    id="password" 
                    name="password"
                    placeholder="Digite sua senha" 
                    required
                    className="text-white bg-app-card border border-app-border"/>
                </div>

                <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary/90">
                {isPending ? "Acessando..." : "Acessar"}
                </Button>

                {state?.error && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                        {state.error}
                    </div>
                )}

                <p className="text-center text-sm text-gray-100">
                    Não tem uma conta? <Link href="/register" className="text-brand-primary font-semibold">Crie uma conta</Link>
                </p>
            </form>
        </CardContent>
       </Card>
    );
}