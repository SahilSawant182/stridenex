"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Send, Copy, Check, FileText, Sparkles, ShieldCheck, Zap,
  Loader2, Plus, X, ChevronDown, ChevronUp, FilePlus2, BadgeCheck,
  Calendar, DollarSign, Clock, Tag, Eye, RefreshCw, Edit2, Trash2
} from "lucide-react";
import { useIndustry } from "@/context/IndustryContext";
import {
  generateEmailTemplate,
  getInvitationTemplate,
  createOfferTemplate,
  getOfferTemplates,
  updateOfferTemplate,
  deleteOfferTemplate,
  OfferTemplatePayload,
} from "@/services/industry.services";

/* ─── types ─────────────────────────────────────────────── */
interface OfferTemplate {
  name?: string;
  template_name: string;
  template_code: string;
  link_ewqm: string;
  select_egwf: string;
  status: string;
  subject: string;
  salutation: string;
  body: string;
  compensation_type: string;
  compensation_amount: number;
  currency: string;
  duration: string;
  effective_from: string;
  effective_to: string;
}

const EMPTY_FORM: OfferTemplatePayload = {
  template_name: "",
  template_code: "",
  link_ewqm: "",
  select_egwf: "Internship",
  status: "Active",
  subject: "",
  salutation: "Dear ",
  body: "<p>We are pleased to offer you...</p>",
  compensation_type: "Stipend",
  compensation_amount: 0,
  currency: "INR",
  duration: "",
  effective_from: "",
  effective_to: "",
};

/* ─── small helpers ──────────────────────────────────────── */
const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
    {label}
  </span>
);

const statusColor = (s: string) =>
  s === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500";

/* ─── main component ─────────────────────────────────────── */
export default function SettingsTabContent() {
  const { industryData } = useIndustry();

  /* --- existing template states --- */
  const [activeTemplate, setActiveTemplate] = useState<{ type: string; content: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  /* --- offer letter states --- */
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<OfferTemplatePayload>({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [templates, setTemplates] = useState<OfferTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const companyName = industryData?.company_name ?? "";

  /* fetch templates on mount / company change */
  useEffect(() => {
    if (companyName) fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName]);

  const fetchTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const res = await getOfferTemplates(companyName);
      // Response shape: { message: { status, message, data: { offer_templates: [...] } } }
      const data =
        res?.message?.data?.offer_templates ??
        res?.data?.data?.offer_templates ??
        res?.data?.offer_templates ??
        res?.message?.data ??
        res?.message ??
        [];
      setTemplates(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setTemplatesLoading(false);
    }
  };

  /* --- existing handlers --- */
  const handleGenerateEmail = async () => {
    if (!companyName) { alert("Company name not found."); return; }
    try {
      setLoadingType("email");
      const res = await generateEmailTemplate(companyName);
      const data = res?.message || res?.data || res;
      if (data) {
        const content = data.subject ? `Subject: ${data.subject}\n\n${data.body}` : data.body;
        setActiveTemplate({ type: "Email Template", content });
      }
    } catch (err: any) {
      alert(err.message || "Failed to generate email template");
    } finally { setLoadingType(null); }
  };

  const handleGenerateInvitation = async () => {
    if (!companyName) { alert("Company name not found."); return; }
    try {
      setLoadingType("invitation");
      const res = await getInvitationTemplate(companyName);
      const data = res?.message || res?.data || res;
      if (data) setActiveTemplate({ type: "Invitation Template", content: data.body || "" });
    } catch (err: any) {
      alert(err.message || "Failed to generate invitation template");
    } finally { setLoadingType(null); }
  };

  const handleCopy = () => {
    if (activeTemplate) {
      navigator.clipboard.writeText(activeTemplate.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* --- offer letter form handlers --- */
  const set = (key: keyof OfferTemplatePayload, val: string | number) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) { alert("Company name not found."); return; }
    try {
      setSubmitting(true);
      const payload: any = { ...form, link_ewqm: companyName };
      if (editingId) {
        payload.name = editingId;
        await updateOfferTemplate(payload);
      } else {
        await createOfferTemplate(payload);
      }
      setForm({ ...EMPTY_FORM });
      setShowForm(false);
      setEditingId(null);
      await fetchTemplates();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (t: OfferTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setForm({
      template_name: t.template_name || "",
      template_code: t.template_code || "",
      link_ewqm: t.link_ewqm || "",
      select_egwf: t.select_egwf || "Internship",
      status: t.status || "Active",
      subject: t.subject || "",
      salutation: t.salutation || "",
      body: t.body || "",
      compensation_type: t.compensation_type || "Stipend",
      compensation_amount: t.compensation_amount || 0,
      currency: t.currency || "INR",
      duration: t.duration || "",
      effective_from: t.effective_from || "",
      effective_to: t.effective_to || "",
    });
    setEditingId(t.name || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (t: OfferTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!t.name) return;
    if (window.confirm(`Are you sure you want to delete the template "${t.template_name}"?`)) {
      try {
        await deleteOfferTemplate(t.name);
        await fetchTemplates();
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  /* ── render ── */
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recruitment Settings</h2>
        <p className="text-slate-500 text-sm font-medium">Manage outreach templates and offer letter templates.</p>
      </div>

      {/* ── outreach cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-orange-100 transition-colors">
            <Mail className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Professional Email</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">Generate a high-conversion follow-up email template personalized for your company outreach.</p>
          <button onClick={handleGenerateEmail} disabled={loadingType !== null}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-75 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95 cursor-pointer disabled:cursor-not-allowed">
            {loadingType === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loadingType === "email" ? "Generating..." : "Generate Email Template"}
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
            <Send className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Student Invitation</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">Get a concise, friendly invitation template perfect for quick platform-based student invites.</p>
          <button onClick={handleGenerateInvitation} disabled={loadingType !== null}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 active:scale-95 cursor-pointer disabled:cursor-not-allowed">
            {loadingType === "invitation" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loadingType === "invitation" ? "Generating..." : "Get Invitation Template"}
          </button>
        </motion.div>
      </div>

      {/* preview panel */}
      <AnimatePresence>
        {activeTemplate && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="font-bold text-slate-800 uppercase tracking-widest text-xs">{activeTemplate.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 text-xs font-bold">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={() => setActiveTemplate(null)} className="p-2.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">✕</button>
              </div>
            </div>
            <div className="p-8">
              <pre className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 p-6 rounded-xl border border-slate-100 italic">{activeTemplate.content}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          OFFER LETTER TEMPLATES SECTION
      ══════════════════════════════════════════════════ */}
      <div className="space-y-5">
        {/* section header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FilePlus2 className="w-5 h-5 text-violet-500" /> Custom Offer Letter Templates
            </h3>
            <p className="text-slate-500 text-sm mt-0.5">Create reusable offer letter templates that appear customised to each candidate.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchTemplates} disabled={templatesLoading}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-all disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${templatesLoading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => {
                const nextState = !showForm;
                setShowForm(nextState);
                if (!nextState) {
                  setEditingId(null);
                  setForm({ ...EMPTY_FORM });
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-violet-500/20 active:scale-95">
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Cancel" : "New Template"}
            </button>
          </div>
        </div>

        {/* ── create form ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-violet-100 rounded-2xl shadow-lg shadow-violet-500/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-indigo-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <FilePlus2 className="w-4 h-4 text-violet-600" />
                </div>
                <span className="font-bold text-slate-800">{editingId ? "Edit Offer Letter Template" : "New Offer Letter Template"}</span>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Template Name *">
                    <input required value={form.template_name} onChange={e => set("template_name", e.target.value)}
                      placeholder="e.g. Software Intern Offer" className={inputCls} />
                  </Field>
                  <Field label="Template Code *">
                    <input required value={form.template_code} onChange={e => set("template_code", e.target.value)}
                      placeholder="e.g. IND-INT-01" className={inputCls} />
                  </Field>
                </div>

                {/* row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Opportunity Type">
                    <select value={form.select_egwf} onChange={e => set("select_egwf", e.target.value)} className={inputCls}>
                      <option>Internship</option>
                      <option>Project</option>
                      <option>Job</option>
                    </select>
                  </Field>
                  <Field label="Status">
                    <select value={form.status} onChange={e => set("status", e.target.value)} className={inputCls}>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Draft</option>
                    </select>
                  </Field>
                </div>

                {/* row 3 */}
                <Field label="Email Subject *">
                  <input required value={form.subject} onChange={e => set("subject", e.target.value)}
                    placeholder="e.g. Internship Offer Letter" className={inputCls} />
                </Field>

                <Field label="Salutation">
                  <input value={form.salutation} onChange={e => set("salutation", e.target.value)}
                    placeholder="Dear " className={inputCls} />
                </Field>

                {/* body */}
                <Field label="Letter Body (HTML supported)">
                  <textarea rows={6} value={form.body} onChange={e => set("body", e.target.value)}
                    placeholder="<p>We are pleased to offer you...</p>"
                    className={`${inputCls} resize-y font-mono text-xs`} />
                  <p className="text-xs text-slate-400 mt-1">You can use HTML tags for formatting.</p>
                </Field>

                {/* compensation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Compensation Type">
                    <select value={form.compensation_type} onChange={e => set("compensation_type", e.target.value)} className={inputCls}>
                      <option>Stipend</option>
                      <option>Salary</option>
                      <option>Honorarium</option>
                      <option>Unpaid</option>
                    </select>
                  </Field>
                  <Field label="Amount">
                    <input type="number" min={0} value={form.compensation_amount}
                      onChange={e => set("compensation_amount", Number(e.target.value))} className={inputCls} />
                  </Field>
                  <Field label="Currency">
                    <select value={form.currency} onChange={e => set("currency", e.target.value)} className={inputCls}>
                      <option>INR</option>
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </Field>
                </div>

                {/* duration & dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Duration">
                    <input value={form.duration} onChange={e => set("duration", e.target.value)}
                      placeholder="e.g. 6 Months" className={inputCls} />
                  </Field>
                  <Field label="Effective From">
                    <input type="date" value={form.effective_from} onChange={e => set("effective_from", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Effective To">
                    <input type="date" value={form.effective_to} onChange={e => set("effective_to", e.target.value)} className={inputCls} />
                  </Field>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white font-bold rounded-xl transition-all shadow-md shadow-violet-500/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
                    {submitting ? "Saving..." : editingId ? "Update Template" : "Save Template"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── templates list ── */}
        {templatesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            <span className="ml-3 text-slate-500 text-sm">Loading templates...</span>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
              <FilePlus2 className="w-7 h-7 text-violet-300" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">No offer letter templates yet</p>
            <p className="text-slate-400 text-sm">Click <span className="font-bold text-violet-600">New Template</span> above to create your first one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((t, i) => {
              const id = t.name ?? String(i);
              const isOpen = expandedId === id;
              return (
                <motion.div key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* card header */}
                  <button type="button" onClick={() => setExpandedId(isOpen ? null : id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-violet-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{t.template_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <Tag className="w-3 h-3" />{t.template_code}
                          <span className="text-slate-200">·</span>
                          <span>{t.select_egwf}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <button onClick={(e) => handleEdit(t, e)} title="Edit Template"
                        className="p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => handleDelete(t, e)} title="Delete Template"
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="h-4 w-px bg-slate-200 mx-1"></div>
                      <Badge label={t.status} color={statusColor(t.status)} />
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 ml-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />}
                    </div>
                  </button>

                  {/* expanded details */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                        className="overflow-hidden border-t border-slate-100">
                        <div className="px-5 py-5 space-y-4 bg-slate-50/40">
                          <p className="text-sm font-semibold text-slate-700">{t.subject}</p>
                          <p className="text-sm text-slate-500">{t.salutation}<em>Candidate Name</em></p>

                          {/* meta pills */}
                          <div className="flex flex-wrap gap-2">
                            <MetaPill icon={<DollarSign className="w-3.5 h-3.5" />} label={`${t.compensation_type}: ${t.currency} ${Number(t.compensation_amount).toLocaleString()}`} />
                            <MetaPill icon={<Clock className="w-3.5 h-3.5" />} label={t.duration || "—"} />
                            <MetaPill icon={<Calendar className="w-3.5 h-3.5" />} label={`${t.effective_from || "—"} → ${t.effective_to || "—"}`} />
                          </div>

                          {/* body preview */}
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" /> Body Preview
                            </p>
                            <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm text-slate-600 leading-relaxed max-h-48 overflow-y-auto"
                              dangerouslySetInnerHTML={{ __html: t.body }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── platform security banner ── */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold mb-2 tracking-tight">Automated Verification Enabled</h4>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Every template generated here follows Stridenex's quality guidelines. Your outreach is automatically verified to increase student response rates by up to 45%.
            </p>
          </div>
          <div className="px-6 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white/80">Secure Outreach</div>
        </div>
      </div>
    </div>
  );
}

/* ── tiny shared helpers ── */
const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all placeholder:text-slate-400";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function MetaPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600 font-medium">
        {icon}{label}
    </span>
  );
}
