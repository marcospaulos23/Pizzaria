// Menu types and image imports
// Data is now loaded from Supabase - see useMenuData hook

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

// Keep image imports for backwards compatibility
import pizzaPepperoni from "@/assets/pizza-pepperoni.jpg";
import pizzaMargherita from "@/assets/pizza-margherita.jpg";
import calzoneImg from "@/assets/calzone.jpg";
import pizzaDoce from "@/assets/pizza-doce.jpg";
import bebidasImg from "@/assets/bebidas.jpg";

// Export images for backwards compatibility
export { pizzaPepperoni, pizzaMargherita, calzoneImg, pizzaDoce, bebidasImg };

// WARNING: The exports below are DEPRECATED and will be empty arrays
// Use the useMenuData hook instead to get data from Supabase
export const pizzasSalgadas: MenuItem[] = [];
export const calzones: MenuItem[] = [];
export const pizzasDoces: MenuItem[] = [];
export const combos: Combo[] = [];
export const bebidas: MenuItem[] = [];

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: "salgadas", label: "Pizzas Salgadas", icon: "🍕" },
  { id: "doces", label: "Pizzas Doces", icon: "🥧" },
  { id: "combos", label: "Combos", icon: "🎁" },
  { id: "calzones", label: "Calzones", icon: "🥟" },
  { id: "bebidas", label: "Bebidas", icon: "🥤" },
];
