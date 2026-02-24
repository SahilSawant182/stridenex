import { api } from "./api.services";

export const fetchFormFields = async (doctype: string) => {
  try {
    const response = await api.get(
      `/api/method/quantlis_management.api.get_doctype_json`,
      {
        params: { doctype },
      }
    );
    
    // Transform API response to your FormField structure
    const fields = response.data.message?.fields || [];
    return fields.map((field: any) => ({
      fieldname: field.fieldname,
      label: field.label || field.fieldname,
      fieldtype: field.fieldtype || "Data",
      placeholder: field.placeholder || `Enter ${field.label || field.fieldname}`,
      required: field.reqd || false,
      options: field.options,
      default: field.default,
      description: field.description,
      read_only: field.read_only || false,
      hidden: field.hidden || false,
    }));
  } catch (error) {
    console.error("Error fetching form fields:", error);
    throw new Error("Failed to fetch form fields");
  }
};