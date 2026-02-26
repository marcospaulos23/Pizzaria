import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, CreditCard, Smartphone, Banknote, Check, Bike, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import UserAuthButton from "@/components/UserAuthButton";
import AdminNavButton from "@/components/AdminNavButton";

interface CartItem {
  name: string;
  size?: string;
  price: number;
}

type PaymentMethod = "pix" | "card" | "cash";
type DeliveryType = "delivery" | "pickup";

interface OrderData {
  items: CartItem[];
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  address?: string;
  cashChange?: number;
  total: number;
}

const MenuCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Get cart from navigation state
  const initialCart: CartItem[] = location.state?.cart || [];

  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cashChange, setCashChange] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState<OrderData | null>(null);

  // Redirect if no cart items
  useEffect(() => {
    if (initialCart.length === 0) {
      navigate("/pedidos");
    }
  }, [initialCart, navigate]);

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

  const handleRemoveItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    if (newCart.length === 0) {
      navigate("/pedidos");
    }
  };

  const isFormValid = () => {
    if (!deliveryType) return false;
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
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (!isFormValid()) return;
    setIsSaving(true);
    try {
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

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const orderDataForModal: OrderData = {
        items: cart,
        deliveryType: deliveryType!,
        paymentMethod: paymentMethod!,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: deliveryType === "delivery" ? address.trim() : undefined,
        cashChange: paymentMethod === "cash" && cashChange ? parseFloat(cashChange) : undefined,
        total,
      };

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
    toast({
      title: "Pedido Confirmado! 🎉",
      description: deliveryType === "delivery"
        ? "Seu pedido chegará em aproximadamente 40 minutos. Bom apetite!"
        : "Seu pedido estará pronto para retirada em aproximadamente 25 minutos!",
    });
    navigate("/");
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="section-orange py-4 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/pedidos"
            className="flex items-center gap-2 bg-secondary/20 hover:bg-secondary/30 rounded-lg px-3 py-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-secondary drop-shadow-sm" />
            <span className="font-medium hidden sm:inline text-secondary drop-shadow-sm">Voltar</span>
          </Link>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-secondary">
            Pizzaria
          </h1>

          <div className="flex items-center gap-2">
            <AdminNavButton />
            <UserAuthButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-card p-6 rounded-2xl shadow-card border border-border space-y-6">
          {/* Order Confirmation Modal */}
          {confirmedOrderData && (
            <OrderConfirmationModal
              isOpen={showConfirmationModal}
              onClose={handleCloseModal}
              orderData={confirmedOrderData}
            />
          )}

          {/* Title */}
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Finalizar Pedido
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Preencha seus dados para concluir
            </p>
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
                      onClick={() => handleRemoveItem(index)}
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

          {/* Delivery Type Selection */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Tipo de Entrega</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeliveryType("delivery")}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${deliveryType === "delivery"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${deliveryType === "delivery" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                  <Bike className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Delivery</p>
                  <p className="text-muted-foreground text-xs">+R$ 5,00</p>
                </div>
              </button>

              <button
                onClick={() => setDeliveryType("pickup")}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${deliveryType === "pickup"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${deliveryType === "pickup" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                  <Store className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Retirada</p>
                  <p className="text-muted-foreground text-xs">Grátis</p>
                </div>
              </button>
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
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === "pix"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === "pix" ? "bg-primary text-primary-foreground" : "bg-muted"
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
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === "card"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === "card" ? "bg-primary text-primary-foreground" : "bg-muted"
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
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === "cash"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === "cash" ? "bg-primary text-primary-foreground" : "bg-muted"
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
      </main>
    </div>
  );
};

export default MenuCheckoutPage;
