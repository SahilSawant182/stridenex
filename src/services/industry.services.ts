import { apiService } from "./api.services";

export const getIndustryByEmail = async (email: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.api_stridenex_app.industry.industry.get_industry_by_name?email=${encodeURIComponent(email)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching industry by email:", error);
    throw error;
  }
};

export const updateIndustry = async (companyName: string, data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.api_stridenex_app.industry.industry.update_industry?company_name=${encodeURIComponent(companyName)}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating industry:", error);
    throw error;
  }
};

export const addRequiredRole = async (data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.api_stridenex_app.industry.industry.add_required_role`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error adding required role:", error);
    throw error;
  }
};

export const addHiringRound = async (data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.api_stridenex_app.industry.industry.add_hiring_round`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error adding hiring round:", error);
    throw error;
  }
};
