import { MessageCircle, Clock, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
interface CartItem {
  name: string;
  size?: string;
  price: number;
  customizations?: {
    add: string[];
    remove: string[];
  };
}
interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    items: CartItem[];
    deliveryType: "delivery" | "pickup";
    paymentMethod: "pix" | "card" | "cash";
    customerName: string;
    customerPhone: string;
    address?: string;
    cashChange?: number;
    total: number;
  };
}
const OrderConfirmationModal = ({
  isOpen,
  onClose,
  orderData
}: OrderConfirmationModalProps) => {
  if (!isOpen) return null;
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "pix":
        return "PIX";
      case "card":
        return "Cartão (Débito/Crédito)";
      case "cash":
        return "Dinheiro";
      default:
        return method;
    }
  };
  const generateWhatsAppMessage = () => {
    const deliveryTypeText = orderData.deliveryType === "delivery" ? "Entrega" : "Retirada";
    let message = `🍕 *NOVO PEDIDO*\n\n`;
    message += `👤 *Cliente:* ${orderData.customerName}\n`;
    message += `📱 *Telefone:* ${orderData.customerPhone}\n`;
    message += `📦 *Tipo:* ${deliveryTypeText}\n`;
    if (orderData.deliveryType === "delivery" && orderData.address) {
      message += `📍 *Endereço:* ${orderData.address}\n`;
    }
    message += `\n🍕 *ITENS DO PEDIDO:*\n`;
    message += `─────────────────\n`;
    orderData.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}`;
      if (item.size) {
        message += ` (${item.size})`;
      }
      message += ` - R$ ${item.price.toFixed(2).replace(".", ",")}\n`;
      if (item.customizations) {
        if (item.customizations.add.length > 0) {
          message += `   ➕ Adicionais: ${item.customizations.add.join(", ")}\n`;
        }
        if (item.customizations.remove.length > 0) {
          message += `   ➖ Remover: ${item.customizations.remove.join(", ")}\n`;
        }
      }
    });
    message += `─────────────────\n`;
    message += `💰 *TOTAL: R$ ${orderData.total.toFixed(2).replace(".", ",")}*\n\n`;
    message += `💳 *Pagamento:* ${formatPaymentMethod(orderData.paymentMethod)}`;
    if (orderData.paymentMethod === "cash" && orderData.cashChange) {
      message += ` (Troco para R$ ${orderData.cashChange.toFixed(2).replace(".", ",")})`;
    }
    message += `\n\n✅ Aguardo confirmação do pedido!`;
    return encodeURIComponent(message);
  };
  const handleWhatsAppClick = () => {
    // Número da pizzaria - substitua pelo número real
    const pizzariaNumber = "5547999999999"; // Formato: código do país + DDD + número
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${pizzariaNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };
  const estimatedTime = orderData.deliveryType === "delivery" ? "40-50 minutos" : "25-35 minutos";
  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

    {/* Modal Content */}
    <div className="relative bg-gradient-to-b from-card to-background rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in border border-border/50 px-[14px] py-[10px] pl-[15px] pt-[10px] pb-[10px] my-0 mx-0">
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-all hover:rotate-90 duration-300">
        <X className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Success Icon with animated ring */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-500/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-center text-foreground mb-2 font-display">
        Pedido Registrado! 🎉
      </h2>

      {/* Description */}
      <p className="text-center text-muted-foreground text-sm mb-5 max-w-xs mx-auto">
        Seu pedido foi registrado. Para confirmar, envie via WhatsApp para a pizzaria.
      </p>

      {/* Estimated Time Card */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-orange-deep/10 rounded-2xl p-4 mb-4 border border-primary/20 px-[14px] pr-[13px] pb-[10px] my-0 py-[9px]">
        <div className="flex items-center gap-4 shadow-none">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-deep flex items-center justify-center shadow-md">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Tempo estimado</p>
            <p className="text-primary font-bold text-lg">{estimatedTime}</p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-muted/30 rounded-2xl p-4 mb-4 border border-border/50 px-[19px] py-[7px]">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          Resumo do Pedido
        </h3>
        <div className="space-y-2">
          {orderData.items.map((item, index) => <div key={index} className="flex justify-between text-sm py-1 border-b border-border/30 last:border-0">
            <span className="text-muted-foreground truncate flex-1 mr-3">
              {item.name} {item.size && `(${item.size})`}
            </span>
            <span className="font-semibold text-foreground whitespace-nowrap">
              R$ {item.price.toFixed(2).replace(".", ",")}
            </span>
          </div>)}
        </div>
        <div className="border-t-2 border-dashed border-border mt-3 pt-3 flex justify-between items-center">
          <span className="font-bold text-foreground">Total</span>
          <span className="font-bold text-xl text-primary">
            R$ {orderData.total.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {/* Important Notices */}
      <div className="space-y-2 mb-5">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-300/50 dark:border-amber-700/50 rounded-xl p-3 px-[14px] py-[3px]">
          <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span><strong>Importante:</strong> Seu pedido só será confirmado após o envio via WhatsApp.</span>
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-300/50 dark:border-blue-700/50 rounded-xl p-3 px-[14px] py-[3px]">
          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
            <span className="text-lg">💳</span>
            <span><strong>Pagamento:</strong> O pagamento deverá ser efetuado na hora da entrega do pedido.</span>
          </p>
        </div>
      </div>

      {/* WhatsApp Button */}
      <Button onClick={handleWhatsAppClick} className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#0F7A6D] text-white py-6 text-base font-bold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all hover:-translate-y-0.5">
        <MessageCircle className="w-5 h-5 mr-2" />
        Enviar Pedido via WhatsApp
      </Button>

      {/* Secondary action */}
      <button onClick={onClose} className="w-full mt-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
        Fechar e continuar navegando
      </button>
    </div>
  </div>;
};
export default OrderConfirmationModal;