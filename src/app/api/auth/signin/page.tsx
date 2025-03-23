"use client";

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use 'next/router' for Pages Router

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/img/register-background.jpg')] bg-cover bg-center relative flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 relative z-10 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
          Sign In
          <span className="block mt-2 w-20 h-1 bg-blue-500 mx-auto rounded-full"></span>
        </h2>

        {error && (
          <div className="mb-6 p-4 rounded-lg text-center animate-slideDown bg-red-100 border border-red-300 text-red-800">
            {error}
            <button 
              onClick={() => setError("")}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative group">
            <label className="block text-gray-700 font-medium mb-3 text-lg">
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 text-lg text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all duration-300 hover:border-gray-300"
              required
            />
          </div>
          
          <div className="relative group">
            <label className="block text-gray-700 font-medium mb-3 text-lg">
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 text-lg text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all duration-300 hover:border-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-95"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <a 
            href="/register" 
            className="text-blue-700 hover:text-blue-500 font-semibold underline transition-colors"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}