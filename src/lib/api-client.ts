import axios from "axios";

const DEFAULT_SERVICE_URL = "http://localhost:3000";

const serviceBaseUrl =
  process.env.NEXT_PUBLIC_SERVICE_URL?.replace(/\/$/, "") ?? DEFAULT_SERVICE_URL;

export const serviceClient = axios.create({
  baseURL: serviceBaseUrl,
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

