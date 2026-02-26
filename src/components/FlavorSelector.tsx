import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type MenuItem } from "@/hooks/useMenuData";
import { useMenu } from "@/contexts/MenuContext";

interface FlavorSelectorProps {
  selectedSize: string;
  sizeLabel: string;
  maxFlavors: number;
  onConfirm: (flavors: MenuItem[]) => void;
  onBack: () => void;
}

const FlavorSelector = ({ selectedSize, sizeLabel, maxFlavors, onConfirm, onBack }: FlavorSelectorProps) => {
  const { pizzasSalgadas } = useMenu();
  const [selectedFlavors, setSelectedFlavors] = useState<MenuItem[]>([]);

  const toggleFlavor = (flavor: MenuItem) => {
    if (selectedFlavors.some((f) => f.id === flavor.id)) {
      setSelectedFlavors(selectedFlavors.filter((f) => f.id !== flavor.id));
    } else if (selectedFlavors.length < maxFlavors) {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  const isSelected = (flavor: MenuItem) => selectedFlavors.some((f) => f.id === flavor.id);

  const getPrice = (flavor: MenuItem) => {
    const priceOption = flavor.prices.find((p) => p.size === selectedSize);
    return priceOption?.price || 0;
  };

  const calculateTotalPrice = () => {
    if (selectedFlavors.length === 0) return 0;
    // Average price for mixed flavors
    const total = selectedFlavors.reduce((sum, f) => sum + getPrice(f), 0);
    return total / selectedFlavors.length;
  };

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
          <p className="text-sm text-muted-foreground">Tamanho selecionado</p>
          <p className="font-display font-bold text-foreground">{sizeLabel}</p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Escolha {maxFlavors > 1 ? `até ${maxFlavors} sabores` : "o sabor"}
        </h2>
        <p className="text-muted-foreground mt-1">
          {selectedFlavors.length} de {maxFlavors} selecionados
        </p>
      </div>

      {/* Selected flavors display */}
      {selectedFlavors.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
          {selectedFlavors.map((flavor) => (
            <span
              key={flavor.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium"
            >
              {flavor.name}
              <button
                onClick={() => toggleFlavor(flavor)}
                className="hover:bg-primary-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Flavors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {pizzasSalgadas.map((flavor) => {
          const selected = isSelected(flavor);
          const disabled = !selected && selectedFlavors.length >= maxFlavors;

          return (
            <button
              key={flavor.id}
              onClick={() => !disabled && toggleFlavor(flavor)}
              disabled={disabled}
              className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-3
                ${selected
                  ? "border-primary bg-primary/10"
                  : disabled
                    ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                }`}
            >
              <img
                src={flavor.image}
                alt={flavor.name}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground truncate">{flavor.name}</h3>
                  {selected && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{flavor.description}</p>
                <p className="text-sm font-bold text-primary mt-1">
                  R$ {getPrice(flavor).toFixed(2).replace(".", ",")}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      {selectedFlavors.length > 0 && (
        <div className="sticky bottom-0 pt-4 bg-background">
          <Button
            variant="cta"
            size="xl"
            className="w-full"
            onClick={() => onConfirm(selectedFlavors)}
          >
            Continuar - R$ {calculateTotalPrice().toFixed(2).replace(".", ",")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlavorSelector;
