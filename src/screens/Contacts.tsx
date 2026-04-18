import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Plus, Trash2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contacts() {
  const navigate = useNavigate();
  const { trustedContacts, addTrustedContact, removeTrustedContact } = useAppStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  const handleAddContact = () => {
    if (!name || !phone) return;

    const newContact = {
      id: Date.now().toString(),
      name,
      phone,
      relation: relation || 'Friend/Family'
    };

    addTrustedContact(newContact);
    setName('');
    setPhone('');
    setRelation('');
  };

  return (
    <div className="min-h-screen bg-app-bg p-6">
      <div className="flex items-center gap-4 mb-8">
        <div onClick={() => navigate(-1)} className="w-10 h-10 bg-app-card-light rounded-full flex items-center justify-center cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-app-text">Trusted Contacts</h1>
      </div>

      {/* Add New Contact */}
      <div className="bg-app-card rounded-3xl p-6 mb-8">
        <h3 className="font-bold text-app-text mb-4">Add New Trusted Contact</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Contact Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-app-text"
          />
          <input
            type="tel"
            placeholder="+91 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-app-text"
          />
          <input
            type="text"
            placeholder="Relation (optional)"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-app-text"
          />
          <button
            onClick={handleAddContact}
            disabled={!name || !phone}
            className="w-full bg-app-blue text-white py-4 rounded-xl font-bold disabled:opacity-50"
          >
            Add Contact
          </button>
        </div>
      </div>

      {/* List of Trusted Contacts */}
      <div className="space-y-4">
        <h3 className="text-app-dim font-medium px-2">Your Trusted Contacts ({trustedContacts.length})</h3>
        
        {trustedContacts.length === 0 ? (
          <div className="bg-app-card rounded-3xl p-12 text-center">
            <p className="text-app-dim">No trusted contacts added yet</p>
          </div>
        ) : (
          trustedContacts.map((contact) => (
            <div key={contact.id} className="bg-app-card rounded-3xl p-5 border border-app-border flex items-center gap-4">
              <div className="w-12 h-12 bg-app-blue/10 rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-app-blue" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-app-text">{contact.name}</h4>
                <p className="text-app-dim">{contact.phone}</p>
                {contact.relation && <p className="text-xs text-app-dim">{contact.relation}</p>}
              </div>
              <button
                onClick={() => removeTrustedContact(contact.id)}
                className="p-3 text-red-500 hover:bg-red-900/30 rounded-xl"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}