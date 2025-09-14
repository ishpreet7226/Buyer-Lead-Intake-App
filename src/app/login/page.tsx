import { createUser, setUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Building2, Mail, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    'use server';
    
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    
    if (!email) {
      return;
    }
    
    const user = await createUser(email, name || undefined);
    await setUserSession(user.id);
    redirect('/buyers');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Header */}
        <div className="text-center animate-in">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to LeadFlow
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your modern buyer lead management system
          </p>
        </div>

        {/* Login Form */}
        <div className="card shadow-xl">
          <div className="card-content">
            <form className="space-y-6" action={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="input pl-10 w-full"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className="input pl-10 w-full"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full flex items-center justify-center text-base font-semibold py-3"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Demo Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            This is a demo application. No password required - just enter your email to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
