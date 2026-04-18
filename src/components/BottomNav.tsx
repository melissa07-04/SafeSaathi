import { NavLink } from 'react-router-dom';
import { Home, Navigation, Users, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/journey', icon: Navigation, label: 'Journeys' },
    { to: '/contacts', icon: Users, label: 'Contacts' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 w-full h-16 bg-app-card border-t border-app-border flex justify-between items-center px-4 z-40 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item, index) => {
        // Space out for central SOS button
        const isLeft = index < 2;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx(
              "flex flex-col items-center justify-center w-16 gap-1 flex-1",
              isLeft ? "mr-2" : "ml-2",
              isActive ? "text-app-blue" : "text-app-dim"
            )}
          >
            <item.icon className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
