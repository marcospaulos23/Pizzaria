import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SizeSelector from "@/components/SizeSelector";
import FlavorSelector from "@/components/FlavorSelector";
import SweetPizzaSizeSelector from "@/components/SweetPizzaSizeSelector";
import SweetFlavorSelector from "@/components/SweetFlavorSelector";
import IngredientCustomizer from "@/components/IngredientCustomizer";
import DrinkSelector from "@/components/DrinkSelector";
import DeliverySelector from "@/components/DeliverySelector";
import ComboSelector from "@/components/ComboSelector";
import CheckoutPage, { type OrderData } from "@/components/CheckoutPage";
import { useOrders } from "@/hooks/useOrders";
import { type MenuItem, type Combo } from "@/hooks/useMenuData";
import { useToast } from "@/hooks/use-toast";
import UserAuthButton from "@/components/UserAuthButton";
import AdminNavButton from "@/components/AdminNavButton";

type Step = "size" | "combos" | "flavors" | "sweetSize" | "sweetFlavors" | "customize" | "drinks" | "delivery" | "checkout";

interface CartItem {
  name: string;
  size?: string;
  price: number;
  customizations?: { add: string[]; remove: string[] };
}

const QuickOrderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addOrder } = useOrders();

  const [step, setStep] = useState<Step>("size");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeLabel, setSizeLabel] = useState<string>("");
  const [selectedFlavors, setSelectedFlavors] = useState<MenuItem[]>([]);
  const [sweetPizzaSize, setSweetPizzaSize] = useState<string>("");
  const [sweetPizzaSizeLabel, setSweetPizzaSizeLabel] = useState<string>("");
  const [selectedSweetFlavors, setSelectedSweetFlavors] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");

  const getMaxFlavors = (size: string) => {
    if (size.includes("Família") || size.includes("GG")) return 4;
    if (size.includes("G (40cm)")) return 3;
    if (size.includes("M (30cm)")) return 2;
    return 1;
  };

  const handleSelectSize = (size: string, label: string) => {
    setSelectedSize(size);
    setSizeLabel(label);
    setStep("flavors");
  };

  const handleSelectFlavors = (flavors: MenuItem[]) => {
    setSelectedFlavors(flavors);
    setStep("sweetSize");
  };

  const handleSelectSweetSize = (size: string, label: string) => {
    setSweetPizzaSize(size);
    setSweetPizzaSizeLabel(label);
    setStep("sweetFlavors");
  };

  const getSweetMaxFlavors = (size: string) => {
    if (size.includes("G (40cm)")) return 3;
    if (size.includes("M (30cm)")) return 2;
    return 1;
  };

  const handleSelectSweetFlavors = (flavors: MenuItem[]) => {
    setSelectedSweetFlavors(flavors);
    setStep("customize");
  };

  const handleSkipSweetPizza = () => {
    setSweetPizzaSize("");
    setSweetPizzaSizeLabel("");
    setSelectedSweetFlavors([]);
    setStep("customize");
  };

  const handleSelectCombo = (combo: Combo) => {
    const comboItem: CartItem = {
      name: combo.name,
      price: combo.price,
    };
    setCart((prev) => [...prev, comboItem]);
    toast({
      title: "Combo adicionado!",
      description: `${combo.name} - R$ ${combo.price.toFixed(2).replace(".", ",")}`,
    });
    setStep("drinks");
  };

  const handleCustomize = (customizations: { add: string[]; remove: string[] }) => {
    const basePrice =
      selectedFlavors.reduce((sum, f) => {
        const priceOption = f.prices.find((p) => p.size === selectedSize);
        return sum + (priceOption?.price || 0);
      }, 0) / selectedFlavors.length;

    const extrasPrice = customizations.add.reduce((sum, id) => {
      if (id === "bacon-extra") return sum + 5;
      if (id === "queijo-extra") return sum + 6;
      if (id === "catupiry-extra") return sum + 7;
      if (id === "borda-recheada") return sum + 10;
      return sum;
    }, 0);

    const pizzaItem: CartItem = {
      name: `Pizza ${selectedFlavors.map((f) => f.name).join(" + ")}`,
      size: sizeLabel,
      price: basePrice + extrasPrice,
      customizations,
    };

    const newCartItems: CartItem[] = [pizzaItem];

    // Add sweet pizza if selected
    if (selectedSweetFlavors.length > 0 && sweetPizzaSize) {
      const sweetBasePrice =
        selectedSweetFlavors.reduce((sum, f) => {
          const priceOption = f.prices.find((p) => p.size === sweetPizzaSize);
          return sum + (priceOption?.price || 0);
        }, 0) / selectedSweetFlavors.length;

      const sweetPizzaItem: CartItem = {
        name: `Pizza Doce ${selectedSweetFlavors.map((f) => f.name).join(" + ")}`,
        size: sweetPizzaSizeLabel,
        price: sweetBasePrice,
      };
      newCartItems.push(sweetPizzaItem);
    }

    setCart((prev) => [...prev, ...newCartItems]);

    const totalAdded = newCartItems.reduce((sum, item) => sum + item.price, 0);
    toast({
      title: newCartItems.length > 1 ? "Pizzas adicionadas!" : "Pizza adicionada!",
      description: `${newCartItems.length} item(s) - R$ ${totalAdded.toFixed(2).replace(".", ",")}`,
    });
    setStep("drinks");
  };

  const handleAddDrinks = (drinks: { item: MenuItem; size: string; quantity: number }[]) => {
    const drinkItems: CartItem[] = drinks.map((d) => {
      const priceOption = d.item.prices.find((p) => p.size === d.size);
      return {
        name: `${d.item.name} (${d.size}) x${d.quantity}`,
        price: (priceOption?.price || 0) * d.quantity,
      };
    });

    if (drinkItems.length > 0) {
      setCart((prev) => [...prev, ...drinkItems]);
      toast({
        title: "Bebidas adicionadas!",
        description: `${drinkItems.length} item(s) adicionado(s) ao carrinho`,
      });
    }

    // Move to delivery selection
    setStep("delivery");
  };

  const handleGoToDrinks = () => {
    if (selectedFlavors.length > 0) {
      handleCustomize({ add: [], remove: [] });
    } else {
      setStep("drinks");
    }
  };

  const handleSelectDelivery = (type: "delivery" | "pickup") => {
    setDeliveryType(type);
    setStep("checkout");
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmOrder = async (orderData: OrderData) => {
    await addOrder({
      deliveryType: orderData.deliveryType,
      items: orderData.items.map((i) => ({ name: i.name, price: i.price })),
      total: orderData.total,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.address,
      paymentMethod: orderData.paymentMethod,
    });

    toast({
      title: "Pedido Confirmado! 🎉",
      description: orderData.deliveryType === "delivery"
        ? "Seu pedido chegará em aproximadamente 40 minutos. Bom apetite!"
        : "Seu pedido estará pronto para retirada em aproximadamente 25 minutos!",
    });

    // Reset state
    setCart([]);
    setSelectedFlavors([]);
    setSelectedSize("");
    setSizeLabel("");
    setSweetPizzaSize("");
    setSweetPizzaSizeLabel("");
    setSelectedSweetFlavors([]);
    setStep("size");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const stepLabels = ["Tamanho", "Sabores", "Doce", "Sabores Doce", "Personalizar", "Bebidas", "Entrega", "Pagamento"];
  const stepOrder: Step[] = ["size", "flavors", "sweetSize", "sweetFlavors", "customize", "drinks", "delivery", "checkout"];

  // For combos flow, we show different step labels
  const isInCombosFlow = step === "combos";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="section-orange py-4 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 bg-secondary/20 hover:bg-secondary/30 rounded-lg px-3 py-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-secondary drop-shadow-sm" />
            <span className="font-medium hidden sm:inline text-secondary drop-shadow-sm">Início</span>
          </Link>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-secondary">
            Pizzaria
          </h1>

          <div className="flex items-center gap-3">
            <AdminNavButton />
            {/* Unified Auth Button */}
            <UserAuthButton />
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-sm overflow-x-auto gap-1">
            {stepLabels.map((label, index) => {
              const currentIndex = stepOrder.indexOf(step);
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 flex-shrink-0 ${isActive
                    ? "text-primary font-bold"
                    : isCompleted
                      ? "text-primary/60"
                      : "text-muted-foreground"
                    }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                      ${isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </span>
                  <span className="hidden md:inline text-xs">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Steps */}
        <div className="bg-card p-6 rounded-2xl shadow-card border border-border">
          {step === "size" && (
            <SizeSelector
              onSelectSize={handleSelectSize}
              onSelectCombos={() => setStep("combos")}
            />
          )}

          {step === "combos" && (
            <ComboSelector
              onSelectCombo={handleSelectCombo}
              onBack={() => setStep("size")}
              onViewFullMenu={() => navigate("/pedidos")}
            />
          )}

          {step === "flavors" && (
            <FlavorSelector
              selectedSize={selectedSize}
              sizeLabel={sizeLabel}
              maxFlavors={getMaxFlavors(selectedSize)}
              onConfirm={handleSelectFlavors}
              onBack={() => setStep("size")}
            />
          )}

          {step === "sweetSize" && (
            <SweetPizzaSizeSelector
              onSelectSize={handleSelectSweetSize}
              onBack={() => setStep("flavors")}
              onSkip={handleSkipSweetPizza}
            />
          )}

          {step === "sweetFlavors" && (
            <SweetFlavorSelector
              selectedSize={sweetPizzaSize}
              sizeLabel={sweetPizzaSizeLabel}
              maxFlavors={getSweetMaxFlavors(sweetPizzaSize)}
              onConfirm={handleSelectSweetFlavors}
              onBack={() => setStep("sweetSize")}
              onSkip={handleSkipSweetPizza}
            />
          )}

          {step === "customize" && (
            <IngredientCustomizer
              selectedFlavors={selectedFlavors}
              selectedSize={selectedSize}
              sizeLabel={sizeLabel}
              onConfirm={handleCustomize}
              onBack={() => selectedSweetFlavors.length > 0 ? setStep("sweetFlavors") : setStep("sweetSize")}
              onAddDrinks={handleGoToDrinks}
            />
          )}

          {step === "drinks" && (
            <DrinkSelector onConfirm={handleAddDrinks} onBack={() => setStep("customize")} />
          )}

          {step === "delivery" && (
            <DeliverySelector
              onSelect={handleSelectDelivery}
              onBack={() => setStep("drinks")}
            />
          )}

          {step === "checkout" && (
            <CheckoutPage
              cart={cart}
              deliveryType={deliveryType}
              onBack={() => setStep("delivery")}
              onConfirmOrder={handleConfirmOrder}
              onRemoveItem={handleRemoveItem}
            />
          )}
        </div>
      </main>

      {/* Floating Cart (if items and not on checkout steps) */}
      {cart.length > 0 && !["delivery", "checkout"].includes(step) && (
        <div className="fixed bottom-4 left-4 right-4 md:max-w-md md:mx-auto z-50 animate-slide-up">
          <button
            onClick={() => setStep("delivery")}
            className="w-full btn-cta flex items-center justify-between py-4 px-6 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              <span>
                {cart.length} {cart.length === 1 ? "item" : "itens"}
              </span>
            </div>
            <span className="font-bold">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickOrderPage;