import { Combo } from "@/hooks/useMenuData";

interface ComboCardProps {
  combo: Combo;
}

const ComboCard = ({ combo }: ComboCardProps) => {
  return (
    <div className="card-product flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border/50">
      {/* Image on the left */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={combo.image}
          alt={combo.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Content on the right */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            {combo.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {combo.description}
          </p>
        </div>

        {/* Price display only */}
        <div className="mt-3 flex items-center">
          <span className="text-2xl font-bold text-secondary">
            R$ {combo.price.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComboCard;
