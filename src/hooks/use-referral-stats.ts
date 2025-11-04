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

export function useReferralStats(referrerId: number | null | undefined) {
  return useSWR<ReferralStatsResponse>(
    // ถ้า referrerId เป็น 0 หรือไม่มีค่า ไม่ต้อง fetch
    (referrerId && referrerId > 0) ? ["referralStats", referrerId] : null,
    async () => {
      // Validation: ถ้า referrerId ไม่ valid ให้ return default values
      if (!referrerId || referrerId <= 0) {
        console.log('⚠️ useReferralStats: Invalid referrerId:', referrerId);
        return {
          success: true,
          data: {
            totalReferrals: 0,
            successfulReferrals: 0,
            pendingReferrals: 0,
          },
        };
      }

      console.log('📊 useReferralStats: Fetching stats for referrerId:', referrerId);
      const { data } = await serviceClient.get<ReferralStatsResponse>(
        `/api/dashboard/referral/my-stats?referrerId=${referrerId}`,
      );

      console.log('✅ useReferralStats: Response:', data);

      if (data.success) {
        return data;
      }

      return {
        success: false,
        data: {
          totalReferrals: 0,
          successfulReferrals: 0,
          pendingReferrals: 0,
        },
      };
    },
    {
      revalidateOnFocus: false,
      // ไม่ retry เมื่อ error (เหมือน legardy-lawyer)
      shouldRetryOnError: false,
      // Cache 1 นาที (เหมือน legardy-lawyer)
      dedupingInterval: 1000 * 60,
    },
  );
}
