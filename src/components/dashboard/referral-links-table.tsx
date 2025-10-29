'use client';

import { Copy, Link as LinkIcon, Users, UserCheck, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

interface ReferralLinkItem {
  id: number;
  title: string;
  referralUrl: string;
  totalReferrals: number;
  successfulReferrals: number;
  createdAt: string;
}

interface ReferralLinksTableProps {
  links: ReferralLinkItem[];
  onCopyLink: (link: ReferralLinkItem) => void;
  statusMessage: string | null;
  loading?: boolean;
}

export function ReferralLinksTable({ links, onCopyLink, statusMessage, loading }: ReferralLinksTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="section-card border border-[#d6b98c]/70">
        <div className="flex items-center justify-between border-b border-[#d6b98c]/60 px-6 py-5">
          <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f3a68] text-[#c6a269] shadow-lg shadow-[#1f3a68]/25">
              <LinkIcon className="h-5 w-5" />
            </span>
            ลิงก์เชิญเพื่อนของคุณ
          </h3>
          <span className="rounded-full bg-[#f8f3ea] px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-[#634f29]">
            Activity
          </span>
        </div>
        <div className="px-6 pb-6">
          {statusMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700">
              {statusMessage}
            </div>
          )}
          {loading ? (
            <div className="py-8 text-center text-slate-500">
              กำลังโหลดข้อมูล...
            </div>
          ) : links.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              ยังไม่มีลิงก์เชิญเพื่อนในขณะนี้
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#d6b98c]/60">
              <table className="min-w-full divide-y divide-[#d6b98c]/50 bg-white/80">
                <thead>
                  <tr className="bg-[#f8f3ea] text-xs uppercase tracking-wider text-[#1f3a68]">
                    <th className="px-4 py-3 text-left">ชื่อลิงก์</th>
                    <th className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Users className="h-4 w-4" />
                        ยอดสมัครทั้งหมด
                      </span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <UserCheck className="h-4 w-4" />
                        สมัครสำเร็จ
                      </span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <CalendarDays className="h-4 w-4" />
                        สร้างเมื่อ
                      </span>
                    </th>
                    <th className="px-4 py-3 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d6b98c]/40">
                  {links.map((link) => (
                    <tr key={link.id} className="bg-white/90 transition hover:bg-[#f8f3ea]">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">
                        {link.title}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-slate-700">
                        {link.totalReferrals}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-slate-700">
                        {link.successfulReferrals}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-slate-700">
                        {formatDate(link.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => onCopyLink(link)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#d6b98c]/60 bg-[#f8f3ea] px-4 py-2 text-sm font-semibold text-[#1f3a68] transition hover:bg-[#f2e4cc]"
                        >
                          <Copy className="h-4 w-4 text-[#c6a269]" />
                          คัดลอก
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}