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
export const getStudentInternshipList = async () => {
  try {
    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.internship.internship.get_internship_list"
    );
    return response;
  } catch (error) {
    console.error("Error fetching student internship list:", error);
    throw error;
  }
};

/**
 * Fetch all available projects for students.
 */
export const getStudentProjectList = async () => {
  try {
    const response = await apiService.get(
      "method/stridenex_app.stridenex_app.doctype.industry_project.industry_project.get_project_list"
    );
    return response;
  } catch (error) {
    console.error("Error fetching student project list:", error);
    throw error;
  }
};

/**
 * Fetch master data for a specific doctype.
 */
export const getMasterData = async (doctype: string) => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.api_stridenex_app.college.master.get_master_data",
      { doctype }
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
