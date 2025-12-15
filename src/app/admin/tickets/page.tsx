'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from '@/app/components/admin/admin.module.css';
import TicketModal from '@/app/components/admin/TicketModal';

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

interface Admin {
  _id: string;
  name: string;
  email: string;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchAdmins();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tickets/admin/all');
      const data = await response.json();
      setTickets(data.data || []);
    } catch (error) {
      toast.error('Error al cargar tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      // Filtrar solo los admins
      const adminUsers = data.data?.filter(
        (user: any) => user.role === 'admin'
      ) || [];
      setAdmins(adminUsers);
    } catch (error) {
      console.error('Error al cargar admins');
    }
  };

  const handleEditClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este ticket?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar ticket');
      }

      toast.success('Ticket eliminado exitosamente');
      fetchTickets();
    } catch (error: any) {
      toast.error(error.message);
    }
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

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Gestión de Tickets</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : tickets.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateIcon}>—</p>
          <p>No hay tickets disponibles</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Cliente</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Asignado a</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket._id.slice(0, 8)}...</td>
                  <td title={ticket.title}>{ticket.title.slice(0, 20)}...</td>
                  <td>{ticket.clientName || 'Usuario Registrado'}</td>
                  <td>{ticket.category}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: getStatusColor(ticket.status),
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    >
                      {ticket.status === 'open'
                        ? 'Abierto'
                        : ticket.status === 'in_progress'
                        ? 'En Progreso'
                        : ticket.status === 'resolved'
                        ? 'Resuelto'
                        : 'Cerrado'}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        backgroundColor: getPriorityColor(ticket.priority),
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    >
                      {ticket.priority === 'low'
                        ? 'Baja'
                        : ticket.priority === 'medium'
                        ? 'Media'
                        : 'Alta'}
                    </span>
                  </td>
                  <td>{ticket.assignedTo?.name || 'Sin asignar'}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditClick(ticket)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#4ee2db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteTicket(ticket._id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TicketModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={fetchTickets}
        admins={admins}
      />
    </div>
  );
}
