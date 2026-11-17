import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Handshake, ChevronRight, Award } from 'lucide-react';
import { SPONSORS_DATA } from '../config/sponsors';

export const SponsorsRow: React.FC = () => {
  return (
    <section className="my-10 sm:my-14 border-t border-[#242430] dark:border-[#242430] light:border-gray-200 pt-8 sm:pt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-heading font-extrabold uppercase tracking-widest text-[#C30D12]">
              COMMERCIAL PARTNERS
            </span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-900">
            Proudly Supported By
          </h3>
          <p className="text-xs text-gray-400 light:text-gray-600">
            Trusted corporate sponsors powering independent journalism across Kenya
          </p>
        </div>

        <Link
          to="/advertise"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-100 hover:bg-[#C30D12] text-white light:text-gray-900 light:hover:text-white font-heading font-bold text-xs uppercase tracking-wider transition-all border border-[#2F2F3D] light:border-gray-300 w-fit"
        >
          <Megaphone className="w-3.5 h-3.5 text-[#C30D12] group-hover:text-white" />
          <span>Advertise With KenLive TV</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Partners Brand Logos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SPONSORS_DATA.map((sp) => (
          <div
            key={sp.name}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#131317] dark:bg-[#131317] light:bg-white border border-[#20202B] dark:border-[#20202B] light:border-gray-200 hover:border-gray-600 transition-colors text-center group"
          >
            <span 
              className="font-heading font-extrabold text-sm sm:text-base tracking-wider uppercase transition-transform group-hover:scale-105"
              style={{ color: sp.accentColor }}
            >
              {sp.logoText}
            </span>
            <span className="text-[10px] text-gray-500 light:text-gray-400 mt-0.5 truncate max-w-full">
              {sp.category}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SponsorsRow;

