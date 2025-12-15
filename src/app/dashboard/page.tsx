
"use client";

import { useState } from 'react';
import styles from './dashboard.module.css';

interface TicketFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export default function DashboardPage() {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    priority: 'low',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!formData.title || !formData.description) {
        throw new Error('Por favor, completa todos los campos requeridos');
      }

      const ticketData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
      };

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el commentario');
      }

      setMessage({
        type: 'success',
        text: 'Ticket creado exitosamente. Nuestro equipo lo revisará pronto.',
      });

      // Limpiar formulario
      setFormData({
        title: '',
        description: '',
        priority: 'low',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: ` ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Cliente - Crear Ticket</h1>
        <p className={styles.subtitle}>¿Necesitas ayuda? Abre un nuevo ticket de soporte.</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Título / Asunto *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Problema con mi pedido"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu problema o consulta con el mayor detalle posible."
              className={styles.textarea}
              rows={4}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ width: '100%' }}>
              <label htmlFor="priority" className={styles.label}>
                Prioridad *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          {message && (
            <div
              className={`${styles.message} ${
                message.type === 'success' ? styles.successMessage : styles.errorMessage
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'Enviando ticket...' : ' Enviar Ticket'}
          </button>
        </form>
      </div>
    </main>
  );
}
