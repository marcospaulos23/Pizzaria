import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, CreditCard, Smartphone, Banknote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";
import OrderConfirmationModal from "./OrderConfirmationModal";
interface CartItem {
  name: string;
  size?: string;
  price: number;
  customizations?: { add: string[]; remove: string[] };
}

interface CheckoutPageProps {
  cart: CartItem[];
  deliveryType: "delivery" | "pickup";
  onBack: () => void;
  onConfirmOrder: (orderData: any) => void;
  onRemoveItem: (index: number) => void;
}

export interface OrderData {
  items: CartItem[];
  deliveryType: "delivery" | "pickup";
  paymentMethod: "pix" | "card" | "cash";
  customerName: string;
  customerPhone: string;
  address?: string;
  cashChange?: number;
  total: number;
}

type PaymentMethod = "pix" | "card" | "cash";

const CheckoutPage = ({
  cart,
  deliveryType,
  onBack,
  onConfirmOrder,
  onRemoveItem,
}: CheckoutPageProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cashChange, setCashChange] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState<OrderData | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setCustomerName(user.full_name);
      setCustomerPhone(user.phone);
    }
  }, [user]);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = deliveryType === "delivery" ? 5 : 0;
  const total = subtotal + deliveryFee;

  const isFormValid = () => {
    if (!customerName.trim() || !customerPhone.trim()) return false;
    if (deliveryType === "delivery" && !address.trim()) return false;
    if (!paymentMethod) return false;
    return true;
  };

  const handleConfirm = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login ou cadastre-se para confirmar seu pedido",
        variant: "destructive",
      });
      window.location.href = "/login";
      return;
    }
    
    if (!isFormValid()) return;
    setIsSaving(true);
    try {
      // Save order to database
      const orderData = {
        items: JSON.parse(JSON.stringify(cart)) as Json,
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_address: deliveryType === "delivery" ? address.trim() : null,
        total: total,
        status: 'confirmed' as const,
      };

      // Save to database for authenticated users
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Prepare order data for confirmation modal
      const orderDataForModal: OrderData = {
        items: cart,
        deliveryType,
        paymentMethod: paymentMethod!,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: deliveryType === "delivery" ? address.trim() : undefined,
        cashChange: paymentMethod === "cash" && cashChange ? parseFloat(cashChange) : undefined,
        total,
      };

      // Set the confirmed order data and show the modal
      setConfirmedOrderData(orderDataForModal);
      setShowConfirmationModal(true);

    } catch (error: any) {
      toast({
        title: "Erro ao salvar pedido",
        description: error.message || "Não foi possível salvar seu pedido",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    // Call the original confirm handler when closing the modal
    if (confirmedOrderData) {
      onConfirmOrder(confirmedOrderData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Confirmation Modal */}
      {confirmedOrderData && (
        <OrderConfirmationModal
          isOpen={showConfirmationModal}
          onClose={handleCloseModal}
          orderData={confirmedOrderData}
        />
      )}
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Finalizar Pedido
          </h2>
          <p className="text-muted-foreground text-sm">
            {deliveryType === "delivery" ? "Entrega em domicílio" : "Retirada na pizzaria"}
          </p>
        </div>
      </div>

      {/* User Info Notice */}
      {user && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            ✅ Você está logado como {customerName}. Seus dados serão salvos para próximos pedidos.
          </p>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-muted/30 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-foreground">Resumo do Pedido</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{item.name}</p>
                {item.size && (
                  <p className="text-muted-foreground text-xs">{item.size}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground">
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </span>
                <button
                  onClick={() => onRemoveItem(index)}
                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
          {deliveryType === "delivery" && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de entrega</span>
              <span className="font-medium">R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-4">
        <h3 className="font-bold text-foreground">Seus Dados</h3>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              placeholder="Seu nome"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone / WhatsApp</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="mt-1"
            />
          </div>

          {deliveryType === "delivery" && (
            <div>
              <Label htmlFor="address">Endereço completo</Label>
              <Input
                id="address"
                placeholder="Rua, número, bairro, complemento"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="font-bold text-foreground">Forma de Pagamento</h3>
        
        <div className="grid gap-3">
          <button
            onClick={() => setPaymentMethod("pix")}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "pix"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              paymentMethod === "pix" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">PIX</p>
              <p className="text-muted-foreground text-sm">Pagamento instantâneo</p>
            </div>
            {paymentMethod === "pix" && <Check className="w-5 h-5 text-primary" />}
          </button>

          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "card"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              paymentMethod === "card" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Cartão</p>
              <p className="text-muted-foreground text-sm">Débito ou Crédito na entrega</p>
            </div>
            {paymentMethod === "card" && <Check className="w-5 h-5 text-primary" />}
          </button>

          <button
            onClick={() => setPaymentMethod("cash")}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "cash"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              paymentMethod === "cash" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              <Banknote className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Dinheiro</p>
              <p className="text-muted-foreground text-sm">Pagamento na entrega</p>
            </div>
            {paymentMethod === "cash" && <Check className="w-5 h-5 text-primary" />}
          </button>

          {paymentMethod === "cash" && (
            <div className="ml-14">
              <Label htmlFor="change">Troco para quanto?</Label>
              <Input
                id="change"
                type="number"
                placeholder="Ex: 100"
                value={cashChange}
                onChange={(e) => setCashChange(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={!isFormValid() || isSaving}
        className="w-full btn-cta py-6 text-lg"
      >
        {isSaving ? "Salvando pedido..." : `Confirmar Pedido • R$ ${total.toFixed(2).replace(".", ",")}`}
      </Button>
    </div>
  );
};

export default CheckoutPage;