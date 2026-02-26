import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useOrderNotification } from "./useOrderNotification";
import type { Json } from "@/integrations/supabase/types";

export interface OrderItem {
  name: string;
  size?: string;
  price: number;
  customizations?: { add: string[]; remove: string[] };
}

export interface Order {
  id: string;
  status: 'confirmed' | 'preparing' | 'delivering' | 'ready' | 'completed';
  deliveryType: 'delivery' | 'pickup';
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  paymentMethod?: 'pix' | 'card' | 'cash';
  orderNumber: number;
  createdAt: Date;
  estimatedTime?: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendOrderNotification, isSending: isNotificationSending } = useOrderNotification();

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    } else {
      // Load orders from localStorage for non-authenticated users
      loadLocalOrders();
    }
  }, [user]);

  const loadLocalOrders = () => {
    const saved = localStorage.getItem("dkasa_orders");
    if (saved) {
      const parsed = JSON.parse(saved);
      setOrders(parsed.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
      })));
    }
    setIsLoading(false);
  };

  const fetchUserOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

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

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching user orders:', error);
      loadLocalOrders(); // Fallback to local storage
    } finally {
      setIsLoading(false);
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'orderNumber' | 'estimatedTime'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "confirmed",
      createdAt: new Date(),
      orderNumber: Date.now(),
      estimatedTime: orderData.deliveryType === "delivery" ? "40-50 min" : "25-35 min",
    };

    if (user) {
      // Save to database
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([{
            user_id: user.id,
            status: newOrder.status,
            delivery_type: newOrder.deliveryType,
            items: JSON.parse(JSON.stringify(newOrder.items)) as Json,
            total: newOrder.total,
            customer_name: newOrder.customerName,
            customer_phone: newOrder.customerPhone,
            customer_address: newOrder.customerAddress,
            payment_method: newOrder.paymentMethod,
            order_number: newOrder.orderNumber,
            estimated_time: newOrder.estimatedTime,
          }])
          .select()
          .single();

        if (error) throw error;
        
        newOrder.id = data.id;
        setOrders(prev => [newOrder, ...prev]);
      } catch (error) {
        console.error('Error saving order to database:', error);
        // Fallback to local storage
        setOrders(prev => [newOrder, ...prev]);
      }
    } else {
      // Save to local storage for non-authenticated users
      setOrders(prev => [newOrder, ...prev]);
    }

    // Send notification to company group
    try {
      await sendOrderNotification({
        ...newOrder,
        createdAt: newOrder.createdAt.toISOString(),
      });
      
      toast({
        title: "Pedido Confirmado! 🎉",
        description: "Seu pedido foi enviado para confirmação da equipe.",
      });
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't block the order creation if notification fails
      toast({
        title: "Pedido Confirmado! 🎉",
        description: "Seu pedido foi recebido. Notificação da equipe pode ter falhado.",
      });
    }

    // Simulate order status updates
    simulateOrderProgress(newOrder.id, orderData.deliveryType);

    return newOrder;
  };

  const simulateOrderProgress = (orderId: string, deliveryType: "delivery" | "pickup") => {
    // Move to preparing after 5 seconds
    setTimeout(() => {
      updateOrderStatus(orderId, "preparing");
    }, 5000);

    // Move to delivering/ready after 15 seconds
    setTimeout(() => {
      updateOrderStatus(orderId, deliveryType === "delivery" ? "delivering" : "ready");
    }, 15000);

    // Complete after 25 seconds
    setTimeout(() => {
      updateOrderStatus(orderId, "completed");
    }, 25000);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));

    // Update in database if user is authenticated
    if (user) {
      supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
    }
  };

  const getActiveOrders = () => {
    return orders.filter((o) => o.status !== "completed");
  };

  const getCompletedOrders = () => {
    return orders.filter((o) => o.status === "completed");
  };

  const clearCompletedOrders = () => {
    setOrders((prev) => prev.filter((o) => o.status !== "completed"));
  };

  return {
    orders,
    isLoading,
    isNotificationSending,
    addOrder,
    getActiveOrders,
    getCompletedOrders,
    clearCompletedOrders,
    updateOrderStatus,
  };
};