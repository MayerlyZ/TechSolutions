'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from '@/app/components/admin/admin.module.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone: string;
  isActive: boolean;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
  phone: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!editingId && !formData.password) {
        throw new Error('La contraseña es requerida para nuevos usuarios');
      }

      const userData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
      };

      if (!editingId || formData.password) {
        userData.password = formData.password;
      }

      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success(editingId ? 'Usuario actualizado' : 'Usuario creado');
      setFormData({ name: '', email: '', password: '', role: 'customer', phone: '' });
      setEditingId(null);
      setShowModal(false);

      setTimeout(() => {
        fetchUsers();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone,
    });
    setEditingId(user._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return;

    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Error al eliminar');
      }

      toast.success('Usuario eliminado');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', role: 'customer', phone: '' });
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Gestión de Usuarios</h1>

      <button className={styles.addBtn} onClick={() => setShowModal(true)}>
        Crear Usuario
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : users.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateIcon}>—</p>
          <p>No hay usuarios disponibles</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id || `user-${index}`}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{
                      background: user.role === 'admin' ? '#e74c3c' : '#3498db',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.phone || '-'}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(user._id)}
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

      {showModal && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button className={styles.closeBtn} onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nombre *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Contraseña {editingId ? '(dejar en blanco para no cambiar)' : '*'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingId}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Rol *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="customer">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                {editingId ? 'Actualizar' : 'Crear'} Usuario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
