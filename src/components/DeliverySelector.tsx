import { Truck, Store } from "lucide-react";

interface DeliverySelectorProps {
  onSelect: (type: "delivery" | "pickup") => void;
  onBack: () => void;
}

const DeliverySelector = ({ onSelect, onBack }: DeliverySelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          Como deseja receber?
        </h2>
        <p className="text-muted-foreground">
          Escolha entre entrega ou retirada na pizzaria
        </p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => onSelect("delivery")}
          className="w-full p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-all duration-200 hover:shadow-lg group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Truck className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                DELIVERY
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Receba seu pedido no conforto da sua casa
              </p>
              <p className="text-primary font-semibold text-sm mt-2">
                Taxa de entrega a calcular
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelect("pickup")}
          className="w-full p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-all duration-200 hover:shadow-lg group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <Store className="w-8 h-8 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-foreground group-hover:text-secondary transition-colors">
                RETIRAR NA PIZZARIA
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Busque seu pedido diretamente conosco
              </p>
              <p className="text-green-600 font-semibold text-sm mt-2">
                Sem taxa de entrega
              </p>
            </div>
          </div>
        </button>
      </div>

      <button
        onClick={onBack}
        className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        ← Voltar às bebidas
      </button>
    </div>
  );
};

export default DeliverySelector;
