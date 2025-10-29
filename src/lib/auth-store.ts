import { create } from "zustand";

export interface ReferralUserInfo {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  bank?: string;
  bankAccount?: string;
}

interface AuthState {
  user: ReferralUserInfo | null;
  setUser: (user: ReferralUserInfo | null) => void;
  loadFromStorage: () => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("legardyReferralUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("legardyReferralUser");
      }
    }
    set({ user });
  },
  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("legardyReferralUser");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as ReferralUserInfo;
      set({ user: parsed });
    } catch (error) {
      console.error("Failed to parse referral user info from storage", error);
      localStorage.removeItem("legardyReferralUser");
    }
  },
  clearUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("legardyReferralUser");
    }
    set({ user: null });
  },
}));
