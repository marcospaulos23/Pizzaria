import { type Combo } from "@/hooks/useMenuData";
import { useMenu } from "@/contexts/MenuContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";

interface ComboSelectorProps {
  onSelectCombo: (combo: Combo) => void;
  onBack: () => void;
  onViewFullMenu: () => void;
}

const ComboSelector = ({ onSelectCombo, onBack, onViewFullMenu }: ComboSelectorProps) => {
  const { combos } = useMenu();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
        🎁 Combos Especiais
      </h2>
      <p className="text-center text-muted-foreground mb-6">
        Aproveite nossas promoções exclusivas!
      </p>

      <div className="grid gap-4">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="w-full p-4 bg-card border-2 border-border hover:border-primary rounded-xl transition-all duration-200 hover:shadow-lg group"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Image */}
              <div className="w-full sm:w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={combo.image}
                  alt={combo.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {combo.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {combo.description}
                  </p>
                </div>

                {/* Price and CTA */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-secondary">
                    R$ {combo.price.toFixed(2).replace(".", ",")}
                  </span>
                  <Button
                    onClick={() => onSelectCombo(combo)}
                    size="sm"
                    className="gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Full Menu Button */}
      <Button
        variant="outline"
        size="lg"
        className="w-full mt-6 border-primary/30 text-primary hover:bg-primary/5"
        onClick={onViewFullMenu}
      >
        VER CARDÁPIO COMPLETO
      </Button>
    </div>
  );
};

export default ComboSelector;
