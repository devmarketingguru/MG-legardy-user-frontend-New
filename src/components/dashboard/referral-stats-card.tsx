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
      <div className="section-card border border-[rgb(59_130_246/0.5)] p-6 shadow-card">
        <div className="flex flex-row items-center justify-between border-b border-[rgb(59_130_246/0.5)] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[rgb(59_130_246)]">
              Referral Overview
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              ภาพรวมสถิติการเชิญเพื่อน
            </h3>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(59_130_246)] text-white shadow-lg shadow-[rgb(59_130_246/0.25)]">
            <Users className="h-5 w-5 text-white" />
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* ทั้งหมด - Blue */}
          <div className="rounded-xl border border-blue-200/50 bg-blue-50/30 p-5">
            <span className="text-xs font-medium text-blue-700/80">
              ทั้งหมด
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-blue-600">
                {totalReferrals}
              </span>
              <span className="text-xs text-blue-600/70">คำเชิญ</span>
            </div>
          </div>

          {/* สมัครสำเร็จ - Green */}
          <div className="rounded-xl border border-green-200/50 bg-green-50/30 p-5">
            <span className="text-xs font-medium text-green-700/80">
              สมัครสำเร็จ
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-green-600">
                {successfulReferrals}
              </span>
              <span className="text-xs text-green-600/70">รายการ</span>
            </div>
          </div>

          {/* รอดำเนินการ - Orange */}
          <div className="rounded-xl border border-orange-200/50 bg-orange-50/30 p-5">
            <span className="text-xs font-medium text-orange-700/80">
              รอดำเนินการ
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-orange-600">
                {pendingReferrals}
              </span>
              <span className="text-xs text-orange-600/70">รายการ</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}