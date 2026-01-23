import { Phone, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EmergencyButton = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="mx-4 mb-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <button 
        onClick={() => navigate("/emergency-sos")}
        className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-emergency to-emergency/90 p-4 shadow-emergency emergency-pulse group"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-emergency-foreground/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
            <Phone className="w-7 h-7 text-emergency-foreground" />
          </div>
          
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <AlertTriangle className="w-4 h-4 text-emergency-foreground" />
              <span className="text-xs font-semibold text-emergency-foreground/90 uppercase tracking-wide">
                24/7 Emergency
              </span>
            </div>
            <h3 className="text-lg font-bold text-emergency-foreground">
              SOS - Get Immediate Help
            </h3>
            <p className="text-sm text-emergency-foreground/80">
              Ambulance • Doctor • Nurse on call
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <motion.div
              className="w-10 h-10 rounded-full border-2 border-emergency-foreground/40 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="w-4 h-4 rounded-full bg-emergency-foreground" />
            </motion.div>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default EmergencyButton;
