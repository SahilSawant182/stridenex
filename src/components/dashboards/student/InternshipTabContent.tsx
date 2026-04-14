"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

import { 
  Briefcase, 
  Send, 
  CheckCircle2, 
  Calendar,

  MapPin, 
  Clock, 
  IndianRupee,
  Loader2
} from "lucide-react";
import StatsWidget from "@/components/dashboards/widgets/StatsWidget";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStudentInternshipList, createStudentApplication } from "@/services/student.services";
import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/components/ui/use-toast"; // use-toast not available


const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};


export default function InternshipTabContent() {
  const { currentUser } = useAuth();
  // const { toast } = useToast();
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [successfullyApplied, setSuccessfullyApplied] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);



  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await getStudentInternshipList();
      const internshipData = response?.message?.data || response?.data || response || [];
      setInternships(Array.isArray(internshipData) ? internshipData : []);
    } catch (err) {
      console.error("Error fetching internships:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internship: any) => {
    if (!currentUser) {
      alert("Authentication Required: Please log in to apply for internships.");
      return;
    }


    try {
      setApplying(internship.name);
      const payload = {
        student: currentUser,
        internship: internship.name,
        industry: internship.industry,
        status: "Applied",
        applied_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
        match_score: 100.0,
      };

      const response = await createStudentApplication(payload);

      if (response && (response.status === 200 || response.status === "200")) {
        setSuccessfullyApplied(prev => [...prev, internship.name]);
        setFeedback({
          type: 'success',
          message: `Application sent successfully for ${internship.role_name || internship.title || 'the internship'}!`
        });
      } else {
        // Handle non-200 responses (e.g., 409 Conflict)
        setFeedback({
          type: 'error',
          message: response?.message || "Something went wrong. Please try again."
        });
      }
      
      setTimeout(() => setFeedback(null), 5000);

    } catch (err: any) {
      console.error("Application error:", err);
      setFeedback({
        type: 'error',
        message: err?.message || "Something went wrong. Please try again."
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setApplying(null);
    }

  };

  // Stats data - Keep static for now or potentially fetch from a 'get_stats' API if available
  const statsData = [
    {
      id: 1,
      title: "APPLIED",
      value: "0",
      icon: Send,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: 2,
      title: "SHORTLISTED",
      value: "0",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      id: 3,
      title: "INTERVIEW SCHEDULED",
      value: "0",
      icon: Calendar,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: 4,
      title: "MATCHING OPENINGS",
      value: internships.length.toString(),
      icon: Briefcase,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  if (loading && internships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-medium">Fetching best internship opportunities...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {feedback && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          } text-sm font-medium mb-4 flex items-center justify-between`}
        >
          {feedback.message}
          <button onClick={() => setFeedback(null)} className="ml-4 opacity-50 hover:opacity-100">×</button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <StatsWidget
            key={stat.id}
            title={stat.title}
            data={{
              value: stat.value,
              icon: stat.icon,
              iconBg: stat.iconBg,
              iconColor: stat.iconColor
            }}
          />
        ))}
      </motion.div>

      {/* Internships Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {internships.map((internship, idx) => (
          <BaseCard key={internship.name || idx} padding="none" className="overflow-hidden border-slate-200 hover:shadow-lg transition-all group">
            <div className="p-5">
              {/* Header with Logo and Match */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg font-bold text-orange-600 group-hover:scale-105 transition-transform shadow-sm`}>
                    {(internship.role_name || internship.title || "I")[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{internship.role_name || internship.title || "Internship Role"}</h3>
                    <p className="text-xs text-slate-500 font-medium">{internship.industry || "Industry Partner"}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`text-lg font-bold text-emerald-600`}>
                    {internship.match_score || 100}%
                  </div>
                  <Badge className={`${
                    internship.status?.toLowerCase() === "closed"
                      ? "bg-red-50 text-red-600 border-red-100" 
                      : internship.status?.toLowerCase() === "active" || internship.status?.toLowerCase() === "open" || !internship.status
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-indigo-50 text-indigo-600 border-indigo-100"
                  } rounded-full text-[9px] px-2 py-0.5 font-bold`}>
                    {internship.status || "Active"}
                  </Badge>


                </div>
              </div>


              {/* Details */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1 text-[10px] font-bold">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {internship.location || "Remote"}
                </Badge>
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1 text-[10px] font-bold">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {internship.duration || "3 Months"}
                </Badge>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-[10px] font-bold">
                  <IndianRupee className="w-3 h-3" />
                  {internship.stipend || "Best in Industry"}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleApply(internship)}
                  disabled={applying === internship.name || internship.status?.toLowerCase() === "closed"}
                  className={`flex-1 ${
                    internship.status?.toLowerCase() === "closed"
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/10 active:scale-95"
                  } font-bold rounded-xl h-10 transition-all`}
                >


                  {applying === internship.name ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : successfullyApplied.includes(internship.name) ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  ) : null}
                  {successfullyApplied.includes(internship.name) ? "Applied" : "Apply Now"}
                </Button>

                <Button variant="outline" className="px-4 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-10 font-bold text-xs">
                  Details
                </Button>
              </div>
            </div>
          </BaseCard>
        ))}
      </motion.div>

      {internships.length === 0 && !loading && (
        <div className="py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-3xl">
          <Briefcase className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Openings Found</h3>
          <p className="text-sm text-slate-500 max-w-xs text-center mt-2">
            We couldn't find any internships matching your profile right now. Check back later!
          </p>
        </div>
      )}
    </motion.div>
  );
}