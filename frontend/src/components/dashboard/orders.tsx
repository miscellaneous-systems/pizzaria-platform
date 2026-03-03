"use client"

import { Button } from "@/components/ui/button";
import { Eye, RefreshCcw } from "lucide-react";
import { Order } from "@/lib/types";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { OrderModal } from "@/components/dashboard/order-modal";

interface OrdersProps {
    token: string;
}


export function Orders({ token }: OrdersProps) {

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await apiClient<Order[]>("/orders?draft=false", {
                method: "GET",
                cache: "no-store",
                token: token,
            });

            const pendingOrders = response.filter(order => !order.status);

            setOrders(pendingOrders);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function loadOrders() {
            await fetchOrders();
        }
        loadOrders();
    }, []);

    const calculateOrderTotal= (order: Order) => {
        if (!order.items) return 0;

        return order.items.reduce((total, item) => {
            return total + item.product.price * item.amount;
        }, 0);
    }



    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Pedidos
                    </h1>
                    <p className="text-sm sm:text-base mt-1">
                        Gerencie os pedidos da cozinha.
                    </p>
                </div>

                <Button onClick={fetchOrders} className="bg-brand-primary text-white hover:bg-brand-primary ">
                    <RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}/>
                </Button>
            </div>

            {loading ? (
                <div>
                    <p className="text-center text-gray-300">Carregando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div>
                    <p className="text-center text-gray-300">
                        Nenhum pedido encontrado
                    </p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map (order => (
                        <Card key={order.id}
                        className="bg-app-card border-app-border text-white"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between gap-2">
                                    <CardTitle className="text-lg font-bold lg:text-xl">
                                        Mesa {order.table}
                                    </CardTitle>
                                    <Badge variant="secondary" className="text-xs select-none">
                                        Em produção
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4 mt-auto">
                                <div>
                                    {order.items && order.items.length > 0 && (
                                        <div className="space-y-1">
                                            {order.items.slice(0,2).map((item) => (
                                                <p key={item.id} className="text-xs sm:text-sm text-gray-300 truncate">
                                                    - {item.amount}x {item.product.name}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between flex-col xl:flex-row pt-4 border-t border-app-border gap-3">

                                    <div className="self-start">
                                        <p className="text-sm text-gray-400 md:text-base">Total</p>
                                        <p className="text-base font-bold text-brand-primary">{formatCurrency(calculateOrderTotal(order))}</p>
                                    </div>

                                    <Button className=" w-full lg:w-auto bg-brand-primary hover:bg-brand-primary" size="sm"
                                    onClick={() => setSelectedOrder(order.id)}
                                    >
                                        <Eye className="w-5 h-5" />
                                        Detalhes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <OrderModal 
            orderId={selectedOrder}
            onClose={ async () => {
                setSelectedOrder(null);
                await fetchOrders();
            }}
            token={token}
            />
    </div>
  );
}