import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface NurseCredentials {
  registrationNo: string;
  nursingCollege: string;
  graduationYear: string;
  pgCollege?: string;
  pgYear?: string;
  pgSpecialization?: string;
  skills: string;
  experience: string;
  certifications: string;
}

const NurseRegistration = () => {
  const navigate = useNavigate();
  const { serviceType, user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [credentials, setCredentials] = useState<NurseCredentials>({
    registrationNo: "",
    nursingCollege: "",
    graduationYear: new Date().getFullYear().toString(),
    pgCollege: "",
    pgYear: new Date().getFullYear().toString(),
    pgSpecialization: "",
    skills: "",
    experience: "",
    certifications: "",
  });

  const [documents, setDocuments] = useState({
    registrationCertificate: null as File | null,
    nursingDegree: null as File | null,
    pgDegree: null as File | null,
    healthCertificate: null as File | null,
  });

  // Only allow nurses
  if (serviceType !== "nurse_caretaker") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 pt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">Access Restricted</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                This page is only for nurses. Your role: <span className="font-medium">{serviceType || "Not set"}</span>
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/service-provider-dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const handleInputChange = (field: keyof NurseCredentials, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (field: keyof typeof documents, file: File | null) => {
    setDocuments((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!credentials.registrationNo || !credentials.nursingCollege || !credentials.experience) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate submission
    toast.loading("Submitting your credentials...");
    setTimeout(() => {
      setIsSubmitted(true);
      toast.success("Credentials submitted successfully! Awaiting verification.");
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="container px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Credentials Submitted
            </h2>
            <p className="text-muted-foreground mb-6">
              Your nursing credentials have been submitted and are under verification. You'll be notified once they're approved.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/nurse-provider")}
                className="w-full"
              >
                View My Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/service-provider-dashboard")}
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Header */}
      <motion.section
        className="px-4 pt-6 pb-4 border-b border-border/50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/service-provider-dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Nursing Credentials
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete your professional registration
            </p>
          </div>
        </div>
      </motion.section>

      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 h-auto p-1 mb-6">
            <TabsTrigger value="basic" className="text-xs py-2">Basic Info</TabsTrigger>
            <TabsTrigger value="education" className="text-xs py-2">Education</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs py-2">Documents</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Registration Details</CardTitle>
                  <CardDescription>
                    Your nursing registration number and professional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Nursing Registration Number *
                    </label>
                    <Input
                      placeholder="Enter your nursing registration number"
                      value={credentials.registrationNo}
                      onChange={(e) => handleInputChange("registrationNo", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your registration number from nursing council
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Total Years of Experience *
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter years of experience"
                      value={credentials.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className="mt-1"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Key Skills
                    </label>
                    <textarea
                      placeholder="E.g., Wound care, Medication administration, Patient monitoring, etc. (comma separated)"
                      value={credentials.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      className="w-full p-2 rounded-md border border-border bg-background text-foreground mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Additional Certifications
                    </label>
                    <textarea
                      placeholder="E.g., BLS Certification, First Aid, etc."
                      value={credentials.certifications}
                      onChange={(e) => handleInputChange("certifications", e.target.value)}
                      className="w-full p-2 rounded-md border border-border bg-background text-foreground mt-1"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Graduation Details</CardTitle>
                  <CardDescription>
                    Your nursing degree/diploma information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Nursing College/Institute *
                    </label>
                    <Input
                      placeholder="Name of your nursing college"
                      value={credentials.nursingCollege}
                      onChange={(e) => handleInputChange("nursingCollege", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Graduation Year *
                    </label>
                    <Input
                      type="number"
                      placeholder="Year of graduation"
                      value={credentials.graduationYear}
                      onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                      className="mt-1"
                      min="1980"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Post-Graduation (PG) Details</CardTitle>
                  <CardDescription>
                    Your specialization and PG details (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      PG Specialization
                    </label>
                    <Input
                      placeholder="E.g., ICU Nursing, Community Health, etc."
                      value={credentials.pgSpecialization}
                      onChange={(e) => handleInputChange("pgSpecialization", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      PG College/Institute
                    </label>
                    <Input
                      placeholder="Name of your PG college"
                      value={credentials.pgCollege}
                      onChange={(e) => handleInputChange("pgCollege", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      PG Year of Completion
                    </label>
                    <Input
                      type="number"
                      placeholder="Year of PG completion"
                      value={credentials.pgYear}
                      onChange={(e) => handleInputChange("pgYear", e.target.value)}
                      className="mt-1"
                      min="1980"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload copies of your nursing credentials and certificates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Registration Certificate */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nursing Registration Certificate
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => document.getElementById("reg-cert")?.click()}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {documents.registrationCertificate
                          ? documents.registrationCertificate.name
                          : "Click to upload or drag and drop"}
                      </p>
                      <input
                        id="reg-cert"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange("registrationCertificate", e.target.files?.[0] || null)}
                        accept="image/*,.pdf"
                      />
                    </div>
                  </div>

                  {/* Nursing Degree */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nursing Degree/Diploma Certificate
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => document.getElementById("nursing-degree")?.click()}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {documents.nursingDegree
                          ? documents.nursingDegree.name
                          : "Click to upload or drag and drop"}
                      </p>
                      <input
                        id="nursing-degree"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange("nursingDegree", e.target.files?.[0] || null)}
                        accept="image/*,.pdf"
                      />
                    </div>
                  </div>

                  {/* PG Degree */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      PG Degree Certificate (if applicable)
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => document.getElementById("pg-degree")?.click()}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {documents.pgDegree
                          ? documents.pgDegree.name
                          : "Click to upload or drag and drop"}
                      </p>
                      <input
                        id="pg-degree"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange("pgDegree", e.target.files?.[0] || null)}
                        accept="image/*,.pdf"
                      />
                    </div>
                  </div>

                  {/* Health Certificate */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Health Certificate
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => document.getElementById("health-cert")?.click()}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {documents.healthCertificate
                          ? documents.healthCertificate.name
                          : "Click to upload or drag and drop"}
                      </p>
                      <input
                        id="health-cert"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange("healthCertificate", e.target.files?.[0] || null)}
                        accept="image/*,.pdf"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mt-8"
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/service-provider-dashboard")}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
          >
            Submit Credentials
          </Button>
        </motion.div>

        {/* Info Box */}
        <Card className="mt-6 bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              Your credentials will be verified by our team within 24-48 hours. You'll receive an email notification once verified.
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default NurseRegistration;
