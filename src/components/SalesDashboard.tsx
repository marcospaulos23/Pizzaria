import { useState, useMemo } from "react";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subMonths, subYears, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, TrendingUp, ShoppingBag } from "lucide-react";
import type { Order } from "@/hooks/useOrders";

interface SalesDashboardProps {
  orders: Order[];
}

type DatePreset = "today" | "last7days" | "last30days" | "thisMonth" | "lastMonth" | "thisYear" | "lastYear" | "allTime" | "custom";

const presetOptions = [
  { value: "today", label: "Hoje" },
  { value: "last7days", label: "Últimos 7 dias" },
  { value: "last30days", label: "Últimos 30 dias" },
  { value: "thisMonth", label: "Este mês" },
  { value: "lastMonth", label: "Mês passado" },
  { value: "thisYear", label: "Este ano" },
  { value: "lastYear", label: "Ano passado" },
  { value: "allTime", label: "Todo o período" },
  { value: "custom", label: "Período personalizado" },
];

export const SalesDashboard = ({ orders }: SalesDashboardProps) => {
  const [preset, setPreset] = useState<DatePreset>("today");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  const getDateRange = (): { start: Date; end: Date } => {
    const now = new Date();
    
    switch (preset) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "last7days":
        return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
      case "last30days":
        return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfDay(now) };
      case "lastMonth":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "thisYear":
        return { start: startOfYear(now), end: endOfDay(now) };
      case "lastYear":
        const lastYear = subYears(now, 1);
        return { start: startOfYear(lastYear), end: endOfYear(lastYear) };
      case "allTime":
        return { start: new Date(0), end: endOfDay(now) };
      case "custom":
        return {
          start: customStartDate ? startOfDay(customStartDate) : startOfDay(now),
          end: customEndDate ? endOfDay(customEndDate) : endOfDay(now)
        };
      default:
        return { start: startOfDay(now), end: endOfDay(now) };
    }
  };

  const stats = useMemo(() => {
    const { start, end } = getDateRange();
    
    const filteredOrders = orders.filter(order => {
      const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);
      return isWithinInterval(orderDate, { start, end });
    });

    const completedOrders = filteredOrders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const totalSales = completedOrders.length;

    return {
      totalRevenue,
      totalOrders,
      totalSales
    };
  }, [orders, preset, customStartDate, customEndDate]);

  const handlePresetChange = (value: string) => {
    setPreset(value as DatePreset);
    if (value !== "custom") {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  };

  const { start, end } = getDateRange();

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!customStartDate || (customStartDate && customEndDate)) {
      setCustomStartDate(date);
      setCustomEndDate(undefined);
      setPreset("custom");
    } else {
      if (date < customStartDate) {
        setCustomEndDate(customStartDate);
        setCustomStartDate(date);
      } else {
        setCustomEndDate(date);
      }
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col xl:flex-row gap-4">
          {/* Left side - Filters and Stats */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Dashboard</h3>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Quick preset buttons */}
                <div className="flex flex-wrap gap-1">
                  {presetOptions.slice(0, 4).map(option => (
                    <Button
                      key={option.value}
                      variant={preset === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePresetChange(option.value)}
                      className="text-xs"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                
                <Select value={preset} onValueChange={handlePresetChange}>
                  <SelectTrigger className="w-40 bg-background">
                    <SelectValue placeholder="Mais opções" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected period display */}
            {preset === "custom" && customStartDate && (
              <div className="mb-4 p-2 bg-muted rounded-lg text-sm text-muted-foreground">
                Período: {format(customStartDate, "dd/MM/yyyy")} 
                {customEndDate ? ` até ${format(customEndDate, "dd/MM/yyyy")}` : " (selecione a data final)"}
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-green-600 font-medium">Valor Líquido</p>
                    <p className="text-xl font-bold text-green-700">
                      R$ {stats.totalRevenue.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Sales */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Vendas Concluídas</p>
                    <p className="text-xl font-bold text-blue-700">{stats.totalSales}</p>
                  </div>
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Total de Pedidos</p>
                    <p className="text-xl font-bold text-purple-700">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Mini Calendar */}
          <div className="xl:w-auto flex-shrink-0">
            <div className="bg-muted/30 rounded-xl p-2 border">
              <Calendar
                mode="single"
                selected={customEndDate || customStartDate}
                onSelect={handleCalendarSelect}
                locale={ptBR}
                className="rounded-md"
                modifiers={{
                  selected: customStartDate && customEndDate 
                    ? { from: customStartDate, to: customEndDate }
                    : customStartDate 
                    ? [customStartDate]
                    : [],
                  range_start: customStartDate ? [customStartDate] : [],
                  range_end: customEndDate ? [customEndDate] : [],
                }}
                modifiersStyles={{
                  selected: { backgroundColor: 'hsl(var(--primary))', color: 'white' },
                  range_start: { backgroundColor: 'hsl(var(--primary))', color: 'white', borderRadius: '50% 0 0 50%' },
                  range_end: { backgroundColor: 'hsl(var(--primary))', color: 'white', borderRadius: '0 50% 50% 0' },
                }}
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                Clique para selecionar período personalizado
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
