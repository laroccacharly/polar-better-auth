"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md border rounded-lg shadow-sm">
        {/* Only show heading and subheading if email not sent */}
        {!emailSent && (
          <div className="p-6">
            <h1 className="text-lg md:text-xl font-semibold">Sign In</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
        )}
        <div className="p-6 pt-0">
          <div className="grid gap-4">
            {emailSent ? (
              <div className="text-center py-8">
                <h2 className="text-lg font-semibold mb-2">Check your email</h2>
                <p className="text-sm text-muted-foreground">
                  A magic sign-in link has been sent to <span className="font-medium">{email}</span>.<br />
                  Please check your inbox and follow the link to log in.
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button
                  disabled={loading}
                  className="gap-2"
                  onClick={async () => {
                    await signIn.magicLink(
                    {
                      email,
                      callbackURL: "/dashboard",
                    },
                    {
                       onRequest: () => {
                          setLoading(true);
                        },
                       onResponse: () => {
                           setLoading(false);
                           setEmailSent(true);
                       },
                     },
                    );
                   }}>
                    {loading ? (
                       <Loader2 size={16} className="animate-spin" />
                       ):(
                           <>Sign-in with Magic Link</>
                     )}
                </Button>
              </div>          
            )}
          </div>
        </div>
      </div>
    </div>
  );
}