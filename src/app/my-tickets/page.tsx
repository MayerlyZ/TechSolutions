'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import styles from './myTickets.module.css';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  isPublic: boolean;
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      try {
        // Intentar obtener la sesión
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          if (session?.user?.email) {
            setEmail(session.user.email);
            fetchTickets(session.user.email);
            return;
          }
        }
      } catch (error) {
        console.log('No hay sesión activa');
      }

      // Si no hay sesión, mostrar formulario para ingresar email
      setShowEmailForm(true);
      setLoading(false);
    };

    checkSessionAndLoad();
  }, []);

  const fetchTickets = async (userEmail: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tickets/my-tickets?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar tickets');
      }

      setTickets(data.data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setEmail(inputEmail);
    setShowEmailForm(false);
    fetchTickets(inputEmail);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#d32f2f';
      case 'medium':
        return '#f57c00';
      case 'low':
        return '#388e3c';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#2196f3';
      case 'in_progress':
        return '#ff9800';
      case 'resolved':
        return '#4caf50';
      case 'closed':
        return '#757575';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Abierto';
      case 'in_progress':
        return 'En Progreso';
      case 'resolved':
        return 'Resuelto';
      case 'closed':
        return 'Cerrado';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Tickets</h1>
        <p className={styles.subtitle}>
          {email ? `Tickets creados con: ${email}` : 'Ingresa tu email para ver tus tickets'}
        </p>
      </div>

      {showEmailForm && (
        <div className={styles.emailFormContainer}>
          <form onSubmit={handleSearchByEmail} className={styles.emailForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="tu@email.com"
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.searchButton}>
              Buscar mis tickets
            </button>
          </form>
        </div>
      )}

      {email && (
        <button
          onClick={() => {
            setShowEmailForm(true);
            setEmail(null);
          }}
          className={styles.changeEmailButton}
        >
          Cambiar email
        </button>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <p>Cargando tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            {email
              ? 'No tienes tickets creados aún'
              : 'Ingresa tu email para ver tus tickets'}
          </p>
          {email && (
            <button
              onClick={() => router.push('/new-ticket')}
              className={styles.createButton}
            >
              Crear nuevo ticket
            </button>
          )}
        </div>
      ) : (
        <div className={styles.ticketsGrid}>
          {tickets.map((ticket) => (
            <div key={ticket._id} className={styles.ticketCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>{ticket.title}</h3>
                  <p className={styles.cardId}>ID: {ticket._id.slice(0, 8)}...</p>
                </div>
                <div className={styles.badges}>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    {getStatusLabel(ticket.status)}
                  </span>
                  <span
                    className={styles.priorityBadge}
                    style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                  >
                    {getPriorityLabel(ticket.priority)}
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.description}>{ticket.description}</p>

                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Categoría:</span>
                    <span className={styles.value}>{ticket.category}</span>
                  </div>

                  {ticket.assignedTo && (
                    <div className={styles.detailItem}>
                      <span className={styles.label}>Asignado a:</span>
                      <span className={styles.value}>{ticket.assignedTo.name}</span>
                    </div>
                  )}

                  <div className={styles.detailItem}>
                    <span className={styles.label}>Fecha:</span>
                    <span className={styles.value}>
                      {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <p className={styles.footerText}>
                  Recibirás actualizaciones en: {ticket.clientEmail || email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {email && tickets.length > 0 && (
        <button
          onClick={() => router.push('/new-ticket')}
          className={styles.createNewButton}
        >
          + Crear nuevo ticket
        </button>
      )}
    </div>
  );
}
