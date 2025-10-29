'use client';

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import { registerReferralUser } from "@/lib/api-client";
import { motion } from "framer-motion";
import { CheckCircle, UserPlus } from "lucide-react";
import { BANKS } from "@/lib/constants/banks";

const genders = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "male" as "male" | "female",
    birthDate: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    bank: "",
    bankAccount: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleChange =
    (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      try {
        await registerReferralUser({
          ...form,
          phoneNumber: form.phoneNumber.trim(),
        });
        setMessage("สมัครสมาชิกสำเร็จ สามารถเข้าสู่ระบบได้แล้ว");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "object" && err !== null && "message" in err
              ? String((err as { message: unknown }).message)
              : "สมัครสมาชิกไม่สำเร็จ";
        console.error("register error", err);
        setError(message);
      }
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#dfe6f4,_#eef1f7,_#dfe6f4)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-48px_rgba(16,24,40,0.45)] lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center space-y-8 bg-gradient-to-br from-[#142033] via-[#182946] to-[#101b30] p-10 text-slate-100 lg:p-16">
          <div className="flex items-center justify-center">
            <Image
              src="/images/logo_big.png"
              alt="Legardy"
              width={200}
              height={80}
              className="h-auto w-auto object-contain"
              priority
            />
          </div>
          <h2 className="text-3xl font-semibold leading-tight text-white lg:text-4xl">
            เข้าร่วมเป็นผู้แนะนำกับ Legardy
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-100/80">
            สร้างรายได้จากการแนะนำทนายความคุณภาพเข้าสู่แพลตฟอร์มของเรา
            พร้อมเครื่องมือติดตามผลที่ใช้งานง่าย
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white">
                <CheckCircle className="h-4 w-4 text-white" stroke="currentColor" />
              </span>
              <span className="text-white">สร้างลิงก์แนะนำส่วนตัวได้ทันที</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white">
                <CheckCircle className="h-4 w-4 text-white" stroke="currentColor" />
              </span>
              <span className="text-white">ติดตามสถิติการสมัครและรายได้แบบเรียลไทม์</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white">
                <CheckCircle className="h-4 w-4 text-white" stroke="currentColor" />
              </span>
              <span className="text-white">รับค่าคอมมิชชั่นเมื่อทนายความที่แนะนำได้รับการอนุมัติ</span>
            </li>
          </ul>
        </div>

        <div className="rounded-none border border-[#e7eaf4] bg-white p-10 shadow-[0_18px_40px_-32px_rgba(16,24,40,0.3)] lg:p-16">
          <h1 className="text-2xl font-semibold text-slate-900 lg:text-3xl">
            สมัครสมาชิกใหม่
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
            สร้างบัญชีเพื่อติดตามสถิติการเชิญเพื่อนและจัดการลิ้งแนะนำของคุณ
          </p>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            <section className="rounded-2xl border border-[#e7eaf4] bg-[#f9fbff] px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-800">ข้อมูลส่วนตัว</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Step 1
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    ชื่อจริง
                  </span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">นามสกุล</span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">เพศ</span>
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.gender}
                    onChange={handleChange("gender")}
                  >
                    {genders.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    วันเดือนปีเกิด
                  </span>
                  <input
                    type="date"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.birthDate}
                    onChange={handleChange("birthDate")}
                    required
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e7eaf4] bg-[#f9fbff] px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-800">ข้อมูลติดต่อ</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Step 2
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    เบอร์โทรศัพท์
                  </span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.phoneNumber}
                    onChange={handleChange("phoneNumber")}
                    required
                    inputMode="numeric"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    อีเมล
                  </span>
                  <input
                    type="email"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e7eaf4] bg-[#f9fbff] px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-800">ตั้งค่าบัญชี</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Step 3
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    รหัสผ่าน
                  </span>
                  <input
                    type="password"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.password}
                    onChange={handleChange("password")}
                    required
                    minLength={8}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    ยืนยันรหัสผ่าน
                  </span>
                  <input
                    type="password"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    required
                    minLength={8}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e7eaf4] bg-[#f9fbff] px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-800">ข้อมูลบัญชีธนาคาร</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Step 4
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    ธนาคาร
                  </span>
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.bank}
                    onChange={handleChange("bank")}
                  >
                    <option value="">เลือกธนาคาร</option>
                    {BANKS.map((bank) => (
                      <option key={bank.value} value={bank.value}>
                        {bank.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    หมายเลขบัญชี
                  </span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[#1f3a68] focus:ring-2 focus:ring-[#1f3a68]/20"
                    value={form.bankAccount}
                    onChange={handleChange("bankAccount")}
                    inputMode="numeric"
                    placeholder="หมายเลขบัญชีธนาคาร"
                  />
                </label>
              </div>
            </section>

            {message && (
              <div className="rounded-xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/60 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-rose-300/80 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/60 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1f3a68] py-3 text-lg font-semibold text-white shadow-lg shadow-[#1f3a68]/25 transition-all duration-300 hover:bg-[#1b3157] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={pending}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                <UserPlus className="h-5 w-5 text-white" stroke="currentColor" />
              </span>
              {pending ? "กำลังบันทึก..." : "สมัครสมาชิก"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            มีบัญชีอยู่แล้วใช่ไหม?{" "}
            <Link
              href="/login"
              className="font-medium text-[#1f3a68] underline-offset-4 hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}