import { motion } from "framer-motion";
import { Check, MapPin, Clock, Package, Phone, MessageCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

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

interface OrderConfirmationProps {
  orderDetails: OrderDetails;
  onTrackOrder: () => void;
  onGoHome: () => void;
}

const OrderConfirmation = ({ orderDetails, onTrackOrder, onGoHome }: OrderConfirmationProps) => {
  const copyOrderId = () => {
    navigator.clipboard.writeText(orderDetails.orderId);
    toast.success("Order ID copied!");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="flex flex-col items-center pt-8 pb-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", duration: 0.5 }}
          className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-foreground text-center"
        >
          Order Placed Successfully!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-center mt-2"
        >
          Your medicines are on the way
        </motion.p>
      </motion.div>

      {/* Order ID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="text-lg font-bold text-primary font-mono">{orderDetails.orderId}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyOrderId}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Delivery Time */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{orderDetails.deliveryAddress}</p>
              </div>
            </div>

            {/* Items */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-2">Order Items</p>
                <div className="space-y-1">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-foreground">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-2 pt-2 flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-foreground">₹{orderDetails.total}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium text-foreground capitalize">
                  {orderDetails.paymentMethod === "cod" ? "Cash on Delivery" : orderDetails.paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Need Help?</h4>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
              <Button variant="outline" className="flex-1" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-3"
      >
        <Button size="lg" className="w-full" onClick={onTrackOrder}>
          Track Your Order
        </Button>
        <Button size="lg" variant="outline" className="w-full" onClick={onGoHome}>
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
