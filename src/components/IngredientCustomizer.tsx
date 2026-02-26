import { useState } from "react";
import { Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type MenuItem } from "@/hooks/useMenuData";

interface IngredientCustomizerProps {
  selectedFlavors: MenuItem[];
  selectedSize: string;
  sizeLabel: string;
  onConfirm: (customizations: { add: string[]; remove: string[] }) => void;
  onBack: () => void;
  onAddDrinks: () => void;
}

const commonIngredients = [
  { id: "cebola", name: "Cebola" },
  { id: "azeitona", name: "Azeitona" },
  { id: "ervilha", name: "Ervilha" },
  { id: "milho", name: "Milho" },
  { id: "oregano", name: "Orégano extra" },
  { id: "pimenta", name: "Pimenta" },
];

const extraIngredients = [
  { id: "bacon-extra", name: "Bacon extra", price: 5 },
  { id: "queijo-extra", name: "Queijo extra", price: 6 },
  { id: "catupiry-extra", name: "Catupiry extra", price: 7 },
  { id: "borda-recheada", name: "Borda recheada", price: 10 },
];

const IngredientCustomizer = ({
  selectedFlavors,
  selectedSize,
  sizeLabel,
  onConfirm,
  onBack,
  onAddDrinks,
}: IngredientCustomizerProps) => {
  const [removeIngredients, setRemoveIngredients] = useState<string[]>([]);
  const [addIngredients, setAddIngredients] = useState<string[]>([]);

  const toggleRemove = (id: string) => {
    setRemoveIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAdd = (id: string) => {
    setAddIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getBasePrice = () => {
    const total = selectedFlavors.reduce((sum, f) => {
      const priceOption = f.prices.find((p) => p.size === selectedSize);
      return sum + (priceOption?.price || 0);
    }, 0);
    return total / selectedFlavors.length;
  };

  const getExtrasPrice = () => {
    return addIngredients.reduce((sum, id) => {
      const extra = extraIngredients.find((e) => e.id === id);
      return sum + (extra?.price || 0);
    }, 0);
  };

  const totalPrice = getBasePrice() + getExtrasPrice();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
        >
          ← Voltar
        </button>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{sizeLabel}</p>
          <p className="font-display font-bold text-foreground text-sm">
            {selectedFlavors.map((f) => f.name).join(" + ")}
          </p>
        </div>
      </div>

      {/* Drinks Upsell Button */}
      <button
        onClick={onAddDrinks}
        className="w-full p-4 bg-secondary/10 border-2 border-secondary/30 hover:border-secondary rounded-xl transition-all duration-200 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🥤</span>
          <div className="text-left">
            <h3 className="font-display font-bold text-secondary group-hover:text-secondary/80">
              ADICIONAR BEBIDAS
            </h3>
            <p className="text-sm text-muted-foreground">Refrigerantes, água e cervejas</p>
          </div>
        </div>
        <Plus className="w-6 h-6 text-secondary" />
      </button>

      <h2 className="font-display text-xl font-bold text-foreground">
        Personalize sua Pizza
      </h2>

      {/* Remove ingredients */}
      <div className="space-y-3">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <Minus className="w-4 h-4 text-destructive" />
          Retirar ingredientes
        </h3>
        <div className="flex flex-wrap gap-2">
          {commonIngredients.map((ing) => (
            <button
              key={ing.id}
              onClick={() => toggleRemove(ing.id)}
              className={`px-3 py-2 rounded-full border transition-all text-sm font-medium
                ${removeIngredients.includes(ing.id)
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border bg-card text-muted-foreground hover:border-destructive/50"
                }`}
            >
              {removeIngredients.includes(ing.id) && <span className="mr-1">✕</span>}
              Sem {ing.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add ingredients */}
      <div className="space-y-3">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          Acrescentar (valor adicional)
        </h3>
        <div className="grid gap-2">
          {extraIngredients.map((ing) => (
            <button
              key={ing.id}
              onClick={() => toggleAdd(ing.id)}
              className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between
                ${addIngredients.includes(ing.id)
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
                }`}
            >
              <span className="font-medium text-foreground">{ing.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary font-bold">
                  + R$ {ing.price.toFixed(2).replace(".", ",")}
                </span>
                {addIngredients.includes(ing.id) && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Confirm */}
      <div className="sticky bottom-0 pt-4 bg-background space-y-2">
        <Button
          variant="cta"
          size="xl"
          className="w-full"
          onClick={() => onConfirm({ add: addIngredients, remove: removeIngredients })}
        >
          Adicionar ao Carrinho - R$ {totalPrice.toFixed(2).replace(".", ",")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => onConfirm({ add: addIngredients, remove: removeIngredients })}
        >
          Pular personalização
        </Button>
      </div>
    </div>
  );
};

export default IngredientCustomizer;
