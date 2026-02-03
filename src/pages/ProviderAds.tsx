import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, TrendingUp, Eye, MousePointer, BarChart3, Plus, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AdCampaign {
  id: string;
  name: string;
  budget: number;
  spent: number;
  status: "active" | "paused" | "completed";
  duration: string;
  reach: number;
  clicks: number;
  startDate: string;
}

const ProviderAds = () => {
  const navigate = useNavigate();
  const { user, serviceType } = useAuth();
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
      id: "1",
      name: "Summer Health Drive",
      budget: 5000,
      spent: 3200,
      status: "active",
      duration: "30 days",
      reach: 4500,
      clicks: 320,
      startDate: "Jan 1, 2025",
    },
    {
      id: "2",
      name: "New Services Launch",
      budget: 3000,
      spent: 3000,
      status: "completed",
      duration: "14 days",
      reach: 2800,
      clicks: 210,
      startDate: "Dec 15, 2024",
    },
  ]);

  // Only allow doctors and nursing homes
  if (serviceType !== "doctor" && serviceType !== "nursing_home") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 text-center py-12">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
            <p className="text-muted-foreground">
              Ad campaigns are only available for doctors and nursing homes.
            </p>
            <Button onClick={() => navigate("/service-provider-dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleCreateCampaign = () => {
    navigate("/create-ad-campaign");
  };

  const handleToggleCampaign = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) => {
        if (campaign.id === campaignId) {
          const newStatus = campaign.status === "active" ? "paused" : "active";
          toast.success(`Campaign ${newStatus === "active" ? "resumed" : "paused"}`);
          return { ...campaign, status: newStatus };
        }
        return campaign;
      })
    );
  };

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 pt-4">
        {/* Header */}
        <motion.section
          className="px-4 pb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/service-provider-dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Ad Campaigns</h1>
              <p className="text-sm text-muted-foreground">Reach more patients with targeted ads</p>
            </div>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <section className="px-4 mb-8">
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <div className="text-xs text-muted-foreground">Total Reach</div>
              </div>
              <div className="text-2xl font-bold text-primary">{totalReach.toLocaleString()}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="w-5 h-5 text-primary" />
                <div className="text-xs text-muted-foreground">Total Clicks</div>
              </div>
              <div className="text-2xl font-bold text-primary">{totalClicks}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div className="text-xs text-muted-foreground">Total Budget</div>
              </div>
              <div className="text-2xl font-bold text-primary">₹{totalBudget.toLocaleString()}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <div className="text-xs text-muted-foreground">Spent</div>
              </div>
              <div className="text-2xl font-bold text-orange-500">₹{totalSpent.toLocaleString()}</div>
            </motion.div>
          </div>
        </section>

        {/* Create Campaign Button */}
        <section className="px-4 mb-8">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-primary/80 gap-2 h-12"
            onClick={handleCreateCampaign}
          >
            <Plus className="w-4 h-4" />
            Create New Campaign
          </Button>
        </section>

        {/* Campaigns List */}
        <section className="px-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Active Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 space-y-4">
                    {/* Campaign Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Started: {campaign.startDate} • Duration: {campaign.duration}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          campaign.status === "active"
                            ? "bg-green-500/20 text-green-700 dark:text-green-400"
                            : campaign.status === "paused"
                              ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                              : "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Budget Usage</span>
                        <span className="font-medium text-foreground">
                          ₹{campaign.spent.toLocaleString()} / ₹{campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Reach</div>
                        <div className="font-bold text-foreground">{campaign.reach.toLocaleString()}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Clicks</div>
                        <div className="font-bold text-foreground">{campaign.clicks}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">CTR</div>
                        <div className="font-bold text-foreground">
                          {((campaign.clicks / campaign.reach) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        size="sm"
                        onClick={() => handleToggleCampaign(campaign.id)}
                      >
                        {campaign.status === "active" ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Campaign
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Resume Campaign
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="px-4 py-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Why advertise with us?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Reach thousands of patients searching for your services</li>
                <li>✓ Boost visibility and increase appointment bookings</li>
                <li>✓ Get detailed analytics on campaign performance</li>
                <li>✓ Flexible budgets starting from ₹499</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProviderAds;
