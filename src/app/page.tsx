
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import  '../app/globals.css';

interface Session {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data: Session = await response.json();
          setSession(data);
          
          // Si es admin, redirigir al panel admin
          if (data?.user?.role === 'admin') {
            router.push('/admin');
            return;
          }
          
          // Mostrar mensaje de bienvenida solo si hay sesión, es cliente, y no se ha mostrado ya
          if (data?.user?.role === 'customer') {
            const hasSeenWelcome = sessionStorage.getItem('welcomeShown');
            if (!hasSeenWelcome) {
              setShowWelcome(true);
              toast.success(`¡Bienvenido ${data.user.name}!`);
              sessionStorage.setItem('welcomeShown', 'true');
              
              // Ocultar el mensaje de bienvenida después de 5 segundos
              setTimeout(() => {
                setShowWelcome(false);
              }, 5000);
            }
          }
        }
      } catch (error) {
        console.log('No hay sesión activa');
      }
    };

    checkSession();
  }, []);

  const handleContactClick = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          asunto: "Hola desde TechSolutions",
          mensajeHtml: `
            <div style="font-family:Inter,sans-serif;color:#592202;background:#F2E7DC;padding:24px;border-radius:24px;">
              <h2 style="margin-top:0; font-family:'Playfair Display', serif; font-style: italic; color:#592202; font-size:28px;">TechSolutions </h2>
              <p style="line-height:1.6;font-size:16px;margin:16px 0;">
                  Bienvenid@ <strong>${email}</strong> Para conocer mas, inicia sesion. 
              </p>
            </div>
          `,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal al enviar el correo.');
      }

      toast.success(data.res);
      setEmail(''); 
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-center px-4 py-8">
      <div className="flex flex-col items-center justify-center w-full">
        {/* Mensaje de bienvenida para clientes */}
        {showWelcome && session?.user?.role === 'customer' && (
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#304F40',
            color: '#FFFAEF',
            padding: '1rem 2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.3rem',
            fontStyle: 'italic',
            zIndex: 100,
            maxWidth: '90%',
            animation: 'slideDown 0.5s ease-out'
          }}>
            ¡Bienvenido {session.user.name}! 
          </div>
        )}

        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/img/logo.png"
            alt="TechSolutions Logo"
            width={150}
            height={150}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        <h1 className="text-6xl md:text-7xl font-playfair mb-4">La solucion que necesitas  </h1>
        <p className="text-lg mb-6"> A un solo click</p>
        <div className="flex flex-col items-center gap-3 mt-8 w-full justify-center">
          <div className="flex flex-row items-center gap-3 w-full justify-center" style={{fontFamily:'font-playfair'}}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-TechSolutions-dark text-black text-base w-48"
              style={{fontSize: '1rem', width:'300px' , height:'40px', borderRadius:'30px', padding:'5px', margin:'30px', border:'1px solid #30b3bdff'}}
            />
            
          </div>
          <button 
            onClick={handleContactClick}
            disabled={loading || !email}
            style={{background:' rgba(78, 226, 219, 0.8)', color:'#FFFAEF', borderRadius:'30px', width:'165px', height:'40px', margin:'5px' , border:'none', fontFamily:'font-playfair', fontSize:'1.2rem', cursor: (loading || !email) ? 'not-allowed' : 'pointer', opacity: (loading || !email) ? 0.6 : 1}}
          >
            {loading ? 'Enviando...' : 'Contactame'}
          </button>
          <button 
            onClick={() => router.push('/new-ticket')}
            style={{background:'rgba(48, 79, 64, 0.9)', color:'#FFFAEF', borderRadius:'30px', width:'200px', height:'40px', margin:'5px', border:'none', fontFamily:'font-playfair', fontSize:'1.2rem', cursor: 'pointer', transition: 'all 0.3s ease'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(48, 79, 64, 1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(48, 79, 64, 0.9)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Crear nuevo ticket
          </button>
        </div>
        <div className="flex gap-6 justify-center mt-6">
          <a href="#" aria-label="Facebook" className="text-white hover:text-TechSolutions-light text-2xl"><i className="fab fa-facebook"></i></a>
          <a href="#" aria-label="Instagram" className="text-white hover:text-TechSolutions-light text-2xl"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="Twitter" className="text-white hover:text-TechSolutions-light text-2xl"><i className="fab fa-twitter"></i></a>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}