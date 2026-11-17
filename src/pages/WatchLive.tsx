import React, { useState } from 'react';
import { 
  Code, 
  MessageCircle, 
  Copy, 
  Check, 
  X, 
  Eye, 
} from 'lucide-react';
import { FacebookIcon, TwitterIcon } from '../components/Icons';
import Player from '../components/Player';
import LiveChat from '../components/LiveChat';
import NowNextCard from '../components/NowNextCard';
import ReplaysSection from '../components/ReplaysSection';
import RadioStrip from '../components/RadioStrip';

export const WatchLive: React.FC = () => {
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [isChatPopout, setIsChatPopout] = useState(false);

  const pageUrl = window.location.href;
  const embedCode = `<iframe src="https://tv.kenlive.co.ke/watch?embed=true" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;

  const handleShareWhatsApp = () => {
    const text = `Tazama KenLive TV Live sasa hivi: ${pageUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Watching KenLive TV Live! @kenlive254 #KenLiveTV #TazamaLive`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#070709] text-white">
      {/* Theatre View Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-10">
        {/* Theatre Breadcrumb & Viewer Count */}
        <div className="flex items-center justify-between py-2 mb-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C30D12] text-white font-heading font-extrabold text-[11px] uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              BROADCAST ON AIR
            </span>
            <span className="hidden sm:inline text-gray-300">
              Channel: <strong>KenLive TV HD</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-gray-300 font-mono text-xs">
              <Eye className="w-3.5 h-3.5 text-[#C30D12]" />
              <strong className="text-white">14,280</strong> watching now
            </span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="hidden sm:inline text-gray-400 font-mono text-[11px]">
              East Africa Time (UTC+3)
            </span>
          </div>
        </div>

        {/* Player + Live Chat Side by Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Theatre Player (8 columns) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <Player isTheatreMode={true} />

            {/* Theatre Action Bar: Social Shares & Embed */}
            <div className="p-4 rounded-2xl bg-[#121217] border border-[#242430] flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs font-heading font-extrabold uppercase text-gray-400 tracking-wider">
                  Share Stream:
                </span>

                {/* WhatsApp First */}
                <button
                  onClick={handleShareWhatsApp}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all min-h-[40px]"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleShareFacebook}
                  className="p-2.5 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2] text-[#1877F2] hover:text-white transition-all min-h-[40px] min-w-[40px] flex items-center justify-center border border-[#1877F2]/30"
                  title="Share on Facebook"
                  aria-label="Share on Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </button>

                {/* X / Twitter */}
                <button
                  onClick={handleShareTwitter}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black transition-all min-h-[40px] min-w-[40px] flex items-center justify-center border border-white/20"
                  title="Share on X"
                  aria-label="Share on X"
                >
                  <TwitterIcon className="w-4 h-4" />
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[40px]"
                  title="Copy link to stream"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Embed Player Button */}
              <button
                onClick={() => setShowEmbedModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#1C1C26] hover:bg-[#282836] text-gray-200 text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10 transition-colors min-h-[40px]"
                title="Embed player on your website or blog"
              >
                <Code className="w-3.5 h-3.5 text-[#C30D12]" />
                <span>Embed Player</span>
              </button>
            </div>

            {/* Now & Up Next Card */}
            <NowNextCard />
          </div>

          {/* Live Chat Panel (4 columns) */}
          <div className="lg:col-span-4 mt-2 lg:mt-0">
            <LiveChat 
              isPopout={isChatPopout} 
              onTogglePopout={() => setIsChatPopout(!isChatPopout)} 
            />
          </div>
        </div>

        {/* Radio strip & replay recommendations */}
        <div className="mt-10">
          <RadioStrip />
          <ReplaysSection />
        </div>
      </div>

      {/* Embed Modal Dialog */}
      {showEmbedModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowEmbedModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#14141A] border border-[#2B2B38] rounded-2xl p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#C30D12]/20 text-[#C30D12]">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg uppercase text-white">
                    Embed KenLive TV Player
                  </h3>
                  <p className="text-xs text-gray-400">Add the live stream to your website or news blog</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEmbedModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 mb-3">
              Copy and paste this HTML embed snippet into any webpage:
            </p>

            <div className="relative">
              <textarea
                readOnly
                value={embedCode}
                rows={3}
                className="w-full bg-[#0D0D12] text-emerald-400 font-mono text-xs p-3 rounded-xl border border-[#242430] focus:outline-none resize-none"
              />
              <button
                onClick={handleCopyEmbed}
                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-[#C30D12] hover:bg-[#A0090E] text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1 shadow-md"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmbed ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-[#242430] flex items-center justify-between text-xs text-gray-400">
              <span>Responsive 16:9 • HLS Autoplay Enabled</span>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default WatchLive;
