"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
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
  Eye,
  EyeOff,
  UserCheck,
  GraduationCap,
  Lock,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getIndustryMembers,
  addIndustryMember,
  updateIndustryMember,
  removeIndustryMember,
  toggleMemberStatus,
  getMasterData,
  createDesignation,
  MemberQuotaInfo,
  IndustryMember,
} from "@/services/industry.services";
import { toast } from "sonner";

interface MemberFormData {
  row_id: number | string | null;
  salutation: string;
  first_name: string;
  last_name: string;
  designation: string;
  email: string;
  contact_no: string;
  member_type: string;
  password?: string;
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
  password: "",
};

const SALUTATIONS = ["Mr", "Ms", "Mrs", "Dr", "Prof"];
const MEMBER_TYPES = ["Member", "Instructor"] as const;

export default function MentorMembersTabContent() {
  const { currentUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mentorEmail = (
    currentUser ||
    (typeof window !== "undefined"
      ? localStorage.getItem("user") || localStorage.getItem("userEmail") || ""
      : "")
  )
    .trim()
    .toLowerCase();

  const [members, setMembers] = useState<IndustryMember[]>([]);
  const [quota, setQuota] = useState<MemberQuotaInfo | null>(null);
  const [togglingEmail, setTogglingEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggedInMemberType, setLoggedInMemberType] = useState<string>("Owner");

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");

  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MemberFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Delete State
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<IndustryMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Clipboard copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Designation dropdown states
  const [designations, setDesignations] = useState<string[]>([]);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [designationDropdownOpen, setDesignationDropdownOpen] = useState(false);
  const [designationSearch, setDesignationSearch] = useState("");
  const designationDropdownRef = useRef<HTMLDivElement>(null);

  const canManage =
    loggedInMemberType.toLowerCase() === "owner" ||
    loggedInMemberType.toLowerCase() === "admin";

  const fetchMembers = async (isManual = false) => {
    if (!mentorEmail) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const res: any = await getIndustryMembers(mentorEmail, "Mentor");
      const apiResponse = res?.message || res?.data || res;
      const rawMembers = Array.isArray(apiResponse?.data)
        ? apiResponse.data
        : Array.isArray(apiResponse)
        ? apiResponse
        : [];

      setMembers(rawMembers);

      if (apiResponse?.quota) {
        setQuota(apiResponse.quota);
      }

      if (apiResponse?.logged_in_member_type) {
        setLoggedInMemberType(apiResponse.logged_in_member_type);
      } else {
        const found = rawMembers.find(
          (m: IndustryMember) =>
            (m.member_user || m.email || m.user || "").toLowerCase().trim() === mentorEmail
        );
        if (found?.member_type) {
          setLoggedInMemberType(found.member_type);
        }
      }
    } catch (err: any) {
      console.error("Failed to load mentor members:", err);
      toast.error(err?.message || "Failed to load team members");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    loadDesignations();
  }, [mentorEmail]);

  const loadDesignations = async () => {
    try {
      setLoadingDesignations(true);
      const res = await getMasterData("Designation", { page: 1 });
      const items = res?.data || res?.message || [];
      const names = items
        .map((it: any) => (typeof it === "string" ? it : it?.name))
        .filter(Boolean);
      setDesignations(names.sort((a: string, b: string) => a.localeCompare(b)));
    } catch {
      // ignore fallback
    } finally {
      setLoadingDesignations(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleStatus = async (member: IndustryMember) => {
    const email = member.member_user || member.email || member.user || "";
    if (!email || member.is_owner || (member.member_type || "").toLowerCase() === "owner") return;

    const currentActive = member.is_active ?? member.enabled === 1;
    const targetStatus = !currentActive;

    if (targetStatus && quota && quota.max_users > 0 && quota.is_locked) {
      toast.error(
        `Plan limit reached (${quota.active_users}/${quota.max_users}). Deactivate an active member first, or upgrade your plan.`
      );
      return;
    }

    try {
      setTogglingEmail(email);
      const res = await toggleMemberStatus({
        user_type: "Mentor",
        name: mentorEmail,
        member_email: email,
        row_id: member.row_id,
        target_status: targetStatus,
      });

      const isNowActive = res?.is_active ?? targetStatus;

      setMembers((prev) =>
        prev.map((m) => {
          const mEmail = m.member_user || m.email || m.user || "";
          if (mEmail.toLowerCase() === email.toLowerCase()) {
            return { ...m, is_active: isNowActive, enabled: isNowActive ? 1 : 0 };
          }
          return m;
        })
      );

      setQuota((prev) => {
        if (!prev || prev.max_users <= 0) return prev;
        const newCount = isNowActive ? prev.active_users + 1 : Math.max(0, prev.active_users - 1);
        const isLocked = newCount >= prev.max_users;
        return {
          ...prev,
          active_users: newCount,
          remaining_users: Math.max(0, prev.max_users - newCount),
          can_add_more: !isLocked,
          is_locked: isLocked,
        };
      });

      toast.success(
        isNowActive
          ? `Member ${email} activated successfully.`
          : `Member ${email} deactivated. 1 quota slot freed up.`
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update member status";
      toast.error(typeof msg === "string" ? msg.replace(/<[^>]*>?/gm, "") : "Failed to toggle status");
      fetchMembers(true);
    } finally {
      setTogglingEmail(null);
    }
  };

  const openAddModal = () => {
    setFormData({ ...INITIAL_FORM });
    setDesignationSearch("");
    setDesignationDropdownOpen(false);
    setShowPassword(false);
    setIsEditing(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: IndustryMember) => {
    if ((member.member_type || "").toLowerCase() === "owner") return;
    setFormData({
      row_id: member.row_id ?? null,
      salutation: member.salutation || "Mr",
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      designation: member.designation || "",
      email: member.member_user || member.email || member.user || "",
      contact_no: member.contact_no || "",
      member_type: member.member_type || "Member",
      password: "",
    });
    setDesignationSearch(member.designation || "");
    setDesignationDropdownOpen(false);
    setShowPassword(false);
    setIsEditing(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.email || !formData.designation) {
      setFormError("Please fill in all required fields (First Name, Email, Designation)");
      toast.error("Please fill in all required fields (First Name, Email, Designation)");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      if (isEditing) {
        await updateIndustryMember({
          user_type: "Mentor",
          name: mentorEmail,
          row_id: formData.row_id,
          member_user: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name || null,
          salutation: formData.salutation,
          designation: formData.designation,
          contact_no: formData.contact_no,
          member_type: formData.member_type,
          password: formData.password || null,
        });
        toast.success("Team member updated successfully");
      } else {
        await addIndustryMember({
          user_type: "Mentor",
          name: mentorEmail,
          member_user: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name || null,
          salutation: formData.salutation,
          designation: formData.designation,
          contact_no: formData.contact_no,
          member_type: formData.member_type,
          password: formData.password || null,
        });
        toast.success("Team member added successfully");
      }
      setIsModalOpen(false);
      setFormData(INITIAL_FORM);
      fetchMembers(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Operation failed";
      setFormError(typeof msg === "string" ? msg.replace(/<[^>]*>?/gm, "") : "Failed to save member");
      toast.error(typeof msg === "string" ? msg.replace(/<[^>]*>?/gm, "") : "Failed to save member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteConfirmMember?.row_id) return;
    try {
      setDeleting(true);
      await removeIndustryMember({
        user_type: "Mentor",
        name: mentorEmail,
        row_id: deleteConfirmMember.row_id,
        member_user: deleteConfirmMember.email || deleteConfirmMember.member_user,
      });
      toast.success("Member removed successfully");
      setDeleteConfirmMember(null);
      fetchMembers(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove member");
    } finally {
      setDeleting(false);
    }
  };

  // Counts summary
  const counts = useMemo(() => {
    const total = members.length;
    const owners = members.filter((m) => (m.member_type || "").toLowerCase() === "owner").length;
    const instructors = members.filter((m) => (m.member_type || "").toLowerCase() === "instructor").length;
    const regular = members.filter((m) => (m.member_type || "").toLowerCase() === "member").length;
    return { total, owners, instructors, regular };
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const name = `${m.first_name || ""} ${m.last_name || ""}`.toLowerCase();
      const email = (m.email || m.member_user || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || name.includes(q) || email.includes(q);
      const role = (m.member_type || "Member").toLowerCase();
      const matchRole =
        selectedRoleFilter === "All" || role === selectedRoleFilter.toLowerCase();
      return matchSearch && matchRole;
    });
  }, [members, searchQuery, selectedRoleFilter]);

  const getRoleBadgeStyle = (type: string = "Member") => {
    switch (type.toLowerCase()) {
      case "owner":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200/80",
          icon: <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />,
        };
      case "instructor":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
          icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />,
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <UserCheck className="w-3.5 h-3.5 text-slate-500" />,
        };
    }
  };

  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-emerald-500 to-teal-600",
      "from-teal-500 to-cyan-600",
      "from-cyan-500 to-blue-600",
      "from-green-500 to-emerald-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              Mentor Team Workspace
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              Role: <strong className="font-bold text-slate-900">{loggedInMemberType}</strong>
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Mentor Team &amp; Assistants
          </h2>
          <p className="text-slate-500 text-sm mt-0.5 max-w-2xl leading-relaxed">
            Manage your mentorship team, teaching assistants, and co-instructors. Authorized team members can host sessions, interact with mentees, and manage course offerings.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => fetchMembers(true)}
            disabled={refreshing || loading}
            title="Refresh members list"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
          </button>
          {canManage && (
            <button
              onClick={() => {
                if (quota && quota.max_users > 0 && quota.is_locked) {
                  toast.error(
                    `Plan Member Limit Reached! Your plan allows max ${quota.max_users} active members. Upgrade your plan or deactivate an existing member first.`
                  );
                  return;
                }
                openAddModal();
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm transition-all cursor-pointer ${
                quota?.is_locked
                  ? "bg-slate-400 hover:bg-slate-500 shadow-slate-400/20"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95"
              }`}
              title={quota?.is_locked ? "Plan limit reached. Deactivate a member or upgrade." : "Add Member"}
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Summary Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Members</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.total}</p>
          <span className="text-xs text-slate-400 font-medium">
            {counts.owners > 0 ? `${counts.owners} Primary Mentor · ` : ""}Team enrolled
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Instructors</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.instructors}</p>
          <span className="text-xs text-slate-400 font-medium">Co-instructors &amp; trainers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Members</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.regular}</p>
          <span className="text-xs text-slate-400 font-medium">Teaching assistants &amp; staff</span>
        </div>
      </div>

      {/* ── Plan Member Quota Banner ── */}
      {quota && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/40 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                quota.is_locked ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900">
                  {quota.active_package || "Mentor Plan"}
                </p>
                {quota.is_locked && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Quota Full
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {quota.max_users > 0
                  ? `${quota.active_users} of ${quota.max_users} active member slots used`
                  : `${quota.active_users} active members (Unlimited quota)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {quota.max_users > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      quota.is_locked ? "bg-amber-500" : "bg-emerald-600"
                    }`}
                    style={{
                      width: `${Math.min(100, (quota.active_users / quota.max_users) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  {quota.active_users}/{quota.max_users}
                </span>
              </div>
            )}

            {quota.is_locked && (
              <a
                href="/partner/billing"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 ml-1"
              >
                Upgrade Plan
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Search Bar & Filter ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {["All", "Instructor", "Member", ...(counts.owners > 0 ? ["Owner"] : [])].map((role) => {
            const count =
              role === "All"
                ? counts.total
                : role === "Owner"
                ? counts.owners
                : role === "Instructor"
                ? counts.instructors
                : counts.regular;

            const isActive = selectedRoleFilter.toLowerCase() === role.toLowerCase();
            return (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
                }`}
              >
                <span>{role === "All" ? "All Roles" : role}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-700"
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
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading team members...</p>
          <p className="text-xs text-slate-400 mt-1">Fetching verified team credentials</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {searchQuery || selectedRoleFilter !== "All" ? "No matching members found" : "No team members yet"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {searchQuery || selectedRoleFilter !== "All"
              ? "Try adjusting your search query or role filter to find team members."
              : "Add teaching assistants or co-instructors to help manage your mentoring sessions and courses."}
          </p>
          {canManage && !searchQuery && selectedRoleFilter === "All" && (
            <button
              onClick={() => {
                if (quota && quota.max_users > 0 && quota.is_locked) {
                  toast.error(
                    `Plan Member Limit Reached! Your plan allows max ${quota.max_users} active members. Upgrade your plan or deactivate an existing member first.`
                  );
                  return;
                }
                openAddModal();
              }}
              className={`mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition shadow-xs cursor-pointer ${
                quota?.is_locked ? "bg-slate-400 hover:bg-slate-500" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
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
                  <th className="py-3.5 px-6">Member / Assistant</th>
                  <th className="py-3.5 px-6">Designation</th>
                  <th className="py-3.5 px-6">Contact &amp; Email</th>
                  <th className="py-3.5 px-6">Role &amp; Access</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredMembers.map((member, idx) => {
                  const isOwner = (member.member_type || "").toLowerCase() === "owner" || member.is_owner;
                  const fullName = `${member.salutation ? member.salutation + " " : ""}${member.first_name || ""} ${member.last_name || ""}`.trim();
                  const userEmail = member.member_user || member.email || member.user || "";
                  const roleBadge = getRoleBadgeStyle(member.member_type || "Member");

                  return (
                    <tr key={member.row_id ?? idx} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                              fullName || userEmail
                            )} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
                          >
                            {fullName ? fullName[0]?.toUpperCase() : userEmail[0]?.toUpperCase()}
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
                          <span className="truncate max-w-[180px]">{member.designation || "Teaching Assistant"}</span>
                        </div>
                      </td>

                      {/* Contact & Email */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a
                              href={`mailto:${userEmail}`}
                              className="hover:text-emerald-600 hover:underline truncate max-w-[200px]"
                            >
                              {userEmail}
                            </a>
                            <button
                              onClick={() => handleCopy(userEmail, `email-${idx}`)}
                              className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                              title="Copy email"
                            >
                              {copiedKey === `email-${idx}` ? (
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

                      {/* Status & Toggle */}
                      <td className="py-4 px-6">
                        {isOwner ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Always Active
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={!canManage || togglingEmail === userEmail}
                              onClick={() => handleToggleStatus(member)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                                member.is_active ?? member.enabled === 1 ? "bg-emerald-600" : "bg-slate-300"
                              }`}
                              title={
                                member.is_active ?? member.enabled === 1
                                  ? "Click to deactivate member"
                                  : "Click to activate member"
                              }
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  member.is_active ?? member.enabled === 1 ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>

                            {togglingEmail === userEmail ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                            ) : (
                              <span
                                className={`text-xs font-semibold ${
                                  member.is_active ?? member.enabled === 1
                                    ? "text-emerald-700 font-medium"
                                    : "text-slate-500 font-medium"
                                }`}
                              >
                                {member.is_active ?? member.enabled === 1 ? "Active" : "Inactive"}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canManage && (
                            <button
                              onClick={() => openEditModal(member)}
                              disabled={isOwner}
                              className={`p-1.5 rounded-lg border transition-all shadow-2xs ${
                                isOwner
                                  ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer"
                              }`}
                              title={isOwner ? "Mentor Owner cannot be edited here" : "Edit member details"}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {canManage && (
                            <button
                              onClick={() => setDeleteConfirmMember(member)}
                              disabled={isOwner}
                              className={`p-1.5 rounded-lg border transition-all shadow-2xs ${
                                isOwner
                                  ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                                  : "border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-500 hover:text-red-600 cursor-pointer"
                              }`}
                              title={isOwner ? "Mentor Owner cannot be removed" : "Remove member"}
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

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
            {filteredMembers.map((member, idx) => {
              const isOwner = (member.member_type || "").toLowerCase() === "owner" || member.is_owner;
              const fullName = `${member.salutation ? member.salutation + " " : ""}${member.first_name || ""} ${member.last_name || ""}`.trim();
              const userEmail = member.member_user || member.email || member.user || "";
              const roleBadge = getRoleBadgeStyle(member.member_type || "Member");

              return (
                <div
                  key={member.row_id ?? idx}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                          fullName || userEmail
                        )} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
                      >
                        {fullName ? fullName[0]?.toUpperCase() : userEmail[0]?.toUpperCase()}
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
                      <span className="font-semibold text-slate-800">{member.designation || "Teaching Assistant"}</span>
                    </div>
                    {member.contact_no && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{member.contact_no}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    {isOwner ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Always Active
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!canManage || togglingEmail === userEmail}
                          onClick={() => handleToggleStatus(member)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out disabled:opacity-50 ${
                            member.is_active ?? member.enabled === 1 ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                              member.is_active ?? member.enabled === 1 ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-xs font-medium text-slate-600">
                          {member.is_active ?? member.enabled === 1 ? "Active" : "Inactive"}
                        </span>
                      </div>
                    )}
                  </div>

                  {canManage && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => openEditModal(member)}
                        disabled={isOwner}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${
                          isOwner
                            ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                        }`}
                        title={isOwner ? "Mentor Owner cannot be edited here" : "Edit member details"}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmMember(member)}
                        disabled={isOwner}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${
                          isOwner
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

      {/* ── Add / Edit Member Modal ── */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
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
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                        {isEditing ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {isEditing ? "Edit Team Member" : "Add Team Member"}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {isEditing
                            ? "Update assistant or co-instructor permissions"
                            : "Grant mentor workspace access to an assistant or instructor"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      disabled={submitting}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Form */}
                  <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {formError && (
                      <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Name Fields */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-3">
                          <select
                            value={formData.salutation}
                            onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                            className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all outline-none"
                          >
                            {SALUTATIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-5">
                          <input
                            type="text"
                            required
                            placeholder="First Name *"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Designation with Dropdown */}
                    <div className="relative" ref={designationDropdownRef}>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Designation / Role in Team <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Teaching Assistant, Co-Instructor, Coordinator"
                          value={formData.designation}
                          onChange={(e) => {
                            setFormData({ ...formData, designation: e.target.value });
                            setDesignationSearch(e.target.value);
                            setDesignationDropdownOpen(true);
                          }}
                          onFocus={() => setDesignationDropdownOpen(true)}
                          className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setDesignationDropdownOpen(!designationDropdownOpen)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {designationDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto p-1.5 space-y-0.5">
                          {loadingDesignations ? (
                            <div className="p-3 text-center text-xs text-slate-400">Loading designations...</div>
                          ) : (
                            designations
                              .filter((d) => d.toLowerCase().includes((designationSearch || "").toLowerCase()))
                              .slice(0, 8)
                              .map((desig) => (
                                <button
                                  key={desig}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, designation: desig });
                                    setDesignationDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition"
                                >
                                  {desig}
                                </button>
                              ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Email & Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            disabled={isEditing}
                            placeholder="assistant@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all outline-none placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Number</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.contact_no}
                            onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          {isEditing ? "Update Password (Optional)" : "Login Password"} {!isEditing && <span className="text-red-500">*</span>}
                        </label>
                        {isEditing && (
                          <span className="text-[11px] text-slate-400">Leave blank to keep existing password</span>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required={!isEditing}
                          placeholder={isEditing ? "Enter new password to update..." : "Enter temporary password (min 6 chars)"}
                          value={formData.password || ""}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Member Role Selection (Only Member & Instructor) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Access Role <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {MEMBER_TYPES.map((type) => {
                          const isSelected = formData.member_type.toLowerCase() === type.toLowerCase();
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFormData({ ...formData, member_type: type })}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? "bg-emerald-50/70 border-emerald-400 text-emerald-900 shadow-xs ring-2 ring-emerald-400/50"
                                  : "bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="font-bold text-xs">{type}</span>
                                <div className={isSelected ? "text-emerald-600" : "text-slate-400"}>
                                  {type === "Instructor" ? (
                                    <GraduationCap className="w-4 h-4" />
                                  ) : (
                                    <UserCheck className="w-4 h-4" />
                                  )}
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight">
                                {type === "Instructor"
                                  ? "Co-instructor — LMS studio, courses, sessions & teaching tools"
                                  : "Assistant / Staff — Access to sessions schedule & mentee requests"}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={submitting}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
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

      {/* ── Delete Confirmation Modal ── */}
      {mounted &&
        typeof document !== "undefined" &&
        deleteConfirmMember &&
        createPortal(
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Remove Team Member?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to remove{" "}
                  <strong>{deleteConfirmMember.first_name} ({deleteConfirmMember.email || deleteConfirmMember.member_user})</strong>{" "}
                  from your mentor workspace?
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteConfirmMember(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteMember}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Remove Member</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

