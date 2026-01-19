import { MapPin, Bell, User, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 safe-top">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo & Location */}
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-foreground">CareNest</span>
          </motion.div>
        </div>

        {/* Location Selector */}
        <motion.button 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Mumbai</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.button>

        {/* Right Actions */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button className="relative p-2.5 rounded-full hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>
          <button className="p-2 rounded-full bg-primary-light hover:bg-primary-muted transition-colors">
            <User className="w-5 h-5 text-primary" />
          </button>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
