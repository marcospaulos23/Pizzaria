import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import ComboCard from "@/components/ComboCard";
import UserAuthButton from "@/components/UserAuthButton";
import AdminNavButton from "@/components/AdminNavButton";
import { useMenu } from "@/contexts/MenuContext";
import { type Category } from "@/hooks/useMenuData";

const OrdersPage = () => {
  const { categories, pizzasSalgadas, pizzasDoces, calzones, bebidas, combos, isLoading } = useMenu();
  const [activeCategory, setActiveCategory] = useState<Category>("salgadas");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  const getItemsByCategory = () => {
    switch (activeCategory) {
      case "salgadas":
        return pizzasSalgadas;
      case "doces":
        return pizzasDoces;
      case "calzones":
        return calzones;
      case "bebidas":
        return bebidas;
      default:
        return [];
    }
  };

  const hasAlcoholicItems = activeCategory === "bebidas";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="section-orange py-6 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-secondary">
            Cardápio
          </h1>

          <div className="flex items-center gap-2">
            <AdminNavButton />
            <UserAuthButton />
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="bg-card border-b border-border sticky top-[76px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "categoryActive" : "category"}
                size="lg"
                onClick={() => setActiveCategory(category.id)}
                className="flex-shrink-0 gap-2"
              >
                <span>{category.icon}</span>
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.split(" ")[0]}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Title */}
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold text-foreground">
            {categories.find((c) => c.id === activeCategory)?.label}
          </h2>
          <p className="text-muted-foreground mt-1">
            Confira nosso cardápio completo
          </p>
        </div>

        {/* Alcoholic Warning */}
        {hasAlcoholicItems && (
          <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-secondary">
                Atenção: Bebidas Alcoólicas
              </p>
              <p className="text-sm text-muted-foreground">
                Venda proibida para menores de 18 anos. Beba com moderação.
              </p>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {activeCategory === "combos" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {combos.map((combo) => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getItemsByCategory().map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* CTA to order */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-8 border border-border">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Gostou do nosso cardápio?
            </h3>
            <p className="text-muted-foreground mb-6">
              Faça seu pedido agora mesmo e receba em casa!
            </p>
            <Link to="/pedido-rapido">
              <Button variant="hero" size="lg" className="text-lg px-8">
                🍕 Fazer Pedido
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;