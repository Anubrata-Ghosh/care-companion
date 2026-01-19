import { motion } from "framer-motion";
import { Shield, Clock, Award, Users } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "100% Verified",
    subtitle: "Doctors & nurses",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    subtitle: "Always available",
  },
  {
    icon: Award,
    title: "5 Lakh+",
    subtitle: "Happy patients",
  },
  {
    icon: Users,
    title: "500+",
    subtitle: "Partner clinics",
  },
];

const TrustBadges = () => {
  return (
    <motion.section 
      className="px-4 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <div className="grid grid-cols-4 gap-2">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.title}
            className="flex flex-col items-center text-center p-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.8 }}
          >
            <div className="w-10 h-10 rounded-full bg-success-light flex items-center justify-center mb-2">
              <badge.icon className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs font-semibold text-foreground leading-tight">
              {badge.title}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {badge.subtitle}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default TrustBadges;
