import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, MapPin, LogOut, Edit2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/layout/BottomNav";

interface Profile {
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Profile>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    avatar_url: null,
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        pincode: data.pincode || "",
        avatar_url: data.avatar_url,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      setProfile({ ...profile, ...formData });
      setEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (formData.full_name) {
      return formData.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 glass border-b border-border/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">My Profile</h1>
          </div>
          {!editing ? (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </motion.header>

      <main className="container py-6 space-y-6">
        {/* Avatar Section */}
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={formData.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            {formData.full_name || "Add your name"}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </motion.div>

        {/* Profile Info */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.full_name || ""}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                disabled={!editing}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  placeholder="+91 98765 43210"
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!editing}
                placeholder="Enter your address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!editing}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode || ""}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  disabled={!editing}
                  placeholder="560001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
