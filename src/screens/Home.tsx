import { useAppStore } from '../store/useAppStore';
import { Bell, MapPin, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { profile } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-app-text mb-1">
            Hello, {profile?.name?.split(' ')[0] || 'User'} <span className="inline-block origin-bottom-right hover:animate-wave">👋</span>
          </h1>
          <p className="text-app-dim text-sm">You're protected. We've got your back.</p>
        </div>
        <div className="relative w-10 h-10 bg-app-card rounded-full flex items-center justify-center border border-app-border">
          <Bell className="w-5 h-5 text-app-text" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-app-card to-app-card rounded-3xl p-6 mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-app-border relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
            <MapPin className="text-app-text w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-app-text mb-1" dangerouslySetInnerHTML={{ __html: t('startJourney').replace(' Journey', '<br/>Journey') }} />
            <p className="text-purple-100/80 text-sm mb-4">{t('destination')}<br/>(Office Sector 5)</p>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/journey')}
              className="bg-white text-app-blue px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-slate-50 transition active:scale-95"
            >
              {t('startBtn')}
            </button>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-app-text mb-4">{t('safetyControls')}</h3>
      
      <div className="space-y-4">
        <div 
          onClick={() => navigate('/journey')}
          className="bg-app-card-light rounded-2xl p-5 flex items-center gap-4 cursor-pointer border border-app-border hover:border-app-blue/50 transition active:scale-[0.98]"
        >
          <div className="w-12 h-12 bg-app-blue/20 rounded-full flex items-center justify-center shrink-0">
            <Shield className="text-app-blue w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-app-text text-lg">{t('featuresHub')}</h4>
            <p className="text-app-dim text-sm leading-tight mt-1">{t('featuresDesc')}</p>
          </div>
          <div className="w-8 h-8 bg-app-card rounded-full flex items-center justify-center text-app-dim">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-app-card-light rounded-2xl p-5 border border-app-border text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
          <h4 className="font-bold text-app-text text-lg">{t('feelingSafe')}</h4>
          <p className="text-app-dim text-sm mt-1 mb-4">{t('verifyManual')}</p>
          <button 
            onClick={() => navigate('/feeling-safe')}
            className="w-full relative group overflow-hidden bg-app-card border border-green-500/50 rounded-xl py-3 flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <CheckCircle className="text-app-green w-5 h-5 relative z-10" />
            <span className="text-app-green font-bold relative z-10">{t('yesSafe')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
