'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styles from '@/app/components/admin/admin.module.css';

interface DashboardStats {
  totalcomments: number;
  totalUsers: number;
  totaltickets: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const session = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalcomments: 0,
    totalUsers: 0,
    totaltickets: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [commentsRes, usersRes, ticketsRes] = await Promise.all([
          fetch('/api/comments'),
          fetch('/api/users'),
          fetch('/api/tickets'),
        ]);

        const commentsData = await commentsRes.json();
        const usersData = await usersRes.json();
        const ticketsData = await ticketsRes.json();

        // Calculate stats
        const totalcomments = commentsData.data?.length || 0;
        const totalUsers = usersData.data?.length || 0;
        const totaltickets = ticketsData.data?.length || 0;
        const totalRevenue = ticketsData.data?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;

        setStats({
          totalcomments,
          totalUsers,
          totaltickets,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminName = session?.data?.user?.name || 'Administrador';

  return (
    <div className={styles.adminContainer}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeContent}>
          <h2>¡Hola, {adminName}! </h2>
          <p>Bienvenido a tu panel de administración..</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.yellow}`}>
          <div className={styles.statLabel}>Total comments</div>
          <div className={styles.statValue}>{stats.totalcomments}</div>
        </div>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <div className={styles.statLabel}>Total Usuarios</div>
          <div className={styles.statValue}>{stats.totalUsers}</div>
        </div>
        <div className={`${styles.statCard} ${styles.pink}`}>
          <div className={styles.statLabel}>Total Tickets</div>
          <div className={styles.statValue}>{stats.totaltickets}</div>
        </div>
        
      </div>

      {/* Admin Cards Section */}
      <h3 className={styles.adminTitle} style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        Gestión
      </h3>

      <div className={styles.adminGrid}>
        <Link href="/admin/comments" className={styles.adminCard}>
          <div className={styles.adminCardIcon}></div>
          <h2 className={styles.adminCardTitle}>Tickets</h2>
          <p className={styles.adminCardDesc}>Crea, edita y elimina tickets del sistema</p>
        </Link>

        <Link href="/admin/users" className={styles.adminCard}>
          <div className={styles.adminCardIcon}></div>
          <h2 className={styles.adminCardTitle}>Usuarios</h2>
          <p className={styles.adminCardDesc}>Administra usuarios y sus roles en el sistema</p>
        </Link>

        <Link href="/admin/tickets" className={styles.adminCard}>
          <div className={styles.adminCardIcon}></div>
          <h2 className={styles.adminCardTitle}>Comentarios</h2>
          <p className={styles.adminCardDesc}>Visualiza y gestiona todos los comentarios</p>
        </Link>
      </div>
    </div>
  );
}
