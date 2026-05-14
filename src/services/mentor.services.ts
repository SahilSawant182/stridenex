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
