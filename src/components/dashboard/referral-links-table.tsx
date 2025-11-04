'use client';

import { Copy, Link as LinkIcon, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ReferralTransaction {
  id: number;
  referredId: number;
  referredFirstName: string;
  referredLastName: string;
  status: string;
  createdAt: string;
  paidAt?: string | null;
  payoutBatchId?: string | null;
}

interface ReferralLinksTableProps {
  transactions: ReferralTransaction[];
  statusMessage: string | null;
  loading?: boolean;
  mainReferralUrl?: string; // ลิงก์หลักสำหรับแสดงและคัดลอก
}

export function ReferralLinksTable({ 
  transactions, 
  statusMessage, 
  loading,
  mainReferralUrl 
}: ReferralLinksTableProps) {
  const [copiedMainLink, setCopiedMainLink] = useState(false);

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

  const handleCopyMainLink = () => {
    if (mainReferralUrl) {
      navigator.clipboard.writeText(mainReferralUrl);
      setCopiedMainLink(true);
      setTimeout(() => setCopiedMainLink(false), 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-600";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "rejected":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "อนุมัติแล้ว";
      case "pending":
        return "รอดำเนินการ";
      case "rejected":
        return "ปฏิเสธ";
      default:
        return status;
    }
  };

  // Helper functions สำหรับสถานะการโอนเงิน (เหมือน admin)
  const getPaymentStatus = (transaction: ReferralTransaction) => {
    if (transaction?.paidAt && transaction?.payoutBatchId) {
      return 'paid';
    }
    return 'unpaid';
  };

  const getPaymentStatusColor = (transaction: ReferralTransaction) => {
    const status = getPaymentStatus(transaction);
    return status === 'paid' 
      ? 'bg-green-500/10 text-green-600' 
      : 'bg-orange-500/10 text-orange-600';
  };

  const getPaymentStatusText = (transaction: ReferralTransaction) => {
    const status = getPaymentStatus(transaction);
    if (status === 'paid' && transaction?.payoutBatchId) {
      return `จ่ายแล้ว (${transaction.payoutBatchId})`;
    }
    return status === 'paid' ? 'จ่ายแล้ว' : 'ยังไม่จ่าย';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="section-card border border-[rgb(59_130_246/0.5)] shadow-lg">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[rgb(59_130_246/0.5)] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(59_130_246)] text-white shadow-lg shadow-[rgb(59_130_246/0.25)]">
              <LinkIcon className="h-5 w-5 text-white" />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                ลิงก์เชิญเพื่อนของคุณ
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                สร้างและจัดการลิงก์เชิญเพื่อนของคุณ
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 self-start rounded-full bg-[rgb(59_130_246/0.1)] px-3 py-1 text-xs font-medium text-[rgb(59_130_246)] lg:self-auto">
            <Sparkles className="h-4 w-4 text-[rgb(59_130_246)]" />
            แชร์และคัดลอกง่าย
          </span>
        </div>

        {/* Main Link Section */}
        {mainReferralUrl && (
          <div className="border-b border-[rgb(59_130_246/0.3)] bg-gradient-to-r from-[rgb(59_130_246/0.05)] via-white to-[rgb(59_130_246/0.05)] px-6 py-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">ลิงก์หลักของคุณ:</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  ลิงก์แนะนำ
                </span>
              </div>
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                  <input
                    value={mainReferralUrl}
                    readOnly
                    className="w-full rounded-xl border border-[rgb(59_130_246/0.5)] bg-white px-4 py-3 text-sm font-medium text-[rgb(59_130_246)] shadow-sm focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)] outline-none"
                  />
                </div>
                <button
                  onClick={handleCopyMainLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(59_130_246)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgb(59_130_246/0.25)] transition hover:bg-[rgb(37_99_235)] whitespace-nowrap"
                >
                  <Copy className="h-4 w-4 text-white" />
                  {copiedMainLink ? "คัดลอกแล้ว!" : "คัดลอกลิงก์"}
                </button>
              </div>
              {copiedMainLink && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs font-medium text-emerald-700">
                  ✓ คัดลอกลิงก์สำเร็จแล้ว แชร์ให้กับเครือข่ายของคุณได้ทันที
                </div>
              )}
            </div>
          </div>
        )}

        {/* Table Section - รายชื่อทนายความที่เชิญ */}
        <div className="px-6 pb-6 pt-5">
          {statusMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700">
              {statusMessage}
            </div>
          )}
          
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[rgb(59_130_246)] to-purple-600">
                <Users className="h-5 w-5 text-white" />
              </span>
              <h4 className="text-lg font-semibold text-slate-900">
                รายชื่อทนายความที่เชิญ
              </h4>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {transactions.length} รายการ
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[rgb(59_130_246)] border-t-transparent"></div>
                <p className="text-sm text-slate-600">กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[rgb(59_130_246)] to-purple-600">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-700">ยังไม่มีข้อมูล</h3>
              <p className="mx-auto max-w-md text-slate-500">
                ยังไม่มีทนายความสมัครผ่านลิงก์เชิญเพื่อนของคุณ
                <br />
                แชร์ลิงก์ของคุณเพื่อเริ่มเชิญเพื่อน!
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-[rgb(59_130_246/0.05)]">
                    <th className="w-[80px] px-4 py-3 text-center text-xs font-semibold text-slate-700">
                      ลำดับ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                      วันที่สมัคร
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">
                      สถานะ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">
                      สถานะการโอนเงิน
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {transactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className="transition-all duration-200 hover:bg-gradient-to-r hover:from-[rgb(59_130_246/0.05)] hover:to-purple-50"
                    >
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[rgb(59_130_246)] to-purple-600 text-sm font-bold text-white">
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-800">
                          {transaction.referredFirstName} {transaction.referredLastName}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(transaction.status)}`}
                        >
                          {getStatusText(transaction.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusColor(transaction)}`}
                        >
                          {getPaymentStatusText(transaction)}
                        </span>
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