import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ShieldCheck, Target, AlertTriangle } from 'lucide-react';

export default function FeelingSafe() {
  const navigate = useNavigate();
  const { profile, setSOSActive } = useAppStore();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Timeout triggered SOS
      setSOSActive(true);
      navigate('/');
    }
  }, [timeLeft, navigate, setSOSActive]);

  const verify = () => {
    if (answer.toLowerCase().trim() === profile?.securityAnswer?.toLowerCase().trim()) {
      // Success
      navigate('/');
    } else {
      setError(true);
      // Wait for a bit then trigger SOS or drop straight to SOS
      setTimeout(() => {
        setSOSActive(true);
        navigate('/');
      }, 1000);
    }
  };

  const getQuestionText = (q?: string) => {
    if (q === 'color') return 'What is your favorite color?';
    if (q === 'pet') return 'What is the name of your first pet?';
    if (q === 'city') return 'What city were you born in?';
    return 'Security Question:';
  };

  return (
    <div className="min-h-screen bg-app-bg p-6 flex flex-col justify-center relative">
      <div className="absolute top-6 right-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-lg font-bold border-2 ${timeLeft < 10 ? 'border-red-500 text-app-red animate-pulse' : 'border-app-blue text-app-blue'}`}>
          {timeLeft}s
        </div>
      </div>

      <div className="bg-app-card-light rounded-3xl p-6 border border-app-border shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-app-blue/10 rounded-full blur-2xl"></div>
        
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-app-blue w-8 h-8" />
          <h2 className="text-2xl font-bold text-app-text">Security Check</h2>
        </div>

        <p className="text-app-text mb-6 leading-relaxed">
          Please answer your security question to verify you are safe. <span className="text-app-red font-medium">An incorrect answer will instantly trigger an SOS.</span>
        </p>

        <div className="bg-app-card p-4 rounded-xl border border-app-border mb-6">
          <p className="text-sm text-app-dim uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" /> The Question
          </p>
          <p className="text-app-text text-lg font-medium">
            {getQuestionText(profile?.securityQuestion)}
          </p>
        </div>

        <input
          type="text"
          value={answer}
          onChange={e => {
            setAnswer(e.target.value);
            setError(false);
          }}
          className={`w-full bg-app-card border ${error ? 'border-red-500' : 'border-app-border focus:border-app-blue'} text-app-text rounded-xl p-4 text-lg outline-none transition mb-8`}
          placeholder="Your secret answer..."
          autoFocus
        />

        {error && (
          <div className="flex items-center gap-2 text-app-red mb-6 mt-[-1rem]">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold text-sm">Incorrect answer. SOS triggering...</span>
          </div>
        )}

        <button 
          onClick={verify}
          disabled={!answer}
          className="w-full bg-app-blue text-app-text font-bold py-4 rounded-xl hover:bg-app-blue active:bg-app-blue/80 transition disabled:opacity-50"
        >
          Verify Identity
        </button>
      </div>
      
      <div className="text-center mt-6">
        <button className="text-app-red font-bold uppercase tracking-widest text-sm py-4" onClick={() => setSOSActive(true)}>
          I AM NOT SAFE (TRIGGER SOS)
        </button>
      </div>
    </div>
  );
}
