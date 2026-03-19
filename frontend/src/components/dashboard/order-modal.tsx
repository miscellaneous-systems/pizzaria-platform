import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { finishOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

interface OrderModalProps {
  orderId: string | null;
  onClose: () => Promise<void>;
  token: string;
}

export function OrderModal({ onClose, orderId, token }: OrderModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const router = useRouter();
  const fetchOrder = async () => {
    if (!orderId) {
      setOrder(null);
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient<Order>(
        `/order/detail?order_id=${orderId}`,
        {
          method: "GET",
          token: token,
        }
      );

      // RETORNO DETALHE DA ORDER
      setOrder(response);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    async function loadOrders() {
      await fetchOrder();
    }

    loadOrders();
  }, [orderId]);

  // Calcula o total do pedido
  const calculateTotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };

  const paymentMethodLabel: Record<string, string> = {
    MONEY: "Dinheiro",
    PIX: "PIX",
    CARD: "Cartão",
  };

  const handleFinishOrder = async () => {
    if (!orderId) return;

    setFinishError(null);
    setFinishing(true);

    const result = await finishOrderAction(
        orderId,
        (order?.paymentMethod as "MONEY" | "PIX" | "CARD") ?? "MONEY",
        order?.tip ?? 0
    );

    setFinishing(false);

    if (result.success) {
      onClose();
      router.refresh();
    } else {
      setFinishError(result.error ?? "Falha ao finalizar pedido");
    }
  };

  return (
    <Dialog open={orderId !== null} onOpenChange={() => onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col p-6 bg-app-card text-white max-w-2xl border-app-border">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl font-bold">
            Detalhe do pedido
          </DialogTitle>
          <DialogDescription className="sr-only">
            Exibe as informacoes completas do pedido selecionado, incluindo
            cliente, forma de pagamento, itens e total.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Carregando...</p>
          </div>
        ) : order ? (
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Informações do pedido */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Nome da categoria</p>
                <p className="text-lg font-semibold">Mesa {order.table}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Cliente</p>
                <p className="text-lg font-semibold">
                  {order.name || "Sem nome"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <Badge variant="secondary" className="text-xs select-none">
                  Em produção
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Forma de pagamento</p>
                <p className="text-lg font-semibold">
                  {order.paymentMethod
                    ? paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Gorjeta</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(order.tip ?? 0)}
                </p>
              </div>
            </div>

            {/* Itens do pedido */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Itens do pedido</h3>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => {
                    const subtotal = item.product.price * item.amount;
                    return (
                      <div
                        key={item.id}
                        className="bg-app-background rounded-lg p-4 border border-app-border"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base mb-1">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {item.product.description}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                              {formatCurrency(item.product.price)} x {item.amount}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm text-gray-400 mb-1">
                              Quantidade: {item.amount}
                            </p>
                            <p className="font-semibold text-lg">
                              Subtotal: {formatCurrency(subtotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    Nenhum item no pedido
                  </p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-app-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-brand-primary">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {finishError && (
          <p className="shrink-0 text-sm text-red-400 px-1">{finishError}</p>
        )}

        <DialogFooter className="shrink-0 flex gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onClose()}
            className="flex-1 border-app-border hover:bg-transparent bg-transparent text-white hover:text-white"
          >
            Fechar
          </Button>
          <Button
            className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold"
            disabled={loading || finishing}
            onClick={() => handleFinishOrder()}
          >
            {finishing ? "Finalizando..." : "Finalizar pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
