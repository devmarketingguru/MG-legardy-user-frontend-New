'use client';

import { useState, useTransition, ChangeEvent, FormEvent, useEffect } from "react";
import { useAuthStore, ReferralUserInfo } from "@/lib/auth-store";
import { updateProfile } from "@/lib/api-client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { motion } from "framer-motion";
import { Save, User, CreditCard } from "lucide-react";
import { BANKS } from "@/lib/constants/banks";

export default function AccountSettingsPage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bank: "",
    bankAccount: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bank: user.bank || "",
        bankAccount: user.bankAccount || "",
      });
    }
  }, [user]);

  const handleChange =
    (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setError(null);
      setMessage(null);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!user) {
      setError("กรุณาเข้าสู่ระบบ");
      return;
    }

    startTransition(async () => {
      try {
        const updatedUser = await updateProfile(user.id, {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          bank: form.bank.trim() || undefined,
          bankAccount: form.bankAccount.trim() || undefined,
        });

        // Update auth store
        const updatedUserInfo: ReferralUserInfo = {
          ...user,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          bank: updatedUser.bank,
          bankAccount: updatedUser.bankAccount,
        };
        setUser(updatedUserInfo);

        setMessage("อัพเดทข้อมูลส่วนตัวสำเร็จ");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "object" && err !== null && "message" in err
              ? String((err as { message: unknown }).message)
              : "อัพเดทข้อมูลส่วนตัวไม่สำเร็จ";
        console.error("update profile error", err);
        setError(message);
      }
    });
  };

  if (!user) {
    return (
      <DashboardShell>
        <div className="text-center text-slate-500">กรุณาเข้าสู่ระบบ</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">ตั้งค่าบัญชี</h1>
          <p className="mt-2 text-sm text-slate-600">
            แก้ไขข้อมูลส่วนตัวของคุณ (ชื่อ นามสกุล และข้อมูลบัญชีธนาคาร)
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Personal Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(59_130_246/0.1)] text-[rgb(59_130_246)]">
                <User className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">ข้อมูลส่วนตัว</h2>
                <p className="text-xs text-slate-500">แก้ไขชื่อและนามสกุล</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  ชื่อจริง <span className="text-rose-500">*</span>
                </span>
                <input
                  type="text"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  นามสกุล <span className="text-rose-500">*</span>
                </span>
                <input
                  type="text"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  required
                />
              </label>
            </div>
          </section>

          {/* Bank Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(59_130_246/0.1)] text-[rgb(59_130_246)]">
                <CreditCard className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">ข้อมูลบัญชีธนาคาร</h2>
                <p className="text-xs text-slate-500">แก้ไขข้อมูลธนาคารและเลขบัญชี</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">ธนาคาร</span>
                <select
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
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
                <span className="text-sm font-medium text-slate-700">เลขบัญชี</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[rgb(59_130_246)] focus:ring-2 focus:ring-[rgb(59_130_246/0.2)]"
                  value={form.bankAccount}
                  onChange={handleChange("bankAccount")}
                  placeholder="หมายเลขบัญชีธนาคาร"
                />
              </label>
            </div>
          </section>

          {/* Messages */}
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

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[rgb(59_130_246)] py-3 text-lg font-semibold text-white shadow-lg shadow-[rgb(59_130_246/0.25)] transition-all duration-300 hover:bg-[rgb(37_99_235)] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={pending}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              <Save className="h-5 w-5 text-white" stroke="currentColor" />
            </span>
            {pending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </motion.button>
        </motion.form>
      </div>
    </DashboardShell>
  );
}

