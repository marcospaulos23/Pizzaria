import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import OrderTracker from "./OrderTracker";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";

const UserAuthButton = () => {
  const { user, logout, isLoading } = useAuth();
  const { orders, getActiveOrders, getCompletedOrders } = useOrders();
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const activeOrders = getActiveOrders();
  const completedOrders = getCompletedOrders();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível realizar o logout",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {/* Profile Link */}
        <Link
          to="/perfil"
          className="relative flex items-center gap-2 p-2 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors"
          title="Meu Perfil"
        >
          <User className="w-5 h-5 text-secondary drop-shadow-sm" />
        </Link>

        {/* Cart with Order Tracker */}
        <Sheet open={isTrackerOpen} onOpenChange={setIsTrackerOpen}>
          <SheetTrigger asChild>
            <button className="relative flex items-center gap-2 p-2 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-secondary drop-shadow-sm" />
              {/* Counter for active orders */}
              {activeOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {activeOrders.length}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md p-0">
            <SheetHeader className="p-4 pb-0">
              <SheetTitle>Meus Pedidos</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <OrderTracker
                orders={orders}
                onClose={() => setIsTrackerOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Login Button */}
      <Link
        to="/login"
        className="relative flex items-center gap-2 p-2 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors"
        title="Fazer Login"
      >
        <User className="w-5 h-5 text-secondary drop-shadow-sm" />
      </Link>

      {/* Cart with Order Tracker */}
      <Sheet open={isTrackerOpen} onOpenChange={setIsTrackerOpen}>
        <SheetTrigger asChild>
          <button className="relative flex items-center gap-2 p-2 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 text-secondary drop-shadow-sm" />
            {/* Counter for active orders */}
            {activeOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {activeOrders.length}
              </span>
            )}
            {/* Counter for completed orders (only if no active orders) */}
            {activeOrders.length === 0 && completedOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-muted text-muted-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {completedOrders.length}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-4 pb-0">
            <SheetTitle>Meus Pedidos</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <OrderTracker
              orders={orders}
              onClose={() => setIsTrackerOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserAuthButton;