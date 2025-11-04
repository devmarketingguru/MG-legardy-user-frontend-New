import axios from "axios";

const DEFAULT_SERVICE_URL = "http://localhost:3000";
const DEFAULT_MAIN_API_URL = "https://backend.legardy.com";

const serviceBaseUrl =
  process.env.NEXT_PUBLIC_SERVICE_URL?.replace(/\/$/, "") ?? DEFAULT_SERVICE_URL;

const mainApiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_MAIN_API_URL;

export const serviceClient = axios.create({
  baseURL: serviceBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export const mainApiClient = axios.create({
  baseURL: mainApiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

serviceClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      error.message = Array.isArray(error.response.data.message)
        ? error.response.data.message.join("\n")
        : error.response.data.message;
    }
    return Promise.reject(error);
  },
);

mainApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    };
    
    console.error('🔴 Main API Error:', errorDetails);
    
    // Extract error message from various possible response structures
    let errorMessage = "Network Error";
    
    if (error.response?.data) {
      const data = error.response.data;
      
      // Check for message property
      if (data.message) {
        errorMessage = Array.isArray(data.message)
          ? data.message.join("\n")
          : String(data.message);
      } 
      // Check for error property
      else if (data.error) {
        errorMessage = String(data.error);
      }
      // Check if data is a string
      else if (typeof data === 'string') {
        errorMessage = data;
      }
      // Check for nested message/error
      else if (data.data?.message) {
        errorMessage = String(data.data.message);
      } else if (data.data?.error) {
        errorMessage = String(data.data.error);
      }
      // Otherwise stringify the whole data
      else {
        try {
          const dataStr = JSON.stringify(data);
          // Only use stringified data if it's reasonable length
          if (dataStr.length < 200) {
            errorMessage = dataStr;
          } else {
            errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
          }
        } catch {
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = error.response?.statusText || "Network Error";
    }
    
    error.message = errorMessage;
    
    return Promise.reject(error);
  },
);

export type RegisterReferralUserPayload = {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  birthDate: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  bank?: string;
  bankAccount?: string;
};

export type LoginReferralUserPayload = {
  phoneNumber: string;
  password: string;
};

export type SendReferralOtpPayload = {
  phoneNumber: string;
};

export type VerifyReferralOtpPayload = {
  phoneNumber: string;
  otp: string;
};

export type GetOtpPayload = {
  phoneNumber: string;
};

export type GetOtpResponse = {
  reference?: string;
  ref?: string;
  data?: {
    reference?: string;
    ref?: string;
  };
  [key: string]: unknown;
};

export type ConfirmOtpPayload = {
  otp: string;
  reference: string;
  phoneNumber?: string; // Optional, but backend might need it
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  bank?: string;
  bankAccount?: string;
};

export type CreateReferralLinkPayload = {
  referrerId: number;
  referrerFirstName: string;
  referrerLastName: string;
  referralCode: string;
  title?: string | null;
  description?: string | null;
};

export async function registerReferralUser(payload: RegisterReferralUserPayload) {
  const { data } = await serviceClient.post(
    "/api/referral-users/register",
    payload,
  );
  return data;
}

export async function loginReferralUser(payload: LoginReferralUserPayload) {
  const { data } = await serviceClient.post("/api/referral-users/login", payload);
  return data;
}

export async function sendReferralOtp(payload: SendReferralOtpPayload) {
  const { data } = await serviceClient.post("/api/referral-users/otp/send", payload);
  return data;
}

export async function verifyReferralOtp(payload: VerifyReferralOtpPayload) {
  const { data } = await serviceClient.post(
    "/api/referral-users/otp/verify",
    payload,
  );
  return data;
}

// OTP API from main backend (backend.legardy.com)
export async function getOtp(payload: GetOtpPayload): Promise<GetOtpResponse> {
  console.log('📞 Calling getOtp API:', {
    url: `${mainApiBaseUrl}/api/getOtp`,
    payload,
  });
  
  try {
    const response = await mainApiClient.post("/api/getOtp", payload);
    console.log('✅ getOtp Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    
    // Return the data directly or wrap it if needed
    return response.data;
  } catch (error) {
    console.error('❌ getOtp API Error:', error);
    throw error;
  }
}

export async function updateProfile(userId: number, payload: UpdateProfilePayload) {
  const { data } = await serviceClient.put(`/api/referral-users/profile/${userId}`, payload);
  return data;
}

export async function confirmOtp(payload: ConfirmOtpPayload) {
  console.log('🔐 Calling confirmOtp API:', {
    url: `${mainApiBaseUrl}/api/confirmOtp`,
    payload: {
      ...payload,
      otp: '******', // Don't log the actual OTP
    },
  });
  
  try {
    const response = await mainApiClient.post("/api/confirmOtp", payload);
    console.log('✅ confirmOtp Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ confirmOtp API Error:', error);
    throw error;
  }
}

export async function createReferralTransaction(payload: CreateReferralLinkPayload) {
  const { data } = await serviceClient.post("/api/referral/add", payload);
  return data;
}

export async function fetchReferralLinks(referrerId: number) {
  const { data } = await serviceClient.get(
    `/api/referral/my-referrals?referrerId=${referrerId}`,
  );
  return data;
}

