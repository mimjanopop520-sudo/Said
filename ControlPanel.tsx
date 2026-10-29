import React from 'react';
import { Target, Crosshair, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import { ControlState } from '../types';
import { soundFx } from '../utils/audio';

interface ControlPanelProps {
  controls: ControlState;
  setControls: React.Dispatch<React.SetStateAction<ControlState>>;
  onTriggerFlash: (type: 'red' | 'red-white') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  controls,
  setControls,
  onTriggerFlash,
}) => {
  const handleToggleAimLock = () => {
    const nextState = !controls.aimLock;
    setControls((prev) => ({ ...prev, aimLock: nextState }));

    if (nextState) {
      soundFx.playAimLock();
      onTriggerFlash('red');
    } else {
      soundFx.playClick(false);
    }
  };

  const handleToggleAimbot = () => {
    const nextState = !controls.aimbot;
    setControls((prev) => ({ ...prev, aimbot: nextState }));

    if (nextState) {
      soundFx.playAimbotLightning();
      onTriggerFlash('red-white');
    } else {
      soundFx.playClick(false);
    }
  };

  return (
    <section className="relative z-10 w-full">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 text-red-500 font-display font-extrabold tracking-widest text-lg sm:text-xl uppercase drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]">
          <span>🔴</span>
          <span>[ FEATURE CONTROLS ]</span>
          <span>🔴</span>
        </div>
        <p className="text-sm text-zinc-300 mt-1 max-w-md mx-auto">
          হাই-স্পিড টার্গেট লক এবং অটো-ট্র্যাকিং অ্যালগরিদম অ্যাক্টিভেশন প্যানেল
        </p>
      </div>

      {/* Main 2-Column or Stacked Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        
        {/* ================= AIM LOCK CARD ================= */}
        <div
          className={`relative rounded-2xl p-6 transition-all duration-300 border backdrop-blur-md overflow-hidden ${
            controls.aimLock
              ? 'bg-gradient-to-b from-stone-900/90 via-red-950/40 to-black/90 border-green-500/60 shadow-xl shadow-green-950/30'
              : 'bg-gradient-to-b from-stone-900/80 to-black/80 border-red-900/40 hover:border-red-700/60'
          }`}
        >
          {/* Subtle glow orb */}
          <div
            className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
              controls.aimLock ? 'bg-green-500/15 opacity-100' : 'bg-red-600/10 opacity-40'
            }`}
          />

          {/* Card Header & Title */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                  controls.aimLock
                    ? 'bg-green-950/50 border-green-500 text-green-400 shadow-sm shadow-green-500/50'
                    : 'bg-red-950/40 border-red-800/80 text-red-400'
                }`}
              >
                <Crosshair className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-wide">
                    Aim Lock
                  </h3>
                  <span className="text-xs text-zinc-400">· v3.2 Engine</span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  টার্গেট ফিক্সড লক আর্কিটেকচার
                </div>
              </div>
            </div>

            {/* Status indicator text */}
            <div className="text-right shrink-0">
              <span
                className={`text-xs font-mono font-semibold tracking-wider ${
                  controls.aimLock ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {controls.aimLock ? 'LOCKED // ACTIVE' : 'DISENGAGED'}
              </span>
            </div>
          </div>

          {/* Description specified in prompt */}
          <div className="bg-black/50 rounded-xl p-3.5 border border-zinc-800/80 mb-6">
            <div className="flex items-start gap-2 text-sm text-zinc-200">
              <span className="text-red-400 font-bold">📌 বিবরণ:</span>
              <p className="leading-relaxed">
                টার্গেট লক করার পাওয়ার অ্যাক্টিভেট করুন।
              </p>
            </div>
            <div className="text-xs text-zinc-400 mt-1 pl-6">
              এনিমি রেঞ্জে প্রবেশ করলেই ক্রসহেয়ার ইনস্ট্যান্ট ফোকাস লক ধরে রাখবে।
            </div>
          </div>

          {/* Stylish Big Switch Button */}
          <div className="pt-2 pb-4">
            <button
              onClick={handleToggleAimLock}
              className={`w-full h-16 rounded-xl font-display font-black text-lg sm:text-xl tracking-wider transition-all duration-300 flex items-center justify-between px-6 border active:scale-[0.98] ${
                controls.aimLock
                  ? 'bg-gradient-to-r from-emerald-900 via-green-700 to-emerald-950 text-white border-green-400 box-glow-green shadow-lg shadow-green-900/50'
                  : 'bg-gradient-to-r from-stone-900 via-red-950 to-stone-900 text-zinc-300 border-red-900/80 hover:border-red-600 shadow-md shadow-red-950/40'
              }`}
            >
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>AIM LOCK STATUS</span>
              </span>

              {/* Exact Bengali Prompt Button Display: [ OFF 🔴 ] / [ ON 🟢 ] */}
              <div
                className={`px-4 py-2 rounded-lg font-mono font-bold text-base flex items-center gap-2 border transition-all ${
                  controls.aimLock
                    ? 'bg-green-500 text-black border-green-300 shadow-sm shadow-green-400'
                    : 'bg-red-950 text-red-300 border-red-800'
                }`}
              >
                <span>{controls.aimLock ? 'ON' : 'OFF'}</span>
                <span>{controls.aimLock ? '🟢' : '🔴'}</span>
              </div>
            </button>
            <div className="text-center mt-2 text-xs text-zinc-400">
              {controls.aimLock ? '🟢 ক্লিক করে অফ করুন' : '🔴 ক্লিক করে চালু করুন (স্ক্রিন রেড ফ্ল্যাশ হবে)'}
            </div>
          </div>

          {/* Fine Tuning Controls when Aim Lock is Active */}
          <div
            className={`mt-4 pt-4 border-t border-zinc-800/80 space-y-4 transition-all duration-300 ${
              controls.aimLock ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                <span>লক এরিয়া টার্গেট:</span>
                <span className="text-red-400 font-bold">{controls.aimLockArea}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['Head', 'Neck', 'Chest', 'Auto'] as const).map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      setControls((prev) => ({ ...prev, aimLockArea: area }));
                      soundFx.playClick(true);
                    }}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-colors ${
                      controls.aimLockArea === area
                        ? 'bg-red-600 text-white border-red-400 shadow-sm'
                        : 'bg-black/40 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1">
                <span>লক সেনসিটিভিটি:</span>
                <span className="text-red-400 font-mono font-bold">{controls.aimLockSensitivity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={controls.aimLockSensitivity}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    aimLockSensitivity: Number(e.target.value),
                  }))
                }
                className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ================= AIMBOT CARD ================= */}
        <div
          className={`relative rounded-2xl p-6 transition-all duration-300 border backdrop-blur-md overflow-hidden ${
            controls.aimbot
              ? 'bg-gradient-to-b from-stone-900/90 via-red-950/40 to-black/90 border-green-500/60 shadow-xl shadow-green-950/30'
              : 'bg-gradient-to-b from-stone-900/80 to-black/80 border-red-900/40 hover:border-red-700/60'
          }`}
        >
          {/* Lightning aura effect */}
          <div
            className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
              controls.aimbot ? 'bg-emerald-400/20 opacity-100' : 'bg-red-600/10 opacity-40'
            }`}
          />

          {/* Card Header & Title */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                  controls.aimbot
                    ? 'bg-green-950/50 border-green-500 text-green-400 shadow-sm shadow-green-500/50'
                    : 'bg-red-950/40 border-red-800/80 text-red-400'
                }`}
              >
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-wide">
                    Aimbot
                  </h3>
                  <span className="text-xs text-zinc-400">· Full Tracking</span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  অটো টার্গেট ও ট্র্যাকিং রেঞ্জ
                </div>
              </div>
            </div>

            {/* Status indicator text */}
            <div className="text-right shrink-0">
              <span
                className={`text-xs font-mono font-semibold tracking-wider ${
                  controls.aimbot ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {controls.aimbot ? 'POWER // ONLINE' : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Description specified in prompt */}
          <div className="bg-black/50 rounded-xl p-3.5 border border-zinc-800/80 mb-6">
            <div className="flex items-start gap-2 text-sm text-zinc-200">
              <span className="text-red-400 font-bold">📌 বিবরণ:</span>
              <p className="leading-relaxed">
                অটো টার্গেট ও ট্র্যাকিং রেঞ্জ ফুল পাওয়ার অ্যাক্টিভেট করুন।
              </p>
            </div>
            <div className="text-xs text-zinc-400 mt-1 pl-6">
              ৩৬০° ফিল্ড অব ভিউতে অটোমেটিক টার্গেট ক্যালকুলেশন ও স্মুথ ট্র্যাক।
            </div>
          </div>

          {/* Stylish Big Switch Button */}
          <div className="pt-2 pb-4">
            <button
              onClick={handleToggleAimbot}
              className={`w-full h-16 rounded-xl font-display font-black text-lg sm:text-xl tracking-wider transition-all duration-300 flex items-center justify-between px-6 border active:scale-[0.98] ${
                controls.aimbot
                  ? 'bg-gradient-to-r from-emerald-900 via-green-700 to-emerald-950 text-white border-green-400 box-glow-green shadow-lg shadow-green-900/50'
                  : 'bg-gradient-to-r from-stone-900 via-red-950 to-stone-900 text-zinc-300 border-red-900/80 hover:border-red-600 shadow-md shadow-red-950/40'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                <span>AIMBOT ULTRA POWER</span>
              </span>

              {/* Exact Bengali Prompt Button Display: [ OFF 🔴 ] / [ ON 🟢 ] */}
              <div
                className={`px-4 py-2 rounded-lg font-mono font-bold text-base flex items-center gap-2 border transition-all ${
                  controls.aimbot
                    ? 'bg-green-500 text-black border-green-300 shadow-sm shadow-green-400'
                    : 'bg-red-950 text-red-300 border-red-800'
                }`}
              >
                <span>{controls.aimbot ? 'ON' : 'OFF'}</span>
                <span>{controls.aimbot ? '🟢' : '🔴'}</span>
              </div>
            </button>
            <div className="text-center mt-2 text-xs text-zinc-400">
              {controls.aimbot ? '🟢 ফুল পাওয়ার এক্টিভ' : '🔴 ক্লিক করুন (লাল ও সাদা বিজলী একসাথে চমকে উঠবে)'}
            </div>
          </div>

          {/* Fine Tuning Controls when Aimbot is Active */}
          <div
            className={`mt-4 pt-4 border-t border-zinc-800/80 space-y-4 transition-all duration-300 ${
              controls.aimbot ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1">
                <span>ফিল্ড অব ভিউ (FOV Range):</span>
                <span className="text-red-400 font-mono font-bold">{controls.aimbotFov}° Radial</span>
              </div>
              <input
                type="range"
                min="45"
                max="180"
                step="5"
                value={controls.aimbotFov}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    aimbotFov: Number(e.target.value),
                  }))
                }
                className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1">
                <span>ট্র্যাকিং স্পিড (Lock Speed):</span>
                <span className="text-red-400 font-mono font-bold">{controls.aimbotSpeed}% Max</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={controls.aimbotSpeed}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    aimbotSpeed: Number(e.target.value),
                  }))
                }
                className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Safe Notice */}
      <div className="mt-8 max-w-xl mx-auto flex items-center justify-center gap-3 text-xs text-zinc-400 bg-black/60 p-3 rounded-xl border border-zinc-800">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Said Prime Concept Engine: সিমুলেটেড গেমিং আর্কিটেকচার ও কাস্টম প্যারামিটার রেডি।</span>
      </div>
    </section>
  );
};
