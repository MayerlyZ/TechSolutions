'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from '@/app/components/admin/admin.module.css';
 
interface Comment {
  _id: string;
  userId: string;
  commentId: string; 
  text: string; 
  status: string;
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/comments'); 
      const data = await response.json();
      setComments(data.data || []);
    } catch (error) {
      toast.error('Error al cargar comentarios'); 
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar comentario'); 
      }

      toast.success('Comentario actualizado'); 
      fetchComments(); // Refetch comments after update
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Gestión de Comentarios</h1> 

      {loading ? (
        <p>Cargando...</p>
      ) : comments.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateIcon}>—</p>
          <p>No hay comentarios disponibles</p> 
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Comentario</th> 
                <th>ID Usuario</th>
                <th>ID commento</th>
                <th>Comentario</th> 
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => (
                <tr key={comment._id}>
                  <td>{comment._id.slice(0, 8)}...</td>
                  <td>{comment.userId.slice(0, 8)}...</td>
                  <td>{comment.commentId.slice(0, 8)}...</td>
                  <td>{comment.text.slice(0, 50)}...</td> 
                  <td>
                    <select
                      value={comment.status}
                      onChange={(e) => handleStatusChange(comment._id, e.target.value)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                      }}
                    >
                      <option value="pending">Pendiente</option> 
                      <option value="approved">Aprobado</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                  </td>
                  <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => alert('Detalles del Comentario: ' + comment._id)} 
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