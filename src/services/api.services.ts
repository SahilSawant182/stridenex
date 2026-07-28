import axios, { AxiosRequestConfig } from "axios";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://devstridenex.quantcloud.in/api/";
export const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : rawBaseUrl + '/';
export const BASE_DOMAIN = BASE_URL.replace(/\/api\/?$/, "");

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
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      console.warn(`API Warning (${config.method} ${config.url}):`, error.message || error);
    } else {
      console.error(`API Error (${config.method} ${config.url}):`, error);
    }
    
    if (error.response && error.response.data) {
      const data = error.response.data;
      // Extract the most meaningful error message from Frappe/ERPNext response
      let serverMessage = null;

      if (data.exception && (data.exc_type === "ValidationError" || String(data.exception).includes("ValidationError"))) {
        const excStr = String(data.exception);
        const index = excStr.indexOf(":");
        serverMessage = index !== -1 ? excStr.slice(index + 1).trim() : excStr;
      }

      if (!serverMessage && data._server_messages) {
        try {
          const messages = typeof data._server_messages === 'string' ? JSON.parse(data._server_messages) : data._server_messages;
          if (Array.isArray(messages)) {
            serverMessage = messages.map((m: any) => {
              const msgObj = typeof m === 'string' ? JSON.parse(m) : m;
              return msgObj?.message;
            }).filter(Boolean).join(", ");
          }
        } catch (e) {
          console.error("Error parsing _server_messages", e);
        }
      }

      if (!serverMessage && data.exception) {
        const excStr = String(data.exception);
        const index = excStr.indexOf(":");
        serverMessage = index !== -1 ? excStr.slice(index + 1).trim() : excStr;
      }

      if (!serverMessage) {
        serverMessage = data.message || (data.exc && typeof data.exc === 'string' && !data.exc.includes("Traceback") ? data.exc : null);
      }

      // Strip HTML tags from message
      if (serverMessage && typeof serverMessage === 'string') {
        serverMessage = serverMessage.replace(/<[^>]*>/g, '').trim();
      }
      
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