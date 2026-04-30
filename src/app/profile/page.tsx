"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { User, Home, GraduationCap, FileText, Save, Loader2, Camera, Phone, MapPin, Calendar, Book, Award, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Application {
  id: number;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  schoolName: string;
  course: string;
  yearLevel: number;
  gwa: string;
  status: string;
  submittedAt: string;
  guardianName?: string;
  guardianPhone?: string;
  birthday?: string;
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "My Profile", icon: User },
];

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<null | { name?: string; email?: string }>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarOpen = sidebarHover;
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Application | null>(null);

  const fetchApplication = async (email: string) => {
    try {
      const res = await fetch(`/api/applications?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setApplication(data[0]);
          setFormData(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      const currentUser = session?.data?.user;
      if (!currentUser) {
        router.push("/?login=1");
        return;
      }
      setUser(currentUser);
      fetchApplication(currentUser.email);
    };
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    if (!user?.email) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/applications?email=${encodeURIComponent(user.email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          schoolName: formData.schoolName,
          course: formData.course,
          yearLevel: formData.yearLevel,
          gwa: formData.gwa,
          guardianName: formData.guardianName,
          guardianPhone: formData.guardianPhone,
          birthday: formData.birthday,
        }),
      });
      if (res.ok) {
        setApplication(formData);
        setEditing(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return { bg: "#dcfce7", text: "#16a34a" };
      case "rejected": return { bg: "#fee2e2", text: "#dc2626" };
      case "in_review": return { bg: "#fef3c7", text: "#d97706" };
      default: return { bg: "#f3f4f6", text: "#6b7280" };
    }
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
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
                  isActive ? "bg-white/20" : "hover:bg-white/10 hover:pl-5"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
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
        className="flex-1 w-full min-h-screen transition-[margin] duration-150"
        style={{ paddingTop: "5rem", paddingBottom: "3rem" }}
      >
        <div className="w-full mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--green-deep)" }}>
                My Profile
              </h1>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Manage your application details
              </p>
            </div>
            <div className="flex items-center gap-2">
              {application && (
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  disabled={saving}
                  className="px-4 sm:px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-70 text-sm sm:text-base"
                  style={{ 
                    background: editing ? "#22c55e" : "var(--green-deep)", 
                    color: "white" 
                  }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Save className="w-4 h-4" /> : null}
                  <span className="hidden sm:inline">{editing ? "Save" : "Edit"}</span>
                  <span className="sm:hidden">{editing ? "Save" : "Edit"}</span>
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg"
                style={{ background: "var(--green-deep)", color: "white" }}
              >
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden"
                style={{ background: "var(--green-deep)", color: "white" }}
              >
                <div className="p-4 flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg"
                      style={{ 
                        background: pathname === item.href ? "rgba(255,255,255,0.2)" : "transparent" 
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button onClick={handleSignOut} className="px-4 py-3 rounded-lg text-left">
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {application && formData ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border"
                style={{ borderColor: "var(--sand)" }}
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  <div className="relative self-center sm:self-auto">
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center"
                      style={{ background: "var(--green-deep)", color: "white" }}
                    >
                      <User className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    {editing && (
                      <div 
                        className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer"
                        style={{ background: "var(--cream)", color: "var(--green-deep)" }}
                      >
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Full Name</p>
                        {editing ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none text-sm sm:text-base"
                              placeholder="First Name"
                            />
                            <input
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none text-sm sm:text-base"
                              placeholder="Last Name"
                            />
                          </div>
                        ) : (
                          <p className="font-semibold text-lg" style={{ color: "var(--green-deep)" }}>
                            {application.firstName} {application.lastName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</p>
                        <span
                          className="inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize"
                          style={{ 
                            background: getStatusColor(application.status).bg, 
                            color: getStatusColor(application.status).text 
                          }}
                        >
                          {application.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Email</p>
                        <p className="font-medium" style={{ color: "var(--green-deep)" }}>{application.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Application ID</p>
                        <p className="font-medium font-mono" style={{ color: "var(--green-deep)" }}>{application.applicationId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border"
                style={{ borderColor: "var(--sand)" }}
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--green-deep)" }}>
                  <Users className="w-5 h-5" /> Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <Phone className="w-3 h-3" /> Phone
                    </p>
                    {editing ? (
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none"
                      />
                    ) : (
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>{application.phone}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <Calendar className="w-3 h-3" /> Date of Birth
                    </p>
                    {editing ? (
                      <input
                        name="birthday"
                        type="date"
                        value={formData.birthday || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none"
                      />
                    ) : (
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                        {application.birthday || "—"}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <p className="text-xs uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <MapPin className="w-3 h-3" /> Address
                    </p>
                    {editing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none"
                      />
                    ) : (
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>{application.address}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border"
                style={{ borderColor: "var(--sand)" }}
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--green-deep)" }}>
                  <GraduationCap className="w-5 h-5" /> Educational Background
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <Book className="w-3 h-3" /> School
                    </p>
                    {editing ? (
                      <input
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none"
                      />
                    ) : (
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>{application.schoolName}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <Book className="w-3 h-3" /> Course
                    </p>
                    {editing ? (
                      <input
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none"
                      />
                    ) : (
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>{application.course}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <Award className="w-3 h-3" /> Year Level
                    </p>
                    {editing ? (
                      <select
                        name="yearLevel"
                        value={formData.yearLevel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none"
                      >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                        <option value={5}>5th Year</option>
                      </select>
                    ) : (
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                        {application.yearLevel}{["st", "nd", "rd", "th", "th"][application.yearLevel - 1]} Year
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <Award className="w-3 h-3" /> GWA
                    </p>
                    {editing ? (
                      <input
                        name="gwa"
                        value={formData.gwa}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none"
                      />
                    ) : (
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>{application.gwa}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border"
                style={{ borderColor: "var(--sand)" }}
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--green-deep)" }}>
                  <Users className="w-5 h-5" /> Parent / Guardian Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Parent / Guardian Name</p>
                    {editing ? (
                      <input
                        name="guardianName"
                        value={formData.guardianName || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none"
                        placeholder="Enter parent/guardian name"
                      />
                    ) : (
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                        {application.guardianName || "—"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Parent / Guardian Phone</p>
                    {editing ? (
                      <input
                        name="guardianPhone"
                        value={formData.guardianPhone || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-600 outline-none"
                        placeholder="09XX XXX XXXX"
                      />
                    ) : (
                      <p className="font-medium" style={{ color: "var(--green-deep)" }}>
                        {application.guardianPhone || "—"}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-sm border"
              style={{ borderColor: "var(--sand)" }}
            >
              <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--muted)" }} />
              <p className="font-medium text-lg mb-2" style={{ color: "var(--green-deep)" }}>
                No Application Found
              </p>
              <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                You haven&apos;t submitted an application yet.
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90"
                style={{ background: "var(--green-deep)", color: "white" }}
              >
                Apply Now
              </Link>
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  );
}