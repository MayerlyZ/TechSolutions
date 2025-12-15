'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './ticketForm.module.css';

interface TicketFormData {
  name: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  category: string;
  priority: string;
}

export default function TicketForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TicketFormData>({
    name: '',
    email: '',
    phone: '',
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'software', label: 'Software' },
    { value: 'network', label: 'Red/Conexión' },
    { value: 'other', label: 'Otro' },
  ];

  const priorities = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('El teléfono es requerido');
      return false;
    }
    if (!formData.title.trim()) {
      toast.error('El título es requerido');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('La descripción es requerida');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/tickets/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el ticket');
      }

      toast.success('¡Ticket creado exitosamente! Nos pondremos en contacto pronto.');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear Nuevo Ticket</h1>
        <p className={styles.subtitle}>
          Cuéntanos qué problema técnico necesitas resolver
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Nombre */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Tu nombre"
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="tu@email.com"
            />
          </div>

          {/* Teléfono */}
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Teléfono *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="+57 123 4567890"
            />
          </div>

          {/* Título */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Título del Problema *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ej: Mi computadora no enciende"
            />
          </div>

          {/* Descripción */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descripción del Problema *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Describe detalladamente el problema que estás experimentando..."
              rows={5}
            />
          </div>

          {/* Categoría */}
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.select}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div className={styles.formGroup}>
            <label htmlFor="priority" className={styles.label}>
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={styles.select}
            >
              {priorities.map((pri) => (
                <option key={pri.value} value={pri.value}>
                  {pri.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botón Enviar */}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Creando Ticket...' : 'Crear Ticket'}
          </button>
        </form>

        <p className={styles.note}>
          Recibirás actualizaciones sobre tu ticket en el email proporcionado
        </p>
      </div>
    </div>
  );
}
