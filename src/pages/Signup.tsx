import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Heart, ArrowLeft, Stethoscope, Users, Ambulance, Package, Home, Nurse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type ServiceType = "nursing_home" | "doctor" | "nurse_caretaker" | "ambulance" | "delivery";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const serviceOptions: { type: ServiceType; label: string; description: string; icon: React.ReactNode }[] = [
    { type: "nursing_home", label: "Nursing Home", description: "Healthcare facility", icon: <Home className="w-6 h-6" /> },
    { type: "doctor", label: "Doctor", description: "Medical practitioner", icon: <Stethoscope className="w-6 h-6" /> },
    { type: "nurse_caretaker", label: "Nurse Caretaker", description: "In-home care", icon: <Nurse className="w-6 h-6" /> },
    { type: "ambulance", label: "Ambulance Service", description: "Emergency transport", icon: <Ambulance className="w-6 h-6" /> },
    { type: "delivery", label: "Delivery Partner", description: "Medicine delivery", icon: <Package className="w-6 h-6" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!userRole) {
      toast({
        title: "Select account type",
        description: "Please select whether you're a patient or service provider",
        variant: "destructive",
      });
      return;
    }

    if (userRole === "service_provider" && !serviceType) {
      toast({
        title: "Select service type",
        description: "Please select what service you want to provide",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName, userRole, serviceType);
    setLoading(false);

    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: `Welcome to CareNest as a ${userRole === 'patient' ? 'patient' : 'service provider'}!`,
      });
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-background flex flex-col">
      {/* Header */}
      <motion.header 
        className="p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")}
          className="text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </motion.header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 pb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-lg mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CareNest</h1>
            <p className="text-muted-foreground text-sm mt-1">Healthcare at your fingertips</p>
          </div>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Create Account</CardTitle>
              <CardDescription>Sign up to get started with CareNest</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">I am a:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Patient Option */}
                    <motion.button
                      type="button"
                      onClick={() => setUserRole("patient")}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        userRole === "patient"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-card"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold text-sm text-foreground">Patient</div>
                      <div className="text-xs text-muted-foreground">Seek care</div>
                      {userRole === "patient" && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </motion.button>

                    {/* Service Provider Option */}
                    <motion.button
                      type="button"
                      onClick={() => setUserRole("service_provider")}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        userRole === "service_provider"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-card"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Stethoscope className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold text-sm text-foreground">Provider</div>
                      <div className="text-xs text-muted-foreground">Offer services</div>
                      {userRole === "service_provider" && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Role Description */}
                {userRole && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-foreground"
                  >
                    {userRole === "patient" ? (
                      <>
                        <strong>Patient Account</strong>
                        <p className="text-xs text-muted-foreground mt-1">
                          Book appointments, order medicines, track health, and manage medical records
                        </p>
                      </>
                    ) : (
                      <>
                        <strong>Service Provider Account</strong>
                        <p className="text-xs text-muted-foreground mt-1">
                          Offer healthcare services as a doctor, nursing home, ambulance, or delivery partner
                        </p>
                      </>
                    )}
                  </motion.div>
                )}

                <hr className="my-4" />

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90"
                  disabled={loading || !userRole}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </CardContent>
            </form>

            <CardFooter className="flex flex-col gap-4 pt-0">
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
