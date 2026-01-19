import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  delay?: number;
  onClick?: () => void;
}

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon, 
  colorClass,
  bgClass,
  delay = 0,
  onClick 
}: ServiceCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "service-card w-full text-left p-4 rounded-2xl",
        "border border-border/50 shadow-soft hover:shadow-elevated",
        "bg-card"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 + 0.3 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
        bgClass
      )}>
        <Icon className={cn("w-6 h-6", colorClass)} />
      </div>
      
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
    </motion.button>
  );
};

export default ServiceCard;
