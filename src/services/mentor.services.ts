import { apiService } from "./api.services";

export const getPendingRequests = async (mentor: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.mentor_session_booking.mentor_session_booking.get_pending_requests?mentor=${encodeURIComponent(mentor)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching mentor pending requests:", error);
    throw error;
  }
};



// mentor profile
export const getMentorByEmail = async (email: string) => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.api_stridenex_app.mentor.mentor.get_mentor_by_email",
      { email_id: email }
    );
    return response;
  } catch (error) {
    console.error("Error fetching mentor by email:", error);
    throw error;
  }
};

export const updateMentor = async (email: string, payload: any) => {
  try {
    const response = await apiService.put(
      `method/stridenex_app.api_stridenex_app.mentor.mentor.update_mentor?email_id=${encodeURIComponent(email)}`,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating mentor profile:", error);
    throw error;
  }
};








// Offerings tab  
export const getMentorOfferings = async (mentor: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.mentor_offering.mentor_offering.get_mentor_offerings?mentor=${encodeURIComponent(mentor)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching mentor offerings:", error);
    throw error;
  }
};

export const createMentorOffering = async (payload: any) => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.mentor_offering.mentor_offering.create_mentor_offering",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error creating mentor offering:", error);
    throw error;
  }
};

export const updateMentorOffering = async (name: string, payload: any) => {
  try {
    const response = await apiService.put(
      `method/stridenex_app.stridenex_app.doctype.mentor_offering.mentor_offering.update_mentor_offering?name=${encodeURIComponent(name)}`,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating mentor offering:", error);
    throw error;
  }
};






//Schedule tab
//Not implmented in ui yet (Weekly Availability Grid) 
export const getWeekSlots = async (mentor: string, weekStart: string, emailId: string) => {
  try {
    const response = await apiService.post(
      "method/stridenex_app.stridenex_app.doctype.mentor_availability.mentor_availability.get_week_slots",
      { mentor, week_start: weekStart, email_id: emailId }
    );
    return response;
  } catch (error) {
    console.error("Error fetching week slots:", error);
    throw error;
  }
};



//Schedule tab: All Upcoming Bookings not implemented yet 
export const getUpcomingSessions = async (mentor: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.mentor_session_booking.mentor_session_booking.get_upcoming_sessions?mentor=${encodeURIComponent(mentor)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    throw error;
  }
};

