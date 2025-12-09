'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import styles from './productos.module.css';

interface comment {
  _id: string;
  name: string;
  description: string;
  asigando: string;
  category: string;
  image?: string;
  fecha: string;
}

interface commentFormData {
  name: string;
  description: string;
  image?: string;
  asignado?: string; 
  email: string;
  prioridad: string;
  fecha?: string;
}

export default function commentsPage() {
  const [session, setSession] = useState<{ user?: { email: string } } | null>(null);
  const [comments, setcomments] = useState<comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [formData, setFormData] = useState<commentFormData>({
    name: '',
    description: '',
    image: '',
    asignado: '', 
    email: '',
    prioridad: 'Media',
  });

  useEffect(() => {
    // Verificar sesión
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        }
      } catch (err) {
        console.log('No hay sesión activa');
      }
    };

    // Cargar favoritos del localStorage
    const saveFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saveFavorites.map((fav: any) => fav.id));

    checkSession();
    fetchcomments();
  }, [selectedCategory]);

  const fetchcomments = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/api/comments?category=${selectedCategory}`
        : '/api/comments';

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar comments');
      }

      setcomments(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setcomments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage(null);

    try {
      if (!formData.name || !formData.description || !formData.email || !formData.fecha || !formData.asignado || !formData.prioridad) {
        throw new Error('Por favor, completa todos los campos requeridos');
      }

      const commentData = {
        name: formData.name,
        description: formData.description,
        category: formData.prioridad, 
        image: formData.image || null,
        asignado: formData.asignado,
      };

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el ticket');
      }

      setFormMessage({
        type: 'success',
        text: ' ticket creado exitosamente',
      });

      setFormData({
        name: '',
        description: '',
        asignado: '',
        image: '',
        email: '',
        prioridad: 'Media',
      });

      // Recargar comments después de 1 segundo
      setTimeout(() => {
        fetchcomments();
        setShowModal(false);
      }, 1000);
    } catch (error: any) {
      setFormMessage({
        type: 'error',
        text: ` ${error.message}`,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const categories = [
    { value: '', label: 'Todos los tickets' },
    { value: 'sin resolver', label: 'Sin resolver' },
    { value: 'en curso', label: 'En curso' },
    { value: 'resuelto', label: 'Resuelto' },
    { value: 'novedades', label: 'Novedades' },
  ];

  const handleAddToCart = (comment: comment) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === comment._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: comment._id,
        name: comment.name,
        fecha: comment.fecha,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${comment.name} agregado al carrito`);
  };

  

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear un nuevo ticket</h1>
        <p className={styles.subtitle}>La mejor opcion para optimizar</p>
      </div>

      {/* Filtros de estado*/}
      <div className={styles.filterSection}>
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.filterBtn} ${
                selectedCategory === cat.value ? styles.active : ''
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className={styles.loading}>
          <p>Cargando tickets...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p> {error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay tickets disponibles en esta categoría.</p>
        </div>
      ) : (
        <div className={styles.commentsGrid}>
          {comments.map((comment) => (
            <div key={comment._id} className={styles.commentCard}>
              {comment.image && (
                <Image
                  src={comment.image}
                  alt={comment.name}
                  width={300}
                  height={200}
                  className={styles.commentImage}
                />
              )}
              <div className={styles.commentInfo}>
                <h3 className={styles.commentName}>{comment.name}</h3>
                <p className={styles.commentDescription}>{comment.description}</p>
                <p className={styles.commentCategory}>Categoría: {comment.category}</p>
                <p className={styles.commentStock}>Asignado a: Agente {comment.asigando}</p>
                <p className={styles.commentStock}>Fecha: {comment.fecha}</p>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Botón flotante + (solo para admin) */}
      {session?.user && (
        <>
          <button
            className={styles.floatingButton}
            onClick={() => setShowModal(true)}
            title="Crear ticket"
          >
            +
          </button>

          {/* Modal */}
          {showModal && (
            <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>Crear Nuevo ticket</h2>
                  <button
                    className={styles.closeBtn}
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className={styles.formModal}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Titulo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Titulo del ticket"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description">Descripción *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Descripción"
                      rows={3}
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Correo Electronico *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="example@gmail.com"
                        required
                      />
                    </div>

                

                      <div className={styles.formGroup}>
                        <label htmlFor="asignado">Asiganado a *</label>
                        <input
                          type="text"
                          id="asignado a"
                          name="asignado"
                          value={formData.asignado}
                          onChange={handleFormChange}
                          placeholder=" asignado a un agente aleatorio"
                          required
                        />
                      </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="prioridad">Prioridad *</label>
                      <select
                        id="prioridad"
                        name="prioridad"
                        value={formData.prioridad}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="fecha">Fecha</label>
                      <input
                        type="date"
                        id="fecha"
                        name="sku"
                        value={formData.fecha}
                        onChange={handleFormChange}
                        placeholder="fecha creacion"
                      />
                    </div>
                  </div>


                  {formMessage && (
                    <div
                      className={`${styles.message} ${
                        formMessage.type === 'success'
                          ? styles.successMessage
                          : styles.errorMessage
                      }`}
                    >
                      {formMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formLoading}
                    className={styles.submitBtn}
                  >
                    {formLoading ? 'Creando...' : ' Crear ticket'}
                  </button>
                </form>
              </div>
            </div>

          )}
        </>
      )}
    </main>
  );
}
