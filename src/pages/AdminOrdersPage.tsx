import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ChefHat,
  Truck,
  CheckCircle,
  Store,
  Clock,
  User,
  Phone,
  MapPin,
  CreditCard,
  RefreshCw,
  Search,
  Filter,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Calendar,
  Hash,
  ShoppingBag,
  BarChart3
} from "lucide-react";
import { SalesDashboard } from "@/components/SalesDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Order, OrderItem } from "@/hooks/useOrders";

const statusConfig = {
  confirmed: {
    label: "Confirmado",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200"
  },
  preparing: {
    label: "Em Preparo",
    icon: ChefHat,
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-200"
  },
  delivering: {
    label: "Saiu p/ Entrega",
    icon: Truck,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200"
  },
  ready: {
    label: "Pronto p/ Retirada",
    icon: Store,
    color: "text-green-500",
    bgColor: "bg-green-500",
    badgeClass: "bg-green-100 text-green-800 border-green-200"
  },
  completed: {
    label: "Concluído",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-300"
  },
};

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isAdmin, isLoading: adminLoading } = useAdminRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Check if user is admin - using hook
  useEffect(() => {
    if (!authLoading && !adminLoading && !isAdmin && user) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate, toast]);

  // Fetch all orders
  const fetchOrders = async () => {
    if (!isAdmin) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOrders: Order[] = (data || []).map(order => ({
        id: order.id,
        status: order.status as Order['status'],
        deliveryType: order.delivery_type as Order['deliveryType'],
        items: (Array.isArray(order.items) ? order.items : []) as unknown as OrderItem[],
        total: order.total,
        customerName: order.customer_name || '',
        customerPhone: order.customer_phone || '',
        customerAddress: order.customer_address || undefined,
        paymentMethod: order.payment_method as Order['paymentMethod'],
        orderNumber: order.order_number || 0,
        createdAt: new Date(order.created_at),
        estimatedTime: order.estimated_time || undefined,
      }));

      // Check for new orders and play sound
      if (soundEnabled && transformedOrders.length > lastOrderCount && lastOrderCount > 0) {
        playNotificationSound();
        toast({
          title: "🔔 Novo pedido!",
          description: "Um novo pedido foi recebido.",
        });
      }
      setLastOrderCount(transformedOrders.length);
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleD0JX6TtxpNkKxtYr/S2hmZLO0WL3N6peDQSVpzu1I1tNSc0a8n/ooxcIhxJovzDf2JONTZkuOG0mGk/M0mR5t+bejMcPZDszYh5QiseTKPzxIJsPy0iYLfkqodqPS02gNDbm3xEKyRWouvAemZGKi1ksNiuim88MTaD2Nieek8qKFug68B8aEwpL2az5K6PckY6P47c2JmDTjQmX6Lt0IZyTTM1brjir5l1RDRCi9rZnIhPMy1gpOu+e2ZQODRptduyimU7L0qW3dyajFI3KWey68OBbEo5L2i45bCXdU4+R5Ta256JVzYtaKzpw4hwRj0tY7XhtJxwTDw6htjbpYdYNipboOnDhW1MNztltOCyjGg/NkKW2t2ZiVI5KWSr6sGEbUg+NWi05K+SdkZCR47b2pqLVC4pX6Xqw4JtSEA7arXhrpRzRDlCmNrcmYtQNipipOrBg21IOTxns9+0jmlBPkeS2tyajVI4LGer68OEcEg7Omm15bCWd0ZARZLb2puNUTYpX6rpw4RuST06arblsJZ1RUA6kd3XmY9ONSpfpe3DgW1KPjppt+Ovl3ZHPUmT2tqbj1I2KV+m68ODbkk8OGm247OYdUVBTpHa25mQUjYpX6fuw4FsSTw6a7fktZl3RkNHkNranI9SNClgqOrEhG5IPjpqtuWxmnZHRESS2tqakFI2Kmao68GBbEpAO2u247SXeEZARZLb2puQUjYpYqfqxIVuSD87arXksZp1RUZGkdvbnI5ROi1mqOvBgWxKPjprtuOwl3dFQ0WR29qakVI2KWGp68OGbko+O2u25bKZdUVEQ5La2puNUTopYKnrwoNtSj86arXms5l2RkVDktrbnI9SNipfqe3DgW1JPjxqtuWzmHdFREeS2tqakFA2K2Gp68ODcEk8O2u247KYdkVDRZLb25yPUDctYqnrwoFsSD89a7fksph2RkJFktvbnpBQNixhqOrEgnBIPjxqt+Syl3dFQkSS2tqcj1A2LGKp7MSCbEg9O2u35LKXd0VDR5Lb252QUTYsYajrxIFvST48a7blsph3RUNET5Lb252PUTYsYqnrw4JwSD07arcBlHdFQkaS2tudj1E2LWKo68ODb0k9O2u247OXd0ZDRY/c25yOUTcuYqjrxINuSD47a7flsph2RkJFkNzbno9QNi1iqOzDgm9IPjxrtuWymHdGQkWS3NudkFA2LWKo68OBb0g+PGu25LKXd0ZCRZDY3J6PUDYtYqfrw4JvST49a7bls5h3RkJFkNnbnY9RNi1hp+vDgm9JPjxrtuWzmXZGRUWQ2tycj1I2LWGo68OCcEg9PGu35bKYdkZCRJHa25uPUDYtY6fsw4JvST48a7blsph2RkNEkdrbm49SNixhqOvDg3BIPjxrt+WymHZGQ0SR2tubkFA3LGGo68SCb0g+PGu35rOXd0VER5Ha25uQUTYrYqnrw4JwSD47a7blsph2RkNDkdrbm5BRNyxhqOvEgm9IPjxrt+WymHZGQ0SR2tubjlE3LWGo68ODb0k+PGu25bKYdkVDRZHb25yPUTctYajrw4NvST48a7blsph2RUNGkdvbnI5RNy1hqOvEgnBIPjxrt+aymHZFQkWQ2tubkFE2LGKo7MOCcEg+PGq35rKYdkZDRJDa252OUTctYqfrw4JwST48a7fls5h2RkNFkNrbm45RNy1hqOzEgm9IPz1rtuaymHZFQkWR2tubjlI2LGGo68SCcEg9O2u347KYdkZDRZHa25uPUTYsYajsxIJwSD48bLfms5h2RkJEkdvbnI9RNixiqOzDgm9JPjxrt+WzmXZGQ0SR2tudj1E2LWKo68ODcEg+PGu35bKYdkZCRZHa252PUTYsYqjsw4JwSD49arbms5l2RkNEkNrbm49RNy1hqOzDgnBIPjtrt+WzmHZGQ0WR2tubjlE2LWKo7MOCcEg+PGq35rOYdkZDRJDa25uOUTctYqjsxIJvSD89a7flsph2RkNFkdrbm49QNy1iqOzDgnBIPjxrt+aymHZGQkWR2tubjlE3LGKo68OCcEk+PGu25bKYdkZCRJHa252OUTctYqjrw4JwSD49a7fls5h2RkNEkdrbm49RNixiqOzDgnBIPjtrt+WzmXZGQ0WR2tubjlE3LGKo68OCcEg+PGq25bKYdkZCRZHa25yPUTYsYqjsw4JwST48a7flsph2RkJEkdrbm49RNy1iqOzDgnBIPjxqt+WymHZGQkWS2tubjlE3LWKo68SCcEg+PGu35rOYdkZCRI==');
      audio.play();
    } catch (error) {
      console.log('Could not play notification sound');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();

      // Set up realtime subscription
      const channel = supabase
        .channel('admin-orders')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          () => {
            fetchOrders();
          }
        )
        .subscribe();

      // Poll every 30 seconds as backup
      const interval = setInterval(fetchOrders, 30000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }
  }, [isAdmin]);

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Status atualizado!",
        description: `Pedido atualizado para: ${statusConfig[newStatus].label}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPaymentMethod = (method?: string) => {
    switch (method) {
      case 'pix': return 'PIX';
      case 'card': return 'Cartão';
      case 'cash': return 'Dinheiro';
      default: return 'N/A';
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.orderNumber.toString().includes(searchTerm);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Count orders by status
  const orderCounts = {
    all: orders.length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-4">
              Faça login com uma conta de administrador para acessar esta área.
            </p>
            <Button onClick={() => navigate('/login')}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="section-orange py-4 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>

          <h1 className="font-display text-xl md:text-2xl font-bold text-secondary">
            Painel Admin
          </h1>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-primary-foreground hover:bg-white/10"
              title={soundEnabled ? "Desativar som" : "Ativar som"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchOrders}
              className="text-primary-foreground hover:bg-white/10"
              title="Atualizar pedidos"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Sales Dashboard */}
        <SalesDashboard orders={orders} />
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <Card className={`cursor-pointer transition-all ${statusFilter === 'all' ? 'ring-2 ring-primary' : ''}`} onClick={() => setStatusFilter('all')}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{orderCounts.all}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer transition-all ${statusFilter === 'confirmed' ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setStatusFilter('confirmed')}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{orderCounts.confirmed}</p>
              <p className="text-xs text-muted-foreground">Confirmados</p>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer transition-all ${statusFilter === 'preparing' ? 'ring-2 ring-orange-500' : ''}`} onClick={() => setStatusFilter('preparing')}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">{orderCounts.preparing}</p>
              <p className="text-xs text-muted-foreground">Em Preparo</p>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer transition-all ${statusFilter === 'delivering' ? 'ring-2 ring-purple-500' : ''}`} onClick={() => setStatusFilter('delivering')}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-500">{orderCounts.delivering}</p>
              <p className="text-xs text-muted-foreground">Entregando</p>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer transition-all ${statusFilter === 'ready' ? 'ring-2 ring-green-500' : ''}`} onClick={() => setStatusFilter('ready')}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{orderCounts.ready}</p>
              <p className="text-xs text-muted-foreground">Prontos</p>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer transition-all ${statusFilter === 'completed' ? 'ring-2 ring-emerald-500' : ''}`} onClick={() => setStatusFilter('completed')}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{orderCounts.completed}</p>
              <p className="text-xs text-muted-foreground">Concluídos</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou nº do pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="confirmed">Confirmados</SelectItem>
              <SelectItem value="preparing">Em Preparo</SelectItem>
              <SelectItem value="delivering">Entregando</SelectItem>
              <SelectItem value="ready">Prontos</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table - Desktop */}
        <div className="hidden lg:block">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pedidos ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Nº Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead className="w-24">Total</TableHead>
                    <TableHead className="w-28">Tipo</TableHead>
                    <TableHead className="w-36">Status</TableHead>
                    <TableHead className="w-40">Data/Hora</TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhum pedido encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => {
                      const config = statusConfig[order.status];
                      const StatusIcon = config.icon;

                      return (
                        <TableRow
                          key={order.id}
                          className={`cursor-pointer hover:bg-muted/50 ${order.status === 'confirmed' ? 'bg-blue-50/50' : ''}`}
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        >
                          <TableCell className="font-mono font-bold">
                            #{order.orderNumber.toString().padStart(6, '0')}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium flex items-center gap-1">
                                <User className="w-3 h-3" /> {order.customerName}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {order.customerPhone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <p key={idx} className="text-sm truncate">
                                  {item.name} {item.size && `(${item.size})`}
                                </p>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-xs text-muted-foreground">
                                  +{order.items.length - 2} item(s)
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-primary">
                            R$ {order.total.toFixed(2).replace('.', ',')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={order.deliveryType === 'delivery' ? 'border-purple-300 text-purple-700' : 'border-green-300 text-green-700'}>
                              {order.deliveryType === 'delivery' ? (
                                <><Truck className="w-3 h-3 mr-1" /> Entrega</>
                              ) : (
                                <><Store className="w-3 h-3 mr-1" /> Retirada</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={config.badgeClass}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="confirmed">Confirmado</SelectItem>
                                <SelectItem value="preparing">Em Preparo</SelectItem>
                                <SelectItem value={order.deliveryType === 'delivery' ? 'delivering' : 'ready'}>
                                  {order.deliveryType === 'delivery' ? 'Saiu p/ Entrega' : 'Pronto p/ Retirada'}
                                </SelectItem>
                                <SelectItem value="completed">Concluído</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Orders Cards - Mobile */}
        <div className="lg:hidden space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum pedido encontrado
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              const isExpanded = selectedOrder?.id === order.id;

              return (
                <Card
                  key={order.id}
                  className={`overflow-hidden transition-all duration-200 ${order.status === 'confirmed'
                    ? 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent'
                    : order.status === 'preparing'
                      ? 'border-l-4 border-l-orange-500'
                      : order.status === 'delivering'
                        ? 'border-l-4 border-l-purple-500'
                        : order.status === 'ready'
                          ? 'border-l-4 border-l-green-500'
                          : 'border-l-4 border-l-emerald-500'
                    }`}
                >
                  <CardContent className="p-0">
                    {/* Clickable Header */}
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setSelectedOrder(isExpanded ? null : order)}
                    >
                      {/* Top Row - Order Number & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-secondary/10 rounded-lg p-2">
                            <Hash className="w-4 h-4 text-secondary" />
                          </div>
                          <div>
                            <p className="font-mono font-bold text-lg tracking-tight">
                              #{order.orderNumber.toString().padStart(6, '0')}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${config.badgeClass} font-medium`}>
                            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                            {config.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Customer Info Row */}
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-2 text-foreground">
                          <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-muted/40 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <ShoppingBag className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <p key={idx} className="text-sm truncate">
                                • {item.name} {item.size && `(${item.size})`}
                              </p>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                +{order.items.length - 2} item(s) adicional(is)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${order.deliveryType === 'delivery' ? 'border-purple-300 text-purple-700 bg-purple-50' : 'border-green-300 text-green-700 bg-green-50'}`}>
                            {order.deliveryType === 'delivery' ? (
                              <><Truck className="w-3 h-3 mr-1" /> Entrega</>
                            ) : (
                              <><Store className="w-3 h-3 mr-1" /> Retirada</>
                            )}
                          </Badge>
                          <span className="text-lg font-bold text-primary">
                            R$ {order.total.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div
                        className="px-4 pb-4 border-t border-border bg-muted/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="pt-4 space-y-4">
                          {/* Full Items List */}
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-secondary">
                              <ShoppingBag className="w-4 h-4" />
                              Itens do Pedido
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between py-2 border-b border-muted last:border-0">
                                  <span className="text-sm">
                                    {item.name} {item.size && `(${item.size})`}
                                  </span>
                                  <span className="font-semibold text-sm">
                                    R$ {item.price.toFixed(2).replace('.', ',')}
                                  </span>
                                </div>
                              ))}
                              <div className="flex justify-between pt-2 mt-2 border-t-2 border-secondary/20">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-primary text-lg">
                                  R$ {order.total.toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Address & Payment */}
                          <div className="grid grid-cols-1 gap-3">
                            {order.customerAddress && (
                              <div className="bg-white rounded-lg p-3 shadow-sm flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Endereço de Entrega</p>
                                  <p className="text-sm">{order.customerAddress}</p>
                                </div>
                              </div>
                            )}
                            <div className="bg-white rounded-lg p-3 shadow-sm flex items-start gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Forma de Pagamento</p>
                                <p className="text-sm font-medium">{formatPaymentMethod(order.paymentMethod)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Status Update */}
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Alterar Status do Pedido</p>
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                            >
                              <SelectTrigger className="bg-muted/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="confirmed">
                                  <span className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-blue-500" /> Confirmado
                                  </span>
                                </SelectItem>
                                <SelectItem value="preparing">
                                  <span className="flex items-center gap-2">
                                    <ChefHat className="w-4 h-4 text-orange-500" /> Em Preparo
                                  </span>
                                </SelectItem>
                                <SelectItem value={order.deliveryType === 'delivery' ? 'delivering' : 'ready'}>
                                  <span className="flex items-center gap-2">
                                    {order.deliveryType === 'delivery' ? (
                                      <><Truck className="w-4 h-4 text-purple-500" /> Saiu para Entrega</>
                                    ) : (
                                      <><Store className="w-4 h-4 text-green-500" /> Pronto para Retirada</>
                                    )}
                                  </span>
                                </SelectItem>
                                <SelectItem value="completed">
                                  <span className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Concluído
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;
