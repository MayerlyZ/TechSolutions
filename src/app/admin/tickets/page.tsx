'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from '@/app/components/admin/admin.module.css';
 
interface Ticket {
  _id: string;
  userId: string;
  subject: string; 
  createdAt: string;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tickets'); 
      const data = await response.json();
      setTickets(data.data || []);
    } catch (error) {
      toast.error('Error al cargar tickets'); 
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar ticket'); 
      }

      toast.success('Ticket actualizado'); 
      fetchTickets(); 
    } catch (error: any) {
      toast.error(error.message);
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
          <p>No hay pedidos disponibles</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Ticket</th> {/* Updated header */}
                <th>Asunto</th> {/* Updated header */}
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id}>
                  <td>{ticket._id.slice(0, 8)}...</td>
                  <td>{ticket.subject}</td> {/* Displaying subject */}
                  <td>
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                      }}
                    >
                      <option value="open">Abierto</option> {/* Updated status options */}
                      <option value="in_progress">En Progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="closed">Cerrado</option>
                    </select>
                  </td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => alert('Detalles del Ticket: ' + ticket._id)} // Updated alert message
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
