import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Tipos baseados no menu.ts original
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    image: string;
    prices: { size: string; price: number }[];
    category: string;
    isAlcoholic?: boolean;
}

export interface Combo {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export type Category = "salgadas" | "doces" | "combos" | "calzones" | "bebidas";

export interface CategoryInfo {
    id: Category;
    label: string;
    icon: string;
}

// Tipos do banco de dados
interface DBProduct {
    id: string;
    name: string;
    description: string;
    category_id: string;
    image_url: string | null;
    is_alcoholic: boolean;
    available: boolean;
}

interface DBProductPrice {
    product_id: string;
    size: string;
    price: number;
}

interface DBCombo {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    available: boolean;
}

interface DBCategory {
    id: string;
    label: string;
    icon: string;
    display_order: number;
}

export const useMenuData = () => {
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [pizzasSalgadas, setPizzasSalgadas] = useState<MenuItem[]>([]);
    const [pizzasDoces, setPizzasDoces] = useState<MenuItem[]>([]);
    const [calzones, setCalzones] = useState<MenuItem[]>([]);
    const [bebidas, setBebidas] = useState<MenuItem[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para converter produtos do banco para o formato MenuItem
    const convertToMenuItem = (
        products: DBProduct[],
        prices: DBProductPrice[]
    ): MenuItem[] => {
        return products.map((product) => {
            const productPrices = prices
                .filter((p) => p.product_id === product.id)
                .map((p) => ({ size: p.size, price: Number(p.price) }));

            return {
                id: product.id,
                name: product.name,
                description: product.description,
                image: product.image_url || "/placeholder.svg",
                prices: productPrices,
                category: product.category_id,
                isAlcoholic: product.is_alcoholic,
            };
        });
    };

    // Função para converter combos do banco
    const convertToCombos = (dbCombos: DBCombo[]): Combo[] => {
        return dbCombos.map((combo) => ({
            id: combo.id,
            name: combo.name,
            description: combo.description,
            price: Number(combo.price),
            image: combo.image_url || "/placeholder.svg",
        }));
    };

    useEffect(() => {
        let isMounted = true;

        const fetchMenuData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Buscar categorias
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from("categories")
                    .select("*")
                    .order("display_order");

                if (categoriesError) throw categoriesError;

                // Buscar produtos disponíveis
                const { data: productsData, error: productsError } = await supabase
                    .from("products")
                    .select("*")
                    .eq("available", true);

                if (productsError) throw productsError;

                // Buscar preços
                const { data: pricesData, error: pricesError } = await supabase
                    .from("product_prices")
                    .select("*");

                if (pricesError) throw pricesError;

                // Buscar combos disponíveis
                const { data: combosData, error: combosError } = await supabase
                    .from("combos")
                    .select("*")
                    .eq("available", true);

                if (combosError) throw combosError;

                if (!isMounted) return;

                // Processar categorias
                const processedCategories: CategoryInfo[] = (
                    categoriesData as DBCategory[]
                ).map((cat) => ({
                    id: cat.id as Category,
                    label: cat.label,
                    icon: cat.icon,
                }));
                setCategories(processedCategories);

                // Separar produtos por categoria
                const salgadasProducts = productsData?.filter(
                    (p) => p.category_id === "salgadas"
                ) as DBProduct[];
                const docesProducts = productsData?.filter(
                    (p) => p.category_id === "doces"
                ) as DBProduct[];
                const calzonesProducts = productsData?.filter(
                    (p) => p.category_id === "calzones"
                ) as DBProduct[];
                const bebidasProducts = productsData?.filter(
                    (p) => p.category_id === "bebidas"
                ) as DBProduct[];

                // Converter para MenuItem
                setPizzasSalgadas(
                    convertToMenuItem(salgadasProducts, pricesData as DBProductPrice[])
                );
                setPizzasDoces(
                    convertToMenuItem(docesProducts, pricesData as DBProductPrice[])
                );
                setCalzones(
                    convertToMenuItem(calzonesProducts, pricesData as DBProductPrice[])
                );
                setBebidas(
                    convertToMenuItem(bebidasProducts, pricesData as DBProductPrice[])
                );

                // Converter combos
                setCombos(convertToCombos(combosData as DBCombo[]));
            } catch (err) {
                console.error("Erro ao carregar menu:", err);
                if (isMounted) {
                    setError(
                        err instanceof Error ? err.message : "Erro ao carregar o cardápio"
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchMenuData();

        // Subscribe para mudanças em tempo real
        const productsChannel = supabase
            .channel("products-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "products" },
                () => {
                    fetchMenuData();
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "product_prices" },
                () => {
                    fetchMenuData();
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "combos" },
                () => {
                    fetchMenuData();
                }
            )
            .subscribe();

        return () => {
            isMounted = false;
            productsChannel.unsubscribe();
        };
    }, []);

    return {
        categories,
        pizzasSalgadas,
        pizzasDoces,
        calzones,
        bebidas,
        combos,
        isLoading,
        error,
    };
};
