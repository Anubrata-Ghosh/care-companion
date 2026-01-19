import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const PromoCard = () => {
  return (
    <motion.section 
      className="px-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-5">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full" />
        </div>
        
        <div className="relative flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-xs font-semibold text-primary-foreground/90 uppercase tracking-wide">
                New User Offer
              </span>
            </div>
            <h3 className="text-xl font-bold text-primary-foreground mb-1">
              Flat ₹100 OFF
            </h3>
            <p className="text-sm text-primary-foreground/80 mb-3">
              On your first medicine order above ₹500
            </p>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-foreground text-primary font-semibold text-sm hover:bg-primary-foreground/90 transition-colors">
              Order Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-shrink-0 hidden sm:block">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-3xl">💊</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default PromoCard;
