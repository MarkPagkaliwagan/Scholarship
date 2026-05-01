"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Key,
  Trash2,
  Loader2,
  User,
  ArrowLeft,
} from "lucide-react";
import ScholarShell from "@/components/ScholarShell";
import { authClient } from "@/lib/auth-client";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        router.push("/?login=1");
        return;
      }
      setUser(session.data.user);
    };
    checkAuth();
  }, [router]);

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordData.new || !passwordData.confirm || !passwordData.current) {
      setPasswordError("All fields are required.");
      return;
    }

    if (passwordData.new.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const res = await authClient.changePassword({
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
        revokeOtherSessions: true,
      });

      if (res.error) {
        throw new Error(res.error.message || "Failed to change password.");
      }

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    if (!confirm("All your data including applications and documents will be permanently deleted. Continue?")) {
      return;
    }

    setDeletingAccount(true);

    try {
      const res = await authClient.deleteUser();
      
      if (res.error) {
        throw new Error(res.error.message || "Failed to delete account.");
      }

      router.push("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete account.");
      setDeletingAccount(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <ScholarShell
      user={user}
      eyebrow="Account Settings"
      title="My Account"
      description="Manage your account password and security settings."
      onSignOut={handleSignOut}
      actions={
        <button
          onClick={() => router.back()}
          className="btn-secondary px-5 py-3 text-sm flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      }
    >
      <div className="max-w-2xl space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface p-5 sm:p-6"
        >
          <div className="flex items-start gap-3 mb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--green-mid)]">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold leading-none text-[var(--green-deep)]">
                Account Information
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                View and manage your account details.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[var(--cream)]">
              <p className="value-label mb-1">Name</p>
              <p className="font-semibold text-[var(--green-deep)]">{user?.name || "—"}</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--cream)]">
              <p className="value-label mb-1">Email</p>
              <p className="font-semibold text-[var(--green-deep)]">{user?.email || "—"}</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="surface p-5 sm:p-6"
        >
          <div className="flex items-start gap-3 mb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--green-mid)]">
              <Key className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold leading-none text-[var(--green-deep)]">
                Change Password
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Update your password to keep your account secure.
              </p>
            </div>
          </div>

          {!showPasswordForm ? (
            <button
              onClick={() => {
                setShowPasswordForm(true);
                setPasswordError("");
                setPasswordSuccess("");
              }}
              className="btn-secondary px-5 py-2.5 text-sm flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Change Password
            </button>
          ) : (
            <div className="space-y-4 max-w-md">
              {passwordError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
                  {passwordSuccess}
                </div>
              )}
              <div>
                <label className="value-label mb-2 block">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="field-control px-3 py-2.5 w-full"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="value-label mb-2 block">New Password</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="field-control px-3 py-2.5 w-full"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>
              <div>
                <label className="value-label mb-2 block">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="field-control px-3 py-2.5 w-full"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePasswordChange}
                  disabled={changingPassword}
                  className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
                >
                  {changingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ current: "", new: "", confirm: "" });
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                  className="btn-secondary px-5 py-2.5 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface p-5 sm:p-6"
        >
          <div className="flex items-start gap-3 mb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold leading-none text-red-800">
                Danger Zone
              </h2>
              <p className="mt-2 text-sm text-red-600">
                Irreversible actions for your account.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
            <p className="text-sm text-red-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {deletingAccount ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {deletingAccount ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </motion.section>
      </div>
    </ScholarShell>
  );
}
