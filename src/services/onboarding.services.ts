import axios from "axios";
import { BASE_URL } from "./api.services";

export interface College {
    name: string;
    college_name: string;
    status: string;
    registration_number: string;
    approved_status: string;
    college_code: string | null;
    university: string | null;
    college_type: string | null;
    website: string | null;
    is_active: number;
    country: string | null;
    state: string | null;
    district: string | null;
    city: string | null;
    taluka: string | null;
    approved_status_workflow: string | null;
    tahsil: string | null;
}

export interface OtpResponse {
    message: string;
    data?: string;
}

export interface EmailOtpResponse {
    message: {
        status: string;
        message: string;
    };
}

export interface OtpVerification {
    message: string;
    data: {
        success: boolean
    }
}

// Send mobile OTP
export const sendMobileOTP = async (mobileNo: string): Promise<OtpResponse> => {
    try {
        const response = await axios.get(
            `${BASE_URL}method/stridenex_app.api_stridenex_app.app.send_mobile_otp`,
            {
                params: {
                    mobile_no: mobileNo
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending mobile OTP:", error);
        throw error;
    }
};

// Verify mobile OTP
export const verifyMobileOTP = async (mobileNo: string, otp: string): Promise<any> => {
    try {
        const url = `${BASE_URL}method/stridenex_app.api_stridenex_app.app.validate_mobile_otp?mobile_no=${encodeURIComponent(mobileNo)}&otp=${encodeURIComponent(otp)}`;
        console.log("Calling verification URL:", url);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error verifying mobile OTP:", error);
        throw error;
    }
};

// ============ NEW EMAIL OTP APIS ============

// Send email OTP
export const sendEmailOTP = async (email: string): Promise<EmailOtpResponse> => {
    try {
        const url = `${BASE_URL}method/stridenex_app.api_stridenex_app.app.send_email_otp?email=${encodeURIComponent(email)}`;
        console.log("Calling send email OTP URL:", url);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error sending email OTP:", error);
        throw error;
    }
};

// Verify email OTP
export const verifyEmailOTP = async (email: string, otp: string): Promise<any> => {
    try {
        const url = `${BASE_URL}method/stridenex_app.api_stridenex_app.app.validate_email_otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
        console.log("Calling verify email OTP URL:", url);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error verifying email OTP:", error);
        throw error;
    }
};