import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, X, ChevronLeft, Shield, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmergencyTriggerProps {
  onTrigger: () => void;
  onBack: () => void;
}

const EmergencyTrigger = ({ onTrigger, onBack }: EmergencyTriggerProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [holdProgress, setHoldProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding]);

  useEffect(() => {
    if (holdProgress >= 100) {
      startCountdown();
    }
  }, [holdProgress]);

  const startCountdown = () => {
    setIsHolding(false);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        onTrigger();
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Emergency SOS</h1>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* SOS Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-8"
        >
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ width: 200, height: 200, margin: -20 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            style={{ width: 200, height: 200, margin: -20 }}
          />

          {/* Main button */}
          <motion.button
            className="relative w-40 h-40 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/50 flex flex-col items-center justify-center text-white"
            onTouchStart={() => setIsHolding(true)}
            onTouchEnd={() => setIsHolding(false)}
            onMouseDown={() => setIsHolding(true)}
            onMouseUp={() => setIsHolding(false)}
            onMouseLeave={() => setIsHolding(false)}
            whileTap={{ scale: 0.95 }}
          >
            {/* Progress ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${holdProgress * 3.01} 301`}
                className="transition-all duration-100"
              />
            </svg>

            <AlertTriangle className="w-12 h-12 mb-1" />
            <span className="text-2xl font-bold">SOS</span>
          </motion.button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-lg font-semibold text-foreground mb-2">
            Hold for 2 seconds to activate
          </p>
          <p className="text-muted-foreground text-sm">
            This will dispatch an ambulance to your location
          </p>
        </motion.div>

        {/* Countdown Overlay */}
        <AnimatePresence>
          {countdown < 3 && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-red-600 flex flex-col items-center justify-center z-50"
            >
              <motion.span
                key={countdown}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-9xl font-bold text-white"
              >
                {countdown}
              </motion.span>
              <p className="text-white/80 text-xl mt-4">Dispatching ambulance...</p>
              <Button
                variant="outline"
                className="mt-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => {
                  setCountdown(3);
                  window.location.reload();
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 pb-8"
      >
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a
            href="tel:102"
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Call 102</p>
              <p className="text-xs text-muted-foreground">Ambulance</p>
            </div>
          </a>
          <a
            href="tel:112"
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Call 112</p>
              <p className="text-xs text-muted-foreground">Emergency</p>
            </div>
          </a>
        </div>

        {/* Features */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            What happens when you trigger SOS?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Instant Ambulance Dispatch
                </p>
                <p className="text-xs text-muted-foreground">
                  Nearest ambulance dispatched with your GPS location
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Doctor on Call
                </p>
                <p className="text-xs text-muted-foreground">
                  Emergency physician connected for guidance
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Hospital Coordination
                </p>
                <p className="text-xs text-muted-foreground">
                  Nearest hospital prepared for your arrival
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyTrigger;
