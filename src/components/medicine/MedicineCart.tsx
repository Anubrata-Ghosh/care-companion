import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2, Pill, Info, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  dosage: string;
}

interface MedicineCartProps {
  items: CartItem[];
  onConfirm: (items: CartItem[]) => void;
  onBack: () => void;
}

const MedicineCart = ({ items: initialItems, onConfirm, onBack }: MedicineCartProps) => {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discount;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "FIRST10") {
      setAppliedCoupon("FIRST10");
      setCouponCode("");
    }
  };

  return (
    <div className="p-4 space-y-4 pb-32">
      {/* Prescription Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Prescription Verified</p>
            <p className="text-xs text-muted-foreground">Medicines extracted from your prescription</p>
          </div>
        </CardContent>
      </Card>

      {/* Cart Items */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Your Medicines ({items.length} items)
        </h3>

        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Medicine Icon */}
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Pill className="h-7 w-7 text-primary" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.dosage}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="font-semibold text-foreground">₹{item.price * item.quantity}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Coupon Section */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Apply Coupon</h4>
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div>
                <p className="text-sm font-medium text-green-600">{appliedCoupon} Applied</p>
                <p className="text-xs text-muted-foreground">You're saving ₹{discount}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAppliedCoupon(null)}
                className="text-destructive"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">Try: FIRST10 for 10% off</p>
        </CardContent>
      </Card>

      {/* Bill Details */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Bill Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className={deliveryFee === 0 ? "text-green-600" : "text-foreground"}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coupon Discount</span>
                <span className="text-green-600">-₹{discount}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-lg text-foreground">₹{total}</span>
              </div>
            </div>
          </div>
          {subtotal < 500 && (
            <p className="text-xs text-muted-foreground mt-3">
              Add ₹{500 - subtotal} more for free delivery
            </p>
          )}
        </CardContent>
      </Card>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-xl font-bold text-foreground">₹{total}</p>
          </div>
          <Button
            size="lg"
            className="px-8"
            onClick={() => onConfirm(items)}
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCart;
