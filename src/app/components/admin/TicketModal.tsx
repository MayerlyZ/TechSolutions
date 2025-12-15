'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './ticketModal.module.css';

interface TicketData {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  category: string;
  createdAt: string;
}

interface TicketModalProps {
  ticket: TicketData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  admins: Array<{ _id: string; name: string; email: string }>;
}

export default function TicketModal({
  ticket,
  isOpen,
  onClose,
  onUpdate,
  admins,
}: TicketModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: ticket?.status || 'open',
    priority: ticket?.priority || 'medium',
    assignedTo: ticket?.assignedTo?._id || '',
    description: ticket?.description || '',
    title: ticket?.title || '',
  });

  const statuses = [
    { value: 'open', label: 'Abierto' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'resolved', label: 'Resuelto' },
    { value: 'closed', label: 'Cerrado' },
  ];

  const priorities = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/tickets/${ticket._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar ticket');
      }

      toast.success('Ticket actualizado exitosamente');
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Editar Ticket #{ticket._id.slice(0, 8)}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.infoSection}>
            <h3>Información del Cliente</h3>
            {ticket.clientName && (
              <>
                <p>
                  <strong>Nombre:</strong> {ticket.clientName}
                </p>
                <p>
                  <strong>Email:</strong> {ticket.clientEmail}
                </p>
                <p>
                  <strong>Teléfono:</strong> {ticket.clientPhone}
                </p>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Título */}
            <div className={styles.formGroup}>
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Descripción */}
            <div className={styles.formGroup}>
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
              />
            </div>

            {/* Estado */}
            <div className={styles.formGroup}>
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.select}
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridad */}
            <div className={styles.formGroup}>
              <label htmlFor="priority">Prioridad</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={styles.select}
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Asignado a */}
            <div className={styles.formGroup}>
              <label htmlFor="assignedTo">Asignar a</label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">-- Sin asignar --</option>
                {admins.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.name} ({admin.email})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
