import React from 'react';
import { Download, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TopBarProps {
  onOpenDownload: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenDownload,
  activeSection,
  setActiveSection,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setMuted(!next);
    if (next) soundFx.playClick(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/80 border-b border-red-900/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-red-600/70 shadow-sm shadow-red-600/40 shrink-0">
            <img
              src="/src/assets/images/said_prime_logo_1793269078698.jpg"
              alt="Said Prime Icon"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('dashboard');
            }}
            className="font-display font-black text-xl tracking-wider text-white hover:text-red-400 transition-colors whitespace-nowrap text-glow-red"
          >
            SAID PRIME
          </a>
        </div>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              activeSection === 'dashboard'
                ? 'text-red-400 font-semibold border-b-2 border-red-500 pb-0.5'
                : 'text-zinc-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection('simulator')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              activeSection === 'simulator'
                ? 'text-red-400 font-semibold border-b-2 border-red-500 pb-0.5'
                : 'text-zinc-400'
            }`}
          >
            Aim Radar
          </button>
          <button
            onClick={() => setActiveSection('features')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              activeSection === 'features'
                ? 'text-red-400 font-semibold border-b-2 border-red-500 pb-0.5'
                : 'text-zinc-400'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={onOpenDownload}
            className="text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            Download Setup
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (+ Sound Toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-900 transition-colors"
            title={soundEnabled ? 'সাউন্ড অন' : 'সাউন্ড অফ'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-red-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          <button
            onClick={onOpenDownload}
            className="px-4 py-2 text-xs font-display font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 rounded-lg shadow-md shadow-red-950/60 border border-red-500/50 transition-transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>ডাউনলোড অ্যাপ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
