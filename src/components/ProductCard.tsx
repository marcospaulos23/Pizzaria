import { MenuItem } from "@/hooks/useMenuData";

interface ProductCardProps {
  item: MenuItem;
}

const ProductCard = ({ item }: ProductCardProps) => {
  return (
    <div className="card-product flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border/50">
      {/* Image on the left */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Content on the right */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-xl font-bold text-foreground">
              {item.name}
            </h3>
            {item.isAlcoholic && (
              <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full font-medium">
                +18
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Prices - Display only */}
        <div className="mt-3 flex flex-wrap gap-2">
          {item.prices.map((priceOption) => (
            <div
              key={priceOption.size}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
            >
              <span className="text-xs text-muted-foreground">
                {priceOption.size}
              </span>
              <span className="text-sm font-bold text-foreground">
                R$ {priceOption.price.toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
