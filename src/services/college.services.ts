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
