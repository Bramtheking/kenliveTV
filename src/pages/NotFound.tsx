import React from 'react';
import { Link } from 'react-router-dom';
import { Tv, Home, Calendar, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <main className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle test pattern background */}
        <div className="absolute inset-0 test-bars-pattern pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#C30D12]/20 text-[#C30D12] flex items-center justify-center mb-5 shadow-lg">
            <Tv className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full bg-[#C30D12] text-white text-[11px] font-heading font-extrabold uppercase tracking-widest inline-block mb-3">
            ERROR 404 • SIGNAL LOST
          </span>

          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950 mb-2">
            Page Not On Air
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 light:text-gray-600 mb-6 leading-relaxed">
            Samahani, ukurasa uliotafuta haupo kwenye masafa yetu ya matangazo au umehamishwa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#C30D12] hover:bg-[#A0090E] text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C30D12]/30 transition-all min-h-[44px]"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>

            <Link
              to="/watch"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-100 text-gray-200 dark:text-gray-200 light:text-gray-800 hover:text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-colors min-h-[44px]"
            >
              <Tv className="w-4 h-4 text-[#C30D12]" />
              <span>Watch Live Stream</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;

