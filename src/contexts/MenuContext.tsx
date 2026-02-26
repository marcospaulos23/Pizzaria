import React, { createContext, useContext, ReactNode } from "react";
import { useMenuData, type MenuItem, type Combo, type Category, type CategoryInfo } from "@/hooks/useMenuData";

interface MenuContextType {
    categories: CategoryInfo[];
    pizzasSalgadas: MenuItem[];
    pizzasDoces: MenuItem[];
    calzones: MenuItem[];
    bebidas: MenuItem[];
    combos: Combo[];
    isLoading: boolean;
    error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
    const menuData = useMenuData();

    return (
        <MenuContext.Provider value={menuData}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error("useMenu must be used within a MenuProvider");
    }
    return context;
};
