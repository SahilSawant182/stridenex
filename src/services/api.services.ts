import axios, { AxiosRequestConfig } from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 600000,
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
    
    if (error.response && error.response.data) {
      const data = error.response.data;
      // Extract the most meaningful error message from Frappe/ERPNext response
      let serverMessage = data.message || data.exc || (data._server_messages ? JSON.parse(data._server_messages).map((m: any) => JSON.parse(m).message).join(", ") : null);
      
      // Cleanup common raw database errors
      if (serverMessage && typeof serverMessage === 'string') {
        // Data too long error
        if (serverMessage.includes("Data too long for column")) {
          const match = serverMessage.match(/column '([^']+)'/);
          const columnName = match ? match[1] : "one of the fields";
          serverMessage = `The content in the '${columnName}' field is too long. Please shorten it.`;
        }
        // Duplicate entry error
        else if (serverMessage.includes("Duplicate entry")) {
          const match = serverMessage.match(/for key '([^']+)'/);
          const keyName = match ? match[1] : "this value";
          serverMessage = `This ${keyName.includes('primary') ? 'record' : keyName} already exists. Please use a unique value.`;
        }
        // General cleanup: remove (code, "message") wrapping if present
        else if (serverMessage.startsWith("(") && serverMessage.endsWith(")")) {
          const parts = serverMessage.match(/\(([^,]+),\s*"([^"]+)"\)/);
          if (parts && parts[2]) {
            serverMessage = parts[2];
          }
        }
      }

      const errorMessage = serverMessage || error.message || "An unexpected error occurred";
      const customError = new Error(errorMessage);
      (customError as any).status = error.response.status;
      (customError as any).data = data;
      throw customError;
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