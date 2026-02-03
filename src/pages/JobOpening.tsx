import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Briefcase, MapPin, DollarSign, Clock, AlertCircle, Bookmark, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface JobPosting {
  id: string;
  title: string;
  organization: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  isSaved: boolean;
}

const JobOpening = () => {
  const navigate = useNavigate();
  const { serviceType } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      loadJobs();
      setLoading(false);
    }, 500);
  }, [serviceType]);

  const loadJobs = () => {
    const mockJobs: JobPosting[] = [
      {
        id: "j1",
        title: "Senior Doctor - General Medicine",
        organization: "Apollo Hospitals",
        location: "Mumbai, India",
        jobType: "Full-time",
        salary: "₹80,000 - ₹1,20,000/month",
        description: "We are looking for an experienced General Medicine doctor to join our team at Apollo Hospitals. Must have 5+ years of experience.",
        requirements: ["Medical Degree (MBBS)", "5+ years experience", "Valid Medical License"],
        postedDate: "2 days ago",
        isSaved: false,
      },
      {
        id: "j2",
        title: "Pediatrician",
        organization: "Max Healthcare",
        location: "Delhi, India",
        jobType: "Full-time",
        salary: "₹70,000 - ₹1,10,000/month",
        description: "Seeking experienced Pediatrician for our multi-specialty clinic. Patient-focused approach required.",
        requirements: ["MD/MS in Pediatrics", "3+ years experience", "Patient management skills"],
        postedDate: "1 week ago",
        isSaved: false,
      },
      {
        id: "j3",
        title: "Staff Nurse",
        organization: "Fortis Healthcare",
        location: "Bangalore, India",
        jobType: "Full-time",
        salary: "₹30,000 - ₹50,000/month",
        description: "Immediate opening for Staff Nurses in our ICU and General wards.",
        requirements: ["BSc/GNM Nursing", "2+ years experience", "ICU experience preferred"],
        postedDate: "3 days ago",
        isSaved: false,
      },
      {
        id: "j4",
        title: "Consultant Cardiologist",
        organization: "Manipal Hospitals",
        location: "Pune, India",
        jobType: "Full-time",
        salary: "₹1,50,000 - ₹2,50,000/month",
        description: "Experienced Cardiologist required for cardiology department. Research opportunities available.",
        requirements: ["DM Cardiology", "7+ years experience", "Publication record preferred"],
        postedDate: "5 days ago",
        isSaved: false,
      },
      {
        id: "j5",
        title: "Critical Care Nurse",
        organization: "Medanta Hospital",
        location: "Gurugram, India",
        jobType: "Full-time",
        salary: "₹35,000 - ₹60,000/month",
        description: "Looking for experienced Critical Care Nurses for our ICU unit.",
        requirements: ["GNM/BSc Nursing", "3+ years ICU experience", "ACLS certification"],
        postedDate: "4 days ago",
        isSaved: false,
      },
    ];

    setJobs(mockJobs);
  };

  const handleSaveJob = (jobId: string) => {
    if (savedJobs.has(jobId)) {
      setSavedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      toast.success("Job removed from saved");
    } else {
      setSavedJobs(prev => new Set(prev).add(jobId));
      toast.success("Job saved successfully!");
    }
  };

  const handleApply = (jobId: string, jobTitle: string) => {
    toast.info(`Application submitted for ${jobTitle}`);
  };

  const handleShare = (jobId: string) => {
    toast.success("Job shared!");
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-card rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Job Openings</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Find the perfect opportunity for your career
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
              placeholder="Search jobs, organizations, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </motion.div>
        </section>

        {/* Stats */}
        <section className="px-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <Briefcase className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{filteredJobs.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Available Jobs</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <Bookmark className="w-5 h-5 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-500">{savedJobs.size}</div>
              <div className="text-xs text-muted-foreground mt-1">Saved Jobs</div>
            </div>
          </motion.div>
        </section>

        {/* Jobs List */}
        <section className="px-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-card rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate text-lg">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {job.organization}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className="ml-2 p-2 hover:bg-card rounded-lg transition-colors flex-shrink-0"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${
                            savedJobs.has(job.id)
                              ? "fill-orange-500 text-orange-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{job.jobType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Requirements */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.slice(0, 2).map((req, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.requirements.length - 2} more
                        </Badge>
                      )}
                    </div>

                    {/* Posted Date & Actions */}
                    <div className="flex items-center justify-between border-t border-border/50 pt-3">
                      <span className="text-xs text-muted-foreground">
                        Posted {job.postedDate}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleShare(job.id)}
                          className="px-3"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApply(job.id, job.title)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No jobs found matching your search</p>
            </motion.div>
          )}
        </section>

        {/* Info Box */}
        {filteredJobs.length > 0 && (
          <section className="px-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Tips for Job Search</h3>
                <ul className="text-xs text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                  <li>• Keep your profile updated with latest credentials</li>
                  <li>• Save jobs and set up alerts for new opportunities</li>
                  <li>• Apply early to get better chances of consideration</li>
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

export default JobOpening;
