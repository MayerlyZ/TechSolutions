'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'react-toastify';
import Style from './style.module.css';

export default function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  
  const router = useRouter();

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage, router]);

  return (
    <form action={dispatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label className={Style.label} htmlFor="email">
          Email
        </label>
        <input
          className={Style.input}
          id="email"
          type="email"
          name="email"
          placeholder="Ingresa tu correo"
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
          placeholder="Ingresa tu contraseña"
          required
          minLength={6}
        />
      </div>
      
      <LoginButton />

      <p
        style={{
          textAlign: 'center',
          marginTop: '1rem',
          fontFamily: 'Inter, sans-serif',
          color: '#666',
        }}
      >
        ¿No tienes cuenta?{' '}
        <a
          href="/signup"
          style={{
            color: '#34bb9eff',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Registrate aquí
        </a>
      </p>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      aria-disabled={pending}
      className="style.button"
      style={{ 
        marginTop: '1.5rem', 
        padding: '12px 20px', 
        backgroundColor: pending ? '#999' : '#34bb9eff', 
        color: '#FFFAEF', 
        border: 'none', 
        borderRadius: '20px', 
        cursor: pending ? 'not-allowed' : 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        fontFamily: "'Playfair Display', serif",
        transition: 'all 300ms ease-in-out',
        transform: pending ? 'scale(1)' : 'scale(1)',
        opacity: pending ? '0.6' : '1'
      }}
    >
      {pending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
    </button>
  );
}