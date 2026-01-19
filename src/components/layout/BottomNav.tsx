import { Home, Calendar, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, isActive = false, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200",
      isActive 
        ? "text-primary bg-primary-light" 
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    <div className={cn(
      "transition-transform duration-200",
      isActive && "scale-110"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-xs font-medium",
      isActive && "text-primary"
    )}>
      {label}
    </span>
  </button>
);

const BottomNav = () => {
  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex items-center justify-around py-2 px-4">
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          isActive={true}
        />
        <NavItem 
          icon={<Calendar className="w-5 h-5" />} 
          label="Bookings" 
        />
        <NavItem 
          icon={<Clock className="w-5 h-5" />} 
          label="History" 
        />
        <NavItem 
          icon={<User className="w-5 h-5" />} 
          label="Profile" 
        />
      </div>
    </motion.nav>
  );
};

export default BottomNav;
