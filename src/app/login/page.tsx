'use client'; // This page needs to be a Client Component to use hooks and handle form state

import type React from 'react'; // Use type import for React
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use App Router's navigation hook
import { authClient } from '@/lib/auth-client';
import Link from 'next/link'; // Import Link component

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Get router instance for navigation

  const { signIn } = authClient;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.email({ email, password });

      console.log('Sign in successful:', result);
      router.push('/');

    } catch (err: unknown) {
      console.error('Sign in failed:', err);
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during sign in.');
      } else {
        setError('An unknown error occurred during sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <form onSubmit={handleSubmit}>
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      {/* Add link to Sign up page */}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Sign up
        </Link>
      </p>
      {/* Optionally add links to signup or password reset pages here */}
    </div>
  );
};

export default LoginPage; 