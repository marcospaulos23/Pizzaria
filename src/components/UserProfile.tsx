import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Calendar, Phone, X, Lock } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";
import BadgeButton, { getBadgeLevel } from "./BadgeButton";

interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  total_pizzas: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: any[];
}

const UserProfile = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error("Usuário não autenticado");
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Get phone from profile or user metadata
      const userPhone = profile.phone || authUser.user_metadata?.phone || "";

      // Fetch user orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      // Count total pizzas purchased
      let totalPizzas = 0;
      ordersData.forEach(order => {
        const items = Array.isArray(order.items) ? order.items : [];
        items.forEach((item: any) => {
          if (item.name && item.name.toLowerCase().includes('pizza')) {
            totalPizzas += 1;
          }
        });
      });

      setUser({
        id: authUser.id,
        full_name: profile.full_name || authUser.user_metadata?.full_name || "Usuário",
        email: authUser.email!,
        phone: userPhone,
        created_at: profile.created_at,
        total_pizzas: totalPizzas,
      });

      setOrders(ordersData.map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : []
      })));
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar seu perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      // Redirect to home page
      window.location.href = '/';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Usuário não encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Por favor, faça login para acessar seu perfil
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const badgeLevel = getBadgeLevel(user.total_pizzas);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Meu Perfil
          </h1>
          <div className="flex items-center gap-2">
            <BadgeButton level={badgeLevel} pizzaCount={user.total_pizzas} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Suas informações de cadastro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome completo</p>
                <p className="font-medium">{user.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Telefone
                </p>
                <p className="font-medium">{user.phone || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membro desde</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Button */}
        <Button
          onClick={() => setShowPasswordModal(true)}
          variant="outline"
          className="w-full py-6 rounded-xl border-2 hover:bg-primary/5 hover:border-primary transition-all"
        >
          <Lock className="w-5 h-5 mr-2" />
          Alterar Senha
        </Button>

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />

        {/* Orders History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Histórico de Pedidos
            </CardTitle>
            <CardDescription>
              Seus últimos pedidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Você ainda não fez nenhum pedido
              </p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status === 'completed' ? 'Concluído' : 'Em andamento'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <span className="font-bold text-primary">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item(s)
                    </p>
                  </div>
                ))}
                {orders.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    + {orders.length - 5} pedidos anteriores
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card className="border-destructive/20">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <LogOut className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">
                  Sair da Conta
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ao sair, você será desconectado do sistema e precisará fazer login novamente para acessar seu perfil e realizar pedidos.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
