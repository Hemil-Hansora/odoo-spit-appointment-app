"use client";

import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    // Redirect to the landing HTML page
    window.location.href = "/landing.html";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
