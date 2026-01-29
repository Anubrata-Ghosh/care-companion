import { motion } from "framer-motion";
import { Heart, ChevronRight, Plus, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Tip {
  id: string;
  title: string;
  description: string;
  emoji: string;
  action: string;
  actionLabel: string;
}

const tips: Tip[] = [
  {
    id: "hydration",
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily for better health.",
    emoji: "💧",
    action: "track-water",
    actionLabel: "Log Water Intake",
  },
  {
    id: "checkup",
    title: "Regular Check-ups",
    description: "Annual health screenings can catch problems early.",
    emoji: "🩺",
    action: "book-checkup",
    actionLabel: "Schedule Check-up",
  },
];

const HealthTipsCard = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const handleWaterLog = () => {
    const newIntake = waterIntake + 1;
    setWaterIntake(newIntake);
    const glassesRemaining = Math.max(0, 8 - newIntake);
    toast.success(`Water logged! ${glassesRemaining > 0 ? `${glassesRemaining} more to go` : "You've reached your daily goal! 🎉"}`);
  };

  const handleScheduleCheckup = () => {
    toast.success("Opening appointment booking...");
    // Could navigate to doctor appointment page
    // navigate("/doctor-appointment");
  };

  const handleTipClick = (tipId: string) => {
    setExpandedTip(expandedTip === tipId ? null : tipId);
  };

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
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="overflow-hidden"
          >
            <button
              onClick={() => handleTipClick(tip.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-soft text-left hover:shadow-elevated transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
                {tip.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{tip.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-1">{tip.description}</p>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${expandedTip === tip.id ? 'rotate-90' : ''}`}
              />
            </button>

            {/* Expanded Content */}
            {expandedTip === tip.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-primary/5 border border-t-0 border-border/50 rounded-b-xl p-4 space-y-3"
              >
                <p className="text-sm text-foreground leading-relaxed">
                  {tip.description}
                </p>

                {tip.id === "hydration" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Today's Progress:</span>
                      <span className="text-sm font-bold text-primary">{waterIntake}/8 glasses</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(waterIntake / 8) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* Water Glass Indicators */}
                    <div className="flex gap-2 flex-wrap">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                            i < waterIntake
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {i + 1}
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={handleWaterLog}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      {waterIntake >= 8 ? "Goal Reached!" : "Log Water Intake"}
                    </button>
                  </div>
                )}

                {tip.id === "checkup" && (
                  <button
                    onClick={handleScheduleCheckup}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity active:scale-95"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule a Check-up
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default HealthTipsCard;
