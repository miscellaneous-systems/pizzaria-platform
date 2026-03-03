import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldX } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccessDenied() {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="bg-app-background min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full">
                <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
                    <CardHeader className="items-center text-center">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 mb-2 mx-auto">
                            <ShieldX className="text-red-500 w-16 h-12" />
                        </div>
                        <CardDescription className="text-red-400 font-semibold text-base mt-1">
                            Acesso Negado
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-gray-300 text-sm">
                            Você não tem permissão para acessar o painel administrativo. Esta área é restrita a administradores.
                        </p>
                        <p className="text-gray-400 text-sm">
                            Se você acredita que isso é um erro, entre em contato com o responsável pelo sistema para solicitar o acesso.
                        </p>
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="w-full text-center bg-brand-primary text-white font-medium py-2 px-4 rounded-md hover:bg-brand-primary/90 transition-colors text-sm"
                            >
                                Sair da conta
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
