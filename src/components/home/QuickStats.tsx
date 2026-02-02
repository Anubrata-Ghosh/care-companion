import { motion } from "framer-motion";
import { Users, Calendar, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Happy Users",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Calendar,
    value: "500+",
    label: "Daily Bookings",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Support",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Rating",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
];

const QuickStats = () => {
  return (
    <motion.section
      className="px-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-foreground mb-3">
        Trusted by Thousands
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-3 text-center">
                <div
                  className={`w-8 h-8 mx-auto mb-1.5 rounded-full ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-base font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default QuickStats;
