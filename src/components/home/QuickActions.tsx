import { motion } from "framer-motion";
import { Camera, Clock, FileText, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    icon: Camera,
    label: "Upload Rx",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: Clock,
    label: "Reorder",
    color: "text-accent",
    bg: "bg-accent-light",
  },
  {
    icon: FileText,
    label: "My Reports",
    color: "text-service-lab",
    bg: "bg-service-lab-light",
  },
  {
    icon: Headphones,
    label: "Support",
    color: "text-info",
    bg: "bg-info-light",
  },
];

const QuickActions = () => {
  return (
    <section className="px-4 mb-6">
      <motion.div 
        className="flex items-center justify-between gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            className={cn(
              "flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl",
              "border border-border/50 bg-card shadow-soft",
              "hover:shadow-elevated transition-all"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", action.bg)}>
              <action.icon className={cn("w-5 h-5", action.color)} />
            </div>
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
};

export default QuickActions;
