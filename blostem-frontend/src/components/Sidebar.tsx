'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Mail, ShieldCheck, BarChart3, Target, Settings, Zap } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/campaigns', label: 'Campaigns', icon: Target },
  { href: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Blostem AI</h1>
            <p className="text-slate-400 text-xs">Marketing Engine</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
          <div className="w-9 h-9 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">DU</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Demo User</p>
            <p className="text-slate-400 text-xs">demo@blostem.ai</p>
          </div>
          <Settings className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}