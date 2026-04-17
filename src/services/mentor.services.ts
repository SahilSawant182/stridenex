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
