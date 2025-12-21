"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Resource {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newResourceName, setNewResourceName] = useState("");
  const [creating, setCreating] = useState(false);
  const [organizationId, setOrganizationId] = useState<string>("");

  useEffect(() => {
    async function initializeAndLoadResources() {
      try {
        // Get organization ID from session
        const sessionRes = await fetch("/api/auth/session");
        if (!sessionRes.ok) throw new Error("Not authenticated");
        const sessionData = await sessionRes.json();
        const orgId = sessionData.session?.user?.activeOrganizationId;

        if (!orgId) {
          setError("No organization found");
          setLoading(false);
          return;
        }

        setOrganizationId(orgId);
        await loadResources(orgId);
      } catch (err) {
        setError("Failed to initialize");
        console.error(err);
        setLoading(false);
      }
    }
    initializeAndLoadResources();
  }, []);

  async function loadResources(orgId?: string) {
    const targetOrgId = orgId || organizationId;
    if (!targetOrgId) return;

    try {
      const response = await fetch(`/api/organiser/resources?organizationId=${targetOrgId}`);
      if (!response.ok) throw new Error("Failed to load resources");
      const data = await response.json();
      setResources(data.resources || []);
    } catch (err) {
      setError("Failed to load resources");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createResource() {
    if (!newResourceName.trim()) {
      alert("Please enter a resource name");
      return;
    }

    setCreating(true);
    setError("");
    try {
      if (!organizationId) {
        throw new Error("No organization found. Please try refreshing the page.");
      }

      const response = await fetch("/api/organiser/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newResourceName,
          organizationId,
          isActive: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create resource");
      }

      setNewResourceName("");
      await loadResources();
      alert("Resource created successfully!");
    } catch (err: any) {
      console.error("Failed to create resource:", err);
      const errorMessage = err.message || "Failed to create resource";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setCreating(false);
    }
  }

  async function toggleResourceStatus(resourceId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/organiser/resources/${resourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update resource");
      await loadResources();
    } catch (err) {
      console.error("Failed to update resource:", err);
      alert("Failed to update resource");
    }
  }

  async function deleteResource(resourceId: string) {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const response = await fetch(`/api/organiser/resources/${resourceId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete resource");
      await loadResources();
    } catch (err) {
      console.error("Failed to delete resource:", err);
      alert("Failed to delete resource");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Resources
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Manage people, rooms, and equipment for your services.
        </p>
      </div>

      {/* Create New Resource */}
      <div className="rounded-2xl p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Create New Resource</h2>
          <p className="text-gray-400">
            Add a person, room, or equipment that can be booked.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="resourceName" className="sr-only">
              Resource Name
            </Label>
            <Input
              id="resourceName"
              placeholder="e.g. Meeting Room A, Dr. Smith"
              value={newResourceName}
              onChange={(e) => setNewResourceName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createResource()}
              disabled={creating}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <button
            onClick={createResource}
            disabled={creating}
            className="px-6 py-2 rounded-lg font-medium text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: creating
                ? 'rgba(168, 85, 247, 0.5)'
                : 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
            }}
          >
            {creating ? "Creating..." : "Create Resource"}
          </button>
        </div>
      </div>

      {/* Resources List */}
      <div className="rounded-2xl p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">All Resources ({resources.length})</h2>
        
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-8 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <p style={{ color: 'rgb(239, 68, 68)' }}>{error}</p>
          </div>
        )}
        {!loading && !error && resources.length === 0 && (
          <p className="text-center py-12 text-gray-400 text-lg">
            No resources yet. Create one above.
          </p>
        )}
        {!loading && !error && resources.length > 0 && (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-6 rounded-xl transition-all hover:scale-[1.01]"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${resource.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <div>
                    <p className="font-semibold text-white text-lg">{resource.name}</p>
                    <p className="text-sm text-gray-400">
                      {resource.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleResourceStatus(resource.id, resource.isActive)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: 'rgba(168, 85, 247, 0.2)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: 'rgb(168, 85, 247)'
                    }}
                  >
                    {resource.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteResource(resource.id)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 transition-all hover:bg-white/5"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
