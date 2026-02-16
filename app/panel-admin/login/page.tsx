'use client';

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/lib/actions/auth.actions';
import { useRouter } from 'next/navigation';

/**
 * Login Page
 * 
 * E-posta/şifre ile giriş formu.
 * Invitation-only registration için link içerir.
 */
export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const result = await loginAction(prevState, formData);

      if (result.success && result.data?.redirect) {
        router.push(result.data.redirect);
      }

      return result;
    },
    null
  );

  const errorMessage = state && !state.success ? state.error : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Link href="/" className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-3xl font-light text-white italic">f</span>
          </div>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Admin Panel
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Fatoş Yılmaz Management & Casting
        </p>
      </div>

      {/* Login Form */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" action={formAction}>
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {String(errorMessage)}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-100"
                placeholder="ornek@fatosyilmazcasting.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isPending}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-100"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={isPending}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Şifremi unuttum
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Davetiye ile kayıt
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Davetiye kodunuz var mı?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Fatoş Yılmaz Management & Casting. Tüm hakları saklıdır.
      </p>
    </div>
  );
}
