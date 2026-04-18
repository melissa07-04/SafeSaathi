import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, LogOut, User, HeartPulse, ShieldQuestion, Edit3, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, setProfile } = useAppStore();
  const { t, i18n } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    height: profile?.height || '',
    weight: profile?.weight || '',
    identificationMark: profile?.identificationMark || '',
    bloodGroup: profile?.bloodGroup || '',
    allergies: profile?.allergies || '',
    medicalConditions: profile?.medicalConditions || '',
  });

  const handleLogout = async () => {
    await auth.signOut();
    setProfile(null);
    navigate('/login');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleSave = async () => {
    if (!profile) return;

    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("User not authenticated. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        height: editForm.height,
        weight: editForm.weight,
        identificationMark: editForm.identificationMark,
        bloodGroup: editForm.bloodGroup,
        allergies: editForm.allergies,
        medicalConditions: editForm.medicalConditions,
      });

      // Update local state
      setProfile({
        ...profile,
        height: editForm.height,
        weight: editForm.weight,
        identificationMark: editForm.identificationMark,
        bloodGroup: editForm.bloodGroup,
        allergies: editForm.allergies,
        medicalConditions: editForm.medicalConditions,
      });

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditForm({
      height: profile?.height || '',
      weight: profile?.weight || '',
      identificationMark: profile?.identificationMark || '',
      bloodGroup: profile?.bloodGroup || '',
      allergies: profile?.allergies || '',
      medicalConditions: profile?.medicalConditions || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-app-bg min-h-screen pb-32">
      <div className="flex justify-between items-center mb-8 pt-4">
        <div 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-app-card-light rounded-full flex items-center justify-center border border-app-border cursor-pointer text-app-text"
        >
          <ArrowLeft className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-app-text">Account Profile</h1>
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-app-blue text-white rounded-xl text-sm font-medium"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 bg-app-blue rounded-full flex items-center justify-center text-4xl font-black mb-4 shadow-[0_0_30px_rgba(10,132,255,0.2)]">
          {profile?.name?.charAt(0) || 'A'}
        </div>
        <h2 className="text-2xl font-bold text-app-text">{profile?.name || 'User'}</h2>
        <p className="text-app-dim mt-1">{profile?.phone || '+'}</p>
      </div>

      <div className="space-y-6">

        {/* Personal Details */}
        <div className="bg-app-card rounded-3xl p-6 border border-app-border">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-6 h-6 text-app-blue" />
            <h3 className="text-xl font-bold text-app-text">Personal Details</h3>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-app-dim block mb-1">Height (cm)</label>
                  <input 
                    type="text" 
                    value={editForm.height} 
                    onChange={(e) => setEditForm({...editForm, height: e.target.value})}
                    className="w-full bg-app-bg border border-app-border rounded-xl p-3" 
                    placeholder="165" 
                  />
                </div>
                <div>
                  <label className="text-xs text-app-dim block mb-1">Weight (kg)</label>
                  <input 
                    type="text" 
                    value={editForm.weight} 
                    onChange={(e) => setEditForm({...editForm, weight: e.target.value})}
                    className="w-full bg-app-bg border border-app-border rounded-xl p-3" 
                    placeholder="60" 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-app-dim block mb-1">Identification Mark</label>
                <input 
                  type="text" 
                  value={editForm.identificationMark} 
                  onChange={(e) => setEditForm({...editForm, identificationMark: e.target.value})}
                  className="w-full bg-app-bg border border-app-border rounded-xl p-3" 
                  placeholder="Mole on left cheek, scar on right arm" 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-app-border">
                <span className="text-app-dim">Height</span>
                <span className="text-app-text">{profile?.height ? `${profile.height} cm` : '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-app-border">
                <span className="text-app-dim">Weight</span>
                <span className="text-app-text">{profile?.weight ? `${profile.weight} kg` : '-'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-app-dim">Identification Mark</span>
                <span className="text-app-text text-right">{profile?.identificationMark || '-'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Medical Info */}
        <div className="bg-app-card rounded-3xl p-6 border border-app-border">
          <div className="flex items-center gap-3 mb-5">
            <HeartPulse className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-bold text-app-text">Emergency Medical Information</h3>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-app-dim block mb-1">Blood Group</label>
                <select 
                  value={editForm.bloodGroup} 
                  onChange={(e) => setEditForm({...editForm, bloodGroup: e.target.value})}
                  className="w-full bg-app-bg border border-app-border rounded-xl p-3"
                >
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
                <label className="text-xs text-app-dim block mb-1">Allergies</label>
                <input 
                  type="text" 
                  value={editForm.allergies} 
                  onChange={(e) => setEditForm({...editForm, allergies: e.target.value})}
                  className="w-full bg-app-bg border border-app-border rounded-xl p-3" 
                  placeholder="Penicillin, Dust, Peanuts" 
                />
              </div>
              <div>
                <label className="text-xs text-app-dim block mb-1">Medical Conditions / Illnesses</label>
                <textarea 
                  value={editForm.medicalConditions} 
                  onChange={(e) => setEditForm({...editForm, medicalConditions: e.target.value})}
                  className="w-full bg-app-bg border border-app-border rounded-xl p-3 h-24" 
                  placeholder="Asthma, Diabetes, etc."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-app-border">
                <span className="text-app-dim">Blood Group</span>
                <span className="font-semibold text-app-text">{profile?.bloodGroup || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-app-border">
                <span className="text-app-dim">Allergies</span>
                <span className="text-app-text">{profile?.allergies || 'None'}</span>
              </div>
              <div>
                <span className="text-app-dim block mb-1">Medical Conditions</span>
                <p className="text-app-text leading-relaxed">{profile?.medicalConditions || 'None declared'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Security Questions - Read Only */}
        <div className="bg-app-card rounded-3xl p-6 border border-app-border">
          <div className="flex items-center gap-3 mb-5">
            <ShieldQuestion className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-app-text">Security Questions</h3>
          </div>
          <p className="text-app-dim text-sm mb-4">These cannot be edited for security reasons.</p>
          
          {profile?.securityQuestions && profile.securityQuestions.length > 0 ? (
            profile.securityQuestions.map((q: any, index: number) => (
              <div key={index} className="bg-app-bg p-4 rounded-2xl mb-3 border border-app-border">
                <p className="text-xs text-app-dim">Question {index + 1}</p>
                <p className="text-app-text font-medium mt-1">{q.question}</p>
              </div>
            ))
          ) : (
            <p className="text-app-dim text-center py-8">No security questions found</p>
          )}
        </div>

        {/* Save / Cancel Buttons when editing */}
        {isEditing && (
          <div className="flex gap-3 mt-8">
            <button 
              onClick={cancelEdit}
              className="flex-1 py-4 border border-app-border rounded-2xl font-medium text-app-text"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="flex-1 py-4 bg-app-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Changes'}
              <Save size={18} />
            </button>
          </div>
        )}

        {/* Logout */}
        <div 
          onClick={handleLogout}
          className="bg-red-500/5 rounded-2xl p-5 border border-red-500/20 flex items-center gap-4 cursor-pointer hover:bg-red-500/10 transition mt-8"
        >
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-app-red">
            <LogOut className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-app-red font-bold text-lg">Sign Out</h3>
          </div>
        </div>
      </div>
    </div>
  );
}