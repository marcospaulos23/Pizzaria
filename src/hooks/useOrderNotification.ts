import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface OrderNotificationData {
  id: string;
  status: 'confirmed' | 'preparing' | 'delivering' | 'ready' | 'completed';
  deliveryType: 'delivery' | 'pickup';
  items: any[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  paymentMethod?: 'pix' | 'card' | 'cash';
  orderNumber: number;
  createdAt: string;
  estimatedTime?: string;
}

export const useOrderNotification = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOrderNotification = async (orderData: OrderNotificationData) => {
    setIsSending(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-order-notification', {
        body: { orderData }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error sending order notification:', error);
      setError(error.message || 'Failed to send order notification');
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendOrderNotification,
    isSending,
    error,
  };
};