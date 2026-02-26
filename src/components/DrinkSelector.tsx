import { useState } from "react";
import { Plus, Minus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type MenuItem } from "@/hooks/useMenuData";
import { useMenu } from "@/contexts/MenuContext";

interface DrinkSelectorProps {
  onConfirm: (drinks: { item: MenuItem; size: string; quantity: number }[]) => void;
  onBack: () => void;
}

const DrinkSelector = ({ onConfirm, onBack }: DrinkSelectorProps) => {
  const { bebidas } = useMenu();
  const [selectedDrinks, setSelectedDrinks] = useState<
    { item: MenuItem; size: string; quantity: number }[]
  >([]);

  const addDrink = (item: MenuItem, size: string) => {
    setSelectedDrinks((prev) => {
      const existing = prev.find((d) => d.item.id === item.id && d.size === size);
      if (existing) {
        return prev.map((d) =>
          d.item.id === item.id && d.size === size
            ? { ...d, quantity: d.quantity + 1 }
            : d
        );
      }
      return [...prev, { item, size, quantity: 1 }];
    });
  };

  const removeDrink = (itemId: string, size: string) => {
    setSelectedDrinks((prev) => {
      const existing = prev.find((d) => d.item.id === itemId && d.size === size);
      if (existing && existing.quantity > 1) {
        return prev.map((d) =>
          d.item.id === itemId && d.size === size
            ? { ...d, quantity: d.quantity - 1 }
            : d
        );
      }
      return prev.filter((d) => !(d.item.id === itemId && d.size === size));
    });
  };

  const getQuantity = (itemId: string, size: string) => {
    const drink = selectedDrinks.find((d) => d.item.id === itemId && d.size === size);
    return drink?.quantity || 0;
  };

  const totalPrice = selectedDrinks.reduce((sum, d) => {
    const priceOption = d.item.prices.find((p) => p.size === d.size);
    return sum + (priceOption?.price || 0) * d.quantity;
  }, 0);

  const hasAlcoholic = bebidas.some((b) => b.isAlcoholic);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
        >
          ← Voltar
        </button>
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
        Adicionar Bebidas
      </h2>

      {/* Alcoholic Warning */}
      {hasAlcoholic && (
        <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-secondary">Atenção:</span> Venda de bebidas alcoólicas proibida para menores de 18 anos.
          </p>
        </div>
      )}

      {/* Drinks list */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {bebidas.map((drink) => (
          <div
            key={drink.id}
            className="p-3 bg-card border border-border rounded-xl"
          >
            <div className="flex items-start gap-3">
              <img
                src={drink.image}
                alt={drink.name}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {drink.name}
                  {drink.isAlcoholic && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-secondary/20 text-secondary rounded-full">
                      +18
                    </span>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {drink.description.replace("⚠️ Venda proibida para menores de 18 anos.", "")}
                </p>

                {/* Sizes */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {drink.prices.map((price) => {
                    const qty = getQuantity(drink.id, price.size);
                    return (
                      <div
                        key={price.size}
                        className="flex items-center gap-1 bg-muted/50 rounded-lg p-1"
                      >
                        <span className="text-xs text-muted-foreground px-2">
                          {price.size} - R$ {price.price.toFixed(2).replace(".", ",")}
                        </span>
                        <div className="flex items-center">
                          {qty > 0 && (
                            <button
                              onClick={() => removeDrink(drink.id, price.size)}
                              className="w-6 h-6 flex items-center justify-center bg-destructive/10 text-destructive rounded-full hover:bg-destructive/20"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          )}
                          {qty > 0 && (
                            <span className="w-6 text-center text-sm font-bold text-foreground">
                              {qty}
                            </span>
                          )}
                          <button
                            onClick={() => addDrink(drink, price.size)}
                            className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded-full hover:bg-primary/20"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm */}
      <div className="sticky bottom-0 pt-4 bg-background space-y-2">
        {selectedDrinks.length > 0 && (
          <Button
            variant="cta"
            size="xl"
            className="w-full"
            onClick={() => onConfirm(selectedDrinks)}
          >
            Adicionar {selectedDrinks.reduce((s, d) => s + d.quantity, 0)} bebida(s) - R${" "}
            {totalPrice.toFixed(2).replace(".", ",")}
          </Button>
        )}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => onConfirm([])}
        >
          {selectedDrinks.length > 0 ? "Continuar sem mais bebidas" : "Continuar sem bebidas"}
        </Button>
      </div>
    </div>
  );
};

export default DrinkSelector;
