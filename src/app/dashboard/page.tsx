"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { User, GraduationCap, Users } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<null | { name?: string; email?: string }>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarOpen = sidebarHover;

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      const currentUser = session?.data?.user;
      if (!currentUser) {
        router.push("/?login=1");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#faf8f3" }}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full" style={{ background: "var(--green-deep)" }} />
          <p style={{ color: "var(--muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#faf8f3" }}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className="fixed left-0 top-0 bottom-0 z-40 flex-col transition-[width] duration-150 hidden lg:flex"
        style={{ background: "var(--green-deep)", color: "white" }}
      >
        <div className="p-4 flex items-center justify-center h-20">
          <GraduationCap className="w-8 h-8 flex-shrink-0" />
          {sidebarOpen && (
            <div className="ml-3">
              <p className="font-bold text-lg leading-tight">Scholarship</p>
              <p className="text-xs opacity-70">Dashboard</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: "/dashboard", label: "Dashboard", icon: Users },
            { href: "/profile", label: "My Profile", icon: User },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
                  isActive ? "bg-white/20" : "hover:bg-white/10 hover:pl-5"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          {sidebarOpen ? (
            <div className="p-3 rounded-xl bg-white/10 mb-2">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs opacity-70 truncate">{user?.email}</p>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/10 hover:pl-5 transition-all duration-150 ${
              sidebarOpen ? "" : "justify-center"
            }`}
          >
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 260 : 72 }}
        className="flex-1 w-full min-h-screen flex flex-col items-center justify-center transition-[margin] duration-150"
        style={{ paddingTop: "5rem", paddingBottom: "3rem" }}
      >
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: "var(--green-deep)", color: "white" }}
            >
              <User className="w-10 h-10" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: "var(--green-deep)" }}>
              {getGreeting()}, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-lg mb-8" style={{ color: "var(--muted)" }}>
              Welcome to your scholarship portal
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="px-8 py-4 rounded-2xl font-medium transition-all hover:opacity-90"
              style={{ background: "var(--green-deep)", color: "white" }}
            >
              Apply for Scholarship
            </Link>
            <Link
              href="/profile"
              className="px-8 py-4 rounded-2xl font-medium border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: "var(--green-deep)", color: "var(--green-deep)" }}
            >
              View My Profile
            </Link>
          </div>

          <div className="lg:hidden mt-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg"
              style={{ background: "var(--green-deep)", color: "white" }}
            >
              <Users className="w-5 h-5" />
            </button>
          </div>

          <Sidebar
            menuOpen={mobileMenuOpen}
            setMenuOpen={setMobileMenuOpen}
            pathname={pathname}
            user={user}
            handleSignOut={handleSignOut}
            isDashboard={true}
          />
        </div>
      </motion.main>
    </div>
  );
}
