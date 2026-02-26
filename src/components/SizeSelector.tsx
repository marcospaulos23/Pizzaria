import { Button } from "@/components/ui/button";


interface SizeSelectorProps {
  onSelectSize: (size: string, sizeLabel: string) => void;
  onSelectCombos?: () => void;
}

const sizes = [
  { id: "P (25cm)", label: "Pequena", description: "25cm - Ideal para 1 pessoa", icon: "🍕" },
  { id: "M (30cm)", label: "Média", description: "30cm - Ideal para 2 pessoas", icon: "🍕🍕" },
  { id: "G (40cm)", label: "Grande", description: "40cm - Ideal para 3-4 pessoas", icon: "🍕🍕🍕" },
  { id: "GG (50cm)", label: "Gigante", description: "50cm - Ideal para 4-5 pessoas", icon: "🍕🍕🍕🍕" },
  { id: "Família (60cm)", label: "Família", description: "60cm - Para toda a família!", icon: "🍕🍕🍕🍕🍕" },
];

const SizeSelector = ({ onSelectSize, onSelectCombos }: SizeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
        Escolha o Tamanho
      </h2>
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

        {/* Combos Button */}
        {onSelectCombos && (
          <button
            onClick={onSelectCombos}
            className="w-full p-4 bg-card border-2 border-secondary hover:border-secondary/80 rounded-xl transition-all duration-200 hover:shadow-lg group text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-secondary group-hover:text-secondary/80 transition-colors">
                  Combos Especiais
                </h3>
                <p className="text-muted-foreground text-sm">Confira nossas promoções!</p>
              </div>
              <span className="text-2xl">🎁</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default SizeSelector;
