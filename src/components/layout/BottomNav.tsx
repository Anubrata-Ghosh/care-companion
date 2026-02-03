import { Home, Network, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", path: "/" },
    { icon: <Network className="w-5 h-5" />, label: "Connections", path: "/connections" },
    { icon: <Clock className="w-5 h-5" />, label: "History", path: "/history" },
    { icon: <User className="w-5 h-5" />, label: "Profile", path: "/profile" },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            isActive={currentPath === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
