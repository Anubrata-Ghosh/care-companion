import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Ambulance, 
  Hospital, 
  Stethoscope,
  Navigation,
  Shield,
  AlertCircle,
  CheckCircle2,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmergencyDetails } from "@/pages/EmergencySOS";

interface EmergencyActiveProps {
  emergency: EmergencyDetails;
  onResolve: () => void;
}

const EmergencyActive = ({ emergency, onResolve }: EmergencyActiveProps) => {
  const [eta, setEta] = useState(emergency.ambulanceEta);
  const [distance, setDistance] = useState(emergency.ambulanceDistance);
  const [activeTab, setActiveTab] = useState<"tracking" | "contacts">("tracking");

  // Simulate ambulance movement
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 0.5));
      setDistance((prev) => Math.max(0.1, prev - 0.15));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const statusSteps = [
    { id: "dispatched", label: "Ambulance Dispatched", completed: true, time: "2 min ago" },
    { id: "enroute", label: "En Route to You", completed: true, time: "1 min ago" },
    { id: "arriving", label: "Arriving Shortly", completed: eta <= 3, time: eta <= 3 ? "Now" : `${Math.ceil(eta)} min` },
    { id: "reached", label: "Reached Location", completed: eta <= 0, time: "" },
  ];

  return (
    <div className="min-h-screen bg-red-600 flex flex-col">
      {/* Header */}
      <div className="bg-red-700 px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <span className="text-white font-semibold">EMERGENCY ACTIVE</span>
          </div>
          <span className="text-white/80 text-sm">ID: {emergency.id}</span>
        </div>
      </div>

      {/* ETA Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <Ambulance className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ambulance arriving in</p>
              <p className="text-3xl font-bold text-foreground">
                {Math.ceil(eta)} <span className="text-lg">min</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Distance</p>
            <p className="text-xl font-semibold text-foreground">{distance.toFixed(1)} km</p>
          </div>
        </div>

        {/* Driver Info */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{emergency.driverName}</p>
              <p className="text-xs text-muted-foreground">{emergency.vehicleNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${emergency.driverPhone}`}
              className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
            >
              <Phone className="w-5 h-5 text-green-600" />
            </a>
            <button className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 px-4 mt-4">
        {["tracking", "contacts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-red-600"
                : "bg-red-500 text-white/90"
            }`}
          >
            {tab === "tracking" ? "Live Tracking" : "Emergency Contacts"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 mt-4 pb-4 overflow-y-auto">
        {activeTab === "tracking" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100">
                {/* Simulated map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Route line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-400 rounded-full" style={{ width: 120 }} />
                    
                    {/* User location */}
                    <motion.div
                      className="absolute left-0 -translate-y-1/2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>

                    {/* Ambulance */}
                    <motion.div
                      className="absolute -translate-y-1/2"
                      initial={{ left: 100 }}
                      animate={{ left: 40 + (distance / emergency.ambulanceDistance) * 60 }}
                      transition={{ duration: 2 }}
                    >
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <Ambulance className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Open in Maps */}
                <button className="absolute bottom-3 right-3 bg-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2 text-sm font-medium">
                  <Navigation className="w-4 h-4 text-red-600" />
                  Open Maps
                </button>
              </div>

              {/* Status Timeline */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">Status Updates</h3>
                <div className="space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            step.completed ? "bg-green-500" : "bg-muted"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                          )}
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-8 ${
                              step.completed ? "bg-green-500" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        {step.time && (
                          <p className="text-xs text-muted-foreground">{step.time}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hospital Info */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Hospital className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-foreground">Destination Hospital</h3>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{emergency.hospitalName}</p>
                  <p className="text-sm text-muted-foreground">{emergency.hospitalAddress}</p>
                </div>
                <a
                  href={`tel:${emergency.hospitalPhone}`}
                  className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 text-purple-600" />
                </a>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* On-Call Doctor */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">On-Call Doctor</h3>
                  <p className="text-xs text-muted-foreground">Available for guidance</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-xl">
                <div className="w-14 h-14 bg-green-200 rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-green-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{emergency.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{emergency.doctorSpecialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <a
                  href={`tel:${emergency.doctorPhone}`}
                  className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Call Doctor
                </a>
                <button className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-xl font-medium">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="font-semibold text-foreground mb-4">Emergency Helplines</h3>
              <div className="space-y-3">
                {[
                  { name: "Ambulance", number: "102", color: "red" },
                  { name: "Police", number: "100", color: "blue" },
                  { name: "Fire", number: "101", color: "orange" },
                  { name: "Women Helpline", number: "1091", color: "pink" },
                ].map((contact) => (
                  <a
                    key={contact.number}
                    href={`tel:${contact.number}`}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${contact.color}-100 rounded-lg flex items-center justify-center`}>
                        <Phone className={`w-5 h-5 text-${contact.color}-600`} />
                      </div>
                      <span className="font-medium text-foreground">{contact.name}</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{contact.number}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Family Notification */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-foreground">Family Notified</h3>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-foreground">
                  Your emergency contacts have been notified with your live location
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="p-4 bg-red-700">
        <Button
          onClick={onResolve}
          variant="outline"
          className="w-full h-14 bg-white text-red-600 border-white hover:bg-red-50 font-semibold"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          Mark as Resolved
        </Button>
      </div>
    </div>
  );
};

export default EmergencyActive;
