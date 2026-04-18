import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, LogOut, User, HeartPulse, Settings, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, setAuthUser, setProfile } = useAppStore();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await auth.signOut();
    setAuthUser(null);
    setProfile(null);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
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
        <div className="w-10"></div>
      </div>

      <div className="flex flex-col items-center justify-center mb-10 mt-4">
        <div className="relative mb-4">
           <div className="w-24 h-24 bg-app-blue rounded-full flex items-center justify-center text-4xl text-app-text font-black shadow-[0_0_30px_rgba(10,132,255,0.2)]">
             {profile?.name?.charAt(0) || 'A'}
           </div>
           <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-[#11121C]"></div>
        </div>
        <h2 className="text-2xl font-bold text-app-text tracking-tight">{profile?.name || 'User'}</h2>
        <p className="text-app-dim mt-1">{profile?.phone || '+91 -'}</p>
        <button className="mt-4 px-6 py-2 bg-app-border border border-app-border text-app-text rounded-full text-sm font-bold shadow-lg">
          Premium Safety Plan
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-app-card rounded-2xl p-5 border border-app-border flex items-center gap-4 cursor-pointer hover:bg-app-card-light transition">
           <div className="w-12 h-12 bg-app-border rounded-xl flex items-center justify-center text-app-text">
             <User className="w-6 h-6" />
           </div>
           <div className="flex-1">
             <h3 className="text-app-text font-bold text-lg">Personal Details</h3>
           </div>
        </div>

        <div className="bg-app-card rounded-2xl p-5 border border-app-border flex items-center gap-4 cursor-pointer hover:bg-app-card-light transition">
           <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-app-red">
             <HeartPulse className="w-6 h-6" />
           </div>
           <div className="flex-1">
             <h3 className="text-app-text font-bold text-lg">Emergency Medical Info</h3>
           </div>
        </div>

        <div className="bg-app-card rounded-2xl p-5 border border-app-border flex items-center gap-4 cursor-pointer hover:bg-app-card-light transition">
           <div className="w-12 h-12 bg-app-border rounded-xl flex items-center justify-center text-app-text">
             <Settings className="w-6 h-6" />
           </div>
           <div className="flex-1">
             <h3 className="text-app-text font-bold text-lg">{t('settings')}</h3>
           </div>
        </div>

        <div onClick={toggleLanguage} className="bg-app-card rounded-2xl p-5 border border-app-border flex items-center gap-4 cursor-pointer hover:bg-app-card-light transition">
           <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-app-blue">
             <Globe className="w-6 h-6" />
           </div>
           <div className="flex-1">
             <h3 className="text-app-text font-bold text-lg">Language ({i18n.language === 'en' ? 'English' : 'हिंदी'})</h3>
             <p className="text-app-dim text-sm">Tap to change</p>
           </div>
        </div>
        
        <div 
          onClick={handleLogout}
          className="bg-red-500/5 rounded-2xl p-5 border border-red-500/20 flex items-center gap-4 cursor-pointer hover:bg-red-500/10 transition mt-8"
        >
           <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-app-red">
             <LogOut className="w-6 h-6" />
           </div>
           <div className="flex-1">
             <h3 className="text-app-red font-bold text-lg">{t('signOut')}</h3>
           </div>
        </div>
      </div>
    </div>
  );
}
