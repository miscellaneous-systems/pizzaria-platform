import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { DailyCashFlow } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Calendar, CreditCard, Wallet, QrCode, Coins } from "lucide-react";
import { CashflowDatePicker } from "@/components/dashboard/cashflow-date-picker";

export default async function CashflowPage({
    searchParams,
}: {
    searchParams: { date?: string };
}) {
    const token = await getToken();
    const date = searchParams.date;

    const cashflow = await apiClient<DailyCashFlow>(
        `/cashflow/daily${date ? `?date=${date}` : ""}`,
        {
            token: token!,
            cache: "no-store",
        }
    );

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Fluxo de Caixa Diário
                    </h1>
                    <p className="text-sm sm:text-base mt-1 text-gray-300">
                        Visualize o resumo financeiro do dia selecionado
                    </p>
                </div>
                <CashflowDatePicker initialDate={date} />
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-app-card border-app-border text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total do Dia
                        </CardTitle>
                        <DollarSign className="w-4 h-4 text-brand-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(cashflow.total)}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            {cashflow.ordersCount} pedido(s)
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-app-card border-app-border text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Dinheiro
                        </CardTitle>
                        <Wallet className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(cashflow.totalMoney)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-app-card border-app-border text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            PIX
                        </CardTitle>
                        <QrCode className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(cashflow.totalPix)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-app-card border-app-border text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Cartão
                        </CardTitle>
                        <CreditCard className="w-4 h-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(cashflow.totalCard)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-app-card border-app-border text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Gorjetas
                        </CardTitle>
                        <Coins className="w-4 h-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(cashflow.totalTip)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-app-card border-app-border text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Data
                        </CardTitle>
                        <Calendar className="w-4 h-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-semibold">
                            {new Date(cashflow.date).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de Pedidos */}
            {cashflow.orders.length > 0 && (
                <Card className="bg-app-card border-app-border text-white">
                    <CardHeader>
                        <CardTitle>Pedidos do Dia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {cashflow.orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-app-border"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                                Mesa {order.table}
                                            </span>
                                            {order.name && (
                                                <span className="text-sm text-gray-400">
                                                    - {order.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-1 rounded bg-gray-700">
                                                {order.paymentMethod}
                                            </span>
                                            {order.tip > 0 && (
                                                <span className="text-xs text-yellow-400">
                                                    Gorjeta: {formatCurrency(order.tip)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">
                                            {formatCurrency(order.total)}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {cashflow.orders.length === 0 && (
                <Card className="bg-app-card border-app-border text-white">
                    <CardContent className="py-8 text-center">
                        <p className="text-gray-400">
                            Nenhum pedido finalizado encontrado para esta data.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}