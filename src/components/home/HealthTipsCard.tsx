import { motion } from "framer-motion";
import { Heart, ChevronRight } from "lucide-react";

const tips = [
  {
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily for better health.",
    emoji: "💧",
  },
  {
    title: "Regular Check-ups",
    description: "Annual health screenings can catch problems early.",
    emoji: "🩺",
  },
];

const HealthTipsCard = () => {
  return (
    <motion.section 
      className="px-4 mb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-emergency" />
          <h2 className="text-lg font-semibold text-foreground">Health Tips</h2>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          More tips
        </button>
      </div>
      
      <div className="space-y-3">
        {tips.map((tip) => (
          <motion.button
            key={tip.title}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-soft text-left hover:shadow-elevated transition-all"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
              {tip.emoji}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{tip.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">{tip.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
};

export default HealthTipsCard;
