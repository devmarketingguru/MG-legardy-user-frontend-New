'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CreateReferralLinkCard } from "@/components/dashboard/create-referral-link-card";
import { ReferralStatsCard } from "@/components/dashboard/referral-stats-card";
import { ReferralLinksTable } from "@/components/dashboard/referral-links-table";
import { useAuthStore } from "@/lib/auth-store";
import { useReferralStats } from "@/hooks/use-referral-stats";
import { fetchReferralLinks } from "@/lib/api-client";

interface ReferralTransactionItem {
  id: number;
  referredFirstName: string;
  referredLastName: string;
  referralCode: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loadFromStorage } = useAuthStore();
  const { data: statsResponse } = useReferralStats(user?.id ?? null);
  const [transactions, setTransactions] = useState<ReferralTransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableMessage, setTableMessage] = useState<string | null>(null);

  const referralBaseUrl =
    process.env.NEXT_PUBLIC_LAWYER_REGISTER_URL ??
    "http://localhost:3002/register-lawyer";
  const referralId = user?.id ?? null;
  const referralUrl = referralId
    ? `${referralBaseUrl}?referralId=${referralId}&referrerType=user`
    : referralBaseUrl;

  const stats = statsResponse?.success
    ? statsResponse.data
    : {
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
      };

  const tableItems = useMemo(() => {
    if (!referralId) {
      return [];
    }

    const grouped = new Map<string, ReferralTransactionItem[]>();
    transactions.forEach((item) => {
      const key = item.referralCode || String(referralId);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)?.push(item);
    });

    return Array.from(grouped.entries()).map(([code, list], index) => {
      const successful = list.filter((t) => t.status === "approved").length;
      const createdAt = list.reduce((latest, current) => {
        return new Date(current.createdAt) > new Date(latest)
          ? current.createdAt
          : latest;
      }, list[0]?.createdAt ?? new Date().toISOString());

      return {
        id: index + 1,
        title: `ลิ้งเชิญ #${code}`,
        referralUrl: `${referralUrl}&ref=${encodeURIComponent(code)}`,
        totalReferrals: list.length,
        successfulReferrals: successful,
        createdAt,
      };
    });
  }, [transactions, referralId, referralUrl]);

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

  const handleCopyLink = (link: { referralUrl: string }) => {
    navigator.clipboard.writeText(link.referralUrl);
    setTableMessage("คัดลอกลิ้งเรียบร้อยแล้ว");
    setTimeout(() => setTableMessage(null), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(29,45,74,0.12),_rgba(31,58,104,0.08)_48%,_rgba(198,162,105,0.08)_85%)]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-[#22344f]/40 blur-3xl" />
        <div className="absolute right-16 bottom-16 h-80 w-80 rounded-full bg-[#c6a269]/25 blur-[110px]" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#1f3a68]/15 blur-[150px]" />
      </div>

      <DashboardShell>
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CreateReferralLinkCard referralUrl={referralUrl} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ReferralStatsCard
              totalReferrals={stats.totalReferrals}
              successfulReferrals={stats.successfulReferrals}
              pendingReferrals={stats.pendingReferrals}
            />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <ReferralLinksTable
            links={tableItems}
            onCopyLink={handleCopyLink}
            statusMessage={tableMessage}
            loading={loading}
          />
        </motion.div>
      </DashboardShell>
    </div>
  );
}