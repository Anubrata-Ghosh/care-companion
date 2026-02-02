import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Users, TrendingUp, Search, MessageCircle, AlertCircle, Settings, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface DeliveryOrder {
  id: string;
  customer_name: string;
  customer_phone?: string;
  pickup_location: string;
  delivery_location: string;
  order_date: string;
  delivery_time: string;
  status: string;
  items: string;
  package_weight?: string;
  amount: number;
}

const DeliveryProvider = () => {
  const navigate = useNavigate();
  const { user, serviceType } = useAuth();
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Only allow delivery partners
  if (serviceType !== "delivery") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 pt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">Access Restricted</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                This page is only available for delivery partners. Your current role: <span className="font-medium">{serviceType || "Not set"}</span>
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/service-provider-dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Mock delivery orders
  const mockOrders: DeliveryOrder[] = [
    {
      id: "1",
      customer_name: "Rajesh Kumar",
      customer_phone: "+91 98765 43210",
      pickup_location: "Apollo Pharmacy, Bandra",
      delivery_location: "Home, Worli",
      order_date: "2024-01-30",
      delivery_time: "10:00",
      status: "assigned",
      items: "Medicines & Supplements",
      package_weight: "0.5 kg",
      amount: 100,
    },
    {
      id: "2",
      customer_name: "Priya Patel",
      customer_phone: "+91 97654 32109",
      pickup_location: "Medical Store, Andheri",
      delivery_location: "Office, Dadar",
      order_date: "2024-02-02",
      delivery_time: "14:30",
      status: "delivered",
      items: "Health Products",
      package_weight: "1 kg",
      amount: 150,
    },
    {
      id: "3",
      customer_name: "Meera Singh",
      customer_phone: "+91 96543 21098",
      pickup_location: "Pharmacy, Fort",
      delivery_location: "Hospital, Vile Parle",
      order_date: "2024-01-28",
      delivery_time: "09:15",
      status: "delivered",
      items: "Emergency Medicines",
      package_weight: "0.2 kg",
      amount: 80,
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && order.status === activeTab;
  });

  const assignedCount = orders.filter((o) => o.status === "assigned").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const OrderCard = ({ order }: { order: DeliveryOrder }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{order.customer_name}</h3>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{order.items}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-primary">₹{order.amount}</div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-2 py-3 border-y border-border/50">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Pickup</p>
              <p className="text-foreground">{order.pickup_location}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Delivery</p>
              <p className="text-foreground">{order.delivery_location}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(order.order_date).toLocaleDateString("en-IN")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{order.delivery_time}</span>
          </div>
          {order.package_weight && (
            <div className="flex items-center gap-2 justify-center text-muted-foreground">
              <Package className="w-4 h-4" />
              {order.package_weight}
            </div>
          )}
        </div>

        {/* Contact & Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => {
              if (order.customer_phone) {
                window.location.href = `tel:${order.customer_phone}`;
              }
            }}
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => toast.info("GPS navigation coming soon!")}
          >
            <MapPin className="w-3.5 h-3.5" />
            Navigate
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Header Section */}
      <motion.header
        className="sticky top-0 z-40 glass border-b border-border/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/service-provider-dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Delivery Orders</h1>
              <p className="text-xs text-muted-foreground">
                {assignedCount} assigned · {deliveredCount} delivered
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/delivery-settings")}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
        </div>
      </motion.header>

      <main className="container px-4 py-6 space-y-4">
        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-card border border-border/50 text-center"
          >
            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{orders.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Orders</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-card border border-border/50 text-center"
          >
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">₹{orders.reduce((sum, o) => sum + o.amount, 0)}</div>
            <div className="text-xs text-muted-foreground mt-1">Earnings</div>
          </motion.div>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 h-auto p-1">
            <TabsTrigger value="all" className="text-xs py-2">All</TabsTrigger>
            <TabsTrigger value="assigned" className="text-xs py-2">Active</TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs py-2">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex gap-3 animate-pulse">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-1">No orders found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term"
                    : "No delivery orders yet"}
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default DeliveryProvider;
