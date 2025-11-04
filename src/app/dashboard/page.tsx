'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ReferralStatsCard } from "@/components/dashboard/referral-stats-card";
import { ReferralLinksTable } from "@/components/dashboard/referral-links-table";
import { useAuthStore } from "@/lib/auth-store";
import { useReferralStats } from "@/hooks/use-referral-stats";
import { fetchReferralLinks } from "@/lib/api-client";
import { getReferralLink } from "@/lib/referral-link";

interface ReferralTransactionItem {
  id: number;
  referredId: number;
  referredFirstName: string;
  referredLastName: string;
  referralCode: string;
  status: string;
  createdAt: string;
  paidAt?: string | null;
  payoutBatchId?: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loadFromStorage } = useAuthStore();
  // ใช้ logic เดียวกับ legardy-lawyer: ส่ง user?.id โดยตรง (ไม่ใส่ ?? null)
  // เพื่อให้ hook รอ user โหลดเสร็จก่อน เพราะ hook มี validation referrerId > 0
  const referralStatsQuery = useReferralStats(user?.id);
  const [transactions, setTransactions] = useState<ReferralTransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableMessage, setTableMessage] = useState<string | null>(null);

  const referralId = user?.id ?? null;
  const referralUrl = getReferralLink(referralId, "user");

  // ใช้ logic เดียวกับ legardy-lawyer
  const stats = referralStatsQuery.data?.success
    ? referralStatsQuery.data.data
    : {
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
      };


  useEffect(() => {
    if (!user) {
      loadFromStorage();
    }
  }, [user, loadFromStorage]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!referralId) {
      return;
    }

    const loadTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetchReferralLinks(referralId);
        if (response?.success && Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Failed to load referral links", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [referralId]);

  if (!user) {
    return null;
  }


  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ReferralStatsCard
            totalReferrals={stats.totalReferrals}
            successfulReferrals={stats.successfulReferrals}
            pendingReferrals={stats.pendingReferrals}
          />
        </motion.div>

        {/* Referral Links Table (รวม main link และ table) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
            <ReferralLinksTable
              transactions={transactions}
              statusMessage={tableMessage}
              loading={loading}
              mainReferralUrl={referralUrl}
            />
        </motion.div>
      </div>
    </DashboardShell>
  );
}