"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-[#020617] text-gray-200">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-[#12345c] bg-[#07142a] p-6 space-y-6">
        <h2 className="text-xl font-bold text-green-400 mb-6">
          CyberSatark Admin
        </h2>

        <nav className="space-y-3 text-sm">
          <SidebarItem label="Overview" href="/admin/dashboard" />
          <SidebarItem label="Articles" href="/admin/articles" />
          <SidebarItem label="Users" href="/admin/users" />
          <SidebarItem label="Reports" href="/admin/reports" />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 space-y-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-green-400">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor platform activity and manage content.
          </p>
        </motion.div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard title="Pending Articles" value="12" />
          <StatCard title="Total Users" value="245" />
          <StatCard title="Reports" value="3" />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-[#07142a] border border-[#12345c] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-green-300 mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-sm text-gray-400">
            <li>New article submitted: Phishing SMS Patterns</li>
            <li>User registered: john@email.com</li>
            <li>Article approved: Email Spoofing</li>
          </ul>
        </div>

      </main>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({ label, href }: any) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 rounded-lg hover:bg-green-400/10 hover:text-green-300 transition"
    >
      {label}
    </Link>
  );
}

/* Stat Card */
function StatCard({ title, value }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-[#07142a] border border-[#12345c] rounded-xl p-6"
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-green-400 mt-2">{value}</p>
    </motion.div>
  );
}