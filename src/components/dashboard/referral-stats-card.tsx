'use client';

import { Users, UserCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ReferralStatsCardProps {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
}

export function ReferralStatsCard({
  totalReferrals,
  successfulReferrals,
  pendingReferrals,
}: ReferralStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="section-card border border-[#d6b98c]/70 p-6 shadow-card">
        <div className="flex flex-row items-center justify-between border-b border-[#d6b98c]/60 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c6a269]">
              Referral Overview
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              ภาพรวมสถิติการเชิญเพื่อน
            </h3>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f3a68] text-[#c6a269] shadow-lg shadow-[#1f3a68]/25">
            <Users className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-[#d6b98c]/40 bg-gradient-to-br from-[#f8f3ea] via-white to-[#f2e4cc] p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#1f3a68]/70">
              ทั้งหมด
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-[#1f3a68]">
                {totalReferrals}
              </span>
              <span className="text-xs text-[#1f3a68]/70">คำเชิญ</span>
            </div>
            <div className="absolute right-4 top-4 text-[#1f3a68]/20">
              <Users className="h-10 w-10" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-emerald-100/40 via-white to-emerald-50/30 p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600/80">
              สมัครสำเร็จ
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-emerald-600">
                {successfulReferrals}
              </span>
              <span className="text-xs text-emerald-500/80">รายการ</span>
            </div>
            <div className="absolute right-4 top-4 text-emerald-400/30">
              <UserCheck className="h-10 w-10" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-amber-200/40 bg-gradient-to-br from-amber-100/40 via-white to-amber-50/30 p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600/80">
              รอดำเนินการ
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-amber-600">
                {pendingReferrals}
              </span>
              <span className="text-xs text-amber-500/80">รายการ</span>
            </div>
            <div className="absolute right-4 top-4 text-amber-400/30">
              <Clock className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}