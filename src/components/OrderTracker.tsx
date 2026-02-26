import { useState } from "react";
import { Package, ChefHat, Truck, CheckCircle, Clock, Store, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useOrders, type Order } from "@/hooks/useOrders";

interface OrderTrackerProps {
  orders?: Order[];
  onClose?: () => void;
}

const statusConfig = {
  confirmed: {
    label: "Pedido Confirmado",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    description: "Recebemos seu pedido e estamos preparando!"
  },
  preparing: {
    label: "Em Preparo",
    icon: ChefHat,
    color: "text-primary",
    bgColor: "bg-primary",
    description: "Seu pedido está sendo preparado com carinho"
  },
  delivering: {
    label: "Saiu para Entrega",
    icon: Truck,
    color: "text-green-500",
    bgColor: "bg-green-500",
    description: "Seu pedido está a caminho!"
  },
  ready: {
    label: "Pronto para Retirada",
    icon: Store,
    color: "text-green-500",
    bgColor: "bg-green-500",
    description: "Seu pedido está pronto na pizzaria!"
  },
  completed: {
    label: "Entregue/Concluído",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-600",
    description: "Aproveite seu pedido! Obrigado!"
  },
};

const OrderTracker = ({ orders: initialOrders, onClose }: OrderTrackerProps) => {
  const { user } = useAuth();
  const { orders, isLoading } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const displayOrders = initialOrders || orders;

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatOrderDate = (date: Date) => {
    // Verificar se a data é válida
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Data inválida";
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatOrderTime = (date: Date) => {
    // Verificar se a data é válida
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Hora inválida";
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando pedidos...</p>
      </div>
    );
  }

  // Separar pedidos em andamento e concluídos
  const activeOrders = displayOrders.filter(order => order.status !== 'completed');
  const completedOrders = displayOrders.filter(order => order.status === 'completed');

  if (displayOrders.length === 0) {
    return (
      <div className="p-6 text-center">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-foreground mb-2">
          Nenhum pedido encontrado
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {user ? "Seus pedidos aparecerão aqui" : "Faça um pedido para acompanhar aqui"}
        </p>
        {onClose && (
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-bold text-foreground">
          Meus Pedidos
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Pedidos em Andamento */}
      {activeOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h4 className="font-semibold text-foreground">Pedidos em Andamento ({activeOrders.length})</h4>
          </div>
          {activeOrders.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedOrderId === order.id;
            const isDelivery = order.deliveryType === "delivery";
            const isCompleted = order.status === "completed";
            
            // Get first item for summary display
            const firstItem = order.items[0];
            const hasMultipleItems = order.items.length > 1;
            
            return (
              <Card key={order.id} className="border border-border">
                <CardContent className="p-4 space-y-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Pedido #{order.orderNumber?.toString().padStart(6, '0') || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    {isCompleted ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ENTREGUE
                      </Badge>
                    ) : (
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}/10`}>
                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                        <span className={`text-sm font-semibold ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Summary (Collapsed View) */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">Resumo do pedido:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderDetails(order.id)}
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    {/* Summary Display */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {firstItem.name}
                            {firstItem.size && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({firstItem.size})
                              </span>
                            )}
                          </p>
                          {hasMultipleItems && (
                            <p className="text-xs text-muted-foreground">
                              + {order.items.length - 1} item(s)
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-bold text-primary">
                          R$ {order.total.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border flex justify-between">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-sm font-bold text-primary">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Order View (Expanded) */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-border space-y-3">
                      <h4 className="font-medium text-foreground">Detalhes do pedido:</h4>
                      
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-muted/30 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-foreground">{item.name}</p>
                                {item.size && (
                                  <p className="text-sm text-muted-foreground">
                                    Tamanho: {item.size}
                                  </p>
                                )}
                              </div>
                              <span className="font-bold text-primary">
                                R$ {item.price.toFixed(2).replace(".", ",")}
                              </span>
                            </div>
                            
                            {item.customizations && (
                              <div className="text-sm text-muted-foreground space-y-1">
                                {item.customizations.add.length > 0 && (
                                  <div>
                                    <span className="font-medium">Adicionais:</span>
                                    <span className="ml-2">{item.customizations.add.join(', ')}</span>
                                  </div>
                                )}
                                {item.customizations.remove.length > 0 && (
                                  <div>
                                    <span className="font-medium">Removidos:</span>
                                    <span className="ml-2">{item.customizations.remove.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Subtotal</span>
                          <span className="text-sm font-medium">
                            R$ {(order.total - (order.deliveryType === 'delivery' ? 5 : 0)).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                        {order.deliveryType === 'delivery' && (
                          <div className="flex justify-between">
                            <span className="text-sm">Taxa de entrega</span>
                            <span className="text-sm font-medium">R$ 5,00</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-primary">
                          <span>Total</span>
                          <span>R$ {order.total.toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-foreground">Informações do cliente:</h5>
                        <p className="text-sm"><span className="font-medium">Nome:</span> {order.customerName}</p>
                        <p className="text-sm"><span className="font-medium">Telefone:</span> {order.customerPhone}</p>
                        {order.customerAddress && (
                          <p className="text-sm"><span className="font-medium">Endereço:</span> {order.customerAddress}</p>
                        )}
                        {order.paymentMethod && (
                          <p className="text-sm"><span className="font-medium">Pagamento:</span> {
                            order.paymentMethod === 'pix' ? 'PIX' :
                            order.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'
                          }</p>
                        )}
                      </div>

                      {/* Progress Steps (only for active orders) */}
                      {!isCompleted && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-foreground">Progresso do pedido:</h5>
                          <div className="relative">
                            <div className="flex justify-between items-center">
                              {(() => {
                                const statusSteps = isDelivery
                                  ? ["confirmed", "preparing", "delivering", "completed"]
                                  : ["confirmed", "preparing", "ready", "completed"];
                                const currentStepIndex = statusSteps.indexOf(order.status);

                                return statusSteps.map((stepStatus, index) => {
                                  const stepConfig = statusConfig[stepStatus as Order['status']];
                                  const StepIcon = stepConfig.icon;
                                  const isActive = index <= currentStepIndex;
                                  const isCurrent = index === currentStepIndex;

                                  return (
                                    <div key={stepStatus} className="flex flex-col items-center z-10">
                                      <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                          isActive
                                            ? isCurrent
                                              ? `${stepConfig.bgColor} text-white animate-pulse`
                                              : `${stepConfig.bgColor} text-white`
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        <StepIcon className="w-4 h-4" />
                                      </div>
                                      <span
                                        className={`text-[10px] mt-1 text-center max-w-16 ${
                                          isActive ? "text-foreground font-medium" : "text-muted-foreground"
                                        }`}
                                      >
                                        {stepConfig.label}
                                      </span>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                            {/* Progress Line */}
                            <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -z-0">
                              <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{
                                  width: `${(() => {
                                    const statusSteps = isDelivery
                                      ? ["confirmed", "preparing", "delivering", "completed"]
                                      : ["confirmed", "preparing", "ready", "completed"];
                                    const currentStepIndex = statusSteps.indexOf(order.status);
                                    return (currentStepIndex / (statusSteps.length - 1)) * 100;
                                  })()}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Status Description */}
                          <p className="text-sm text-muted-foreground text-center">
                            {config.description}
                          </p>

                          {/* Estimated Time */}
                          {(order.estimatedTime && order.status !== "completed") && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>Tempo estimado: {order.estimatedTime}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pedidos Concluídos (Histórico) */}
      {completedOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <h4 className="font-semibold text-foreground">Histórico de Pedidos ({completedOrders.length})</h4>
          </div>
          {completedOrders.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedOrderId === order.id;
            const isDelivery = order.deliveryType === "delivery";
            
            // Get first item for summary display
            const firstItem = order.items[0];
            const hasMultipleItems = order.items.length > 1;
            
            return (
              <Card key={order.id} className="border border-border opacity-75">
                <CardContent className="p-4 space-y-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Pedido #{order.orderNumber?.toString().padStart(6, '0') || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      ENTREGUE
                    </Badge>
                  </div>

                  {/* Order Summary (Collapsed View) */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">Resumo do pedido:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderDetails(order.id)}
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    {/* Summary Display */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {firstItem.name}
                            {firstItem.size && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({firstItem.size})
                              </span>
                            )}
                          </p>
                          {hasMultipleItems && (
                            <p className="text-xs text-muted-foreground">
                              + {order.items.length - 1} item(s)
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-bold text-primary">
                          R$ {order.total.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border flex justify-between">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-sm font-bold text-primary">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Order View (Expanded) */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-border space-y-3">
                      <h4 className="font-medium text-foreground">Detalhes do pedido:</h4>
                      
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-muted/30 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-foreground">{item.name}</p>
                                {item.size && (
                                  <p className="text-sm text-muted-foreground">
                                    Tamanho: {item.size}
                                  </p>
                                )}
                              </div>
                              <span className="font-bold text-primary">
                                R$ {item.price.toFixed(2).replace(".", ",")}
                              </span>
                            </div>
                            
                            {item.customizations && (
                              <div className="text-sm text-muted-foreground space-y-1">
                                {item.customizations.add.length > 0 && (
                                  <div>
                                    <span className="font-medium">Adicionais:</span>
                                    <span className="ml-2">{item.customizations.add.join(', ')}</span>
                                  </div>
                                )}
                                {item.customizations.remove.length > 0 && (
                                  <div>
                                    <span className="font-medium">Removidos:</span>
                                    <span className="ml-2">{item.customizations.remove.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Subtotal</span>
                          <span className="text-sm font-medium">
                            R$ {(order.total - (order.deliveryType === 'delivery' ? 5 : 0)).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                        {order.deliveryType === 'delivery' && (
                          <div className="flex justify-between">
                            <span className="text-sm">Taxa de entrega</span>
                            <span className="text-sm font-medium">R$ 5,00</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-primary">
                          <span>Total</span>
                          <span>R$ {order.total.toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-foreground">Informações do cliente:</h5>
                        <p className="text-sm"><span className="font-medium">Nome:</span> {order.customerName}</p>
                        <p className="text-sm"><span className="font-medium">Telefone:</span> {order.customerPhone}</p>
                        {order.customerAddress && (
                          <p className="text-sm"><span className="font-medium">Endereço:</span> {order.customerAddress}</p>
                        )}
                        {order.paymentMethod && (
                          <p className="text-sm"><span className="font-medium">Pagamento:</span> {
                            order.paymentMethod === 'pix' ? 'PIX' :
                            order.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'
                          }</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTracker;