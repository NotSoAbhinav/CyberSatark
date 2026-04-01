"use client";
import { motion } from "framer-motion";
import { Bell, Search, User } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#020617] text-gray-200">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#07142a] border-r border-[#12345c] p-6">
        <h2 className="text-2xl font-bold text-green-400 mb-8">
          CyberSatark
        </h2>

        <nav className="space-y-4 text-sm">
          <SidebarItem label="Dashboard" />
          <SidebarItem label="Articles" />
          <SidebarItem label="Users" />
          <SidebarItem label="Reports" />
          <SidebarItem label="Analytics" />
          <SidebarItem label="Settings" />
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="flex justify-between items-center p-6 border-b border-[#12345c] bg-[#07142a]">
          <div className="flex items-center gap-3 bg-[#020617] px-4 py-2 rounded-lg">
            <Search size={16} />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <Bell className="cursor-pointer" />
            <User className="cursor-pointer" />
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-8 space-y-8">

          {/* STATS */}
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard title="Users" value="245" />
            <StatCard title="Articles" value="120" />
            <StatCard title="Reports" value="3" />
            <StatCard title="Threat Alerts" value="7" />
          </div>

          {/* CHART AREA */}
          <div className="grid md:grid-cols-2 gap-6">

            <Card title="User Growth">
              📈 Chart goes here
            </Card>

            <Card title="Threat Reports">
              🚨 Chart goes here
            </Card>

          </div>

          {/* RECENT ACTIVITY */}
          <Card title="Recent Activity">
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✔ New phishing report submitted</li>
              <li>👤 New user registered</li>
              <li>📝 Article approved</li>
            </ul>
          </Card>

        </main>
      </div>
    </div>
  );
}

function SidebarItem({ label }: any) {
  return (
    <div className="px-4 py-2 rounded-lg hover:bg-green-400/10 hover:text-green-300 cursor-pointer transition">
      {label}
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#07142a] border border-[#12345c] rounded-xl p-5"
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-green-400 mt-2">{value}</p>
    </motion.div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-[#07142a] border border-[#12345c] rounded-xl p-6">
      <h2 className="text-green-300 font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}