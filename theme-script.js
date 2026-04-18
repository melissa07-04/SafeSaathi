import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssStr = `@import "tailwindcss";

@theme {
  --color-app-bg: #050505;
  --color-app-card: #121214;
  --color-app-card-light: #1C1C1E;
  --color-app-border: #242426;
  --color-app-red: #FF3B30;
  --color-app-blue: #0A84FF;
  --color-app-green: #30D158;
  --color-app-text: #FFFFFF;
  --color-app-dim: #8E8E93;
}

body {
  background-color: var(--color-app-bg);
  color: var(--color-app-text);
  font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
`;
fs.writeFileSync(path.join(__dirname, 'src', 'index.css'), cssStr);

const files = [
  'src/App.tsx',
  'src/components/BottomNav.tsx',
  'src/components/SOSButton.tsx',
  'src/components/SOSOverlay.tsx',
  'src/screens/Home.tsx',
  'src/screens/Journey.tsx',
  'src/screens/Contacts.tsx',
  'src/screens/Profile.tsx',
  'src/screens/FeelingSafe.tsx',
  'src/screens/Login.tsx',
  'src/screens/Register.tsx'
];

files.forEach(f => {
  let p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let text = fs.readFileSync(p, 'utf8');
    
    // Backgrounds
    text = text.replace(/bg-slate-950/g, 'bg-app-bg');
    text = text.replace(/bg-black/g, 'bg-app-bg');
    text = text.replace(/bg-\[\#11121C\]/g, 'bg-app-bg');
    text = text.replace(/bg-\[\#161722\]/g, 'bg-app-card');
    text = text.replace(/bg-\[\#1C1D2B\]\/90/g, 'bg-app-card/90');
    text = text.replace(/bg-\[\#1C1D2B\]/g, 'bg-app-card');
    text = text.replace(/bg-\[\#222436\]/g, 'bg-app-card-light');
    text = text.replace(/bg-\[\#0A0B14\]/g, 'bg-[#1C1C1E]');
    
    // Gradients
    text = text.replace(/from-purple-600 to-indigo-600/g, 'from-app-card to-app-card');
    text = text.replace(/bg-gradient-to-r from-purple-600 to-purple-800/g, 'bg-app-blue');
    text = text.replace(/hover:from-purple-500 hover:to-purple-700/g, 'hover:bg-app-blue/80');
    text = text.replace(/bg-gradient-to-tr from-red-600 to-orange-500/g, 'bg-app-red');
    
    // Borders
    text = text.replace(/border-slate-800/g, 'border-app-border');
    text = text.replace(/border-slate-700/g, 'border-app-border');
    text = text.replace(/border-purple-500\/50/g, 'border-app-blue/50');
    text = text.replace(/border-purple-400\/20/g, 'border-app-border');
    text = text.replace(/border-purple-500\/30/g, 'border-app-blue/30');
    text = text.replace(/border-purple-500/g, 'border-app-blue');
    
    // Text colors
    text = text.replace(/text-white/g, 'text-app-text');
    text = text.replace(/text-slate-100/g, 'text-app-text');
    text = text.replace(/text-slate-300/g, 'text-app-text');
    text = text.replace(/text-slate-400/g, 'text-app-dim');
    text = text.replace(/text-slate-500/g, 'text-app-dim');
    text = text.replace(/text-slate-600/g, 'text-app-dim');
    
    text = text.replace(/text-purple-400/g, 'text-app-blue');
    text = text.replace(/text-purple-500/g, 'text-app-blue');
    text = text.replace(/text-purple-700/g, 'text-app-blue');
    
    text = text.replace(/text-red-500/g, 'text-app-red');
    text = text.replace(/text-red-400/g, 'text-app-red');
    text = text.replace(/text-red-200/g, 'text-app-text');
    text = text.replace(/text-green-500/g, 'text-app-green');
    text = text.replace(/text-green-400/g, 'text-app-green');
    text = text.replace(/text-blue-500/g, 'text-app-blue');
    text = text.replace(/text-blue-400/g, 'text-app-blue');
    
    // Button & Solid bgs
    text = text.replace(/bg-purple-600/g, 'bg-app-blue');
    text = text.replace(/bg-purple-700/g, 'bg-app-blue');
    text = text.replace(/bg-purple-800/g, 'bg-app-blue/80');
    text = text.replace(/bg-purple-500\/20/g, 'bg-app-blue/20');
    text = text.replace(/bg-purple-500\/10/g, 'bg-app-blue/10');
    text = text.replace(/bg-purple-900\/30/g, 'bg-app-blue/20');
    text = text.replace(/bg-red-600/g, 'bg-app-red');
    text = text.replace(/bg-red-950\/50/g, 'bg-app-red/20');
    text = text.replace(/border-red-900/g, 'border-app-red/40');
    text = text.replace(/bg-slate-900/g, 'bg-app-card-light');
    text = text.replace(/bg-slate-800/g, 'bg-app-border');
    
    // Shadows
    text = text.replace(/shadow-\[0_10px_30px_rgba\(147,51,234,0\.3\)\]/g, 'shadow-[0_10px_30px_rgba(0,0,0,0.5)]');
    text = text.replace(/shadow-\[0_0_30px_rgba\(147,51,234,0\.4\)\]/g, 'shadow-[0_0_30px_rgba(10,132,255,0.2)]');
    text = text.replace(/shadow-\[0_0_25px_rgba\(239,68,68,0\.6\)\]/g, 'shadow-[0_0_25px_rgba(255,59,48,0.4)]');
    text = text.replace(/shadow-\[0_0_40px_rgba\(239,68,68,0\.8\)\]/g, 'shadow-[0_0_40px_rgba(255,59,48,0.6)]');
    text = text.replace(/shadow-\[0_0_10px_rgba\(59,130,246,0\.8\)\]/g, 'shadow-[0_0_10px_rgba(10,132,255,0.6)]');
    text = text.replace(/shadow-\[0_0_10px_rgba\(239,68,68,0\.8\)\]/g, 'shadow-[0_0_10px_rgba(255,59,48,0.6)]');
    text = text.replace(/shadow-\[0_0_20px_rgba\(59,130,246,0\.8\)\]/g, 'shadow-[0_0_20px_rgba(10,132,255,0.6)]');
    
    fs.writeFileSync(p, text);
  }
});

console.log("Theme updated successfully!");
