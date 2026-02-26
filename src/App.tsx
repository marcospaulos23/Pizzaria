import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MenuProvider } from "@/contexts/MenuContext";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import QuickOrderPage from "./pages/QuickOrderPage";
import MenuCheckoutPage from "./pages/MenuCheckoutPage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./components/UserProfile";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MenuProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pedidos" element={<OrdersPage />} />
            <Route path="/pedido-rapido" element={<QuickOrderPage />} />
            <Route path="/checkout" element={<MenuCheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/perfil" element={<UserProfile />} />
            <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
            <Route path="/admin/menu" element={<AdminMenuPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MenuProvider>
  </QueryClientProvider>
);

export default App;