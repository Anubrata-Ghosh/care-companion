import { 
  Pill, 
  Stethoscope, 
  TestTube2, 
  UserCheck, 
  Home,
  Syringe
} from "lucide-react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Medicine Delivery",
    description: "Upload prescription & get medicines delivered fast",
    icon: Pill,
    colorClass: "text-service-medicine",
    bgClass: "bg-service-medicine-light",
  },
  {
    title: "Doctor Appointment",
    description: "Book online or in-person consultations",
    icon: Stethoscope,
    colorClass: "text-service-doctor",
    bgClass: "bg-service-doctor-light",
  },
  {
    title: "Lab Tests at Home",
    description: "Blood tests & diagnostics at your doorstep",
    icon: TestTube2,
    colorClass: "text-service-lab",
    bgClass: "bg-service-lab-light",
  },
  {
    title: "Part-time Nurse",
    description: "Hourly care for injections, wound care & more",
    icon: Syringe,
    colorClass: "text-service-nurse",
    bgClass: "bg-service-nurse-light",
  },
  {
    title: "Doctor Home Visit",
    description: "GP or specialist visits at fixed charges",
    icon: Home,
    colorClass: "text-service-home-visit",
    bgClass: "bg-service-home-visit-light",
  },
  {
    title: "Elderly Care",
    description: "Dedicated caregivers for senior citizens",
    icon: UserCheck,
    colorClass: "text-primary",
    bgClass: "bg-primary-light",
  },
];

const ServicesGrid = () => {
  return (
    <section className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Our Services</h2>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {services.map((service, index) => (
          <ServiceCard
            key={service.title}
            {...service}
            delay={index}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;
