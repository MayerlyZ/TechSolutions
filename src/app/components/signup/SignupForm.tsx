'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Style from '../login/style.module.css';

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      toast.success('¡Cuenta creada exitosamente! Te hemos enviado un email de bienvenida.');
      setFormData({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label className={Style.label} htmlFor="name">
          Nombre Completo
        </label>
        <input
          className={Style.input}
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          required
        />
      </div>

      <div>
        <label className={Style.label} htmlFor="email">
          Email
        </label>
        <input
          className={Style.input}
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          required
        />
      </div>

      <div>
        <label className={Style.label} htmlFor="password">
          Contraseña
        </label>
        <input
          className={Style.input}
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
        />
      </div>

      <div>
        <label className={Style.label} htmlFor="passwordConfirm">
          Confirmar Contraseña
        </label>
        <input
          className={Style.input}
          id="passwordConfirm"
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          placeholder="Confirma tu contraseña"
          required
          minLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={Style.button}
        style={{
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </button>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1rem',
          fontFamily: 'Inter, sans-serif',
          color: '#666',
        }}
      >
        ¿Ya tienes cuenta?{' '}
        <a
          href="/login"
          style={{
            color: '#34bb9eff',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Inicia sesión aquí
        </a>
      </p>
    </form>
  );
}
