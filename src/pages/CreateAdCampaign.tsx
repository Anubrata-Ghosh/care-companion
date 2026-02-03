import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Info, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface CampaignFormData {
  name: string;
  description: string;
  budget: number;
  duration: number;
  targetAudience: string[];
  adContent: string;
  keywords: string;
  dailyBudget?: number;
}

const CreateAdCampaign = () => {
  const navigate = useNavigate();
  const { serviceType } = useAuth();
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    budget: 500,
    duration: 7,
    targetAudience: [],
    adContent: "",
    keywords: "",
  });

  // Only allow doctors and nursing homes
  if (serviceType !== "doctor" && serviceType !== "nursing_home") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 pt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">Access Restricted</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                Ad campaigns are only available for doctors and nursing homes.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/provider-ads")}
              >
                Back to Ads
              </Button>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const targetAudienceOptions = [
    { id: "age_18_30", label: "18-30 years", description: "Young adults" },
    { id: "age_30_50", label: "30-50 years", description: "Middle-aged" },
    { id: "age_50plus", label: "50+ years", description: "Seniors" },
    { id: "location_city", label: "City residents", description: "Urban areas" },
    { id: "location_suburb", label: "Suburbs", description: "Suburban areas" },
    { id: "health_conscious", label: "Health conscious", description: "Fitness enthusiasts" },
    { id: "parents", label: "Parents", description: "Families with kids" },
    { id: "seniors_care", label: "Senior care seekers", description: "Elderly care providers" },
  ];

  const durationOptions = [7, 14, 21, 30, 60, 90];

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAudienceToggle = (audienceId: string) => {
    setFormData((prev) => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audienceId)
        ? prev.targetAudience.filter((id) => id !== audienceId)
        : [...prev.targetAudience, audienceId],
    }));
  };

  const calculateDailyBudget = () => {
    return Math.round(formData.budget / formData.duration);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.description) {
      toast.error("Please fill in campaign name and description");
      return;
    }

    if (formData.budget < 500) {
      toast.error("Minimum budget is ₹500");
      return;
    }

    if (formData.targetAudience.length === 0) {
      toast.error("Please select at least one target audience");
      return;
    }

    if (!formData.adContent) {
      toast.error("Please add ad content/description");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Creating your ad campaign...");

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Ad campaign created successfully!");
      navigate("/provider-ads", { replace: true });
    }, 2000);
  };

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
            onClick={() => navigate("/provider-ads")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Create Ad Campaign
            </h1>
            <p className="text-sm text-muted-foreground">
              Reach more patients and grow your practice
            </p>
          </div>
        </div>
      </motion.section>

      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 h-auto p-1 mb-6">
            <TabsTrigger value="details" className="text-xs py-2">Details</TabsTrigger>
            <TabsTrigger value="targeting" className="text-xs py-2">Targeting</TabsTrigger>
            <TabsTrigger value="content" className="text-xs py-2">Content</TabsTrigger>
            <TabsTrigger value="review" className="text-xs py-2">Review</TabsTrigger>
          </TabsList>

          {/* Campaign Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                  <CardDescription>
                    Basic information about your ad campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Campaign Name *
                    </label>
                    <Input
                      placeholder="E.g., Summer Health Drive"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Give your campaign a descriptive name
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Campaign Description *
                    </label>
                    <textarea
                      placeholder="Describe what your campaign is about..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="w-full p-2 rounded-md border border-border bg-background text-foreground mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Total Budget (₹) *
                      </label>
                      <Input
                        type="number"
                        placeholder="500"
                        value={formData.budget}
                        onChange={(e) => handleInputChange("budget", parseFloat(e.target.value) || 0)}
                        className="mt-1"
                        min="500"
                        step="100"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum: ₹500
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Campaign Duration (Days) *
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
                        className="w-full p-2 rounded-md border border-border bg-background text-foreground mt-1"
                      >
                        {durationOptions.map((days) => (
                          <option key={days} value={days}>
                            {days} days
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900 dark:text-blue-200">
                        <p className="font-medium mb-1">Daily Budget</p>
                        <p>₹{calculateDailyBudget()}/day</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Targeting Tab */}
          <TabsContent value="targeting" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                  <CardDescription>
                    Select who you want to reach with this campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {targetAudienceOptions.map((audience) => (
                      <button
                        key={audience.id}
                        onClick={() => handleAudienceToggle(audience.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.targetAudience.includes(audience.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {audience.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {audience.description}
                            </p>
                          </div>
                          {formData.targetAudience.includes(audience.id) && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                      </button>
                    ))}
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
                  <CardTitle>Keywords</CardTitle>
                  <CardDescription>
                    Add relevant keywords to help patients find you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    placeholder="E.g., cardiology, heart specialist, heart surgery (comma separated)"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange("keywords", e.target.value)}
                    className="w-full p-2 rounded-md border border-border bg-background text-foreground"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter keywords separated by commas
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Ad Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Ad Content</CardTitle>
                  <CardDescription>
                    Write compelling ad content to attract patients
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Ad Headline
                    </label>
                    <Input
                      placeholder="E.g., Best Cardiology Services in Your Area"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep it short and attention-grabbing (max 60 characters)
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Ad Description *
                    </label>
                    <textarea
                      placeholder="Write a compelling description of your services..."
                      value={formData.adContent}
                      onChange={(e) => handleInputChange("adContent", e.target.value)}
                      className="w-full p-2 rounded-md border border-border bg-background text-foreground mt-1"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.adContent.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Call to Action Button
                    </label>
                    <select className="w-full p-2 rounded-md border border-border bg-background text-foreground mt-1">
                      <option>Book Now</option>
                      <option>Learn More</option>
                      <option>Contact Us</option>
                      <option>View Services</option>
                      <option>Get Started</option>
                    </select>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-medium text-sm text-foreground mb-2">Ad Preview</h4>
                    <div className="bg-white dark:bg-slate-900 rounded p-3 space-y-2">
                      <p className="font-bold text-sm text-foreground">
                        {formData.name || "Your Campaign Name"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {formData.adContent || "Your ad description will appear here..."}
                      </p>
                      <button className="text-xs bg-primary text-white px-2 py-1 rounded">
                        Book Now
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Summary</CardTitle>
                  <CardDescription>
                    Review your campaign details before publishing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Campaign Name</p>
                      <p className="font-semibold text-foreground mt-1">
                        {formData.name || "Not set"}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Total Budget</p>
                      <p className="font-semibold text-foreground mt-1">
                        ₹{formData.budget}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold text-foreground mt-1">
                        {formData.duration} days
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Daily Budget</p>
                      <p className="font-semibold text-foreground mt-1">
                        ₹{calculateDailyBudget()}/day
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg col-span-2">
                      <p className="text-xs text-muted-foreground">Target Audience</p>
                      <p className="font-semibold text-foreground mt-1">
                        {formData.targetAudience.length} segments selected
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-green-900 dark:text-green-200">
                          Campaign Ready to Launch
                        </p>
                        <p className="text-xs text-green-800 dark:text-green-300 mt-1">
                          Your campaign will start immediately and run for {formData.duration} days
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mt-8"
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (activeTab === "details") {
                navigate("/provider-ads");
              } else {
                const tabs = ["details", "targeting", "content", "review"];
                const currentIndex = tabs.indexOf(activeTab);
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}
          >
            {activeTab === "details" ? "Cancel" : "Back"}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              const tabs = ["details", "targeting", "content", "review"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              } else {
                handleSubmit();
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating..."
              : activeTab === "review"
                ? "Create Campaign"
                : "Next"}
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CreateAdCampaign;
