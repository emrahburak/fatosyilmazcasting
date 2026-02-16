'use client';

import React from 'react';
import { logoutAction } from '@/lib/actions/auth.actions';

/**
 * Dashboard - Admin Panel Ana Sayfa
 * 
 * Quick stats, recent activities ve navigation hub.
 */
export default function DashboardPage() {
  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Fatoş Yılmaz Casting
              </h1>
              <span className="text-sm text-gray-500">Admin Panel</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Hoş Geldiniz
          </h2>
          <p className="text-gray-600">
            Talent ve proje yönetimi için kontrol panelinize hoş geldiniz.
          </p>
        </div>

        {/* Stats Cards - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Toplam Talent"
            value="--"
            description="Aktif yetenekler"
            icon="👤"
          />
          <StatCard
            title="Aktif Projeler"
            value="--"
            description="Cast sürecindeki"
            icon="🎬"
          />
          <StatCard
            title="Bekleyen Başvurular"
            value="--"
            description="Onay bekleyen"
            icon="📋"
          />
          <StatCard
            title="Bu Ay Casting"
            value="--"
            description="Tamamlanan"
            icon="✅"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Yeni Talent Ekle"
            description="Yeni yetenek kaydı oluştur"
            icon="➕"
            href="/talents/new"
          />
          <QuickActionCard
            title="Proje Oluştur"
            description="Yeni cast projesi başlat"
            icon="🎯"
            href="/projects/new"
          />
          <QuickActionCard
            title="Davetiye Gönder"
            description="Yeni kullanıcı davet et"
            icon="📧"
            href="/settings/invitations"
            adminOnly
          />
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Sistem Durumu
              </h3>
              <p className="text-sm text-blue-700">
                Bu panel şu anda development aşamasındadır. Database entegrasyonu
                ve tam özellik listesi yakında aktif edilecektir.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  adminOnly = false,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
  adminOnly?: boolean;
}) {
  return (
    <a
      href={href}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all group"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <h3 className="font-medium text-gray-900">{title}</h3>
        {adminOnly && (
          <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
            Admin
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}
