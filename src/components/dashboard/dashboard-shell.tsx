import Link from "next/link";
import { ReactNode } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { BANKS } from "@/lib/constants/banks";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user, clearUser } = useAuthStore();

  const handleLogout = () => {
    clearUser();
  };

  const getBankLabel = (bankValue: string) => {
    const bank = BANKS.find((b) => b.value === bankValue);
    return bank ? bank.label : bankValue;
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <header className="border-b border-[#d6b98c]/60 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f8f3ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#634f29]">
              Legardy
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-[#1f3a68]">
              ศูนย์ควบคุมผู้แนะนำ
            </h1>
            <p className="text-sm text-slate-500">
              จัดการลิ้งเชิญเพื่อนและตรวจสอบสถิติการแนะนำ
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="rounded-2xl border border-[#d6b98c]/70 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <div className="font-semibold text-[#1f3a68]">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-slate-500">{user.phoneNumber}</div>
                  {user.bank && (
                    <div className="text-xs text-[#1f3a68]/80">
                      {getBankLabel(user.bank)} {user.bankAccount}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-[#d6b98c]/60 px-4 py-2 text-sm font-medium text-[#1f3a68] shadow-sm transition hover:bg-[#f8f3ea]"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-xl border border-[#d6b98c]/60 px-4 py-2 text-sm font-medium text-[#1f3a68] shadow-sm transition hover:bg-[#f8f3ea]"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[2fr_1.3fr]">{children}</div>
      </main>
    </div>
  );
}