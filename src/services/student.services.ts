import { apiService } from "./api.services";

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

/**
 * Fetch all available internships for students.
 */
export const getStudentInternshipList = async (studentEmail?: string) => {
  try {
    const url = studentEmail 
      ? `method/stridenex_app.stridenex_app.doctype.internship.internship.get_internship_list?student=${encodeURIComponent(studentEmail)}`
      : "method/stridenex_app.stridenex_app.doctype.internship.internship.get_internship_list";
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
export const getStudentProjectList = async (studentEmail?: string) => {
  try {
    const url = studentEmail 
      ? `method/stridenex_app.stridenex_app.doctype.industry_project.industry_project.get_project_list?student=${encodeURIComponent(studentEmail)}`
      : "method/stridenex_app.stridenex_app.doctype.industry_project.industry_project.get_project_list";
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
    const response = await apiService.post(
      "method/stridenex_app.api_stridenex_app.college.master.get_master_data",
      { doctype, ...additionalPayload }
    );
    return response;
  } catch (error) {
    console.error(`Error fetching master data for ${doctype}:`, error);
    throw error;
  }
};

/**
 * Fetch mentor listings for students.
 */
export const getMentorListings = async () => {
  try {
    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.mentor_offering.mentor_offering.get_mentor_listings"
    );
    return response;
  } catch (error) {
    console.error("Error fetching mentor listings:", error);
    throw error;
  }
};

/**
 * Fetch mentor slot calendar.
 */
export const getMentorSlotCalendar = async (mentorEmail: string) => {
  try {
    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.mentor_session_booking.mentor_session_booking.get_slot_calendar",
      { params: { mentor: mentorEmail } }
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
 * Update student details.
 */
export const updateStudent = async (emailId: string, data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.api_stridenex_app.student.student.update_student?email_id=${encodeURIComponent(emailId)}`,
      data
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
