import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, FileImage, Clock, Package, ChevronRight, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PrescriptionUploadProps {
  onUpload: (data: { type: string; file?: File; pastOrderId?: string }) => void;
}

interface PastOrder {
  id: string;
  date: string;
  medicines: string[];
  pharmacy: string;
}

const PrescriptionUpload = ({ onUpload }: PrescriptionUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPastOrders, setShowPastOrders] = useState(false);

  const pastOrders: PastOrder[] = [
    {
      id: "ORD001",
      date: "15 Jan 2024",
      medicines: ["Paracetamol 500mg", "Cetirizine 10mg", "Vitamin D3"],
      pharmacy: "Apollo Pharmacy",
    },
    {
      id: "ORD002",
      date: "02 Jan 2024",
      medicines: ["Metformin 500mg", "Amlodipine 5mg"],
      pharmacy: "MedPlus",
    },
    {
      id: "ORD003",
      date: "20 Dec 2023",
      medicines: ["Omeprazole 20mg", "Pantoprazole"],
      pharmacy: "Netmeds",
    },
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleCameraCapture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelect(file);
    };
    input.click();
  };

  const handleGallerySelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelect(file);
    };
    input.click();
  };

  const handlePastOrderSelect = (orderId: string) => {
    onUpload({ type: "past-order", pastOrderId: orderId });
  };

  const handleUploadConfirm = () => {
    if (selectedFile) {
      onUpload({ type: "upload", file: selectedFile });
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-6"
      >
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Get Medicines Delivered
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload your prescription and we'll deliver genuine medicines to your doorstep
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary/10" />
      </motion.div>

      {/* Preview Section */}
      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[4/3] bg-muted">
                <img
                  src={previewUrl}
                  alt="Prescription preview"
                  className="w-full h-full object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={clearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedFile?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile?.size ? selectedFile.size / 1024 : 0).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Ready</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button
            className="w-full mt-4 h-12"
            onClick={handleUploadConfirm}
          >
            Continue with this Prescription
          </Button>
        </motion.div>
      )}

      {/* Upload Options */}
      {!previewUrl && (
        <>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Upload Prescription</h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCameraCapture}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Camera className="h-7 w-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Take Photo</p>
                  <p className="text-xs text-muted-foreground">Use camera</p>
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleGallerySelect}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                  <FileImage className="h-7 w-7 text-accent" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Gallery</p>
                  <p className="text-xs text-muted-foreground">Upload image/PDF</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Past Orders */}
          <div className="space-y-3">
            <button
              onClick={() => setShowPastOrders(!showPastOrders)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Clock className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Reorder from Past</h3>
                  <p className="text-xs text-muted-foreground">{pastOrders.length} previous orders</p>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-muted-foreground transition-transform ${
                  showPastOrders ? "rotate-90" : ""
                }`}
              />
            </button>

            {showPastOrders && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                {pastOrders.map((order) => (
                  <motion.button
                    key={order.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePastOrderSelect(order.id)}
                    className="w-full p-4 rounded-xl border border-border bg-card hover:bg-accent/5 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.pharmacy}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {order.id}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {order.medicines.join(" • ")}
                    </p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Guidelines */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Prescription Guidelines</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  Ensure the prescription is clearly visible
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  Include doctor's name, signature, and date
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  Valid prescriptions only (within 6 months)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  Scheduled drugs require physical prescription
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PrescriptionUpload;
