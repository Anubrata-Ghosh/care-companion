import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FlaskConical, Heart, Droplets, Activity, Baby, Bone, Shield, ChevronRight, Clock, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LabTest } from "@/pages/LabTests";

interface TestCatalogProps {
  selectedTests: LabTest[];
  onSelectTest: (test: LabTest) => void;
  onProceed: () => void;
}

const categories = [
  { id: "popular", name: "Popular", icon: Activity },
  { id: "full-body", name: "Full Body", icon: FlaskConical },
  { id: "heart", name: "Heart", icon: Heart },
  { id: "diabetes", name: "Diabetes", icon: Droplets },
  { id: "thyroid", name: "Thyroid", icon: Shield },
  { id: "vitamin", name: "Vitamins", icon: Baby },
  { id: "bone", name: "Bone", icon: Bone },
];

const allTests: LabTest[] = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    description: "Measures various blood components including RBC, WBC, platelets",
    price: 500,
    discountPrice: 349,
    category: "popular",
    fastingRequired: false,
    reportTime: "6 hours",
    includes: ["Hemoglobin", "RBC Count", "WBC Count", "Platelet Count", "Hematocrit"],
  },
  {
    id: "2",
    name: "Full Body Checkup",
    description: "Comprehensive health screening with 80+ parameters",
    price: 2999,
    discountPrice: 1499,
    category: "full-body",
    fastingRequired: true,
    reportTime: "24 hours",
    includes: ["CBC", "Liver Function", "Kidney Function", "Lipid Profile", "Thyroid", "Diabetes"],
  },
  {
    id: "3",
    name: "Lipid Profile",
    description: "Complete cholesterol and triglycerides analysis",
    price: 800,
    discountPrice: 499,
    category: "heart",
    fastingRequired: true,
    reportTime: "12 hours",
    includes: ["Total Cholesterol", "HDL", "LDL", "Triglycerides", "VLDL"],
  },
  {
    id: "4",
    name: "HbA1c (Glycated Hemoglobin)",
    description: "3-month average blood sugar levels",
    price: 600,
    discountPrice: 399,
    category: "diabetes",
    fastingRequired: false,
    reportTime: "6 hours",
  },
  {
    id: "5",
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Complete thyroid function assessment",
    price: 700,
    discountPrice: 449,
    category: "thyroid",
    fastingRequired: false,
    reportTime: "12 hours",
    includes: ["T3", "T4", "TSH"],
  },
  {
    id: "6",
    name: "Vitamin D Test",
    description: "25-Hydroxy Vitamin D levels",
    price: 1200,
    discountPrice: 699,
    category: "vitamin",
    fastingRequired: false,
    reportTime: "24 hours",
  },
  {
    id: "7",
    name: "Vitamin B12 Test",
    description: "Serum B12 levels for energy and nerve health",
    price: 800,
    discountPrice: 549,
    category: "vitamin",
    fastingRequired: false,
    reportTime: "12 hours",
  },
  {
    id: "8",
    name: "Calcium & Bone Health",
    description: "Calcium, Phosphorus, and Vitamin D",
    price: 1500,
    discountPrice: 999,
    category: "bone",
    fastingRequired: false,
    reportTime: "24 hours",
    includes: ["Calcium", "Phosphorus", "Vitamin D", "Alkaline Phosphatase"],
  },
  {
    id: "9",
    name: "Liver Function Test (LFT)",
    description: "Complete liver health assessment",
    price: 700,
    discountPrice: 449,
    category: "popular",
    fastingRequired: true,
    reportTime: "12 hours",
    includes: ["SGOT", "SGPT", "Bilirubin", "Albumin", "Protein"],
  },
  {
    id: "10",
    name: "Kidney Function Test (KFT)",
    description: "Complete kidney health assessment",
    price: 600,
    discountPrice: 399,
    category: "popular",
    fastingRequired: false,
    reportTime: "12 hours",
    includes: ["Creatinine", "Urea", "Uric Acid", "BUN"],
  },
];

const TestCatalog = ({ selectedTests, onSelectTest, onProceed }: TestCatalogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("popular");

  const filteredTests = allTests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "popular" 
      ? test.category === "popular" || true
      : test.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalAmount = selectedTests.reduce((sum, test) => sum + (test.discountPrice || test.price), 0);
  const isSelected = (testId: string) => selectedTests.some((t) => t.id === testId);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <FlaskConical className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Lab Tests at Home</h2>
            <p className="text-sm text-muted-foreground">Get tested from comfort of home</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>Reports in 24h</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Shield className="h-4 w-4 text-success" />
            <span>NABL Certified</span>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tests, packages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl bg-muted/50"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Test List */}
      <div className="space-y-3">
        {filteredTests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`cursor-pointer transition-all ${
                isSelected(test.id)
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:shadow-md"
              }`}
              onClick={() => onSelectTest(test)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{test.name}</h3>
                      {test.fastingRequired && (
                        <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                          Fasting
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                    
                    {test.includes && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {test.includes.slice(0, 3).map((item) => (
                          <Badge key={item} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                        {test.includes.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{test.includes.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Report in {test.reportTime}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <div>
                      {test.discountPrice && (
                        <span className="text-xs text-muted-foreground line-through">₹{test.price}</span>
                      )}
                      <p className="text-lg font-bold text-primary">
                        ₹{test.discountPrice || test.price}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected(test.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected(test.id) && <Check className="h-4 w-4 text-primary-foreground" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom Cart */}
      {selectedTests.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{selectedTests.length} test(s) selected</p>
              <p className="text-xl font-bold text-foreground">₹{totalAmount}</p>
            </div>
            <Button onClick={onProceed} className="rounded-xl px-6">
              Proceed
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TestCatalog;
