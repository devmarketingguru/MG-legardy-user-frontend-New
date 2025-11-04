'use client';

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState, useTransition } from "react";
import { loginReferralUser } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { LogIn, ShieldCheck } from "lucide-react";
import { BANKS } from "@/lib/constants/banks";
import { useMemo } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    phoneNumber: "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { user, setUser, loadFromStorage } = useAuthStore();

  const getBankLabel = useMemo(
    () =>
      (bankValue?: string | null) => {
        if (!bankValue) return null;
        const bank = BANKS.find((b) => b.value === bankValue);
        return bank ? bank.label : bankValue;
      },
    [],
  );

  useEffect(() => {
    if (!user) {
      loadFromStorage();
    } else {
      router.replace("/dashboard");
    }
  }, [user, loadFromStorage, router]);

  const handleChange =
    (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement>) => {
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
        const data = await loginReferralUser({
          phoneNumber: form.phoneNumber.trim(),
          password: form.password,
        });
        setUser({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          bank: data.bank,
          bankAccount: data.bankAccount,
        });
        setMessage("เข้าสู่ระบบสำเร็จ");
        router.replace("/dashboard");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "object" && err !== null && "message" in err
              ? String((err as { message: unknown }).message)
              : "เข้าสู่ระบบไม่สำเร็จ";
        console.error("login error", err);
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
        <div className="flex flex-col justify-center space-y-8 bg-gradient-to-br from-[rgb(59_130_246)] via-[rgb(37_99_235)] to-[rgb(29_78_216)] p-10 text-white lg:p-16">
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
          <p className="max-w-xl text-sm leading-relaxed text-slate-100/80">
             เข้าสู่ระบบเพื่อจัดการลิงก์แนะนำ ตรวจสอบสถิติ และดูรายได้ของคุณ
           </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white">
                <ShieldCheck className="h-4 w-4 text-white" stroke="currentColor" />
              </span>
              <span className="text-white">ระบบปลอดภัยและใช้งานง่าย</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white">
                <ShieldCheck className="h-4 w-4 text-white" stroke="currentColor" />
              </span>
              <span className="text-white">ข้อมูลอัปเดตแบบเรียลไทม์</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white">
                <ShieldCheck className="h-4 w-4 text-white" stroke="currentColor" />
              </span>
              <span className="text-white">เข้าถึงได้ทุกที่ทุกเวลา</span>
            </li>
          </ul>
        </div>

        <div className="rounded-none border border-[#e7eaf4] bg-white p-10 shadow-[0_18px_40px_-32px_rgba(16,24,40,0.3)] lg:p-16">
          <h1 className="text-2xl font-semibold text-slate-900 lg:text-3xl">
            เข้าสู่ระบบ
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            ใช้เบอร์โทรศัพท์ที่สมัครสมาชิกเพื่อเข้าสู่ระบบ
          </p>

          {user && (
            <div className="mt-6 rounded-xl border border-[rgb(59_130_246/0.3)] bg-[rgb(59_130_246/0.1)] px-4 py-3 text-left text-xs text-[rgb(59_130_246)]">
              <p className="font-semibold text-[rgb(59_130_246)]">
                ข้อมูลบัญชีของคุณ
              </p>
              <p className="mt-1 text-[rgb(59_130_246)]/80">{user.phoneNumber}</p>
              {getBankLabel(user.bank) && (
                <p className="mt-1 text-[rgb(59_130_246)]/70">
                  {getBankLabel(user.bank)} {user.bankAccount}
                </p>
              )}
            </div>
          )}

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-2xl border border-[#e7eaf4] bg-[#f9fbff] px-6 py-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">เบอร์โทรศัพท์</span>
                <input
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                  value={form.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  required
                  inputMode="numeric"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">รหัสผ่าน</span>
                <input
                  type="password"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                />
              </label>
            </div>

            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[rgb(59_130_246)] py-3 text-lg font-semibold text-white shadow-lg shadow-[rgb(59_130_246/0.25)] transition-all duration-300 hover:bg-[rgb(37_99_235)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={pending}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                <LogIn className="h-5 w-5 text-white" stroke="currentColor" />
              </span>
              {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </motion.button>
          </form>

          <div className="mt-8 rounded-xl border border-[rgb(59_130_246/0.5)] bg-[rgb(59_130_246/0.1)] px-4 py-3 text-center text-xs text-[rgb(59_130_246)]">
            ระบบนี้รองรับเฉพาะผู้แนะนำที่ได้รับการยืนยันให้ใช้งานจาก Legardy เท่านั้น
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/register"
              className="font-medium text-[rgb(59_130_246)] underline-offset-4 hover:underline"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}