"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
}

export default function OrganiserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) throw new Error("Failed to fetch profile");
      
      const data = await response.json();
      if (data.session?.user) {
        setUser(data.session.user);
        setFormData({
          name: data.session.user.name || "",
          email: data.session.user.email || "",
        });
      }
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/organiser/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      await fetchProfile();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Profile Settings
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Manage your account information and preferences
        </p>
      </div>

      {error && (
        <div className="rounded-xl p-4"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <p className="text-sm" style={{ color: 'rgb(239, 68, 68)' }}>{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl p-4"
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}
        >
          <p className="text-sm" style={{ color: 'rgb(34, 197, 94)' }}>{success}</p>
        </div>
      )}

      <div className="grid gap-6">
        {/* Profile Information */}
        <div className="rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Profile Information</h2>
            <p className="text-gray-400">
              Update your personal information and email address
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg font-medium text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                style={{
                  background: saving 
                    ? 'rgba(168, 85, 247, 0.5)' 
                    : 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded-lg font-medium text-gray-300 transition-all hover:bg-white/5"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => {
                  setFormData({
                    name: user?.name || "",
                    email: user?.email || "",
                  });
                  setError("");
                  setSuccess("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Account Details */}
        <div className="rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Account Details</h2>
            <p className="text-gray-400">
              View your account information and status
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">User ID</p>
                <p className="text-sm text-white font-mono bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  {user?.id}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Email Status</p>
                <div className="mt-1">
                  {user?.emailVerified ? (
                    <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
                      style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: 'rgb(34, 197, 94)'
                      }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
                      style={{
                        background: 'rgba(250, 204, 21, 0.2)',
                        border: '1px solid rgba(250, 204, 21, 0.3)',
                        color: 'rgb(250, 204, 21)'
                      }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Not Verified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Account Created</p>
                <p className="text-sm text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Account Type</p>
                <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
                  style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: 'rgb(168, 85, 247)'
                  }}
                >
                  Organiser
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
