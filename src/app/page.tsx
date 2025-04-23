'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const session = data?.session;
  const user = data?.user;

  const goToLogin = () => {
    router.push('/login');
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">Welcome to Polar Auth Example</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {isPending && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading session...</span>
            </div>
          )}

          {!isPending && session && user && (
            <Button
              type="button"
              onClick={goToDashboard}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          )}

          {!isPending && !session && (
            <Button
              type="button"
              onClick={goToLogin}
              className="w-full"
            >
              Go to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
