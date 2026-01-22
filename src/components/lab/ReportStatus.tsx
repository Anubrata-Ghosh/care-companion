import { motion } from "framer-motion";
import { FileText, CheckCircle2, Clock, Download, Share2, Eye, FlaskConical, Truck, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { LabBooking } from "@/pages/LabTests";

interface ReportStatusProps {
  booking: LabBooking;
}

const reportSteps = [
  { id: 1, title: "Sample Collected", icon: TestTube, status: "completed", time: "Today, 8:30 AM" },
  { id: 2, title: "At Lab", icon: Truck, status: "completed", time: "Today, 10:15 AM" },
  { id: 3, title: "Processing", icon: FlaskConical, status: "current", time: "In progress" },
  { id: 4, title: "Report Ready", icon: FileText, status: "pending", time: "Expected by tomorrow" },
];

const ReportStatus = ({ booking }: ReportStatusProps) => {
  const completedSteps = reportSteps.filter((s) => s.status === "completed").length;
  const progress = ((completedSteps + 0.5) / reportSteps.length) * 100;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-1">Report Status</h1>
        <p className="text-muted-foreground">Booking ID: {booking.bookingId}</p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
              <span className="text-sm text-primary font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Processing Timeline</h3>
            <div className="space-y-4">
              {reportSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = step.status === "completed";
                const isCurrent = step.status === "current";
                const isPending = step.status === "pending";

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-success text-success-foreground"
                            : isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </div>
                      {index < reportSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-8 ${
                            isCompleted ? "bg-success" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${isPending ? "text-muted-foreground" : "text-foreground"}`}>
                          {step.title}
                        </p>
                        {isCurrent && (
                          <Badge className="bg-primary/10 text-primary border-0">
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tests Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Test Reports</h3>
            <div className="space-y-3">
              {booking.tests.map((test, index) => {
                const isReady = index === 0; // Simulate first test ready
                return (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isReady ? "bg-success/20" : "bg-warning/20"
                        }`}
                      >
                        {isReady ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Clock className="h-4 w-4 text-warning" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{test.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isReady ? "Report Ready" : "Processing..."}
                        </p>
                      </div>
                    </div>
                    {isReady && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-primary/5 border border-primary/20 rounded-xl p-4"
      >
        <h4 className="font-medium text-foreground mb-2">📱 Get Notified</h4>
        <p className="text-sm text-muted-foreground">
          You'll receive a notification as soon as your reports are ready. 
          All reports are digitally signed and NABL certified.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-3"
      >
        <Button variant="outline" className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          Download All
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Share2 className="h-4 w-4" />
          Share with Doctor
        </Button>
      </motion.div>
    </div>
  );
};

export default ReportStatus;
