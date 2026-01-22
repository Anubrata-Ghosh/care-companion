import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  CheckCircle2, 
  Truck, 
  Home, 
  Phone, 
  MapPin,
  Clock,
  User,
  Star,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  dosage: string;
}

interface OrderDetails {
  orderId: string;
  pharmacy: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  estimatedDelivery: string;
}

interface OrderTrackingProps {
  orderDetails: OrderDetails;
  onGoHome: () => void;
}

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
}

const OrderTracking = ({ orderDetails, onGoHome }: OrderTrackingProps) => {
  const [currentStep, setCurrentStep] = useState(2);

  // Simulate order progress
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const trackingSteps: TrackingStep[] = [
    {
      id: "confirmed",
      title: "Order Confirmed",
      description: "Your order has been placed",
      time: "2:30 PM",
      icon: <CheckCircle2 className="h-5 w-5" />,
      completed: currentStep >= 1,
      current: currentStep === 1,
    },
    {
      id: "preparing",
      title: "Preparing Order",
      description: "Pharmacy is packing your medicines",
      time: "2:35 PM",
      icon: <Package className="h-5 w-5" />,
      completed: currentStep >= 2,
      current: currentStep === 2,
    },
    {
      id: "dispatched",
      title: "Out for Delivery",
      description: "Rider picked up your order",
      time: currentStep >= 3 ? "3:00 PM" : "Expected 3:00 PM",
      icon: <Truck className="h-5 w-5" />,
      completed: currentStep >= 3,
      current: currentStep === 3,
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Order delivered successfully",
      time: currentStep >= 4 ? "3:45 PM" : "Expected by 4:00 PM",
      icon: <Home className="h-5 w-5" />,
      completed: currentStep >= 4,
      current: currentStep === 4,
    },
  ];

  const deliveryPartner = {
    name: "Rahul Kumar",
    phone: "+91 98765 43210",
    rating: 4.8,
    vehicleNo: "DL 01 AB 1234",
    eta: "15 mins",
  };

  return (
    <div className="p-4 space-y-4">
      {/* Live Map Placeholder */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-2"
              >
                <Navigation className="h-8 w-8 text-primary" />
              </motion.div>
              <p className="text-sm font-medium text-foreground">Live Tracking</p>
              <p className="text-xs text-muted-foreground">Rider is on the way</p>
            </div>
          </div>
          
          {/* ETA Badge */}
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{deliveryPartner.eta}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Delivery Partner (shown when dispatched) */}
      {currentStep >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{deliveryPartner.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {deliveryPartner.rating}
                      </span>
                      <span>•</span>
                      <span>{deliveryPartner.vehicleNo}</span>
                    </div>
                  </div>
                </div>
                <Button size="icon" className="rounded-full h-10 w-10">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tracking Timeline */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Order Status</h3>
          
          <div className="relative">
            {trackingSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 pb-6 last:pb-0"
              >
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      step.completed
                        ? "bg-primary text-primary-foreground"
                        : step.current
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.icon}
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 mt-2 transition-colors ${
                        step.completed ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4
                        className={`font-medium ${
                          step.completed || step.current
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                    </div>
                    <span
                      className={`text-xs ${
                        step.completed ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.time}
                    </span>
                  </div>
                  
                  {step.current && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center gap-1.5"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                      <span className="text-xs text-primary font-medium">In Progress</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Delivering To</h4>
              <p className="text-xs text-muted-foreground mt-1">{orderDetails.deliveryAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Order Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-foreground">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="text-foreground">{orderDetails.items.length} medicines</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span className="text-foreground capitalize">
                {orderDetails.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="font-medium text-foreground">Total Amount</span>
              <span className="font-bold text-foreground">₹{orderDetails.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back to Home */}
      <Button variant="outline" size="lg" className="w-full" onClick={onGoHome}>
        Back to Home
      </Button>
    </div>
  );
};

export default OrderTracking;
