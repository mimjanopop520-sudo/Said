/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { TopBar } from './components/TopBar';
import { ControlPanel } from './components/ControlPanel';
import { TargetSimulator } from './components/TargetSimulator';
import { DeviceStats } from './components/DeviceStats';
import { DownloadModal } from './components/DownloadModal';
import { LightningCanvas } from './components/LightningCanvas';
import { ControlState } from './types';
import { Target, Crosshair, Download, RefreshCw, Zap, Shield } from 'lucide-react';
import { soundFx } from './utils/audio';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [flashType, setFlashType] = useState<'red' | 'red-white' | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [lightningIntensity, setLightningIntensity] = useState<'low' | 'medium' | 'high'>('high');

  const [controls, setControls] = useState<ControlState>({
    aimLock: false,
    aimbot: false,
    aimLockSensitivity: 75,
    aimLockArea: 'Head',
    aimbotFov: 90,
    aimbotSpeed: 80,
    soundEnabled: true,
  });

  const setSoundEnabled = (val: boolean) => {
    setControls((prev) => ({ ...prev, soundEnabled: val }));
  };

  // Triggers light red flash or red-white lightning storm flash
  const handleTriggerFlash = (type: 'red' | 'red-white') => {
    setFlashType(null);
    // Force DOM repaint
    requestAnimationFrame(() => {
      setFlashType(type);
      setTimeout(() => {
        setFlashType(null);
      }, type === 'red-white' ? 650 : 450);
    });
  };

  return (
    <div className="min-h-screen bg-[#070002] text-white font-body relative overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* 1. Splash Screen Intro */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* 2. Fullscreen Screen Flash Overlay */}
      {flashType === 'red' && (
        <div
          className="fixed inset-0 z-50 pointer-events-none flash-red"
          aria-hidden="true"
        />
      )}
      {flashType === 'red-white' && (
        <div
          className="fixed inset-0 z-50 pointer-events-none flash-red-white"
          aria-hidden="true"
        />
      )}

      {/* 3. Background Thunderstorm Cloud Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/storm_lightning_clouds_1793269079093.jpg"
          alt="Thunderstorm clouds background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-30 mix-blend-screen scale-105"
        />
        {/* Dark crimson vignette gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070002] via-[#070002]/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(185,28,28,0.25),transparent_70%)]" />
      </div>

      {/* 4. Canvas Red & White Lightning FX Engine */}
      <LightningCanvas
        intensity={lightningIntensity}
        isSpike={flashType === 'red-white'}
      />

      {/* 5. Top Bar (Top Bar Contract: Zone 1, Zone 2, Zone 3) */}
      <TopBar
        onOpenDownload={() => setIsDownloadOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        soundEnabled={controls.soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* 6. Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24 md:pb-16">
        
        {/* Brand Banner & Replay Intro Pill Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-red-950/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-500 shadow-md shadow-red-600/40 shrink-0">
              <img
                src="/src/assets/images/said_prime_logo_1793269078698.jpg"
                alt="Said Prime Roaring Lion Crest"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl sm:text-3xl tracking-wider text-white text-glow-red">
                  SAID PRIME
                </h1>
                <span className="text-xs font-mono text-red-400 font-semibold">· PRO HUD</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300">
                ডার্ক রেড ও ব্রাইট হোয়াইট থিম · রিয়েল রেড লাইটনিং এফেক্টস
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick(true);
                setShowSplash(true);
              }}
              className="px-3 py-2 text-xs font-mono font-medium rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-red-400" />
              <span>রিপ্লে স্প্ল্যাশ স্ক্রিন</span>
            </button>
          </div>
        </div>

        {/* Quick APK Download Action Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-black to-zinc-950 border border-red-600/70 shadow-lg shadow-red-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-red-600 text-white shadow-md shadow-red-600/50 shrink-0">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white text-base">Said Prime APK v1.0.4</span>
                <span className="text-[11px] text-green-400 font-mono font-semibold">· ডাউনলোড রেডি</span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                আপনার অ্যান্ড্রয়েড ফোনে সরাসরি ইন্সটল বা APK ফাইল ডাউনলোড করতে ট্যাপ করুন
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDownloadOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-red-950 shrink-0 active:scale-95 transition-transform border border-red-400/50"
          >
            <Download className="w-4 h-4" />
            <span>ডাউনলোড APK</span>
          </button>
        </div>

        {/* Section Router */}
        {activeSection === 'dashboard' && (
          <div className="space-y-12">
            {/* Feature Controls (Prompt Section 3) */}
            <ControlPanel
              controls={controls}
              setControls={setControls}
              onTriggerFlash={handleTriggerFlash}
            />

            {/* Target Simulator Preview */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Aim Lock & Aimbot লাইভ সিমুলেশন
                  </h3>
                  <p className="text-xs text-zinc-400">
                    কন্ট্রোল অন করে দেখুন কিভাবে টার্গেট ট্র্যাক এবং ফিক্সড লক হয়
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection('simulator')}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <span>ফুল স্ক্রিন রাডার</span>
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>

              <TargetSimulator controls={controls} />
            </div>

            {/* Device Stats & Specs */}
            <DeviceStats
              controls={controls}
              lightningIntensity={lightningIntensity}
              setLightningIntensity={setLightningIntensity}
            />
          </div>
        )}

        {activeSection === 'simulator' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">
                  ফুলস্ক্রিন এইম সিমুলেশন রাডার
                </h2>
                <p className="text-xs text-zinc-400">
                  Aim Lock এবং Aimbot অ্যাক্টিভেশন টেস্ট ল্যাব
                </p>
              </div>
              <button
                onClick={() => setActiveSection('dashboard')}
                className="px-4 py-2 rounded-lg bg-red-950/80 border border-red-800 text-xs font-semibold text-white hover:bg-red-900"
              >
                ড্যাশবোর্ডে ফিরুন
              </button>
            </div>

            <TargetSimulator controls={controls} />

            <ControlPanel
              controls={controls}
              setControls={setControls}
              onTriggerFlash={handleTriggerFlash}
            />
          </div>
        )}

        {activeSection === 'features' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">
                  Said Prime আর্কিটেকচার ও ফিচার স্পেসিফিকেশন
                </h2>
                <p className="text-xs text-zinc-400">
                  সম্পূর্ণ কারিগরি ও অ্যালগরিদম বিবরণ
                </p>
              </div>
              <button
                onClick={() => setActiveSection('dashboard')}
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                ড্যাশবোর্ডে ফিরুন
              </button>
            </div>

            <DeviceStats
              controls={controls}
              lightningIntensity={lightningIntensity}
              setLightningIntensity={setLightningIntensity}
            />
          </div>
        )}
      </main>

      {/* 7. Mobile Thumb-Zone Bottom Tab Bar (Pattern 1 from Mobile Spec) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-t border-red-900/40 px-3 py-2">
        <div className="grid grid-cols-4 items-center h-14">
          <button
            onClick={() => {
              setActiveSection('dashboard');
              soundFx.playClick(true);
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeSection === 'dashboard' ? 'text-red-400' : 'text-zinc-500'
            }`}
          >
            <Crosshair className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-1">কন্ট্রোলস</span>
          </button>

          <button
            onClick={() => {
              setActiveSection('simulator');
              soundFx.playClick(true);
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeSection === 'simulator' ? 'text-red-400' : 'text-zinc-500'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-1">রাডার</span>
          </button>

          <button
            onClick={() => {
              setActiveSection('features');
              soundFx.playClick(true);
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeSection === 'features' ? 'text-red-400' : 'text-zinc-500'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-1">লাইটনিং</span>
          </button>

          <button
            onClick={() => {
              setIsDownloadOpen(true);
              soundFx.playClick(true);
            }}
            className="flex flex-col items-center justify-center min-h-[44px] text-white"
          >
            <Download className="w-5 h-5 text-red-500" />
            <span className="text-[11px] font-medium mt-1 text-red-400 font-semibold">ডাউনলোড</span>
          </button>
        </div>
      </nav>

      {/* 8. Download Modal Center */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        controls={controls}
      />

      {/* 9. Minimal Footer */}
      <footer className="relative z-10 border-t border-red-950/60 bg-black/90 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white tracking-wider">SAID PRIME</span>
            <span>· Concept & Layout Engine</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>ডাইনামিক রেড লাইটনিং এফএক্স</span>
            <span aria-hidden="true">·</span>
            <span>এইম লক</span>
            <span aria-hidden="true">·</span>
            <span>এইমবট ট্র্যাকিং</span>
          </div>
          <div>
            © 2026 Said Prime. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
