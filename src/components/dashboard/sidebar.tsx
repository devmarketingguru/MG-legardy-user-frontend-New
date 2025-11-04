'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: SidebarItem[] = [
  {
    label: 'แดชบอร์ด',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'ตั้งค่าบัญชี',
    href: '/account-settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    clearUser();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-xl border border-[rgb(59_130_246/0.5)] bg-white/95 backdrop-blur p-3 shadow-sm transition hover:bg-[rgb(59_130_246/0.1)]"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-[rgb(59_130_246)]" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-full w-64 transform border-r border-[rgb(59_130_246/0.5)] bg-white/95 backdrop-blur transition-transform duration-300 lg:relative lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="border-b border-[rgb(59_130_246/0.5)] px-6 py-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[rgb(59_130_246/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[rgb(59_130_246)]">
              Legardy
            </div>
            <h2 className="mt-3 text-lg font-semibold text-[rgb(59_130_246)]">
              เมนูหลัก
            </h2>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                    ${
                      isActive
                        ? 'bg-[rgb(59_130_246)] text-white shadow-md [&_svg]:text-white'
                        : 'text-slate-700 hover:bg-[rgb(59_130_246/0.1)] hover:text-[rgb(59_130_246)] [&_svg]:text-slate-700'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-[rgb(59_130_246/0.5)] px-4 py-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-5 w-5 text-rose-600" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

