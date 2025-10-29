import useSWR from "swr";
import { serviceClient } from "@/lib/api-client";

interface ReferralStatsResponse {
  success: boolean;
  data: {
    totalReferrals: number;
    successfulReferrals: number;
    pendingReferrals: number;
  };
}

export function useReferralStats(referrerId: number | null) {
  return useSWR<ReferralStatsResponse>(
    referrerId ? ["referralStats", referrerId] : null,
    async () => {
      const { data } = await serviceClient.get<ReferralStatsResponse>(
        `/api/dashboard/referral/my-stats?referrerId=${referrerId}`,
      );
      return data;
    },
    {
      revalidateOnFocus: false,
    },
  );
}
