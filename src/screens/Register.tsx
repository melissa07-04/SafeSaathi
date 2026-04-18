import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User, Phone, Mail, Lock, ShieldQuestion } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    securityQuestion: 'color', // or 'pet', 'place'
    securityAnswer: 'Blue',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create auth user
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      
      // 2. Create profile doc in Firestore (matching blueprint)
      const userRef = doc(db, 'users', userCred.user.uid);
      await setDoc(userRef, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer,
        createdAt: Date.now()
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-app-text mb-2 tracking-tight">Create Account</h1>
        <p className="text-app-dim mb-8">Let's set up your safety profile.</p>

        {error && <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-app-text text-sm mb-4">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue placeholder:text-app-dim"
                placeholder="Full Name"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue placeholder:text-app-dim"
                placeholder="+91 9876543210"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue placeholder:text-app-dim"
                placeholder="Email Address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue placeholder:text-app-dim"
                placeholder="Password"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!form.name || !form.phone || !form.email || !form.password}
              className="w-full bg-app-blue text-app-text font-bold py-4 rounded-xl mt-6 active:scale-95 transition disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="bg-app-card-light p-6 rounded-2xl border border-app-border">
              <div className="flex items-center gap-3 mb-2">
                <ShieldQuestion className="text-app-blue w-6 h-6" />
                <h3 className="font-bold text-app-text text-lg">Set Safety Question</h3>
              </div>
              <p className="text-sm text-app-dim mb-6">This helps us verify you when you press "I'm Safe".</p>

              <div className="space-y-4">
                <select 
                  value={form.securityQuestion}
                  onChange={e => setForm({...form, securityQuestion: e.target.value})}
                  className="w-full bg-app-card border border-app-border text-app-text rounded-xl p-4 focus:outline-none focus:border-app-blue appearance-none"
                >
                  <option value="color">What is your favorite color?</option>
                  <option value="pet">What is the name of your first pet?</option>
                  <option value="city">What city were you born in?</option>
                </select>

                <input
                  type="text"
                  value={form.securityAnswer}
                  onChange={e => setForm({...form, securityAnswer: e.target.value})}
                  className="w-full bg-app-card border border-app-border text-app-text rounded-xl p-4 focus:outline-none focus:border-app-blue"
                  placeholder="Your Answer"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !form.securityAnswer}
              className="w-full bg-white text-black font-bold py-4 rounded-xl mt-6 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Finish Setup'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-app-dim text-sm font-medium"
            >
              Back
            </button>
          </form>
        )}

        {step === 1 && (
          <div className="text-center mt-6">
            <span className="text-app-dim text-sm">Already have an account? </span>
            <Link to="/login" className="text-app-blue text-sm font-medium">Log in</Link>
          </div>
        )}
      </div>
    </div>
  );
}
