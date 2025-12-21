"use client"

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";

export default function OrganiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const isActive = (path: string) => {
    if (path === "/organiser") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <ProtectedRoute requiredRole="member">
      <div className="min-h-screen bg-background relative overflow-x-hidden">
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Texture dots */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          
          {/* Gradient orbs - matching landing page */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20" style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent 70%)'
          }} />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-15 translate-x-1/2" style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4), transparent 70%)'
          }} />
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 translate-y-1/2" style={{
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.3), transparent 70%)'
          }} />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur-xl shadow-sm" style={{
          background: 'rgba(0, 0, 0, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center gap-8">
                <Link href="/organiser" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105" style={{
                    background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">Appointment App</span>
                </Link>
                
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                  <Link
                    href="/organiser"
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all relative",
                      isActive("/organiser") && !pathname?.includes("/organiser/")
                        ? "text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    style={isActive("/organiser") && !pathname?.includes("/organiser/") ? {
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: 'rgb(168, 85, 247)'
                    } : {}}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </span>
                  </Link>
                  <Link
                    href="/organiser/appointments"
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive("/organiser/appointments")
                        ? "text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    style={isActive("/organiser/appointments") ? {
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: 'rgb(168, 85, 247)'
                    } : {}}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Appointments
                    </span>
                  </Link>
                  <Link
                    href="/organiser/services"
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive("/organiser/services")
                        ? "text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    style={isActive("/organiser/services") ? {
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: 'rgb(168, 85, 247)'
                    } : {}}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Services
                    </span>
                  </Link>
                  <Link
                    href="/organiser/resources"
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive("/organiser/resources")
                        ? "text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    style={isActive("/organiser/resources") ? {
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: 'rgb(168, 85, 247)'
                    } : {}}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Resources
                    </span>
                  </Link>
                  <Link
                    href="/organiser/reporting"
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive("/organiser/reporting")
                        ? "text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    style={isActive("/organiser/reporting") ? {
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: 'rgb(168, 85, 247)'
                    } : {}}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Reporting
                    </span>
                  </Link>
                </nav>
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3">
                <Link
                  href="/organiser/profile"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgb(255, 255, 255)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all shadow-sm hover:shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10">
          <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
