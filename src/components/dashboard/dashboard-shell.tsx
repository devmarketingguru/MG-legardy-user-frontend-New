import Link from "next/link";
import { ReactNode } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Sidebar } from "./sidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          <header className="bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-[rgb(59_130_246/0.5)] px-6 py-5">
              <div className="hidden lg:block">
                <h1 className="text-2xl font-semibold text-[rgb(59_130_246)]">
                  ศูนย์ควบคุมผู้แนะนำ
                </h1>
                <p className="text-sm text-slate-500">
                  จัดการลิ้งเชิญเพื่อนและตรวจสอบสถิติการแนะนำ
                </p>
              </div>
              {user && (
                <div className="ml-auto rounded-2xl border border-[rgb(59_130_246/0.5)] bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <div className="font-semibold text-[rgb(59_130_246)]">
                    สวัสดี! {user.firstName} {user.lastName}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto px-6 py-10">
            <div className="mx-auto max-w-7xl">
              <div className="space-y-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}