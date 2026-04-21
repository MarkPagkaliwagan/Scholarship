"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 50%, #1a3c2e 100%)" }}>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-float-1"
          style={{ background: "#74c69d" }} />
        <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float-2"
          style={{ background: "#40916c" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ background: "#f8f5ef" }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(#f8f5ef 1px, transparent 1px), linear-gradient(90deg, #f8f5ef 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-300"
            style={{ background: "linear-gradient(135deg, #f8f5ef 0%, #ede8dc 100%)" }}>
            <GraduationCap className="w-8 h-8" style={{ color: "#1a3c2e" }} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="font-body text-sm opacity-70">Sign in to access your scholarship dashboard</p>
        </div>

        {/* Login form */}
        <div className="relative rounded-3xl p-8 shadow-2xl animate-slide-up"
          style={{ 
            background: "rgba(248, 245, 239, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
          
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 opacity-20">
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg" style={{ borderColor: "#1a3c2e" }} />
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20">
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 rounded-br-lg" style={{ borderColor: "#1a3c2e" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block font-body text-xs font-semibold uppercase tracking-wider" style={{ color: "#1a3c2e" }}>
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-green-600" style={{ color: "#6b7280" }}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl font-body text-sm transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    background: "#f8f5ef",
                    border: "2px solid #ede8dc",
                    color: "#1a1a1a"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#40916c";
                    e.target.style.boxShadow = "0 0 0 4px rgba(64, 145, 108, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ede8dc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block font-body text-xs font-semibold uppercase tracking-wider" style={{ color: "#1a3c2e" }}>
                  Password
                </label>
                <Link href="/forgot-password" className="font-body text-xs transition-colors hover:underline" style={{ color: "#40916c" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-green-600" style={{ color: "#6b7280" }}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-14 py-4 rounded-xl font-body text-sm transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    background: "#f8f5ef",
                    border: "2px solid #ede8dc",
                    color: "#1a1a1a"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#40916c";
                    e.target.style.boxShadow = "0 0 0 4px rgba(64, 145, 108, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ede8dc";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all hover:bg-gray-100"
                  style={{ color: "#6b7280" }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded transition-colors cursor-pointer"
                style={{ accentColor: "#2d6a4f" }}
              />
              <label htmlFor="remember" className="font-body text-sm cursor-pointer" style={{ color: "#6b7280" }}>
                Remember me for 30 days
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-300 relative overflow-hidden group"
              style={{ 
                background: "linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%)",
                color: "#f8f5ef"
              }}
            >
              <span className={`flex items-center justify-center gap-2 ${isLoading ? "opacity-0" : "opacity-100"}`}>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              
              {/* Loading spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              
              {/* Hover shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}>
                <div className="absolute inset-0 animate-shimmer" 
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", backgroundSize: "200% 100%" }} />
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "#d4c9b0" }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 font-body text-xs uppercase tracking-wider" style={{ color: "#6b7280", background: "#f8f5ef" }}>
                Secure Login
              </span>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl"
            style={{ background: "rgba(64, 145, 108, 0.1)", border: "1px solid rgba(64, 145, 108, 0.2)" }}>
            <Shield className="w-4 h-4" style={{ color: "#2d6a4f" }} />
            <span className="font-body text-xs" style={{ color: "#2d6a4f" }}>
              Your data is protected with bank-level encryption
            </span>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-8 animate-fade-in-delay">
          <Link href="/" className="inline-flex items-center gap-2 font-body text-sm text-white/70 hover:text-white transition-colors group">
            <Sparkles className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Scholarship Portal
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-slide-up {
          animation: slide-up 0.7s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-float-1 {
          animation: float-1 8s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 10s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
