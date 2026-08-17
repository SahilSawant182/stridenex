import { apiService as baseApiService } from "./api.services";
import { customAlert } from "@/utils/alert";

const apiService = {
  get: async (url: string, config?: any) => {
    try {
      return await baseApiService.get(url, config);
    } catch (error: any) {
      customAlert(error?.message || "An unexpected error occurred");
      throw error;
    }
  },
  post: async (url: string, data?: any, config?: any) => {
    try {
      return await baseApiService.post(url, data, config);
    } catch (error: any) {
      customAlert(error?.message || "An unexpected error occurred");
      throw error;
    }
  },
  put: async (url: string, data?: any, config?: any) => {
    try {
      return await baseApiService.put(url, data, config);
    } catch (error: any) {
      customAlert(error?.message || "An unexpected error occurred");
      throw error;
    }
  },
  patch: async (url: string, data?: any, config?: any) => {
    try {
      return await baseApiService.patch(url, data, config);
    } catch (error: any) {
      customAlert(error?.message || "An unexpected error occurred");
      throw error;
    }
  },
  delete: async (url: string, config?: any) => {
    try {
      return await baseApiService.delete(url, config);
    } catch (error: any) {
      customAlert(error?.message || "An unexpected error occurred");
      throw error;
    }
  },
};

export const getMasterData = async (doctype: string, additionalPayload: any = {}) => {
  try {
    const payload = {
      doctype,
      page: additionalPayload.page !== undefined ? additionalPayload.page : 1,
      search: additionalPayload.search !== undefined ? additionalPayload.search : "",
      ...additionalPayload
    };
    const response = await apiService.post(
      `method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
      payload
    );
    let arr = [];
    if (response?.data && response?.data?.data && Array.isArray(response?.data?.data)) {
      arr = response.data.data;
    } else if (response?.data && Array.isArray(response?.data)) {
      arr = response.data;
    } else if (response?.message && Array.isArray(response?.message)) {
      arr = response.message;
    } else if (response?.message && response?.message?.data && Array.isArray(response?.message?.data)) {
      arr = response.message.data;
    }
    return { data: arr, message: arr, pagination: response?.data?.pagination || response?.message?.pagination };
  } catch (error) {
    console.error(`Error fetching master data for ${doctype}:`, error);
    throw error;
  }
};

export const getCollegeDetails = async (email: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.api_stridenex_app.college.college.get_college?email=${encodeURIComponent(email)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching college details for ${email}:`, error);
    throw error;
  }
};

export const getCollegeEvents = async (college: string, page: number = 1, pageSize: number = 20) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_event.college_event.get_college_event_list?college=${encodeURIComponent(college)}&page=${page}&page_size=${pageSize}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching events for college ${college}:`, error);
    throw error;
  }
};

export const createCollegeEvent = async (eventData: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.college_event.college_event.create_college_event`,
      eventData
    );
    return response;
  } catch (error) {
    console.error("Error creating college event:", error);
    throw error;
  }
};

export const updateCollegeEvent = async (name: string, eventData: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.college_event.college_event.update_college_event?name=${encodeURIComponent(name)}`,
      eventData
    );
    return response;
  } catch (error) {
    console.error(`Error updating college event ${name}:`, error);
    throw error;
  }
};

export const getCollegeNotices = async (college: string, page: number = 1, pageSize: number = 20) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_notice.college_notice.get_college_notice_list?college=${encodeURIComponent(college)}&page=${page}&page_size=${pageSize}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching notices for college ${college}:`, error);
    throw error;
  }
};

export const createCollegeNotice = async (noticeData: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.college_notice.college_notice.create_college_notice`,
      noticeData
    );
    return response;
  } catch (error) {
    console.error("Error creating college notice:", error);
    throw error;
  }
};

export const updateCollegeNotice = async (name: string, noticeData: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.college_notice.college_notice.update_college_notice?name=${encodeURIComponent(name)}`,
      noticeData
    );
    return response;
  } catch (error) {
    console.error(`Error updating college notice ${name}:`, error);
    throw error;
  }
};

export const deleteCollegeNotice = async (name: string) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.college_notice.college_notice.delete_college_notice?name=${encodeURIComponent(name)}`,
      { name }
    );
    return response;
  } catch (error) {
    console.error(`Error deleting college notice ${name}:`, error);
    throw error;
  }
};

export const getCollegeDrives = async (college: string, page: number = 1, pageSize: number = 20) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.get_drives_by_college?college=${encodeURIComponent(college)}&page=${page}&page_size=${pageSize}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching drives for college ${college}:`, error);
    throw error;
  }
};

export const createCollegeDrive = async (driveData: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.create_drive`,
      driveData
    );
    return response;
  } catch (error) {
    console.error("Error creating college drive:", error);
    throw error;
  }
};

export const updateCollegeDrive = async (driveData: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.update_drive`,
      driveData
    );
    return response;
  } catch (error) {
    console.error("Error updating college drive:", error);
    throw error;
  }
};

export const deleteCollegeDrive = async (driveName: string) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.delete_drive?name=${encodeURIComponent(driveName)}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting college drive:", error);
    throw error;
  }
};

export const getDriveCount = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.get_drive_count/?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching drive count for college ${college}:`, error);
    throw error;
  }
};

export const getPlacementList = async (college: string, name?: string, status?: string) => {
  try {
    let url = `method/stridenex_app.stridenex_app.doctype.campus_drive_application.campus_drive_application.get_placement_list?college=${encodeURIComponent(college)}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    const response = await apiService.get(url);
    return response;
  } catch (error) {
    console.error(`Error fetching placement list for college ${college}:`, error);
    throw error;
  }
};

export const getPlacementCounts = async (college: string, name?: string) => {
  try {
    let url = `method/stridenex_app.stridenex_app.doctype.campus_drive_application.campus_drive_application.get_placement_counts?college=${encodeURIComponent(college)}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    const response = await apiService.get(url);
    return response;
  } catch (error) {
    console.error(`Error fetching placement counts for college ${college}:`, error);
    throw error;
  }
};

export const getOpenRegistrationCount = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.open_registration_count?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching open registration count for college ${college}:`, error);
    throw error;
  }
};

export const getEligibleStudents = async (
  params: string | { 
    branch?: string; 
    cgpa?: number | string; 
    backlog?: number | string; 
    drive?: string; 
    academic_year?: string;
    college?: string;
    page?: number | string;
    page_size?: number | string;
  }
) => {
  try {
    let url = `method/stridenex_app.stridenex_app.doctype.campus_drive_application.campus_drive_application.get_eligible_students`;

    if (typeof params === 'string') {
      url += `?drive=${encodeURIComponent(params)}`;
    } else {
      const queryParts: string[] = [];
      if (params.branch) queryParts.push(`branch=${encodeURIComponent(params.branch)}`);
      if (params.cgpa !== undefined && params.cgpa !== "") queryParts.push(`cgpa=${encodeURIComponent(params.cgpa)}`);
      if (params.backlog !== undefined && params.backlog !== "") queryParts.push(`backlog=${encodeURIComponent(params.backlog)}`);
      if (params.drive) queryParts.push(`drive=${encodeURIComponent(params.drive)}`);
      if (params.academic_year) queryParts.push(`academic_year=${encodeURIComponent(params.academic_year)}`);
      if (params.college) queryParts.push(`college=${encodeURIComponent(params.college)}`);
      if (params.page !== undefined && params.page !== "") queryParts.push(`page=${encodeURIComponent(params.page)}`);
      if (params.page_size !== undefined && params.page_size !== "") queryParts.push(`page_size=${encodeURIComponent(params.page_size)}`);
      if (queryParts.length > 0) {
        url += `?${queryParts.join("&")}`;
      }
    }

    const response = await apiService.get(url);
    return response;
  } catch (error) {
    console.error(`Error fetching eligible students:`, error);
    throw error;
  }
};

export const updateCampusDriveApplicationStatus = async (applicationName: string, status: string) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.campus_drive_application.campus_drive_application.update_application_status?application_name=${encodeURIComponent(applicationName)}&status=${encodeURIComponent(status)}`
    );
    return response;
  } catch (error) {
    console.error(`Error updating campus drive application status for ${applicationName}:`, error);
    throw error;
  }
};

export const sendCandidateStatusMail = async (data: {
  email: string;
  status: string;
  candidate_name: string;
  drive_name: string;
}) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.campus_drive_application.campus_drive_application.send_candidate_status_mail`,
      data
    );
    return response;
  } catch (error) {
    console.error(`Error sending candidate status mail to ${data.email}:`, error);
    throw error;
  }
};

export const getStudentAnalyticsList = async (params: {
  search?: string;
  college?: string;
  department?: string;
  skill?: string;
  current_year?: string;
  risk_level?: string;
  page?: number;
  page_size?: number;
}) => {
  try {
    const queryParts: string[] = [];
    if (params.search !== undefined) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.college !== undefined) queryParts.push(`college=${encodeURIComponent(params.college)}`);
    if (params.department !== undefined) queryParts.push(`department=${encodeURIComponent(params.department)}`);
    if (params.skill !== undefined) queryParts.push(`skill=${encodeURIComponent(params.skill)}`);
    if (params.current_year !== undefined) queryParts.push(`current_year=${encodeURIComponent(params.current_year)}`);
    if (params.risk_level !== undefined) queryParts.push(`risk_level=${encodeURIComponent(params.risk_level)}`);
    if (params.page !== undefined) queryParts.push(`page=${encodeURIComponent(params.page)}`);
    if (params.page_size !== undefined) queryParts.push(`page_size=${encodeURIComponent(params.page_size)}`);

    let url = `method/stridenex_app.stridenex_app.doctype.campus_drive_application.campus_drive_application.get_student_Analytics_list`;
    if (queryParts.length > 0) {
      url += `?${queryParts.join("&")}`;
    }

    const response = await apiService.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching student analytics list:", error);
    throw error;
  }
};


export const getPlacementStats = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.get_placement_stats?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching placement stats for college ${college}:`, error);
    throw error;
  }
};

export const getBranchWisePerformance = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.get_branch_wise_performance?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching branch wise performance for college ${college}:`, error);
    throw error;
  }
};

export const getPlacementFunnel = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.get_placement_funnel?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching placement funnel for college ${college}:`, error);
    throw error;
  }
};

export const getSalaryBands = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.get_salary_bands?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching salary bands for college ${college}:`, error);
    throw error;
  }
};

export const getNonEligibleStudents = async (params: {
  branch?: string;
  cgpa?: number | string;
  backlog?: number | string;
  college?: string;
  academic_year?: string;
}) => {
  try {
    const queryParts: string[] = [];
    if (params.branch) queryParts.push(`branch=${encodeURIComponent(params.branch)}`);
    if (params.cgpa !== undefined && params.cgpa !== "") queryParts.push(`cgpa=${encodeURIComponent(params.cgpa)}`);
    if (params.backlog !== undefined && params.backlog !== "") queryParts.push(`backlog=${encodeURIComponent(params.backlog)}`);
    if (params.college) queryParts.push(`college=${encodeURIComponent(params.college)}`);
    if (params.academic_year) queryParts.push(`academic_year=${encodeURIComponent(params.academic_year)}`);

    let url = `method/stridenex_app.stridenex_app.doctype.campus_drive_application.campus_drive_application.get_not_eligible_students`;
    if (queryParts.length > 0) {
      url += `?${queryParts.join("&")}`;
    }

    const response = await apiService.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching non-eligible students:", error);
    throw error;
  }
};

export const exportEligibleStudents = async (params: {
  branch?: string;
  cgpa?: number | string;
  backlog?: number | string;
  college?: string;
  academic_year?: string;
}) => {
  try {
    const queryParts: string[] = [];
    if (params.branch) queryParts.push(`branch=${encodeURIComponent(params.branch)}`);
    if (params.cgpa !== undefined && params.cgpa !== "") queryParts.push(`cgpa=${encodeURIComponent(params.cgpa)}`);
    if (params.backlog !== undefined && params.backlog !== "") queryParts.push(`backlog=${encodeURIComponent(params.backlog)}`);
    if (params.college) queryParts.push(`college=${encodeURIComponent(params.college)}`);
    if (params.academic_year) queryParts.push(`academic_year=${encodeURIComponent(params.academic_year)}`);

    let url = `method/stridenex_app.stridenex_app.doctype.campus_drive_application.campus_drive_application.export_eligible_students`;
    if (queryParts.length > 0) {
      url += `?${queryParts.join("&")}`;
    }

    const response = await apiService.get(url, { responseType: 'blob' });
    return response;
  } catch (error) {
    console.error("Error exporting eligible students:", error);
    throw error;
  }
};

export const exportNotEligibleStudents = async (params: {
  branch?: string;
  cgpa?: number | string;
  backlog?: number | string;
  college?: string;
  academic_year?: string;
}) => {
  try {
    const queryParts: string[] = [];
    if (params.branch) queryParts.push(`branch=${encodeURIComponent(params.branch)}`);
    if (params.cgpa !== undefined && params.cgpa !== "") queryParts.push(`cgpa=${encodeURIComponent(params.cgpa)}`);
    if (params.backlog !== undefined && params.backlog !== "") queryParts.push(`backlog=${encodeURIComponent(params.backlog)}`);
    if (params.college) queryParts.push(`college=${encodeURIComponent(params.college)}`);
    if (params.academic_year) queryParts.push(`academic_year=${encodeURIComponent(params.academic_year)}`);

    let url = `method/stridenex_app.stridenex_app.doctype.campus_drive_application.campus_drive_application.export_not_eligible_students`;
    if (queryParts.length > 0) {
      url += `?${queryParts.join("&")}`;
    }

    const response = await apiService.get(url, { responseType: 'blob' });
    return response;
  } catch (error) {
    console.error("Error exporting not eligible students:", error);
    throw error;
  }
};

export const updateCollegeDetails = async (email: string, payload: any) => {
  try {
    const response = await apiService.put(
      `method/stridenex_app.api_stridenex_app.college.college.update_college?email=${encodeURIComponent(email)}`,
      payload
    );
    return response;
  } catch (error) {
    console.error(`Error updating college details for ${email}:`, error);
    throw error;
  }
};

export const getLowEmployabilityStudents = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_campus_drives.college_campus_drives.get_low_employability_students?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching low employability students:", error);
    throw error;
  }
};

export const assignStudentMentor = async (payload: { student: string; mentor: string }) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.student_mentor_mapping.student_mentor_mapping.create_student_mentor_mapping`,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error assigning student mentor:", error);
    throw error;
  }
};

export const getDashboardSummary = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college.college.get_dashboard_summary?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching dashboard summary for college ${college}:`, error);
    throw error;
  }
};

export const getEmployabilityDistribution = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college.college.get_employability_distribution?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching employability distribution for college ${college}:`, error);
    throw error;
  }
};

export const getOnboardingGrowth = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college.college.get_student_onboarding_graph?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching onboarding growth for college ${college}:`, error);
    throw error;
  }
};

export const getTopSkillGaps = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college.college.get_top_skill_gaps?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching top skill gaps for college ${college}:`, error);
    throw error;
  }
};

export const createSkill = async (skill_name: string) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.student.student.create_skill`,
      { skill_name }
    );
    return response;
  } catch (error) {
    console.error("Error creating skill:", error);
    throw error;
  }
};

export const getCollegeEmployabilitySummary = async (college: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.api_stridenex_app.college.college.get_college_employability_summary?college=${encodeURIComponent(college)}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching college employability summary for ${college}:`, error);
    throw error;
  }
};
