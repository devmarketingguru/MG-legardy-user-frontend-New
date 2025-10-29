'use client';

import { Copy, Link as LinkIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface CreateReferralLinkCardProps {
  referralUrl: string;
}

export function CreateReferralLinkCard({ referralUrl }: CreateReferralLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-card border border-[#d6b98c]/70 p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-[#d6b98c]/60 pb-4">
          <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f3a68] text-[#c6a269] shadow-lg shadow-[#1f3a68]/25">
              <LinkIcon className="h-5 w-5" />
            </span>
            ลิงก์เชิญเพื่อนของคุณ
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f8f3ea] px-3 py-1 text-xs font-medium text-[#634f29]">
            <Sparkles className="h-4 w-4 text-[#c6a269]" />
            แชร์และคัดลอกง่าย
          </span>
        </div>
        <div className="mt-6 space-y-4">
          <p className="text-sm leading-relaxed text-slate-600">
            ส่งลิงก์นี้ให้กับผู้สนใจ เพื่อให้รู้ว่ามาจากการแนะนำของคุณ
          </p>
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <input
                value={referralUrl}
                readOnly
                className="w-full rounded-xl border border-[#d6b98c]/60 bg-[#f8f3ea] px-4 py-3 text-sm font-medium text-[#1f3a68] shadow-inner focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
              />
              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-xs font-medium text-indigo-400 lg:block">
                ใช้ลิงก์นี้เท่านั้น
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f3a68] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1f3a68]/25 transition hover:bg-[#1b3157]"
            >
              <Copy className="h-4 w-4" />
              {copied ? "คัดลอกแล้ว!" : "คัดลอกลิงก์"}
            </button>
          </div>
          {copied && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-xs font-medium text-emerald-700">
              คัดลอกลิงก์สำเร็จแล้ว แชร์ให้กับเครือข่ายของคุณได้ทันที
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}