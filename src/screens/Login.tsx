import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ProtectedRoute will catch auth and navigate automatically, but we can do it explicitly
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col p-6 items-center justify-center">
      <div className="w-20 h-20 bg-app-blue rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(10,132,255,0.2)] mb-8">
        <ShieldCheck className="w-12 h-12 text-app-text" />
      </div>
      <h1 className="text-3xl font-bold text-app-text mb-2 tracking-tight">SafeSaathi</h1>
      <p className="text-app-dim mb-10">With you, every step.</p>

      <form onSubmit={handleLogin} className="w-full space-y-4">
        {error && <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-app-text text-sm">{error}</div>}
        
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue transition placeholder:text-app-dim"
            placeholder="ananya@example.com"
            required
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue transition placeholder:text-app-dim"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-white text-black font-bold py-4 rounded-xl mt-6 active:scale-95 transition"
        >
          {loading ? 'Logging in...' : 'Login Securely'}
        </button>
      </form>

      <p className="text-app-dim mt-8 text-sm">
        New to SafeSaathi? <Link to="/register" className="text-app-blue font-medium ml-1">Create Account</Link>
      </p>
    </div>
  );
}
