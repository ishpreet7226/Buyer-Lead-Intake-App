'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Plus, 
  Upload, 
  Download, 
  LogOut, 
  Menu, 
  X,
  Building2,
  BarChart3
} from 'lucide-react';
// Remove server-side auth import

interface NavigationProps {
  user?: {
    id: string;
    email: string;
    name?: string;
  } | null;
}

export function Navigation({ user }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/buyers', icon: Home, current: pathname === '/buyers' },
    { name: 'New Lead', href: '/buyers/new', icon: Plus, current: pathname === '/buyers/new' },
    { name: 'Import', href: '/buyers/import', icon: Upload, current: pathname === '/buyers/import' },
    { name: 'Export', href: '/buyers/export', icon: Download, current: pathname === '/buyers/export' },
  ];

  const handleLogout = async () => {
    // Clear the user session cookie
    document.cookie = 'user-id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LeadFlow</span>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                      item.current
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <p className="text-sm text-gray-700">
                    Welcome, <span className="font-medium">{user.name || user.email}</span>
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200 ${
                      item.current
                        ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
