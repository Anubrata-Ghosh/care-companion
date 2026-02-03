import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, MessageCircle, UserPlus, MapPin, Star, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface CommunityProvider {
  id: string;
  name: string;
  location: string;
  experience: number;
  rating: number;
  reviews: number;
  specialization?: string;
  image?: string;
  isConnected?: boolean;
}

const ProviderCommunity = () => {
  const navigate = useNavigate();
  const { user, serviceType } = useAuth();
  const [providers, setProviders] = useState<CommunityProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedList, setConnectedList] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      loadProvidersData();
      setLoading(false);
    }, 500);
  }, []);

  const loadProvidersData = () => {
    const mockProviders: CommunityProvider[] = [
      {
        id: "p1",
        name: "Dr. Amit Sharma",
        location: "Mumbai, India",
        experience: 12,
        rating: 4.8,
        reviews: 127,
        specialization: "General Medicine",
        isConnected: false,
      },
      {
        id: "p2",
        name: "Dr. Priya Verma",
        location: "Delhi, India",
        experience: 8,
        rating: 4.9,
        reviews: 98,
        specialization: "Pediatrics",
        isConnected: false,
      },
      {
        id: "p3",
        name: "Dr. Rajesh Patel",
        location: "Bangalore, India",
        experience: 15,
        rating: 4.7,
        reviews: 156,
        specialization: "Cardiology",
        isConnected: false,
      },
    ];
    setProviders(mockProviders);
  };

  const handleConnect = (providerId: string) => {
    if (connectedList.has(providerId)) {
      setConnectedList(prev => {
        const newSet = new Set(prev);
        newSet.delete(providerId);
        return newSet;
      });
      toast.success("Connection removed");
    } else {
      setConnectedList(prev => new Set(prev).add(providerId));
      toast.success("Connection request sent!");
    }
  };

  const handleMessage = (providerId: string) => {
    toast.info("Chat feature coming soon!");
  };

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getServiceTypeLabel = (type?: string) => {
    const typeMap: Record<string, string> = {
      doctor: "Doctors",
      nurse_caretaker: "Nurses & Caretakers",
      nursing_home: "Nursing Homes",
      ambulance: "Ambulance Services",
      delivery: "Delivery Partners",
    };
    return typeMap[type || ""] || "Service Providers";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20">
        {/* Header Section */}
        <motion.section
          className="px-4 pt-6 pb-6 bg-gradient-to-r from-primary/10 to-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/service-provider-dashboard")}
              className="p-2 hover:bg-card rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Community Network</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Connect with {getServiceTypeLabel(serviceType)}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Search Bar */}
        <section className="px-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="px-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <Users className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{providers.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Providers</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <UserPlus className="w-5 h-5 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">{connectedList.size}</div>
              <div className="text-xs text-muted-foreground mt-1">Connected</div>
            </div>
          </motion.div>
        </section>

        {/* Providers List */}
        <section className="px-4 mb-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredProviders.length > 0 ? (
            <div className="space-y-3">
              {filteredProviders.map((provider, index) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-white">
                            {provider.name.charAt(0)}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {provider.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{provider.location}</span>
                          </div>
                          {provider.specialization && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {provider.specialization}
                            </Badge>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-foreground">
                                {provider.rating}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({provider.reviews})
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {provider.experience} yrs exp
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 justify-center">
                          <Button
                            size="sm"
                            variant={connectedList.has(provider.id) ? "default" : "outline"}
                            onClick={() => handleConnect(provider.id)}
                            className="w-20"
                          >
                            {connectedList.has(provider.id) ? "Connected" : "Connect"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMessage(provider.id)}
                            className="w-20"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No providers found matching your search</p>
            </motion.div>
          )}
        </section>

        {/* Info Box */}
        {filteredProviders.length > 0 && (
          <section className="px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Community Benefits</h3>
                <ul className="text-xs text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                  <li>• Share knowledge and best practices</li>
                  <li>• Collaborate on patient referrals</li>
                  <li>• Build professional relationships</li>
                </ul>
              </div>
            </motion.div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default ProviderCommunity;
