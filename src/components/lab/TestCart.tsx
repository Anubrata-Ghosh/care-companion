import { motion } from "framer-motion";
import { Trash2, Clock, AlertCircle, Tag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { LabTest } from "@/pages/LabTests";

interface TestCartProps {
  tests: LabTest[];
  onRemoveTest: (testId: string) => void;
  onProceed: () => void;
}

const TestCart = ({ tests, onRemoveTest, onProceed }: TestCartProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = tests.reduce((sum, test) => sum + (test.discountPrice || test.price), 0);
  const homeCollectionFee = 0; // Free home collection
  const discount = couponDiscount;
  const total = subtotal + homeCollectionFee - discount;

  const hasFastingTest = tests.some((test) => test.fastingRequired);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "HEALTH20") {
      setAppliedCoupon("HEALTH20");
      setCouponDiscount(Math.round(subtotal * 0.2));
    } else if (couponCode.toUpperCase() === "FIRST50") {
      setAppliedCoupon("FIRST50");
      setCouponDiscount(50);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6 pb-32">
      {/* Tests List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Selected Tests</h2>
        {tests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{test.name}</h3>
                      {test.fastingRequired && (
                        <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                          Fasting
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Report in {test.reportTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-foreground">₹{test.discountPrice || test.price}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => onRemoveTest(test.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Fasting Alert */}
      {hasFastingTest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-warning/10 border border-warning/30 rounded-xl p-4"
        >
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">Fasting Required</p>
              <p className="text-sm text-muted-foreground">
                Some tests require 8-12 hours of fasting. Please schedule your collection in the morning for best results.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Coupon */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Apply Coupon</span>
          </div>
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-success/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-success text-success-foreground">{appliedCoupon}</Badge>
                <span className="text-sm text-success">-₹{couponDiscount} applied</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAppliedCoupon(null);
                  setCouponDiscount(0);
                  setCouponCode("");
                }}
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
          <p className="text-xs text-muted-foreground mt-2">Try: HEALTH20, FIRST50</p>
        </CardContent>
      </Card>

      {/* Bill Summary */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Bill Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({tests.length} tests)</span>
              <span className="text-foreground">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Home Collection Fee</span>
              <span className="text-success">FREE</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Coupon Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-primary text-lg">₹{total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proceed Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4"
      >
        <Button onClick={onProceed} className="w-full h-12 rounded-xl text-base">
          Schedule Home Collection
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
};

export default TestCart;
