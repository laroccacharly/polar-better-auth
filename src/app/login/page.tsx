"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {emailSent ? (
             <CardTitle className="text-center text-xl">Check your email</CardTitle>
           ) : (
             <>
               <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
               <CardDescription className="text-xs md:text-sm">
                 Enter your email below to login to your account
               </CardDescription>
             </>
           )}
        </CardHeader>
        <CardContent>
          {emailSent ? (
             <div className="text-center text-sm text-muted-foreground">
               <p>
                 A magic sign-in link has been sent to <span className="font-medium">{email}</span>.
               </p>
               <p>
                 Please check your inbox and follow the link to log in.
               </p>
             </div>
           ) : (
             <div className="grid gap-4">
               <div className="grid gap-2">
                 <Label htmlFor="email">Email</Label>
                 <Input
                   id="email"
                   type="email"
                   placeholder="johndoe@gmail.com"
                   required
                   onChange={(e) => setEmail(e.target.value)}
                   value={email}
                 />
               </div>
               <Button
                 disabled={loading}
                 className="w-full gap-2"
                 onClick={async () => {
                   await signIn.magicLink(
                     {
                       email,
                       callbackURL: "/dashboard",
                     },
                     {
                       onRequest: () => setLoading(true),
                       onResponse: () => {
                         setLoading(false);
                         setEmailSent(true);
                       },
                     },
                   );
                 }}>
                 {loading ? (
                   <Loader2 size={16} className="animate-spin" />
                 ) : (
                   "Sign-in with Magic Link"
                 )}
               </Button>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}