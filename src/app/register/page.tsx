'use client';

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerReferralUser, getOtp, confirmOtp } from "@/lib/api-client";
import { motion } from "framer-motion";
import { CheckCircle, UserPlus, Mail } from "lucide-react";
import { BANKS } from "@/lib/constants/banks";

const genders = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
];

export default function RegisterPage() {
  const router = useRouter();
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
  
  // OTP states
  const [otpCode, setOtpCode] = useState("");
  const [otpReference, setOtpReference] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpPending, setOtpPending] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleChange =
    (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Reset OTP verification when phone number changes
      if (field === "phoneNumber") {
        setIsOtpSent(false);
        setIsOtpVerified(false);
        setOtpReference(null);
        setOtpCode("");
        setOtpError(null);
      }
    };

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => {
        setOtpCountdown(otpCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const handleSendOtp = async () => {
    if (!form.phoneNumber.trim()) {
      setOtpError("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }

    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(form.phoneNumber.replace(/-/g, ""))) {
      setOtpError("เบอร์โทรศัพท์ไม่ถูกต้อง");
      return;
    }

    setOtpError(null);
    setOtpPending(true);

    try {
      console.log('📱 Sending OTP to:', form.phoneNumber.trim().replace(/-/g, ""));
      
      const response = await getOtp({
        phoneNumber: form.phoneNumber.trim().replace(/-/g, ""),
      });
      
      console.log('📨 OTP Response:', response);
      
      // Check various possible response structures
      const reference = 
        (response as { reference?: string })?.reference ||
        (response as { data?: { reference?: string } })?.data?.reference ||
        (response as { ref?: string })?.ref;
      
      if (reference) {
        setOtpReference(reference);
        setIsOtpSent(true);
        setIsOtpVerified(false);
        setOtpCountdown(60); // 60 seconds countdown
        setMessage("ส่งรหัส OTP สำเร็จ กรุณาตรวจสอบ SMS");
        setOtpError(null);
      } else {
        console.error('❌ No reference in response:', response);
        setOtpError("ไม่พบ reference ใน response กรุณาติดต่อผู้ดูแลระบบ");
      }
    } catch (err) {
      console.error('❌ OTP Send Error:', err);
      
      // Better error handling
      let errorMessage = "ไม่สามารถส่ง OTP ได้";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response: unknown }).response === "object" &&
        (err as { response: { data?: unknown } }).response !== null
      ) {
        const response = (err as { response: { data?: { message?: unknown } } }).response;
        if (response.data?.message) {
          errorMessage = String(response.data.message);
        } else if (response.data) {
          errorMessage = `Error: ${JSON.stringify(response.data)}`;
        }
      } else if (
        typeof err === "object" &&
        err !== null &&
        "message" in err
      ) {
        errorMessage = String((err as { message: unknown }).message);
      }
      
      setOtpError(errorMessage);
    } finally {
      setOtpPending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      setOtpError("กรุณากรอกรหัส OTP 6 หลัก");
      return;
    }

    if (!otpReference) {
      setOtpError("ไม่พบ reference กรุณาส่ง OTP ใหม่");
      return;
    }

    setOtpError(null);
    setOtpPending(true);

    try {
      console.log('🔐 Verifying OTP:', {
        otpLength: otpCode.trim().length,
        hasReference: !!otpReference,
        reference: otpReference,
      });
      
      const response = await confirmOtp({
        otp: otpCode.trim(),
        reference: otpReference,
        phoneNumber: form.phoneNumber.trim().replace(/-/g, ""), // Include phone number for backend verification
      });
      
      console.log('✅ OTP Verification Response:', response);
      
      setIsOtpVerified(true);
      setMessage("ยืนยัน OTP สำเร็จ");
      setOtpError(null);
    } catch (err) {
      console.error('❌ OTP Verification Error:', err);
      
      // Better error handling
      let errorMessage = "OTP ไม่ถูกต้อง";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response: unknown }).response === "object" &&
        (err as { response: { data?: unknown } }).response !== null
      ) {
        const response = (err as { response: { data?: { message?: unknown } } }).response;
        if (response.data?.message) {
          errorMessage = String(response.data.message);
        } else if (response.data) {
          // Check if response.data itself is a string or object
          if (typeof response.data === 'string') {
            errorMessage = response.data;
          } else {
            errorMessage = `Error: ${JSON.stringify(response.data)}`;
          }
        }
      } else if (
        typeof err === "object" &&
        err !== null &&
        "message" in err
      ) {
        errorMessage = String((err as { message: unknown }).message);
      }
      
      setOtpError(errorMessage);
      setIsOtpVerified(false);
    } finally {
      setOtpPending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    // Check OTP verification
    if (!isOtpVerified) {
      setError("กรุณายืนยันเบอร์โทรศัพท์ด้วย OTP ก่อน");
      return;
    }

    // Check password match
    if (form.password !== form.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    startTransition(async () => {
      try {
        await registerReferralUser({
          ...form,
          phoneNumber: form.phoneNumber.trim(),
        });
        setMessage("สมัครสมาชิกสำเร็จ กำลังไปที่หน้าเข้าสู่ระบบ...");
        
        // Redirect to login page after 1.5 seconds
        setTimeout(() => {
          router.push("/login");
        }, 1500);
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
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">นามสกุล</span>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">เพศ</span>
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                    value={form.gender}
                    onChange={handleChange("gender")}
                    required
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
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
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
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
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
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e7eaf4] bg-[#f9fbff] px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-800">ยืนยันเบอร์โทรศัพท์</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Step 3
                </span>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <label className="flex flex-1 flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      รหัส OTP (6 หลัก)
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                      value={otpCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setOtpCode(value);
                        setOtpError(null);
                      }}
                      placeholder="กรอกรหัส OTP"
                      inputMode="numeric"
                      disabled={!isOtpSent || otpPending}
                    />
                  </label>
                  <div className="flex gap-2">
                    {!isOtpSent ? (
                      <motion.button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpPending || !form.phoneNumber.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="rounded-xl border border-[rgb(59_130_246/0.5)] bg-[rgb(59_130_246)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[rgb(37_99_235)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {otpPending ? "กำลังส่ง..." : "ส่ง OTP"}
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpPending || otpCountdown > 0}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {otpCountdown > 0 ? `ส่งใหม่ (${otpCountdown}s)` : "ส่ง OTP ใหม่"}
                      </motion.button>
                    )}
                    {isOtpSent && !isOtpVerified && (
                      <motion.button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpPending || otpCode.length !== 6}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="rounded-xl border border-[rgb(59_130_246/0.5)] bg-[rgb(59_130_246)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[rgb(37_99_235)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {otpPending ? "กำลังตรวจสอบ..." : "ยืนยัน"}
                      </motion.button>
                    )}
                  </div>
                </div>
                {otpError && (
                  <div className="rounded-xl border border-rose-300/80 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/60 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
                    {otpError}
                  </div>
                )}
                {isOtpVerified && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/60 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>ยืนยันเบอร์โทรศัพท์สำเร็จ</span>
                  </div>
                )}
                {isOtpSent && !isOtpVerified && (
                  <div className="flex items-center gap-2 rounded-xl border border-[rgb(59_130_246/0.3)] bg-[rgb(59_130_246/0.1)] px-4 py-3 text-sm text-[rgb(59_130_246)]">
                    <Mail className="h-4 w-4" />
                    <span>กรุณาตรวจสอบ SMS และกรอกรหัส OTP</span>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e7eaf4] bg-[#f9fbff] px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-800">ตั้งค่าบัญชี</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Step 4
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    รหัสผ่าน
                  </span>
                  <input
                    type="password"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
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
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
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
                  Step 5
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    ธนาคาร
                  </span>
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
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
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
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
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[rgb(59_130_246)] py-3 text-lg font-semibold text-white shadow-lg shadow-[rgb(59_130_246/0.25)] transition-all duration-300 hover:bg-[rgb(37_99_235)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={pending || !isOtpVerified}
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
              className="font-medium text-[rgb(59_130_246)] underline-offset-4 hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}