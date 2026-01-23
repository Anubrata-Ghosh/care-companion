import { motion } from "framer-motion";
import { Syringe, Heart, UserCheck, Stethoscope, Pill, Activity, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SelectedService } from "@/pages/PartTimeNurse";

const services = [
  {
    id: "injections",
    name: "Injections & IV",
    description: "IM, IV injections, IV drips, cannulation",
    icon: "syringe",
    pricePerHour: 299,
    pricePerDay: 1499,
  },
  {
    id: "wound-care",
    name: "Wound Care",
    description: "Dressing, wound cleaning, suture care",
    icon: "heart",
    pricePerHour: 349,
    pricePerDay: 1799,
  },
  {
    id: "elderly-care",
    name: "Elderly Care",
    description: "Companionship, mobility assistance, medication",
    icon: "user-check",
    pricePerHour: 249,
    pricePerDay: 1299,
  },
  {
    id: "vitals-monitoring",
    name: "Vitals Monitoring",
    description: "BP, sugar, temperature, oxygen levels",
    icon: "activity",
    pricePerHour: 199,
    pricePerDay: 999,
  },
  {
    id: "post-surgery",
    name: "Post-Surgery Care",
    description: "Recovery assistance, wound management",
    icon: "stethoscope",
    pricePerHour: 399,
    pricePerDay: 1999,
  },
  {
    id: "medication",
    name: "Medication Administration",
    description: "Timely medicine, dosage tracking",
    icon: "pill",
    pricePerHour: 199,
    pricePerDay: 999,
  },
];

const iconMap: Record<string, React.ElementType> = {
  syringe: Syringe,
  heart: Heart,
  "user-check": UserCheck,
  activity: Activity,
  stethoscope: Stethoscope,
  pill: Pill,
};

interface NurseServiceSelectionProps {
  selectedServices: SelectedService[];
  onUpdate: (services: SelectedService[]) => void;
  onContinue: () => void;
}

const NurseServiceSelection = ({
  selectedServices,
  onUpdate,
  onContinue,
}: NurseServiceSelectionProps) => {
  const toggleService = (service: typeof services[0]) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      onUpdate(selectedServices.filter((s) => s.id !== service.id));
    } else {
      onUpdate([
        ...selectedServices,
        {
          id: service.id,
          name: service.name,
          icon: service.icon,
          pricePerHour: service.pricePerHour,
          pricePerDay: service.pricePerDay,
        },
      ]);
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-service-nurse/20 to-service-nurse/5 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-service-nurse/20 rounded-2xl flex items-center justify-center">
            <Syringe className="w-8 h-8 text-service-nurse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Professional Home Nursing
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Verified nurses • Flexible hours • Quality care
            </p>
          </div>
        </div>
      </motion.div>

      {/* Services List */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground mb-4">
          What care do you need?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select one or more services
        </p>

        <div className="space-y-3">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            const isSelected = selectedServices.some((s) => s.id === service.id);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleService(service)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-service-nurse bg-service-nurse/5"
                    : "border-border bg-card hover:border-service-nurse/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-service-nurse text-white"
                        : "bg-service-nurse/10 text-service-nurse"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {service.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {service.description}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-service-nurse bg-service-nurse"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm text-muted-foreground">
                        ₹{service.pricePerHour}/hr
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        ₹{service.pricePerDay}/day
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-24 bg-background pt-4"
      >
        <Button
          onClick={onContinue}
          disabled={selectedServices.length === 0}
          className="w-full h-14 text-base font-semibold bg-service-nurse hover:bg-service-nurse/90"
        >
          Continue with {selectedServices.length} Service
          {selectedServices.length !== 1 ? "s" : ""}
        </Button>
      </motion.div>
    </div>
  );
};

export default NurseServiceSelection;
