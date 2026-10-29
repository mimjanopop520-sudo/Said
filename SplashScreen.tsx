import React, { useState, useEffect } from 'react';
import { Zap, Shield, ArrowRight } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const jump = Math.floor(Math.random() * 15) + 12;
        return Math.min(100, prev + jump);
      });
    }, 240);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        handleEnter();
      }, 700);
      return () => clearTimeout(exitTimer);
    }
  }, [progress]);

  const handleEnter = () => {
    if (isFading) return;
    setIsFading(true);
    soundFx.playAimbotLightning();
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-black transition-opacity duration-500 overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background storm image with subtle zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/storm_lightning_clouds_1793269079093.jpg"
          alt="Thunderstorm background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 scale-105 animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-red-950/40" />
      </div>

      {/* Top micro badge */}
      <div className="relative z-10 w-full max-w-sm flex items-center justify-between pt-4 text-xs font-mono text-red-300/80">
        <span className="flex items-center gap-1.5 tracking-wider">
          <Shield className="w-3.5 h-3.5 text-red-500" />
          SYSTEM VERIFIED
        </span>
        <span className="text-white/60 font-body">v1.0 PREMIUM HUD</span>
      </div>

      {/* Center 3D Logo & App Name */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-4 max-w-md w-full">
        {/* Glowing Shield Ring */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-6 group">
          <div className="absolute inset-0 rounded-3xl bg-red-600/30 blur-2xl animate-pulse" />
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-red-600 via-white to-red-600 opacity-60 blur-sm" />
          
          {/* 3D Lion Logo Frame */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-red-500/70 shadow-2xl shadow-red-900/60 bg-gradient-to-b from-stone-900 to-black p-1.5">
            <img
              src="/src/assets/images/said_prime_logo_1793269078698.jpg"
              alt="Said Prime 3D Roaring Cyber Lion Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
            />
            {/* Gloss reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* App Name with Bold Glowing Font */}
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-wider text-white text-glow-red uppercase">
          SAID PRIME
        </h1>

        {/* Bengali Tagline */}
        <p className="mt-2 text-sm sm:text-base text-red-200/90 font-medium tracking-wide">
          আলটিমেট গেমিং পারফরম্যান্স ও এইম কন্ট্রোল হাব
        </p>

        {/* Electric decorative divider */}
        <div className="flex items-center gap-3 my-4 w-40">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
          <Zap className="w-4 h-4 text-red-400 fill-red-400 animate-bounce" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mt-2">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-1.5">
            <span>কোর সিস্টেম লোডিং...</span>
            <span className="text-red-400 font-bold tabular-nums">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-900/90 rounded-full overflow-hidden border border-red-950">
            <div
              className="h-full bg-gradient-to-r from-red-700 via-red-500 to-white transition-all duration-300 shadow-sm shadow-red-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Button Action */}
      <div className="relative z-10 w-full max-w-sm pb-4">
        <button
          onClick={handleEnter}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white font-display font-semibold tracking-wide text-sm shadow-lg shadow-red-900/50 border border-red-500/40"
        >
          <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
