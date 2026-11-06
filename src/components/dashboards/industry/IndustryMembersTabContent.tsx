"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Shield,
  ShieldCheck,
  Crown,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  X,
  Check,
  Copy,
  AlertCircle,
  Loader2,
  Building2,
  UserCheck,
  Filter,
  MoreVertical,
  Plus,
  Info,
  GraduationCap
} from "lucide-react";
import { useIndustry } from "@/context/IndustryContext";
import { useAuth } from "@/context/AuthContext";
import {
  getIndustryMembers,
  addIndustryMember,
  updateIndustryMember,
  removeIndustryMember,
  IndustryMember
} from "@/services/industry.services";
import { toast } from "sonner";

interface MemberFormData {
  row_id: number | null;
  salutation: string;
  first_name: string;
  last_name: string;
  designation: string;
  email: string;
  contact_no: string;
  member_type: string;
}

const INITIAL_FORM: MemberFormData = {
  row_id: null,
  salutation: "Mr",
  first_name: "",
  last_name: "",
  designation: "",
  email: "",
  contact_no: "",
  member_type: "Member",
};

const SALUTATIONS = ["Mr", "Ms", "Mrs", "Dr", "Prof"];
const MEMBER_TYPES = ["Admin", "Member", "Instructor"] as const;

export default function IndustryMembersTabContent() {
  const { industryData } = useIndustry();
  const { currentUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [members, setMembers] = useState<IndustryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggedInMemberType, setLoggedInMemberType] = useState<string>("Member");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MemberFormData>({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation modal states
  const [memberToDelete, setMemberToDelete] = useState<IndustryMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Copied state for email/contact
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const companyName = industryData?.company_name || "";

  const fetchMembers = async (isManualRefresh = false) => {
    if (!companyName) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const res: any = await getIndustryMembers(companyName, "Industry");
      const apiResponse = res?.message || res?.data || res;

      const rawMembers = Array.isArray(apiResponse?.data)
        ? apiResponse.data
        : Array.isArray(apiResponse)
          ? apiResponse
          : [];

      setMembers(rawMembers);

      if (apiResponse?.logged_in_member_type) {
        setLoggedInMemberType(apiResponse.logged_in_member_type);
      } else {
        // Fallback: check if currentUser is Owner
        const userEmail = (currentUser || "").toLowerCase().trim();
        const found = rawMembers.find(
          (m: IndustryMember) =>
            (m.member_user || m.email || m.user || "").toLowerCase().trim() === userEmail
        );
        if (found?.member_type) {
          setLoggedInMemberType(found.member_type);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch industry members:", err);
      toast.error(err?.message || "Failed to load team members");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [companyName, currentUser]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const openAddModal = () => {
    setFormData({ ...INITIAL_FORM });
    setIsEditing(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: IndustryMember) => {
    setFormData({
      row_id: member.row_id ?? null,
      salutation: member.salutation || "Mr",
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      designation: member.designation || "",
      email: member.member_user || member.email || member.user || "",
      contact_no: member.contact_no || "",
      member_type: member.member_type || "Member",
    });
    setIsEditing(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailTrimmed = formData.email.trim();
    const firstNameTrimmed = formData.first_name.trim();

    if (!firstNameTrimmed) {
      setFormError("First name is required.");
      return;
    }

    if (!emailTrimmed || !emailTrimmed.includes("@")) {
      setFormError("Please enter a valid work email address.");
      return;
    }

    if (!formData.designation.trim()) {
      setFormError("Designation is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        user_type: "Industry" as const,
        member_user: emailTrimmed,
        first_name: firstNameTrimmed,
        last_name: formData.last_name.trim() || null,
        salutation: formData.salutation || null,
        designation: formData.designation.trim(),
        contact_no: formData.contact_no.trim() || null,
        member_type: formData.member_type || "Member",
        name: companyName,
        ...(formData.row_id != null ? { row_id: formData.row_id } : {}),
      };

      if (isEditing) {
        await updateIndustryMember(payload);
      } else {
        await addIndustryMember(payload);
      }
      toast.success(
        isEditing
          ? `Updated member "${firstNameTrimmed}" successfully!`
          : `Member "${firstNameTrimmed}" added successfully!`
      );
      setIsModalOpen(false);
      await fetchMembers();
    } catch (err: any) {
      console.error("Error saving member:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to save member details.";
      setFormError(typeof msg === "string" ? msg : JSON.stringify(msg));
      toast.error(typeof msg === "string" ? msg : "Failed to save member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete || memberToDelete.row_id == null) {
      toast.error("Cannot remove member: missing row_id.");
      return;
    }
    setDeleting(true);
    try {
      const payload = {
        user_type: "Industry" as const,
        name: companyName,
        row_id: memberToDelete.row_id,
      };

      await removeIndustryMember(payload);
      toast.success(`Removed "${memberToDelete.first_name}" from the company.`);
      setMemberToDelete(null);
      await fetchMembers();
    } catch (err: any) {
      console.error("Failed to remove member:", err);
      toast.error(err?.message || "Failed to remove member.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered members calculation
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Role filter
      if (selectedRoleFilter !== "All") {
        const type = (member.member_type || "").toLowerCase();
        if (type !== selectedRoleFilter.toLowerCase()) return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const fullName = `${member.salutation || ""} ${member.first_name || ""} ${member.last_name || ""}`.toLowerCase();
      const email = (member.member_user || member.email || member.user || "").toLowerCase();
      const designation = (member.designation || "").toLowerCase();
      const phone = (member.contact_no || "").toLowerCase();

      return fullName.includes(q) || email.includes(q) || designation.includes(q) || phone.includes(q);
    });
  }, [members, searchQuery, selectedRoleFilter]);

  // Counts summary
  const counts = useMemo(() => {
    const total = members.length;
    const owners = members.filter((m) => (m.member_type || "").toLowerCase() === "owner").length;
    const admins = members.filter((m) => (m.member_type || "").toLowerCase() === "admin").length;
    const instructors = members.filter((m) => (m.member_type || "").toLowerCase() === "instructor").length;
    const regular = members.filter((m) => (m.member_type || "").toLowerCase() === "member").length;
    return { total, owners, admins, instructors, regular };
  }, [members]);

  const canManage = loggedInMemberType.toLowerCase() === "owner" || loggedInMemberType.toLowerCase() === "admin";

  const getInitials = (first?: string | null, last?: string | null) => {
    const f = (first || "").trim().charAt(0).toUpperCase();
    const l = (last || "").trim().charAt(0).toUpperCase();
    const fallback = (first || "").length > 1 ? (first || "").charAt(1).toUpperCase() : "";
    return (f || "U") + (l || fallback);
  };

  const getRoleBadgeStyle = (type: string = "Member") => {
    switch ((type || "").toLowerCase()) {
      case "owner":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200/80",
          icon: <Crown className="w-3.5 h-3.5 text-amber-600" />,
        };
      case "admin":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200/80",
          icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />,
        };
      case "instructor":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
          icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />,
        };
      default:
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200/80",
          icon: <UserCheck className="w-3.5 h-3.5 text-blue-600" />,
        };
    }
  };

  const getAvatarGradient = (name?: string | null) => {
    const gradients = [
      "from-blue-600 to-indigo-600",
      "from-purple-600 to-pink-600",
      "from-emerald-600 to-teal-600",
      "from-amber-600 to-orange-600",
      "from-cyan-600 to-blue-600",
      "from-rose-600 to-red-600",
    ];
    let hash = 0;
    const safeName = name || "User";
    for (let i = 0; i < safeName.length; i++) {
      hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Top Header & Stats ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              {companyName || "Company Workspace"}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              <Shield className="w-3 h-3 text-slate-500" />
              Your Role: <strong className="font-bold text-slate-900">{loggedInMemberType}</strong>
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Company Members & Employees
          </h2>
          <p className="text-slate-500 text-sm mt-0.5 max-w-2xl leading-relaxed">
            Manage your company&apos;s team, hiring staff, and recruiters. Authorized members have access to review student applications, post jobs, and coordinate interviews.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => fetchMembers(true)}
            disabled={refreshing || loading}
            title="Refresh members list"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-purple-600" : ""}`} />
          </button>
          {canManage && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-sm shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Summary Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Members</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.total}</p>
          <span className="text-xs text-slate-400 font-medium">
            {counts.owners > 0 ? `${counts.owners} Primary Owner · ` : ""}Enrolled team
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Admins</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.admins}</p>
          <span className="text-xs text-slate-400 font-medium">Main administrators</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Instructors</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.instructors}</p>
          <span className="text-xs text-slate-400 font-medium">LMS trainers & educators</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Members</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.regular}</p>
          <span className="text-xs text-slate-400 font-medium">General staff & recruiters</span>
        </div>
      </div>

      {/* ── Search and Filter Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, designation or phone..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {["All", "Admin", "Instructor", "Member", ...(counts.owners > 0 ? ["Owner"] : [])].map((role) => {
            const count =
              role === "All"
                ? counts.total
                : role === "Owner"
                  ? counts.owners
                  : role === "Admin"
                    ? counts.admins
                    : role === "Instructor"
                      ? counts.instructors
                      : counts.regular;

            const isActive = selectedRoleFilter.toLowerCase() === role.toLowerCase();
            return (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
                  }`}
              >
                <span>{role === "All" ? "All Roles" : role}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-700"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Members List / Table ── */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading company members...</p>
          <p className="text-xs text-slate-400 mt-1">Fetching verified team credentials</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {searchQuery || selectedRoleFilter !== "All" ? "No matching members found" : "No team members yet"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {searchQuery || selectedRoleFilter !== "All"
              ? "Try adjusting your search query or role filter to find team members."
              : "Start by adding recruiters, HR specialists, or technical leads to help manage your hiring pipeline."}
          </p>
          {canManage && !searchQuery && selectedRoleFilter === "All" && (
            <button
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add First Member</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3.5 px-6">Member / Employee</th>
                  <th className="py-3.5 px-6">Designation</th>
                  <th className="py-3.5 px-6">Contact & Email</th>
                  <th className="py-3.5 px-6">Role & Access</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredMembers.map((member, index) => {
                  const isOwner = (member.member_type || "").toLowerCase() === "owner";
                  const fullName = `${member.salutation ? member.salutation + " " : ""}${member.first_name || ""} ${member.last_name || ""
                    }`.trim();
                  const roleBadge = getRoleBadgeStyle(member.member_type || "Member");
                  const userEmail = member.member_user || member.email || member.user || "";

                  return (
                    <tr
                      key={member.row_id ?? index}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                              fullName || userEmail
                            )} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
                          >
                            {getInitials(member.first_name, member.last_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                              {fullName || userEmail}
                              {isOwner && (
                                <span title="Account Owner" className="text-amber-500 inline-block">
                                  <Crown className="w-3.5 h-3.5 fill-amber-500" />
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400 font-mono truncate">{userEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Designation */}
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[180px]">{member.designation || "Staff Member"}</span>
                        </div>
                      </td>

                      {/* Contact & Email */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a
                              href={`mailto:${userEmail}`}
                              className="hover:text-purple-600 hover:underline truncate max-w-[200px]"
                            >
                              {userEmail}
                            </a>
                            <button
                              onClick={() => handleCopy(userEmail, `email-${index}`)}
                              className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                              title="Copy email"
                            >
                              {copiedKey === `email-${index}` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {member.contact_no ? (
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{member.contact_no}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No phone provided</span>
                          )}
                        </div>
                      </td>

                      {/* Role & Access */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleBadge.bg}`}
                        >
                          {roleBadge.icon}
                          <span>{member.member_type || "Member"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canManage && (
                            <button
                              onClick={() => openEditModal(member)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
                              title="Edit member details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {canManage && (
                            <button
                              onClick={() => setMemberToDelete(member)}
                              disabled={isOwner}
                              className={`p-1.5 rounded-lg border transition-all shadow-2xs ${isOwner
                                ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                                : "border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-500 hover:text-red-600 cursor-pointer"
                                }`}
                              title={isOwner ? "Company Owner cannot be removed" : "Remove member"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
            {filteredMembers.map((member, index) => {
              const isOwner = (member.member_type || "").toLowerCase() === "owner";
              const fullName = `${member.salutation ? member.salutation + " " : ""}${member.first_name || ""} ${member.last_name || ""
                }`.trim();
              const roleBadge = getRoleBadgeStyle(member.member_type || "Member");
              const userEmail = member.member_user || member.email || member.user || "";

              return (
                <div
                  key={member.row_id ?? index}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                          fullName || userEmail
                        )} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
                      >
                        {getInitials(member.first_name, member.last_name)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                          {fullName || userEmail}
                          {isOwner && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono truncate">{userEmail}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${roleBadge.bg}`}
                    >
                      {roleBadge.icon}
                      <span>{member.member_type || "Member"}</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-600 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{member.designation || "Staff Member"}</span>
                    </div>
                    {member.contact_no && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{member.contact_no}</span>
                      </div>
                    )}
                  </div>

                  {canManage && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => openEditModal(member)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setMemberToDelete(member)}
                        disabled={isOwner}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${isOwner
                          ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-red-600 cursor-pointer"
                          }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Add / Edit Member Modal (Portaled directly to body for true full-screen overlay) ── */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => !submitting && setIsModalOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100 max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 via-indigo-50 to-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
                      {isEditing ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {isEditing ? "Edit Team Member" : "Add Team Member"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isEditing
                          ? "Update details and access permissions for this member"
                          : "Grant dashboard access to an employee or recruiter"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4">
                  {formError && (
                    <div className="p-3.5 bg-red-50 border border-red-200/80 rounded-xl text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Name row */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Title</label>
                      <select
                        value={formData.salutation}
                        onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all outline-none"
                      >
                        {SALUTATIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}.
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-5">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Radhika"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Patil"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Email input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="email"
                        placeholder="employee@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      This email is used to log in and receive notifications.
                    </p>
                  </div>

                  {/* Designation & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="text"
                          placeholder="e.g. Lead HR / Tech Recruiter"
                          value={formData.designation}
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          placeholder="+91-9876543210"
                          value={formData.contact_no}
                          onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Member Role selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Access Role <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {MEMBER_TYPES.map((type) => {
                        const isSelected = formData.member_type.toLowerCase() === type.toLowerCase();
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, member_type: type })}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${isSelected
                              ? "bg-purple-50/70 border-purple-400 text-purple-900 shadow-xs ring-2 ring-purple-400/50"
                              : "bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700"
                              }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="font-bold text-xs">{type}</span>
                              <div className={isSelected ? "text-purple-600" : "text-slate-400"}>
                                {type === "Admin" ? (
                                  <ShieldCheck className="w-4 h-4" />
                                ) : type === "Instructor" ? (
                                  <GraduationCap className="w-4 h-4" />
                                ) : (
                                  <UserCheck className="w-4 h-4" />
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              {type === "Admin"
                                ? "Main user — Full access to manage team, settings & organization"
                                : type === "Instructor"
                                  ? "Trainer & educator — LMS studio, courses, sessions & tasks"
                                  : "Standard member — Access to jobs, candidate pipeline & dashboard"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={submitting}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>{isEditing ? "Save Changes" : "Add Member"}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Remove Member Confirmation Dialog (Portaled directly to body) ── */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {memberToDelete && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => !deleting && setMemberToDelete(null)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative z-10 border border-slate-100 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Remove Team Member?</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Are you sure you want to remove{" "}
                  <strong className="text-slate-800">
                    {memberToDelete.salutation ? `${memberToDelete.salutation} ` : ""}
                    {memberToDelete.first_name} {memberToDelete.last_name || ""}
                  </strong>{" "}
                  ({memberToDelete.member_user || memberToDelete.email || memberToDelete.user}) from your company?
                </p>
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 text-left flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    This user will immediately lose access to your company dashboard, job posts, and candidate profiles.
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMemberToDelete(null)}
                    disabled={deleting}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteMember}
                    disabled={deleting}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition flex-1 disabled:opacity-50 cursor-pointer"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    <span>{deleting ? "Removing..." : "Yes, Remove"}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

