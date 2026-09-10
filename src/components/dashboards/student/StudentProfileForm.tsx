"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, Mail, Phone, Building2, GraduationCap, Layers, Shield, Calendar, Target, Linkedin, Github, Award } from "lucide-react";
import { DashboardDynamicForm } from "@/components/dashboards/shared/DashboardDynamicForm";
import { DynamicField } from "@/components/dashboards/shared/DashboardDynamicModal";
import MarksheetUploader from "@/components/profile/MarksheetUploader";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import { getStudentByEmail, updateStudent } from "@/services/student.services";
import { uploadFileApi } from "@/services/api.services";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

export default function StudentProfileForm() {
  const { showToast } = useToast();
  const { userImage, updateUserImage } = useAuth();
  const [currentUser, setCurrentUser] = useState<string>("");
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [studentFormState, setStudentFormState] = useState({
    stream: "",
    course_type: "",
    course: "",
    department: ""
  });
  const [studentDepartmentOptions, setStudentDepartmentOptions] = useState<any[]>([]);

  useEffect(() => {
    const email = typeof window !== "undefined" ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail")) : "";
    if (email) {
      setCurrentUser(email);
      fetchStudentData(email);
    }
  }, []);

  const fetchStudentData = async (email: string) => {
    setLoading(true);
    try {
      const res = await getStudentByEmail(email);
      const data = res?.data || res?.message?.data || res?.message;
      if (data) {
        data.course_type = data.course_type || data.courses_type;
        setStudentData(data);
        setStudentFormState({
          stream: data.stream || "",
          course_type: data.course_type || "",
          course: data.course || "",
          department: data.department || ""
        });
      }
    } catch (err) {
      console.error("Failed to fetch student data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData: any) => {
    if (!currentUser) return;
    setSubmitLoading(true);
    setError(null);
    try {
      let marksheetUrl = formData.marksheet;

      if (formData.marksheet instanceof File) {
        const uploadRes = await uploadFileApi(
          formData.marksheet,
          "Student",
          currentUser,
          "marksheet"
        );
        marksheetUrl = uploadRes.file_url || uploadRes.file_name;
      }

      const payload = {
        ...formData,
        courses_type: formData.course_type || formData.courses_type,
        marksheet: marksheetUrl || null,
        name: currentUser
      };
      await updateStudent(currentUser, payload);
      showToast("Profile updated successfully!", "success");
      await fetchStudentData(currentUser);
    } catch (err: any) {
      console.error("Failed to update student:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Failed to update profile";
      setError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const studentFields: DynamicField[] = useMemo(() => [
    { name: "first_name", label: "First Name", type: "text", icon: Users, required: true, disabled: true },
    { name: "last_name", label: "Last Name", type: "text", icon: Users, required: true, disabled: true },
    { name: "email_id", label: "Email ID", type: "email", icon: Mail, required: true, disabled: true, colSpan: 2 },
    { name: "mobile_no", label: "Mobile No", type: "text", icon: Phone, required: true },
    { name: "college", label: "College", type: "text", icon: Building2, required: true, disabled: true, colSpan: 2 },
    {
      name: "course_type",
      label: "Course Type",
      type: "select",
      icon: GraduationCap,
      required: true,
      apiEndpoint: "method/stridenex_app.api_stridenex_app.college.master.get_master_data",
      apiParams: { doctype: "Course Type" },
      mapOptions: (data: any) => {
        let items = Array.isArray(data) ? data : (data?.data?.data || data?.message?.data || data?.message || data?.data || []);
        items = Array.isArray(items) ? items : [];
        return items.map((item: any) => ({ value: item.name || item.course_type, label: item.course_type || item.name }));
      }
    },
    {
      name: "stream",
      label: "Stream",
      type: "select",
      icon: Layers,
      required: true,
      apiEndpoint: "method/stridenex_app.api_stridenex_app.college.master.get_master_data",
      apiParams: { doctype: "Stream" },
      mapOptions: (data: any) => {
        let items = Array.isArray(data) ? data : (data?.data?.data || data?.message?.data || data?.message || data?.data || []);
        items = Array.isArray(items) ? items : [];
        return items.map((item: any) => ({ value: item.name, label: item.name }));
      }
    },
    {
      name: "course",
      label: "Course",
      type: "select",
      icon: GraduationCap,
      required: true,
      disabled: !studentFormState.stream || !studentFormState.course_type,
      apiEndpoint: (studentFormState.stream && studentFormState.course_type)
        ? "method/stridenex_app.api_stridenex_app.college.master.get_courses_by_type"
        : undefined,
      apiParams: (studentFormState.stream && studentFormState.course_type) ? {
        stream: studentFormState.stream,
        course_type: studentFormState.course_type
      } : undefined,
      mapOptions: (data: any) => {
        const courses = data?.data?.courses || data?.courses || data?.message?.data?.courses || [];
        return courses.map((item: any) => ({ value: item.name, label: item.course_name || item.name }));
      }
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      icon: Shield,
      required: true,
      disabled: !studentFormState.course,
      apiEndpoint: studentFormState.course
        ? "method/stridenex_app.stridenex_app.doctype.college_department.college_department.get_departments_by_course"
        : undefined,
      apiParams: studentFormState.course ? {
        courses: studentFormState.course
      } : undefined,
      mapOptions: (data: any) => {
        const depts = data?.data || data?.message?.data || [];
        const deptOptions = depts.map((d: any) => ({
          value: d.name,
          label: d.department_name || d.name,
          academicYears: d.academic_years || "",
          semester: d.semester || ""
        }));
        setStudentDepartmentOptions(deptOptions);
        return deptOptions.map(({ value, label }: { value: string; label: string }) => ({ value, label }));
      }
    },
    {
      name: "semester",
      label: "Semester",
      type: "select",
      icon: Calendar,
      required: true,
      disabled: !studentFormState.department,
      apiEndpoint: studentFormState.department
        ? "method/stridenex_app.api_stridenex_app.student.masters.get_semester"
        : undefined,
      apiMethod: "GET",
      apiParams: studentFormState.department ? {
        semester: studentDepartmentOptions.find(d => d.value === studentFormState.department)?.semester || ""
      } : undefined,
      mapOptions: (data: any) => {
        let semesters = Array.isArray(data) ? data : (data?.data?.data || data?.message?.data || data?.message || data?.data || []);
        semesters = Array.isArray(semesters) ? semesters : [];
        return semesters.map((sem: any) => ({
          value: sem.name,
          label: sem.name
        }));
      }
    },
    { name: "current_year", label: "Current Year", type: "select", icon: Target, options: ["First Year", "Second Year", "Third Year", "Final Year"], required: true },
    { name: "date_of_birth", label: "Date of Birth", type: "date", icon: Calendar, required: true, textTransform: "uppercase" },
    { name: "gender", label: "Gender", type: "select", icon: Users, options: ["Male", "Female", "Other"], required: true },
    { name: "linkedin", label: "LinkedIn URL", type: "url", icon: Linkedin },
    { name: "github", label: "GitHub URL", type: "url", icon: Github },
    { name: "cgpa", label: "CGPA", type: "number", icon: Award, required: true },
    {
      name: "marksheet",
      label: "Upload Marksheet / Result",
      type: "custom",
      colSpan: 2,
      customRender: (formData, onChange) => (
        <MarksheetUploader
          value={formData.marksheet}
          onChange={(val) => onChange(val)}
        />
      )
    },
  ], [studentFormState.course_type, studentFormState.stream, studentFormState.course, studentFormState.department, studentDepartmentOptions]);

  const handleValuesChange = (values: Record<string, any>, changedFieldName: string) => {
    let sideEffects: Record<string, any> = {};
    if (changedFieldName === "stream" || changedFieldName === "course_type") {
      sideEffects = { course: "", department: "", semester: "" };
    } else if (changedFieldName === "course") {
      sideEffects = { department: "", semester: "" };
    } else if (changedFieldName === "department") {
      sideEffects = { semester: "" };
    }
    setStudentFormState(prev => ({
      ...prev,
      stream: values.stream || "",
      course_type: values.course_type || "",
      course: values.course || "",
      department: values.department || "",
      ...sideEffects
    }));
    return sideEffects;
  };

  if (loading && !studentData) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="w-full">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Update Profile</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your personal and academic details.</p>
        </div>
        <div className="mt-8 flex justify-center">
          <ProfileImageUploader 
            currentImageUrl={userImage || studentData?.image || undefined} 
            initials={studentData?.first_name?.charAt(0) || currentUser?.charAt(0)?.toUpperCase() || "U"} 
            size="lg" 
            onSuccess={(fileUrl) => {
              fetchStudentData(currentUser);
              if (updateUserImage) updateUserImage(fileUrl);
            }}
          />
        </div>
      </div>
      <div className="p-6">
        <DashboardDynamicForm
          fields={studentFields}
          initialValues={studentData}
          onSubmit={handleUpdateProfile}
          loading={submitLoading}
          error={error}
          onValuesChange={handleValuesChange}
          maxWidth="max-w-full"
          submitText="Update Profile"
        />
      </div>
    </div>
  );
}
