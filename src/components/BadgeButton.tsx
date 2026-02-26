import { useState } from "react";
import { Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type BadgeLevel = "ferro" | "prata" | "ouro" | "cristal";

interface BadgeButtonProps {
  level: BadgeLevel;
  pizzaCount: number;
}

const badgeConfig: Record<BadgeLevel, { name: string; color: string; bgColor: string; borderColor: string; icon: string }> = {
  ferro: {
    name: "Ferro",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    icon: "🔩",
  },
  prata: {
    name: "Prata",
    color: "text-slate-500",
    bgColor: "bg-gradient-to-r from-slate-100 to-slate-200",
    borderColor: "border-slate-400",
    icon: "🥈",
  },
  ouro: {
    name: "Ouro",
    color: "text-amber-600",
    bgColor: "bg-gradient-to-r from-amber-100 to-yellow-200",
    borderColor: "border-amber-400",
    icon: "🥇",
  },
  cristal: {
    name: "Cristal",
    color: "text-cyan-600",
    bgColor: "bg-gradient-to-r from-cyan-100 to-blue-200",
    borderColor: "border-cyan-400",
    icon: "💎",
  },
};

export const getBadgeLevel = (pizzaCount: number): BadgeLevel => {
  if (pizzaCount >= 200) return "cristal";
  if (pizzaCount >= 100) return "ouro";
  if (pizzaCount >= 50) return "prata";
  return "ferro";
};

export const getNextBadgeInfo = (level: BadgeLevel): { nextLevel: BadgeLevel | null; pizzasNeeded: number } => {
  switch (level) {
    case "ferro":
      return { nextLevel: "prata", pizzasNeeded: 50 };
    case "prata":
      return { nextLevel: "ouro", pizzasNeeded: 100 };
    case "ouro":
      return { nextLevel: "cristal", pizzasNeeded: 200 };
    case "cristal":
      return { nextLevel: null, pizzasNeeded: 0 };
  }
};

const BadgeButton = ({ level, pizzaCount }: BadgeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = badgeConfig[level];
  const nextInfo = getNextBadgeInfo(level);
  const progress = nextInfo.nextLevel 
    ? Math.min(100, (pizzaCount / nextInfo.pizzasNeeded) * 100)
    : 100;

  return (
    <>
      {/* Compact Badge Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`${config.bgColor} border ${config.borderColor} rounded-xl px-3 py-2 flex items-center gap-2 hover:opacity-80 transition-opacity`}
      >
        <span className="text-lg">{config.icon}</span>
        <div className="text-left">
          <div className="flex items-center gap-1">
            <Award className={`w-3 h-3 ${config.color}`} />
            <span className={`font-semibold text-xs ${config.color}`}>
              Nível {config.name}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {pizzaCount} pizza{pizzaCount !== 1 ? 's' : ''} comprada{pizzaCount !== 1 ? 's' : ''}
          </p>
        </div>
      </button>

      {/* Badge Details Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <span className={config.color}>Nível {config.name}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Award className={`w-6 h-6 ${config.color}`} />
              <div>
                <p className={`font-bold text-lg ${config.color}`}>
                  Nível {config.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {pizzaCount} pizza{pizzaCount !== 1 ? 's' : ''} comprada{pizzaCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {nextInfo.nextLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progresso para {badgeConfig[nextInfo.nextLevel].name}</span>
                  <span>{pizzaCount}/{nextInfo.pizzasNeeded}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      nextInfo.nextLevel === "prata" ? "bg-slate-400" :
                      nextInfo.nextLevel === "ouro" ? "bg-amber-400" :
                      "bg-cyan-400"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Faltam {nextInfo.pizzasNeeded - pizzaCount} pizzas para o próximo nível!
                </p>
              </div>
            )}

            {!nextInfo.nextLevel && (
              <p className="text-sm text-center text-cyan-700 font-medium">
                🎉 Parabéns! Você alcançou o nível máximo!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BadgeButton;
