'use client'; // Need client component for onClick handler

import { Button } from "@/components/ui/button"; // Import Shadcn Button
import { authClient } from "@/lib/auth-client"; // Import authClient for sign out
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for client-side redirect

// Define a basic type for the session data expected
interface SessionData {
  user?: {
    name?: string | null;
    email?: string | null;
    // Add other user properties if needed
  };
  session?: { // Add session object type
     id?: string;
     // Add other session properties if needed
  };
}

// Client component now
export default function DashboardPage() {
  const [session, setSession] = useState<SessionData | null>(null); // Use defined type
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Need router for client-side redirect

  // Fetch session client-side using the hook directly
  const { data, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      setLoading(false);
      // Check for data and data.user (user presence indicates authentication)
      if (error || !data?.user) {
        console.log("Client: No session or error, redirecting...", error);
        router.push('/login?error=unauthorized'); // Use router.push on client
      } else {
        // Set state with the whole data object which contains user and session
        setSession(data);
      }
    }
  }, [data, isPending, error, router]); // Update dependencies

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push('/login'); // Redirect after sign out
    } catch (err) {
      console.error("Sign out failed:", err);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return <p style={{ padding: '20px', fontFamily: 'sans-serif' }}>Loading dashboard...</p>;
  }

  if (!session?.user) { // Check session.user for rendering
    // This case should ideally be handled by the redirect in useEffect,
    // but included as a fallback / during initial load state issues.
    return <p style={{ padding: '20px', fontFamily: 'sans-serif' }}>Redirecting to login...</p>;
  }

  // User is authenticated, display dashboard content
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <h1>Dashboard</h1>
      {/* Adjust property access based on the actual structure of 'session' from the API */}
      <p>Welcome, {session.user?.name || 'User'}!</p> {/* Add optional chaining */}
      <p>Your email: {session.user?.email}</p> {/* Add optional chaining */}
      <pre style={{ fontSize: '12px', marginTop: '20px', background: '#eee', padding: '10px' }}>
        Session Data: {JSON.stringify(session, null, 2)}
      </pre>
      {/* Add more dashboard content here */}

      {/* Links to Polar Portal and Checkout */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <a href="/api/auth/portal" target="_blank" rel="noopener noreferrer">
          <Button variant="outline">Go to Customer Portal</Button>
        </a>
        <a href="/api/auth/checkout/consultation" target="_blank" rel="noopener noreferrer">
          <Button>Purchase Consultation</Button> {/* Use the slug from auth.ts */}
        </a>
      </div>

      <Button variant="destructive" onClick={handleSignOut} style={{ marginTop: '20px' }}>
        Sign Out
      </Button>
    </div>
  );
} 