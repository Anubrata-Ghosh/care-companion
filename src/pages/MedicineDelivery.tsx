import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PrescriptionUpload from "@/components/medicine/PrescriptionUpload";
import PharmacySelection from "@/components/medicine/PharmacySelection";
import MedicineCart from "@/components/medicine/MedicineCart";
import Checkout from "@/components/medicine/Checkout";
import OrderConfirmation from "@/components/medicine/OrderConfirmation";
import OrderTracking from "@/components/medicine/OrderTracking";

type BookingStep = "upload" | "pharmacy" | "cart" | "checkout" | "confirmation" | "tracking";

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

const MedicineDelivery = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BookingStep>("upload");
  const [prescriptionData, setPrescriptionData] = useState<{ type: string; file?: File; pastOrderId?: string } | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const handlePrescriptionUpload = (data: { type: string; file?: File; pastOrderId?: string }) => {
    setPrescriptionData(data);
    // Mock medicines from prescription
    setCartItems([
      { id: "1", name: "Paracetamol 500mg", quantity: 2, price: 45, dosage: "1 tablet twice daily" },
      { id: "2", name: "Cetirizine 10mg", quantity: 1, price: 32, dosage: "1 tablet at night" },
      { id: "3", name: "Vitamin D3 60K", quantity: 4, price: 180, dosage: "1 sachet weekly" },
    ]);
    setCurrentStep("pharmacy");
  };

  const handlePharmacySelect = (pharmacyId: string) => {
    setSelectedPharmacy(pharmacyId);
    setCurrentStep("cart");
  };

  const handleCartConfirm = (items: CartItem[]) => {
    setCartItems(items);
    setCurrentStep("checkout");
  };

  const handleCheckoutComplete = (paymentMethod: string, address: string) => {
    const order: OrderDetails = {
      orderId: `ORD${Date.now().toString().slice(-8)}`,
      pharmacy: selectedPharmacy || "",
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMethod,
      deliveryAddress: address,
      estimatedDelivery: "Today, 6:00 PM - 8:00 PM",
    };
    setOrderDetails(order);
    setCurrentStep("confirmation");
  };

  const handleTrackOrder = () => {
    setCurrentStep("tracking");
  };

  const handleBack = () => {
    const stepOrder: BookingStep[] = ["upload", "pharmacy", "cart", "checkout", "confirmation", "tracking"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      navigate("/");
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "upload": return "Upload Prescription";
      case "pharmacy": return "Select Pharmacy";
      case "cart": return "Your Medicines";
      case "checkout": return "Checkout";
      case "confirmation": return "Order Confirmed";
      case "tracking": return "Track Order";
      default: return "Medicine Delivery";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">{getStepTitle()}</h1>
            <p className="text-xs text-muted-foreground">
              {currentStep === "upload" && "Add your prescription to get started"}
              {currentStep === "pharmacy" && "Choose from verified pharmacy partners"}
              {currentStep === "cart" && "Review and modify your order"}
              {currentStep === "checkout" && "Complete your purchase"}
              {currentStep === "confirmation" && "Your order is placed"}
              {currentStep === "tracking" && "Real-time delivery updates"}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        {!["confirmation", "tracking"].includes(currentStep) && (
          <div className="px-4 pb-3">
            <div className="flex gap-1">
              {["upload", "pharmacy", "cart", "checkout"].map((step, index) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    ["upload", "pharmacy", "cart", "checkout"].indexOf(currentStep) >= index
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="pb-8"
        >
          {currentStep === "upload" && (
            <PrescriptionUpload onUpload={handlePrescriptionUpload} />
          )}
          {currentStep === "pharmacy" && (
            <PharmacySelection onSelect={handlePharmacySelect} />
          )}
          {currentStep === "cart" && (
            <MedicineCart
              items={cartItems}
              onConfirm={handleCartConfirm}
              onBack={() => setCurrentStep("pharmacy")}
            />
          )}
          {currentStep === "checkout" && (
            <Checkout
              items={cartItems}
              pharmacyName="Apollo Pharmacy"
              onComplete={handleCheckoutComplete}
            />
          )}
          {currentStep === "confirmation" && orderDetails && (
            <OrderConfirmation
              orderDetails={orderDetails}
              onTrackOrder={handleTrackOrder}
              onGoHome={() => navigate("/")}
            />
          )}
          {currentStep === "tracking" && orderDetails && (
            <OrderTracking orderDetails={orderDetails} onGoHome={() => navigate("/")} />
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default MedicineDelivery;
