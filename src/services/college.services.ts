import { apiService } from "./api.services";

export const getMasterData = async (doctype: string) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
      { doctype }
    );
    return response;
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


