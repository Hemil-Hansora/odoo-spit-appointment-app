"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    if (!newResourceName.trim()) return;

    setCreating(true);
    try {
      if (!organizationId) throw new Error("No organization found");

      const response = await fetch("/api/organiser/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newResourceName,
          organizationId,
          isActive: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to create resource");

      setNewResourceName("");
      await loadResources();
    } catch (err) {
      console.error("Failed to create resource:", err);
      alert("Failed to create resource");
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">
          Manage people, rooms, and equipment for your services.
        </p>
      </div>

      {/* Create New Resource */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Resource</CardTitle>
          <CardDescription>
            Add a person, room, or equipment that can be booked.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              />
            </div>
            <Button onClick={createResource} disabled={creating || !newResourceName.trim()}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>All Resources ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-center py-8 text-muted-foreground">Loading...</p>}
          {error && <p className="text-center py-8 text-red-600">{error}</p>}
          {!loading && !error && resources.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              No resources yet. Create one above.
            </p>
          )}
          {!loading && !error && resources.length > 0 && (
            <div className="space-y-3">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${resource.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium">{resource.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {resource.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleResourceStatus(resource.id, resource.isActive)}
                    >
                      {resource.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteResource(resource.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
