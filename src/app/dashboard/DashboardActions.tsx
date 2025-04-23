'use client';

import type React from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface DashboardActionsProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      createdAt?: string | Date | null;
    };
    // Add other session properties if needed
    [key: string]: unknown;
  };
}

const DashboardActions: React.FC<DashboardActionsProps> = ({ session }) => {
  const router = useRouter();
  const user = session.user || {};
  const createdAt = user.createdAt;
  const createdAtStr = createdAt
    ? (typeof createdAt === 'string' ? new Date(createdAt) : createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "40vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          padding: 32,
          maxWidth: 360,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div style={{ marginBottom: 18, textAlign: 'center', width: '100%' }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{user.email}</div>
          {createdAtStr && (
            <div style={{ color: '#888', fontSize: 14 }}>Joined {createdAtStr}</div>
          )}
        </div>
        <Button
          variant="outline"
          style={{ width: "100%", maxWidth: 280 }}
          onClick={() => window.open("/api/auth/portal", "_blank")}
        >
          Go to Customer Portal
        </Button>
        <Button
          style={{ width: "100%", maxWidth: 280 }}
          onClick={() => window.open("/api/auth/checkout/consultation", "_blank")}
        >
          Purchase Consultation
        </Button>
        <Button
          variant="destructive"
          style={{ width: "100%", maxWidth: 280, marginTop: 8 }}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardActions; 