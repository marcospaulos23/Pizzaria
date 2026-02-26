import { Button } from "@/components/ui/button";

interface SweetPizzaSizeSelectorProps {
  onSelectSize: (size: string, sizeLabel: string) => void;
  onBack: () => void;
  onSkip: () => void;
}

const sizes = [
  { id: "P (25cm)", label: "Pequena", description: "25cm - Ideal para 1 pessoa", icon: "🍫" },
  { id: "M (30cm)", label: "Média", description: "30cm - Ideal para 2 pessoas", icon: "🍫🍫" },
  { id: "G (40cm)", label: "Grande", description: "40cm - Ideal para 3-4 pessoas", icon: "🍫🍫🍫" },
];

const SweetPizzaSizeSelector = ({ onSelectSize, onBack, onSkip }: SweetPizzaSizeSelectorProps) => {
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

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
        🍫 Pizza Doce
      </h2>
      <p className="text-center text-muted-foreground mb-6">
        Deseja adicionar uma pizza doce ao seu pedido?
      </p>

      <div className="grid gap-3">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSelectSize(size.id, size.label)}
            className="w-full p-4 bg-card border-2 border-border hover:border-primary rounded-xl transition-all duration-200 hover:shadow-lg group text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {size.label}
                </h3>
                <p className="text-muted-foreground text-sm">{size.description}</p>
              </div>
              <span className="text-2xl">{size.icon}</span>
            </div>
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full mt-4 border-muted-foreground/30"
        onClick={onSkip}
      >
        Pular - Não quero pizza doce
      </Button>
    </div>
  );
};

export default SweetPizzaSizeSelector;
