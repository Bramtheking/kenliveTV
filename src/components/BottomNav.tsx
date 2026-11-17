import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tv, Calendar, Newspaper, Radio } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      label: 'Live',
      swahili: 'Tazama',
      path: '/watch',
      icon: Tv,
      isLive: true,
    },
    {
      label: 'Schedule',
      swahili: 'Ratiba',
      path: '/schedule',
      icon: Calendar,
    },
    {
      label: 'News',
      swahili: 'Habari',
      path: '/news',
      icon: Newspaper,
    },
    {
      label: 'Radio',
      swahili: 'Redio',
      path: SITE_CONFIG.network.radio,
      icon: Radio,
      isExternal: true,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0C]/95 dark:bg-[#0B0B0C]/95 light:bg-white/95 backdrop-blur-lg border-t border-[#242430] dark:border-[#242430] light:border-gray-200 px-2 py-1.5 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="grid grid-cols-4 items-center">
        {navItems.map((item) => {
          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-[#0B5CAB] transition-colors group min-h-[44px]"
              >
                <div className="relative">
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform text-[#0B5CAB]" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>
                <span className="text-[11px] font-semibold mt-1 tracking-tight text-[#0B5CAB]">
                  {item.label}
                </span>
                <span className="text-[9px] font-normal opacity-70 leading-none">
                  {item.swahili}
                </span>
              </a>
            );
          }

          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-h-[44px] ${
                isActive
                  ? 'text-[#C30D12] font-bold'
                  : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-black'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#C30D12]' : ''}`} />
                {item.isLive && (
                  <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C30D12]"></span>
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'text-[#C30D12] font-bold' : ''}`}>
                {item.label}
              </span>
              <span className="text-[9px] font-normal opacity-70 leading-none">
                {item.swahili}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

