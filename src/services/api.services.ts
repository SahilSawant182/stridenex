import axios, { AxiosRequestConfig } from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Generic API caller with token injection
const apiRequest = async (config: AxiosRequestConfig) => {
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
  const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;

  const headers = {
    ...config.headers,
    ...(apiKey && apiSecret ? { Authorization: `token ${apiKey}:${apiSecret}` } : {}),
  };

  try {
    const response = await api({ ...config, headers });
    return response.data;
  } catch (error: any) {
    console.error(`API Error (${config.method} ${config.url}):`, error);
    // Return error data if available to allow component to handle server errors
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const apiService = {
  get: (url: string, config?: AxiosRequestConfig) => apiRequest({ ...config, method: "GET", url }),
  post: (url: string, data?: any, config?: AxiosRequestConfig) => apiRequest({ ...config, method: "POST", url, data }),
  put: (url: string, data?: any, config?: AxiosRequestConfig) => apiRequest({ ...config, method: "PUT", url, data }),
  patch: (url: string, data?: any, config?: AxiosRequestConfig) => apiRequest({ ...config, method: "PATCH", url, data }),
  delete: (url: string, config?: AxiosRequestConfig) => apiRequest({ ...config, method: "DELETE", url }),
};

export const getIndustryByEmail = async (email: string) => {
  try {
    // Correcting relative path to use email query parameter instead of company_name
    const response = await apiService.get(
      `method/stridenex_app.api_stridenex_app.industry.industry.get_industry_by_name?email=${encodeURIComponent(email)}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching industry by email:", error);
    throw error;
  }
};

export const fetchProjectDetails = async (doctype: string) => {
  try {
    const response = await api.get(
      `method/quantlis_management.api.get_doctype_json`,
      {
        params: { doctype },
      }
    );

    return response.data.message;
  } catch (error) {
    console.error("Error fetching doctype:", error);
    throw new Error("Failed to fetch doctype");
  }
};

export const fetchBackgroundImage = async () => {
  try {
    const response = await api.get(
      `method/quantlis_management.api.get_background_image`
    );

    return response.data.message.background_image;
  } catch (error) {
    console.error("Error fetching background image:", error);
    throw new Error("Failed to fetch background image");
  }
};