import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User, Phone, Mail, Lock, ShieldQuestion, Plus, Heart } from 'lucide-react';

const PREDEFINED_QUESTIONS = [
  "What is your favorite color?",
  "What is the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favorite food?",
  "What is the name of your childhood best friend?",
  "What was your first car or bike model?"
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Basic Info
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  // Personal & Medical Info
  const [personalInfo, setPersonalInfo] = useState({
    height: '',
    weight: '',
    identificationMark: '',
    bloodGroup: '',
    allergies: '',
    medicalConditions: '',
  });

  // Security Questions (5 by default)
  const [securityQuestions, setSecurityQuestions] = useState<
    { question: string; answer: string }[]
  >([
    { question: PREDEFINED_QUESTIONS[0], answer: '' },
    { question: PREDEFINED_QUESTIONS[1], answer: '' },
    { question: PREDEFINED_QUESTIONS[2], answer: '' },
    { question: PREDEFINED_QUESTIONS[3], answer: '' },
    { question: PREDEFINED_QUESTIONS[4], answer: '' },
  ]);

  const updatePersonalInfo = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateAnswer = (index: number, answer: string) => {
    const updated = [...securityQuestions];
    updated[index].answer = answer;
    setSecurityQuestions(updated);
  };

  const addNewQuestion = () => {
    if (securityQuestions.length >= 8) return;
    const nextIndex = securityQuestions.length;
    setSecurityQuestions([
      ...securityQuestions,
      { question: PREDEFINED_QUESTIONS[nextIndex], answer: '' }
    ]);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const allAnswered = securityQuestions.every(q => q.answer.trim().length >= 2);
    if (!allAnswered) {
      setError('Please answer all security questions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);

      const userRef = doc(db, 'users', userCred.user.uid);
      await setDoc(userRef, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        height: personalInfo.height,
        weight: personalInfo.weight,
        identificationMark: personalInfo.identificationMark,
        bloodGroup: personalInfo.bloodGroup,
        allergies: personalInfo.allergies,
        medicalConditions: personalInfo.medicalConditions,
        securityQuestions: securityQuestions,
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

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue placeholder:text-app-dim" placeholder="Full Name" />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue placeholder:text-app-dim" placeholder="+91 9876543210" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue placeholder:text-app-dim" placeholder="Email Address" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-app-dim w-5 h-5" />
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full bg-app-card border border-app-border text-app-text rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-app-blue placeholder:text-app-dim" placeholder="Password" />
            </div>

            <button onClick={() => setStep(2)} disabled={!form.name || !form.phone || !form.email || !form.password}
              className="w-full bg-app-blue text-app-text font-bold py-4 rounded-xl mt-6 active:scale-95 transition disabled:opacity-50">
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Personal & Medical Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-app-blue w-6 h-6" />
              <h3 className="font-bold text-app-text text-lg">Personal & Medical Information</h3>
            </div>
            <p className="text-app-dim text-sm">This information can help in emergencies.</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-app-dim block mb-1">Height (cm)</label>
                <input type="text" value={personalInfo.height} onChange={e => updatePersonalInfo('height', e.target.value)} className="w-full bg-app-card border border-app-border text-app-text rounded-xl p-4" placeholder="165" />
              </div>
              <div>
                <label className="text-xs text-app-dim block mb-1">Weight (kg)</label>
                <input type="text" value={personalInfo.weight} onChange={e => updatePersonalInfo('weight', e.target.value)} className="w-full bg-app-card border border-app-border text-app-text rounded-xl p-4" placeholder="60" />
              </div>
            </div>

            <div>
              <label className="text-xs text-app-dim block mb-1">Visible Identification Mark</label>
              <input type="text" value={personalInfo.identificationMark} onChange={e => updatePersonalInfo('identificationMark', e.target.value)} className="w-full bg-app-card border border-app-border text-app-text rounded-xl p-4" placeholder="Mole on left cheek, scar on right arm" />
            </div>

            <div>
              <label className="text-xs text-app-dim block mb-1">Blood Group</label>
              <select value={personalInfo.bloodGroup} onChange={e => updatePersonalInfo('bloodGroup', e.target.value)} className="w-full bg-app-card border border-app-border text-app-text rounded-xl p-4">
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-app-dim block mb-1">Allergies (if any)</label>
              <input type="text" value={personalInfo.allergies} onChange={e => updatePersonalInfo('allergies', e.target.value)} className="w-full bg-app-card border border-app-border text-app-text rounded-xl p-4" placeholder="Penicillin, Dust, Peanuts" />
            </div>

            <div>
              <label className="text-xs text-app-dim block mb-1">Medical Conditions / Illnesses</label>
              <textarea value={personalInfo.medicalConditions} onChange={e => updatePersonalInfo('medicalConditions', e.target.value)} className="w-full bg-app-card border border-app-border text-app-text rounded-xl p-4 h-24 resize-y" placeholder="Asthma, Diabetes, etc." />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 border border-app-border text-app-dim rounded-xl">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-app-blue text-app-text font-bold py-4 rounded-xl">Continue to Security</button>
            </div>
          </div>
        )}

        {/* Step 3: Security Questions */}
        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="bg-app-card-light p-6 rounded-2xl border border-app-border">
              <div className="flex items-center gap-3 mb-4">
                <ShieldQuestion className="text-app-blue w-6 h-6" />
                <h3 className="font-bold text-app-text text-lg">Set Security Questions</h3>
              </div>
              <p className="text-sm text-app-dim mb-6">Answer all 5 questions. One will be randomly asked during safety check-ins.</p>

              <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
                {securityQuestions.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-app-text text-sm font-medium block">{item.question}</label>
                    <input
                      type="text"
                      value={item.answer}
                      onChange={(e) => updateAnswer(index, e.target.value)}
                      className="w-full bg-app-card border border-app-border text-app-text rounded-xl p-4 focus:outline-none focus:border-app-blue"
                      placeholder="Your Answer"
                      required
                    />
                  </div>
                ))}
              </div>

              {securityQuestions.length < 8 && (
                <button type="button" onClick={addNewQuestion} className="mt-6 w-full flex items-center justify-center gap-2 py-3 border border-dashed border-app-border text-app-dim hover:text-app-text rounded-xl hover:border-app-blue transition">
                  <Plus size={18} /> Add Another Question
                </button>
              )}
            </div>

            <button type="submit" disabled={loading || securityQuestions.some(q => q.answer.trim().length < 2)}
              className="w-full bg-white text-black font-bold py-4 rounded-xl active:scale-95 transition disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Finish Setup'}
            </button>

            <button type="button" onClick={() => setStep(2)} className="w-full py-2 text-app-dim text-sm font-medium">Back</button>
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