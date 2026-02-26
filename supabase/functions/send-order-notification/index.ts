import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Get the request body
    const { orderData } = await req.json()
    
    if (!orderData) {
      return new Response('Order data is required', { 
        status: 400, 
        headers: corsHeaders 
      })
    }
    
    // Format order details for WhatsApp message
    const formatOrderForWhatsApp = (order: any) => {
      const deliveryType = order.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'
      const paymentMethod = order.paymentMethod === 'pix' ? 'PIX' : 
                           order.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'
      
      let message = `🍕 *NOVO PEDIDO D'KASA*\n\n`
      message += `📋 *Informações do Pedido*\n`
      message += `Número: #${order.orderNumber?.toString().padStart(6, '0') || 'N/A'}\n`
      message += `Status: ${order.status}\n`
      message += `Tipo: ${deliveryType}\n`
      message += `Forma de Pagamento: ${paymentMethod}\n\n`
      
      message += `👤 *Dados do Cliente*\n`
      message += `Nome: ${order.customerName}\n`
      message += `Telefone: ${order.customerPhone}\n`
      
      if (order.customerAddress) {
        message += `Endereço: ${order.customerAddress}\n`
      }
      
      message += `\n🍕 *Itens do Pedido*\n`
      order.items.forEach((item: any, index: number) => {
        message += `${index + 1}. ${item.name}`
        if (item.size) {
          message += ` (${item.size})`
        }
        message += ` - R$ ${item.price.toFixed(2).replace('.', ',')}\n`
        
        if (item.customizations) {
          if (item.customizations.add.length > 0) {
            message += `   + Adicionais: ${item.customizations.add.join(', ')}\n`
          }
          if (item.customizations.remove.length > 0) {
            message += `   - Sem: ${item.customizations.remove.join(', ')}\n`
          }
        }
      })
      
      message += `\n💰 *Resumo Financeiro*\n`
      message += `Subtotal: R$ ${(order.total - (order.deliveryType === 'delivery' ? 5 : 0)).toFixed(2).replace('.', ',')}\n`
      
      if (order.deliveryType === 'delivery') {
        message += `Taxa de Entrega: R$ 5,00\n`
      }
      
      message += `Total: R$ ${order.total.toFixed(2).replace('.', ',')}\n\n`
      
      message += `⏰ *Tempo Estimado*\n`
      message += `${order.estimatedTime || 'A confirmar'}\n\n`
      
      message += `📅 *Data do Pedido*\n`
      message += `${new Date(order.createdAt).toLocaleString('pt-BR')}\n\n`
      
      message += `*Por favor, confirme este pedido no sistema!*`
      
      return message
    }
    
    // Format the WhatsApp message
    const whatsappMessage = formatOrderForWhatsApp(orderData)
    
    // Send notification to WhatsApp group (using a webhook service)
    // This would typically use a service like:
    // - WhatsApp Business API
    // - Twilio
    // - SendGrid
    // - A custom webhook service
    
    // For now, we'll log the message and simulate sending
    console.log('WhatsApp Message:', whatsappMessage)
    
    // In a real implementation, you would call a WhatsApp API here
    // Example using a webhook service:
    /*
    const webhookUrl = 'https://your-webhook-service.com/send-whatsapp'
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`
      },
      body: JSON.stringify({
        message: whatsappMessage,
        group_id: process.env.WHATSAPP_GROUP_ID,
        phone_number: process.env.BUSINESS_PHONE_NUMBER
      })
    })
    
    if (!webhookResponse.ok) {
      throw new Error('Failed to send WhatsApp notification')
    }
    */
    
    // Also send to a Discord webhook if configured
    const discordWebhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL')
    if (discordWebhookUrl) {
      const discordPayload = {
        embeds: [{
          title: '🍕 Novo Pedido D\'Kasa',
          color: 0xFF6B35, // Orange color
          fields: [
            {
              name: '📋 Pedido',
              value: `#${orderData.orderNumber?.toString().padStart(6, '0') || 'N/A'} - ${orderData.status}`,
              inline: true
            },
            {
              name: '👤 Cliente',
              value: `${orderData.customerName}\n${orderData.customerPhone}`,
              inline: true
            },
            {
              name: '🍕 Itens',
              value: orderData.items.map((item: any) => 
                `${item.name}${item.size ? ` (${item.size})` : ''} - R$ ${item.price.toFixed(2).replace('.', ',')}`
              ).join('\n'),
              inline: false
            },
            {
              name: '💰 Total',
              value: `R$ ${orderData.total.toFixed(2).replace('.', ',')}`,
              inline: true
            },
            {
              name: '🚚 Tipo',
              value: orderData.deliveryType === 'delivery' ? 'Entrega' : 'Retirada',
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'D\'Kasa Pizzaria'
          }
        }]
      }
      
      try {
        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(discordPayload)
        })
      } catch (error) {
        console.error('Failed to send Discord notification:', error)
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order notification sent successfully',
        orderNumber: orderData.orderNumber
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in send-order-notification function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})