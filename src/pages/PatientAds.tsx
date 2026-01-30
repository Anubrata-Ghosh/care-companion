import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, BarChart3, Users, Target, Share2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface AdCampaign {
  id: string;
  name: string;
  type: "referral" | "health-tip" | "wellness";
  status: "active" | "draft" | "paused";
  budget: number;
  spent: number;
  reach: number;
  clicks: number;
  startDate: string;
  endDate?: string;
}

const PatientAds = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
      id: "1",
      name: "Wellness Tips Campaign",
      type: "health-tip",
      status: "active",
      budget: 1000,
      spent: 450,
      reach: 5200,
      clicks: 340,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
    },
  ]);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCampaign = () => {
    setIsCreating(true);
    toast.success("Starting ad creation...");
    
    setTimeout(() => {
      const newCampaign: AdCampaign = {
        id: String(campaigns.length + 1),
        name: "New Health Campaign",
        type: "wellness",
        status: "draft",
        budget: 500,
        spent: 0,
        reach: 0,
        clicks: 0,
        startDate: new Date().toISOString().split('T')[0],
      };
      
      setCampaigns([...campaigns, newCampaign]);
      setIsCreating(false);
      toast.success("Campaign created! Setup your ad details.");
    }, 1500);
  };

  const handleLaunchCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: "active" as const } : c
    ));
    toast.success("Campaign launched successfully!");
  };

  const handlePauseCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: "paused" as const } : c
    ));
    toast.info("Campaign paused.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "paused":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "referral":
        return <Share2 className="w-5 h-5" />;
      case "health-tip":
        return <Sparkles className="w-5 h-5" />;
      case "wellness":
        return <Users className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const CampaignCard = ({ campaign }: { campaign: AdCampaign }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2.5 rounded-lg bg-primary/10">
              {getTypeIcon(campaign.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{campaign.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {campaign.type.replace('-', ' ').toUpperCase()}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{campaign.reach}</div>
            <div className="text-xs text-muted-foreground mt-1">Reach</div>
          </div>
          <div className="bg-accent/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-accent">{campaign.clicks}</div>
            <div className="text-xs text-muted-foreground mt-1">Clicks</div>
          </div>
        </div>

        {/* Budget Info */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-semibold text-foreground">₹{campaign.budget}</span>
          </div>
          <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-primary h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Spent: ₹{campaign.spent}</span>
            <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {new Date(campaign.startDate).toLocaleDateString("en-IN")} 
            {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString("en-IN")}`}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {campaign.status === "draft" && (
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600"
              onClick={() => handleLaunchCampaign(campaign.id)}
            >
              <Zap className="w-3.5 h-3.5 mr-1" />
              Launch
            </Button>
          )}
          {campaign.status === "active" && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => handlePauseCampaign(campaign.id)}
            >
              Pause
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="flex-1"
            onClick={() => toast.info("Analytics coming soon!")}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 glass border-b border-border/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Ad Campaigns</h1>
              <p className="text-xs text-muted-foreground">
                Promote your health journey and earn rewards
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container px-4 py-6">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h3 className="font-semibold text-foreground">Share Your Health Tips</h3>
            <p className="text-muted-foreground mt-1">
              Create ad campaigns to share wellness tips, referral programs, or health achievements with the community
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full justify-start bg-transparent border-b border-border/50 rounded-none h-auto p-0">
            <TabsTrigger value="campaigns" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              My Campaigns
            </TabsTrigger>
            <TabsTrigger value="create" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              Create New
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="mt-6 space-y-4">
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-1">No campaigns yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first ad campaign to start promoting
                </p>
                <Button 
                  onClick={() => setActiveTab("create")}
                  className="gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Create Campaign
                </Button>
              </motion.div>
            )}
          </TabsContent>

          {/* Create Tab */}
          <TabsContent value="create" className="mt-6 space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Campaign Types</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        id: "wellness",
                        title: "Wellness Promotion",
                        description: "Share your wellness journey and health tips",
                        icon: <Users className="w-5 h-5" />,
                      },
                      {
                        id: "referral",
                        title: "Referral Program",
                        description: "Earn rewards by referring friends to CareNest",
                        icon: <Share2 className="w-5 h-5" />,
                      },
                      {
                        id: "health-tip",
                        title: "Health Tips",
                        description: "Share valuable health and wellness tips",
                        icon: <Sparkles className="w-5 h-5" />,
                      },
                    ].map((type) => (
                      <motion.button
                        key={type.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                        onClick={() => handleCreateCampaign()}
                      >
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{type.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {campaigns.length === 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Get Started</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your first campaign and start reaching the community
                    </p>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary/80"
                      disabled={isCreating}
                      onClick={handleCreateCampaign}
                    >
                      {isCreating ? "Creating..." : "Create Your First Campaign"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6 space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Overall Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-primary">
                        {campaigns.reduce((sum, c) => sum + c.reach, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">Total Reach</div>
                    </div>
                    <div className="bg-accent/5 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-accent">
                        {campaigns.reduce((sum, c) => sum + c.clicks, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">Total Clicks</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Campaign Details</h4>
                  <div className="space-y-3">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">{campaign.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {campaign.reach} reach · {campaign.clicks} clicks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Real-time analytics dashboard coming soon. Track impressions, clicks, conversions, and more!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default PatientAds;
