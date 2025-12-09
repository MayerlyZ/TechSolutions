import LoginForm from '@/app/components/login/LoginForm'; 

export default function LoginPage() {
  return (
    <main style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      backgroundColor: '#FFFAEF',
      padding: '1rem'
    }}>
      <div style={{ 
        position: 'relative', 
        width: '100%',
        maxWidth: '500px',
        padding: '3rem 2rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          color: '#304F40',
          marginBottom: '2rem',
          margin: '0 0 2rem 0'
        }}>
          TechSolutions
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}