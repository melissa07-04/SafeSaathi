import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Check, Trash2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

type Contact = { id: string; name: string; phone: string; notifySOS: boolean; notifyTracking: boolean; };

export default function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    if (!auth.currentUser) return;
    try {
      const snap = await getDocs(collection(db, 'users', auth.currentUser.uid, 'contacts'));
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Contact[];
      setContacts(arr);
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const addDummyContact = async () => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'contacts'), {
        name: 'Jane Doe',
        phone: '+91 9123456789',
        notifySOS: true,
        notifyTracking: true,
        createdAt: Date.now()
      });
      fetchContacts();
    } catch(e) { console.error(e); }
  };

  const removeContact = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'contacts', id));
      setContacts(contacts.filter(c => c.id !== id));
    } catch(e) { console.error(e); }
  }

  return (
    <div className="p-6 bg-app-bg min-h-screen pb-32">
      <div className="flex items-center gap-4 mb-8 pt-4">
        <div 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-app-card-light rounded-full flex items-center justify-center border border-app-border cursor-pointer text-app-text"
        >
          <ArrowLeft className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-app-text">Trusted Contacts</h1>
      </div>

      <div className="bg-app-card-light rounded-2xl p-6 border border-app-border mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <Shield className="w-32 h-32" />
        </div>
        <h2 className="text-xl font-bold text-app-text mb-2 relative z-10">Your Safety Network</h2>
        <p className="text-app-dim text-sm mb-6 relative z-10">
          These contacts will be instantly notified with your live tracking link and location if you trigger an SOS.
        </p>
        <button className="bg-app-border text-app-text px-4 py-2 rounded-lg font-medium text-sm relative z-10 pointer-events-none hover:bg-slate-700">
          Manage Permissions
        </button>
      </div>

      <p className="text-xs font-bold text-app-dim tracking-widest uppercase mb-4">Alert Sent To ({contacts.length})</p>

      {loading ? (
        <div className="text-center py-10 text-app-dim">Loading contacts...</div>
      ) : (
        <div className="space-y-4">
          {contacts.map(c => (
            <div key={c.id} className="bg-app-card rounded-2xl p-5 border border-app-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-app-blue rounded-full flex items-center justify-center text-app-text font-bold text-lg">
                    {c.name.charAt(0)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1C1D2B]"></div>
                </div>
                <div>
                  <h3 className="text-app-text font-bold">{c.name}</h3>
                  <p className="text-app-dim text-sm mt-0.5">{c.phone}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                 <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-app-green">
                   <Check className="w-4 h-4" />
                 </div>
                 <button onClick={() => removeContact(c.id)} className="flex items-center gap-1 text-app-red/80 hover:text-app-red text-[10px] font-bold uppercase tracking-wider">
                   <Trash2 className="w-3 h-3" /> Remove
                 </button>
              </div>
            </div>
          ))}

          <button 
            onClick={addDummyContact}
            className="w-full border-2 border-dashed border-app-border hover:border-slate-500 text-app-dim bg-transparent rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition"
          >
            <UserPlus className="w-6 h-6" />
            <span className="font-bold">Add New Contact</span>
          </button>
        </div>
      )}
    </div>
  );
}
