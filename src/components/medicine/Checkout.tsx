import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  CreditCard, 
  Banknote, 
  Wallet, 
  ChevronRight, 
  Plus,
  Check,
  Clock,
  Shield,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  dosage: string;
}

interface CheckoutProps {
  items: CartItem[];
  pharmacyName: string;
  onComplete: (paymentMethod: string, address: string) => void;
}

interface Address {
  id: string;
  label: string;
  full: string;
  isDefault: boolean;
}

const Checkout = ({ items, pharmacyName, onComplete }: CheckoutProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string>("home");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [deliveryType, setDeliveryType] = useState<string>("standard");
  const [isProcessing, setIsProcessing] = useState(false);

  const addresses: Address[] = [
    {
      id: "home",
      label: "Home",
      full: "123, Green Valley Apartments, Sector 15, Gurgaon, Haryana - 122001",
      isDefault: true,
    },
    {
      id: "office",
      label: "Office",
      full: "Tower B, 5th Floor, Cyber City, DLF Phase 2, Gurgaon - 122002",
      isDefault: false,
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === "express" ? 60 : subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const address = addresses.find((a) => a.id === selectedAddress);
    onComplete(paymentMethod, address?.full || "");
  };

  return (
    <div className="p-4 space-y-4 pb-32">
      {/* Delivery Address */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Address
            </h3>
            <Button variant="ghost" size="sm" className="text-primary">
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Button>
          </div>

          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
            <div className="space-y-3">
              {addresses.map((address) => (
                <motion.div
                  key={address.id}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                    selectedAddress === address.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={address.id} className="font-medium text-foreground cursor-pointer">
                          {address.label}
                        </Label>
                        {address.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{address.full}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Delivery Type */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Truck className="h-4 w-4 text-primary" />
            Delivery Type
          </h3>

          <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
            <div className="space-y-3">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                  deliveryType === "standard"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
                onClick={() => setDeliveryType("standard")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <div>
                      <Label htmlFor="standard" className="font-medium text-foreground cursor-pointer">
                        Standard Delivery
                      </Label>
                      <p className="text-xs text-muted-foreground">Today, 6:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                  <span className={`font-medium ${subtotal >= 500 ? "text-green-600" : "text-foreground"}`}>
                    {subtotal >= 500 ? "FREE" : "₹40"}
                  </span>
                </div>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                  deliveryType === "express"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
                onClick={() => setDeliveryType("express")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="express" id="express" />
                    <div>
                      <Label htmlFor="express" className="font-medium text-foreground cursor-pointer flex items-center gap-2">
                        Express Delivery
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">
                          Fast
                        </span>
                      </Label>
                      <p className="text-xs text-muted-foreground">Within 60 minutes</p>
                    </div>
                  </div>
                  <span className="font-medium text-foreground">₹60</span>
                </div>
              </motion.div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4 text-primary" />
            Payment Method
          </h3>

          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              {/* Cash on Delivery */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="cod" id="cod" />
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Banknote className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <Label htmlFor="cod" className="font-medium text-foreground cursor-pointer">
                      Cash on Delivery
                    </Label>
                    <p className="text-xs text-muted-foreground">Pay when you receive</p>
                  </div>
                </div>
              </motion.div>

              {/* UPI */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                  paymentMethod === "upi"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
                onClick={() => setPaymentMethod("upi")}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="upi" id="upi" />
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <Label htmlFor="upi" className="font-medium text-foreground cursor-pointer">
                      UPI Payment
                    </Label>
                    <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
              </motion.div>

              {/* Card */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="card" id="card" />
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <Label htmlFor="card" className="font-medium text-foreground cursor-pointer">
                      Credit / Debit Card
                    </Label>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items ({items.length})</span>
              <span className="text-foreground">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className={deliveryFee === 0 ? "text-green-600" : "text-foreground"}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Amount to Pay</span>
                <span className="font-bold text-lg text-foreground">₹{total}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-6 py-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 text-primary" />
          Secure Payment
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          On-time Delivery
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          size="lg"
          className="w-full h-14 text-base"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Processing...
            </span>
          ) : (
            <>
              {paymentMethod === "cod" ? "Place Order" : `Pay ₹${total}`}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
