'use client';

import Link from "next/link";
import { ShieldCheck, Users, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(29,45,74,0.12),_rgba(31,58,104,0.08)_45%,_rgba(198,162,105,0.08)_85%)] py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-[#22344f]/45 blur-[110px]" />
        <div className="absolute bottom-0 right-24 h-72 w-72 rounded-full bg-[#c6a269]/25 blur-[120px]" />
        <div className="absolute left-20 bottom-32 h-64 w-64 rounded-full bg-[#1f3a68]/15 blur-[140px]" />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-14 px-6 text-center">
        <div className="highlight-badge mt-2">
          <ShieldCheck className="size-4" />
          Legardy Referral Partner Portal
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            พื้นที่จัดการการเชิญเพื่อนสำหรับผู้แนะนำ Legardy
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            ดูแลการแนะนำทนายอย่างมืออาชีพ สร้างลิ้งเชิญส่วนตัว รับรู้สถานะการอนุมัติทันที และติดตามสถิติแบบเรียลไทม์
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2">
          <Link
            href="/register"
            className="group flex items-center justify-center gap-3 rounded-2xl border border-[#d6b98c]/80 bg-[#1f3a68] px-8 py-4 text-base font-medium text-white shadow-lg shadow-[#1f3a68]/25 transition hover:-translate-y-1 hover:bg-[#1b3157]"
          >
            <Users className="size-5" />
            สร้างบัญชีผู้แนะนำใหม่
          </Link>
          <Link
            href="/login"
            className="group flex items-center justify-center gap-3 rounded-2xl border border-[#d6b98c]/70 bg-white/90 px-8 py-4 text-base font-medium text-[#1f3a68] shadow transition hover:-translate-y-1 hover:bg-[#f8f3ea]"
          >
            <ShieldCheck className="size-5" />
            เข้าสู่ระบบเพื่อจัดการลิ้ง
          </Link>
        </div>

        <div className="section-card w-full rounded-3xl border border-[#d6b98c]/70 px-8 py-10 text-left">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#c6a269]">
                Why partner with Legardy
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                หนึ่งเดียวที่รวมงานด้านกฎหมายและระบบผู้แนะนำไว้ครบในที่เดียว
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
                ระบบเดียวกับที่ทนายความในแพลตฟอร์มใช้งาน ช่วยให้ผู้แนะนำของ Legardy ติดตามผลการสมัครและการอนุมัติได้อย่างโปร่งใส พร้อมข้อมูลสถิติแบบละเอียด
              </p>
            </div>
            <div className="grid gap-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200/60 bg-slate-50/40 px-5 py-4">
                <div className="flex items-center gap-3 font-medium text-slate-700">
                  <Award className="size-4 text-indigo-500" />
                  เหมาะกับที่ปรึกษา เครือข่าย และพันธมิตรทางธุรกิจ
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  สร้างความน่าเชื่อถือ ดึงดูดผู้ที่ต้องการคำปรึกษาเรื่องกฎหมายและจัดการค่าตอบแทนได้เป็นระบบ
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/60 bg-slate-50/40 px-5 py-4">
                <div className="flex items-center gap-3 font-medium text-slate-700">
                  <Users className="size-4 text-indigo-500" />
                  พร้อมใช้ร่วมกับแคมเปญและอีเวนต์ต่าง ๆ
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  แชร์ลิ้งของคุณได้จากทุกอุปกรณ์ ติดตามสถานะได้ตลอด และส่งต่อให้ทีม Legardy ดูแลต่อให้ครบทุกขั้นตอน
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}