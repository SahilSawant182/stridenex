import { api, apiService } from "./api.services";

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
