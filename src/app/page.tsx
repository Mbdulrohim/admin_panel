'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '../utils/auth'; // Import the utility function

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/dashboard'); // Redirect if logged in
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">CONTENT STRATEGIES FOR CLAPP</h1>
      <a
        href="/login"
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-sm hover:bg-green-600 transition"
      >
        Login
      </a>
    </div>
  );
}
