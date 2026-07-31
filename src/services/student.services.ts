import { apiService, BASE_DOMAIN } from "./api.services";

/**
 * Internship Application API
 * Endpoint for students to apply for an internship.
 */
export const createStudentApplication = async (data: any) => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.internship_application.internship_application.create_student_application",
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating student application:", error);
    throw error;
  }
};

/**
 * Project Enrollment API
 * Endpoint for students to enroll in an industry project.
 */
export const createStudentProjectEnrollment = async (data: any) => {
  console.log("data", data);
  try {
    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.student_project_enrollment.student_project_enrollment.create_student_project_enrollment",
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating student project enrollment:", error);
    throw error;
  }
};

export const mapYearToWord = (year: any): string | null => {
  if (!year) return null;
  const str = String(year).trim().toLowerCase();
  if (str === "1" || str.includes("1st") || str.includes("first")) return "First Year";
  if (str === "2" || str.includes("2nd") || str.includes("second")) return "Second Year";
  if (str === "3" || str.includes("3rd") || str.includes("third")) return "Third Year";
  if (str === "4" || str.includes("4th") || str.includes("final") || str.includes("fourth")) return "Final Year";
  return year;
};

/**
 * Fetch all available internships for students.
 */
export const getStudentInternshipList = async (
  studentEmail?: string,
  course?: string | null,
  department?: string | null,
  academicYear?: string | null,
  search?: string
) => {
  try {
    let url = "method/stridenex_app.stridenex_app.doctype.internship.internship.get_internship_list";
    const params = new URLSearchParams();

    if (studentEmail) params.append("student", studentEmail);
    params.append("course", course || "null");
    params.append("department", department || "null");
    
    const yearWord = mapYearToWord(academicYear);
    params.append("current_year", yearWord || "null");

    if (search) {
      params.append("search", search);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await apiService.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching student internship list:", error);
    throw error;
  }
};

/**
 * Fetch all available projects for students.
 */
export const getStudentProjectList = async (
  studentEmail?: string,
  course?: string | null,
  department?: string | null,
  academicYear?: string | null,
  search?: string
) => {
  try {
    let url = "method/stridenex_app.stridenex_app.doctype.industry_project.industry_project.get_project_list";
    const params = new URLSearchParams();

    if (studentEmail) params.append("student", studentEmail);
    params.append("course", course || "null");
    params.append("department", department || "null");
    
    const yearWord = mapYearToWord(academicYear);
    params.append("current_year", yearWord || "null");

    if (search) {
      params.append("search", search);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await apiService.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching student project list:", error);
    throw error;
  }
};

/**
 * Fetch master data for a specific doctype.
 */
export const getMasterData = async (doctype: string, additionalPayload: any = {}) => {
  try {
    const payload = {
      doctype,
      page: additionalPayload.page !== undefined ? additionalPayload.page : 1,
      search: additionalPayload.search !== undefined ? additionalPayload.search : "",
      ...additionalPayload
    };
    const response = await apiService.post(
      "method/stridenex_app.api_stridenex_app.college.master.get_master_data",
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

/**
 * Fetch mentor list for students.
 */
export const getMentorList = async (page: number = 1, page_size: number = 20, search?: string) => {
  try {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("page_size", String(page_size));
    if (search) {
      params.append("search", search);
    }
    const response = await apiService.get(
      `method/stridenex_app.api_stridenex_app.mentor.mentor.get_mentor_list?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching mentor list:", error);
    throw error;
  }
};

/**
 * Fetch mentor slot calendar.
 */
export const getMentorSlotCalendar = async (mentorEmail: string, offeringName: string) => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.mentor_session_booking.mentor_session_booking.get_slot_calendar",
      { mentor: mentorEmail, offering: offeringName }
    );
    return response;
  } catch (error) {
    console.error("Error fetching mentor slot calendar:", error);
    throw error;
  }
};

/**
 * Book a mentor slot.
 */
export const bookMentorSlot = async (data: Record<string, string>) => {
  try {
    const queryString = new URLSearchParams(data).toString();
    const url = `method/stridenex_app.stridenex_app.doctype.mentor_session_booking.mentor_session_booking.book_slot?${queryString}`;

    const response = await apiService.get(url);
    return response;
  } catch (error) {
    console.error("Error booking mentor slot:", error);
    throw error;
  }
};
/**
 * Fetch the next available slot for a mentor.
 */
export const getMentorNextAvailableSlot = async (mentorEmail: string) => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.mentor_offering.mentor_offering._get_next_available_slot",
      { mentor: mentorEmail }
    );
    return response;
  } catch (error) {
    console.error("Error fetching mentor next available slot:", error);
    throw error;
  }
};
/**
 * Fetch skill ledger summary for a student.
 */
export const getSkillLedger = async (studentEmail: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.skill_ledger.doctype.student_skill.student_skill.get_skill_ledger",
      { student: studentEmail }
    );
    return response;
  } catch (error) {
    console.error("Error fetching skill ledger:", error);
    throw error;
  }
};

/**
 * Fetch employability score for a student.
 */
export const getEmployabilityScore = async (studentEmail: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.skill_ledger.doctype.student_skill.student_skill.get_employability_score",
      { student: studentEmail }
    );
    return response;
  } catch (error) {
    console.error("Error fetching employability score:", error);
    throw error;
  }
};
/**
 * Create a group session booking.
 */
export const createGroupSessionBooking = async (data: any) => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.mentor_session_booking.mentor_session_booking.create_group_session_booking",
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating group session booking:", error);
    throw error;
  }
};

/**
 * Fetch student details by email.
 */
export const getStudentByEmail = async (emailId: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.api_stridenex_app.student.student.get_student_by_email?email_id=${encodeURIComponent(emailId)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching student by email:", error);
    throw error;
  }
};
/**
 * Format mobile number to standard "+CountryCode-PhoneNumber" (like +91-7656787656)
 */
export const formatMobileNumber = (mobileNo: string): string => {
  if (!mobileNo) return "";
  let cleaned = String(mobileNo).trim();

  // If already in the format "+XX-XXXXXXXXXX" or similar (+country_code-number)
  if (/^\+\d+-\d+$/.test(cleaned)) {
    return cleaned;
  }

  // Remove all non-digit characters except the leading "+" if present
  const hasPlus = cleaned.startsWith("+");
  let digits = cleaned.replace(/\D/g, "");

  if (hasPlus) {
    if (digits.startsWith("91")) {
      const rest = digits.substring(2);
      return `+91-${rest}`;
    } else {
      if (digits.length === 11) {
        return `+${digits.substring(0, 1)}-${digits.substring(1)}`;
      } else if (digits.length === 12) {
        return `+${digits.substring(0, 2)}-${digits.substring(2)}`;
      } else if (digits.length === 13) {
        return `+${digits.substring(0, 3)}-${digits.substring(3)}`;
      }
      return `+${digits}`;
    }
  } else {
    if (digits.startsWith("91") && digits.length === 12) {
      return `+91-${digits.substring(2)}`;
    }
    if (digits.length === 10) {
      return `+91-${digits}`;
    }
    return `+91-${digits}`;
  }
};

/**
 * Update student details.
 */
export const updateStudent = async (emailId: string, data: any) => {
  try {
    const formattedData = { ...data };
    if (formattedData.mobile_no) {
      formattedData.mobile_no = formatMobileNumber(formattedData.mobile_no);
    }
    const response = await apiService.post(
      `method/stridenex_app.api_stridenex_app.student.student.update_student?email_id=${encodeURIComponent(emailId)}`,
      formattedData
    );
    return response;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};
/**
 * Create a student event registration.
 */
export const createStudentEventRegistration = async (data: any) => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.student_event_registeration.student_event_registeration.create_student_event_registeration",
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating student event registration:", error);
    throw error;
  }
};

/**
 * Fetch college event list for a specific college and student.
 */
export const getCollegeEventList = async (college: string, studentEmail: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.college_event.college_event.get_college_event_list?college=${encodeURIComponent(college)}&student=${encodeURIComponent(studentEmail)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching college event list:", error);
    throw error;
  }
};

/**
 * Create a new student skill.
 */
export const createStudentSkill = async (data: any) => {
  try {
    const response = await apiService.post(
      "method/nexedu.skill_ledger.doctype.student_skill.student_skill.create_student_skill",
      { data }
    );
    return response;
  } catch (error) {
    console.error("Error creating student skill:", error);
    throw error;
  }
};

/**
 * Add skill evidence for a student.
 */
export const addSkillEvidence = async (data: any) => {
  try {
    const response = await apiService.post(
      "method/nexedu.skill_ledger.doctype.skill_evidence.skill_evidence.add_evidence",
      data
    );
    return response;
  } catch (error) {
    console.error("Error adding skill evidence:", error);
    throw error;
  }
};

/**
 * Fetch student habits dashboard.
 */
export const getStudentDashboardHabits = async (studentEmail: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.get_student_dashboard",
      { student: studentEmail }
    );
    return response;
  } catch (error) {
    console.error("Error fetching student habits dashboard:", error);
    throw error;
  }
};

/**
 * Log daily habits.
 */
export const logDailyHabits = async (data: any) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.log_daily_habits",
      data
    );
    return response;
  } catch (error) {
    console.error("Error logging daily habits:", error);
    throw error;
  }
};

/**
 * Update habit log status.
 */
export const updateLogStatus = async (logName: string, status: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.update_log_status",
      { log_name: logName, status }
    );
    return response;
  } catch (error) {
    console.error("Error updating log status:", error);
    throw error;
  }
};

/**
 * Create a new habit plan.
 */
export const createHabitPlan = async (data: any) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.create_habit_plan",
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating habit plan:", error);
    throw error;
  }
};

/**
 * Fetch student habit plans.
 */
export const getStudentPlans = async (studentEmail: string, status?: string) => {
  try {
    const payload: any = { student: studentEmail };
    if (status) payload.status = status;
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.get_student_plans",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error fetching student plans:", error);
    throw error;
  }
};

/**
 * Fetch habit streaks for a student.
 */
export const getHabitStreaks = async (studentEmail: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.get_habit_streaks",
      { student: studentEmail }
    );
    return response;
  } catch (error) {
    console.error("Error fetching habit streaks:", error);
    throw error;
  }
};

/**
 * Fetch habit history.
 */
export const getHabitHistory = async (studentEmail: string, habit: string, days: number = 30) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.get_habit_history",
      { student: studentEmail, habit, days }
    );
    return response;
  } catch (error) {
    console.error("Error fetching habit history:", error);
    throw error;
  }
};

/**
 * Fetch today's pending habits.
 */
export const getTodaysPendingHabits = async (studentEmail: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.get_todays_pending_habits",
      { student: studentEmail }
    );
    return response;
  } catch (error) {
    console.error("Error fetching today's pending habits:", error);
    throw error;
  }
};

/**
 * Fetch habit plan summary.
 */
export const getPlanSummary = async (planName: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.get_plan_summary",
      { plan_name: planName }
    );
    return response;
  } catch (error) {
    console.error("Error fetching plan summary:", error);
    throw error;
  }
};

/**
 * Complete habit plan status.
 */
export const completeHabitPlanStatus = async (planName: string, habitName: string, student: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.complete_habit_plan_status",
      {
        plan_name: planName,
        habit_name: habitName,
        student: student
      }
    );
    return response;
  } catch (error) {
    console.error("Error completing habit plan status:", error);
    throw error;
  }
};

/**
 * Delete habit plan.
 */
export const deleteHabitPlan = async (planName: string, habitName: string, student: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.habits_builder.api.delete_habit_plan",
      {
        plan_name: planName,
        habit_name: habitName,
        student: student
      }
    );
    return response;
  } catch (error) {
    console.error("Error deleting habit plan:", error);
    throw error;
  }
};

/**
 * Get booked sessions for a student.
 */
export const getBookedSessions = async (studentEmail: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.mentor_session_booking.mentor_session_booking.get_booked_sessions?student_email=${encodeURIComponent(studentEmail)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    throw error;
  }
};

/**
 * Fetch billing packages for a user by email.
 */
export const getUserPackages = async (email: string) => {
  try {
    const response = await apiService.get(
      `method/quantbit_billing_platform.quantbit_billing_platform.api.get_user_packages?email=${encodeURIComponent(email)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching user packages:", error);
    throw error;
  }
};
/**
 * Fetch mentor offerings list.
 */
export const getMentorOfferings = async (mentorEmail: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.mentor_offering.mentor_offering.get_mentor_offerings?mentor=${encodeURIComponent(mentorEmail)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching mentor offerings:", error);
    throw error;
  }
};

/**
 * Fetch package remaining days for a user.
 */
export const getPackageRemainingDays = async (user: string) => {
  try {
    const response = await apiService.get(
      `method/quantbit_billing_platform.quantbit_billing_platform.api.get_remaining_days?user=${encodeURIComponent(user)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching package remaining days:", error);
    throw error;
  }
};

/**
 * Fetch skill test questions.
 */
export const getSkillTestQuestions = async (student: string, skill: string, level: string) => {
  try {
    const response = await apiService.get(
      `method/nexedu.api.skill_assessment_ai.get_skill_test_questions?student=${encodeURIComponent(student)}&skill=${encodeURIComponent(skill)}&level=${encodeURIComponent(level)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching skill test questions:", error);
    throw error;
  }
};

/**
 * Submit skill test.
 */
export const submitSkillTest = async (payload: {
  student: string;
  skill: string;
  level: string;
  answers: Record<string, string>;
}) => {
  try {
    const response = await apiService.post(
      "method/nexedu.api.skill_assessment_ai.submit_skill_test",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error submitting skill test:", error);
    throw error;
  }
};

/**
 * Fetch student career path.
 */
export const getStudentCareerPath = async (studentEmail: string) => {
  try {
    const response = await apiService.get(
      `method/nexedu.path_finder.app_api.get_student_career_path?student=${encodeURIComponent(studentEmail)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching student career path:", error);
    throw error;
  }
};

/**
 * Fetch recommended paths.
 */
export const getRecommendedPaths = async (studentEmail: string) => {
  try {
    const response = await apiService.get(
      `method/nexedu.path_finder.app_api.get_recommended_paths?student=${encodeURIComponent(studentEmail)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching recommended paths:", error);
    throw error;
  }
};

/**
 * Enroll student in a career path.
 */
export const enrollStudentPath = async (studentEmail: string, careerPath: string) => {
  try {
    const response = await apiService.post(
      "method/nexedu.path_finder.api.path_enrollment.enroll_student",
      {
        student: studentEmail,
        career_path: careerPath
      }
    );
    return response;
  } catch (error) {
    console.error("Error enrolling student path:", error);
    throw error;
  }
};


export const initiateSessionBooking = async (payload: any): Promise<any> => {
  try {
    const response = await fetch(
      `${BASE_DOMAIN}/api/method/quantbit_billing_platform.quantbit_billing_platform.api.initiate_session_booking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       
        body: JSON.stringify({ payload: JSON.stringify(payload) }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
     
      let errMsg = `Server error ${response.status}`;
      try {
        if (data?._server_messages) {
          const msgs = typeof data._server_messages === "string"
            ? JSON.parse(data._server_messages)
            : data._server_messages;
          if (Array.isArray(msgs) && msgs.length > 0) {
            const msgObj = typeof msgs[0] === "string" ? JSON.parse(msgs[0]) : msgs[0];
            errMsg = msgObj?.message ?? errMsg;
          }
        } else if (data?.message) {
          errMsg = data.message;
        } else if (data?.exception) {
          const exc = String(data.exception);
          const idx = exc.indexOf(":");
          errMsg = idx !== -1 ? exc.slice(idx + 1).trim() : exc;
        }
      } catch (_) {
      }
      throw new Error(errMsg);
    }

    return data;
  } catch (error) {
    console.error("Error initiating session booking:", error);
    throw error;
  }
};

export const verifySessionPayment = async (payload: {
  booking_id: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<any> => {
  try {
    const response = await apiService.post(
      "method/quantbit_billing_platform.quantbit_billing_platform.api.verify_session_payment",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error verifying session payment:", error);
    throw error;
  }
};

/**
 * Fetch all success stories.
 */
export const getSuccessStories = async (): Promise<any> => {
  try {
    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.success_story.success_story.get_success_stories"
    );
    return response;
  } catch (error) {
    console.error("Error fetching success stories:", error);
    throw error;
  }
};

/**
 * Create a new success story.
 */
export const createSuccessStory = async (data: any): Promise<any> => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.success_story.success_story.create_success_story",
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating success story:", error);
    throw error;
  }
};

/**
 * Fetch educational shorts feed.
 */
export const getShortsFeed = async (userEmail?: string): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.educational_short.educational_short.get_shorts_feed",
      {
        params: userEmail ? { user: userEmail } : {},
        headers
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching shorts feed:", error);
    throw error;
  }
};

/**
 * Save an educational short.
 */
export const saveShort = async (payload: { user: string; short_name: string }): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.educational_short.educational_short.save_short",
      payload,
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error saving short:", error);
    throw error;
  }
};

/**
 * Unsave an educational short.
 */
export const unsaveShort = async (payload: { user: string; short_name: string }): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.educational_short.educational_short.unsave_short",
      payload,
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error unsaving short:", error);
    throw error;
  }
};

/**
 * Toggle like status of an educational short.
 */
export const toggleLikeShort = async (payload: { short: string }): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.educational_short.educational_short.toggle_like",
      payload,
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

/**
 * Fetch saved educational shorts.
 */
export const getSavedShorts = async (userEmail: string): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.educational_short.educational_short.get_saved_shorts",
      {
        params: { user: userEmail },
        headers
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching saved shorts:", error);
    throw error;
  }
};

/**
 * Add a comment or reply on an educational short video.
 * Endpoint: method/stridenex_app.stridenex_app.doctype.short_comment.short_comment.add_comment
 */
export const addShortComment = async (payload: { short: string; content: string; parent_comment?: string }): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.short_comment.short_comment.add_comment",
      {
        short: payload.short,
        content: payload.content,
        parent_comment: payload.parent_comment || ""
      },
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error adding short comment:", error);
    throw error;
  }
};

/**
 * Fetch comments for an educational short video.
 * Endpoint: method/stridenex_app.stridenex_app.doctype.short_comment.short_comment.get_comments
 */
export const getShortComments = async (shortId: string): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.short_comment.short_comment.get_comments",
      { short: shortId },
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error fetching short comments:", error);
    throw error;
  }
};

/**
 * Toggle like/unlike on a short comment.
 * Endpoint: method/stridenex_app.stridenex_app.doctype.short_comment.short_comment.toggle_like
 */
export const toggleLikeComment = async (payload: { comment: string }): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.short_comment.short_comment.toggle_like",
      payload,
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error toggling short comment like:", error);
    throw error;
  }
};



/**
 * Fetch student skills snapshot.
 */
export const getStudentSkills = async (studentEmail: string): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.student.student.get_student_skills",
      {
        params: { student: studentEmail },
        headers
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching student skills:", error);
    throw error;
  }
};

/**
 * Fetch student dashboard metrics / stats.
 */
export const getDashboardStats = async (studentEmail: string): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.student.student.get_dashboard_stats",
      {
        params: { student: studentEmail },
        headers
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

/**
 * Fetch all educational tags.
 */
export const getTags = async (): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.educational_short.educational_short.get_tags",
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

/**
 * Create an educational tag.
 */
export const createTag = async (title: string): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.educational_short.educational_short.create_tag",
      { title },
      { headers }
    );
    return response;
  } catch (error) {
    console.warn("Error creating tag:", error);
    throw error;
  }
};

/**
 * Fetch learning activity.
 */
export const getLearningActivity = async (studentEmail: string): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.student.student.get_learning_activity",
      {
        params: { student: studentEmail },
        headers
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching learning activity:", error);
    throw error;
  }
};

/**
 * Fetch today's opportunity alerts.
 */
export const getTodaysOpportunityAlerts = async (studentEmail: string): Promise<any> => {
  try {
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
    const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey && apiSecret) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.student.student.get_todays_opportunity_alerts",
      {
        params: { student: studentEmail },
        headers
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching today's opportunity alerts:", error);
    throw error;
  }
};