'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/app/components/admin/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        if (!session?.user || session.user.role !== 'admin') {
          router.push('/login');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        router.push('/login');
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Verificando permisos...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No tienes permisos para acceder a esta página</p>
      </div>
    );
  }

  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
}
