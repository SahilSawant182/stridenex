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

export const addRequiredRole = async (data: any, industry: string) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.industry_role.industry_role.create_industry_role?industry=${encodeURIComponent(industry)}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error adding required role:", error);
    throw error;
  }
};

export const getIndustryRoleList = async (industry: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.industry_role.industry_role.get_industry_role_list?industry=${encodeURIComponent(industry)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching industry role list:", error);
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

export const createProject = async (data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.industry_project.industry_project.create_project`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjectList = async (industry: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.industry_project.industry_project.get_project_list?industry=${encodeURIComponent(industry)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};

export const updateProject = async (projectName: string, data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.industry_project.industry_project.update_project?project_name=${encodeURIComponent(projectName)}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectName: string) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.industry_project.industry_project.inactive_project?project_name=${encodeURIComponent(projectName)}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const createInternship = async (data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.internship.internship.create_internship`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating internship:", error);
    throw error;
  }
};

export const updateInternship = async (name: string, data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.internship.internship.update_internship?name=${encodeURIComponent(name)}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating internship:", error);
    throw error;
  }
};

export const getInternshipList = async (industry: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.internship.internship.get_internship_list?industry=${encodeURIComponent(industry)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching internship list:", error);
    throw error;
  }
};

export const deleteInternship = async (name: string) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.internship.internship.inactive_internship?name=${encodeURIComponent(name)}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting internship:", error);
    throw error;
  }
};

export const getStudentApplicationList = async (industry: string, status: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.internship_application.internship_application.get_student_application_list?industry=${encodeURIComponent(industry)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching student application list:", error);
    throw error;
  }
};

export const getSkillDomain = async (industry: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.industry_skill_domain.industry_skill_domain.get_skill_domain?industry=${encodeURIComponent(industry)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching skill domain:", error);
    throw error;
  }
};

export const createSkillDomain = async (data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.industry_skill_domain.industry_skill_domain.create_skill_domain?industry=${encodeURIComponent(data.industry)}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating skill domain:", error);
    throw error;
  }
};

export const updateSkillDomain = async (name: string, data: any) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.industry_skill_domain.industry_skill_domain.update_skill_domain?name=${encodeURIComponent(name)}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating skill domain:", error);
    throw error;
  }
};

export const deleteSkillDomain = async (name: string) => {
  try {
    const response = await apiService.post(
      `method/stridenex_app.stridenex_app.doctype.industry_skill_domain.industry_skill_domain.delete_skill_domain?name=${encodeURIComponent(name)}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting skill domain:", error);
    throw error;
  }
};

export const getApplicationStatusCount = async (industry: string) => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.stridenex_app.doctype.internship_application.internship_application.get_application_status_count?industry=${encodeURIComponent(industry)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching application status count:", error);
    throw error;
  }
};
