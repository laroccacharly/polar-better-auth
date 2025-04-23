'use client';

import type React from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{user.email}</CardTitle>
          {createdAtStr && (
            <CardDescription>Joined {createdAtStr}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => window.open("/api/auth/portal", "_blank")}
          >
            Go to Customer Portal
          </Button>
          <Button
            onClick={() => window.open("/api/auth/checkout/consultation", "_blank")}
          >
            Purchase Consultation
          </Button>
          <Button
            variant="destructive"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActions; 