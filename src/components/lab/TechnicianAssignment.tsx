import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Phone, MessageCircle, Clock, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { LabBooking } from "@/pages/LabTests";

interface TechnicianAssignmentProps {
  booking: LabBooking;
  onUpdate: (updates: Partial<LabBooking>) => void;
  onProceed: () => void;
}

const technicians = [
  {
    id: "1",
    name: "Priya Sharma",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    experience: "5 years",
    completedTests: 2500,
    certifications: ["NABL Certified", "Phlebotomy Expert"],
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    experience: "4 years",
    completedTests: 1800,
    certifications: ["NABL Certified"],
  },
  {
    id: "3",
    name: "Anita Patel",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
    rating: 4.95,
    experience: "7 years",
    completedTests: 4200,
    certifications: ["NABL Certified", "Senior Phlebotomist"],
  },
];

const getTimeSlotLabel = (slotId: string) => {
  const slots: Record<string, string> = {
    "6-8am": "6:00 - 8:00 AM",
    "8-10am": "8:00 - 10:00 AM",
    "10-12pm": "10:00 AM - 12:00 PM",
    "12-2pm": "12:00 - 2:00 PM",
    "2-4pm": "2:00 - 4:00 PM",
    "4-6pm": "4:00 - 6:00 PM",
  };
  return slots[slotId] || slotId;
};

const TechnicianAssignment = ({ booking, onUpdate, onProceed }: TechnicianAssignmentProps) => {
  const [isAssigning, setIsAssigning] = useState(true);
  const [assignedTechnician, setAssignedTechnician] = useState<typeof technicians[0] | null>(null);

  useEffect(() => {
    // Simulate technician assignment
    const timer = setTimeout(() => {
      const randomTech = technicians[Math.floor(Math.random() * technicians.length)];
      setAssignedTechnician(randomTech);
      onUpdate({
        technician: {
          name: randomTech.name,
          photo: randomTech.photo,
          rating: randomTech.rating,
          experience: randomTech.experience,
        },
      });
      setIsAssigning(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onUpdate]);

  return (
    <div className="px-4 py-6 space-y-6 pb-32">
      {/* Assignment Status */}
      {isAssigning ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="relative w-24 h-24 mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Assigning Technician</h2>
          <p className="text-muted-foreground text-center">
            Finding the best available technician for your location...
          </p>
        </motion.div>
      ) : (
        <>
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="h-8 w-8 text-success" />
            </motion.div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Technician Assigned!</h2>
            <p className="text-muted-foreground">Your sample collection is confirmed</p>
          </motion.div>

          {/* Technician Card */}
          {assignedTechnician && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={assignedTechnician.photo}
                      alt={assignedTechnician.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-background"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{assignedTechnician.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Star className="h-4 w-4 text-warning fill-warning" />
                        <span>{assignedTechnician.rating}</span>
                        <span>•</span>
                        <span>{assignedTechnician.experience} exp</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {assignedTechnician.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {assignedTechnician.completedTests.toLocaleString()}+ samples collected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Appointment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-foreground">Collection Details</h3>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {booking.date ? format(booking.date, "EEEE, d MMMM yyyy") : "Date not selected"}
                    </p>
                    <p className="text-sm text-muted-foreground">{getTimeSlotLabel(booking.timeSlot)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Home Address</p>
                    <p className="text-sm text-muted-foreground">{booking.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tests Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Tests to be Collected</h3>
                <div className="space-y-2">
                  {booking.tests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{test.name}</span>
                      <span className="font-medium text-foreground">₹{test.discountPrice || test.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 flex items-center justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">
                      ₹{booking.tests.reduce((sum, t) => sum + (t.discountPrice || t.price), 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* Proceed Button */}
      {!isAssigning && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4"
        >
          <Button onClick={onProceed} className="w-full h-12 rounded-xl text-base">
            Confirm & Pay
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TechnicianAssignment;
