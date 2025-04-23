'use client'; // This component needs client-side interaction (router, useSession)

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client'; // Import authClient

export default function Home() {
  const router = useRouter();
  const { data, isPending, error } = authClient.useSession();
  const session = data?.session;
  const user = data?.user;

  const goToLogin = () => {
    router.push('/login');
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '30px' }}>Welcome to Polar Auth Example</h1>
      {isPending && <p>Loading session...</p>}

      {!isPending && session && user && (
        <button
          type="button"
          onClick={goToDashboard}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#28a745', // Green for dashboard
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Go to Dashboard
        </button>
      )}

      {!isPending && !session && (
        <button
          type="button"
          onClick={goToLogin}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#0070f3', // Blue for login
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Go to Login
        </button>
      )}
    </div>
  );
}
