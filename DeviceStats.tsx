import React from 'react';
import { Cpu, Zap, Crosshair, Shield, Sparkles, Sliders } from 'lucide-react';
import { ControlState } from '../types';

interface DeviceStatsProps {
  controls: ControlState;
  lightningIntensity: 'low' | 'medium' | 'high';
  setLightningIntensity: (val: 'low' | 'medium' | 'high') => void;
}

export const DeviceStats: React.FC<DeviceStatsProps> = ({
  controls,
  lightningIntensity,
  setLightningIntensity,
}) => {
  return (
    <section className="mt-12 space-y-8">
      {/* 4 Metric Columns (Clean unboxed typography) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950/70 border border-red-900/30 backdrop-blur-sm">
          <div className="text-xs text-zinc-400 font-medium">Touch Sampling</div>
          <div className="text-2xl font-bold font-display text-white mt-1 tabular-nums">
            360 <span className="text-xs text-red-400 font-sans">Hz</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Instant Response</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-red-900/30 backdrop-blur-sm">
          <div className="text-xs text-zinc-400 font-medium">Tracking Latency</div>
          <div className="text-2xl font-bold font-display text-green-400 mt-1 tabular-nums">
            1.2 <span className="text-xs text-zinc-400 font-sans">ms</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Ultra Low Jitter</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-red-900/30 backdrop-blur-sm">
          <div className="text-xs text-zinc-400 font-medium">Engine Status</div>
          <div className="text-2xl font-bold font-display text-red-400 mt-1">
            {controls.aimLock || controls.aimbot ? 'PRIME' : 'READY'}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Algorithm Core Active</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-red-900/30 backdrop-blur-sm">
          <div className="text-xs text-zinc-400 font-medium">Storm Lightning FX</div>
          <div className="text-2xl font-bold font-display text-white mt-1 uppercase">
            {lightningIntensity}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Canvas Render Active</div>
        </div>
      </div>

      {/* Lightning FX Controller */}
      <div className="p-5 rounded-2xl bg-zinc-950/80 border border-red-900/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-500" />
            <span>রেড লাইটনিং থিম কনফিগারেশন</span>
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            ব্যাকগ্রাউন্ডের লাল মেঘ ও সাদা/লাল বিদ্যুৎ চমকানোর গতি নির্ধারণ করুন
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-zinc-800">
          {(['low', 'medium', 'high'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLightningIntensity(lvl)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all ${
                lightningIntensity === lvl
                  ? 'bg-red-700 text-white shadow-md shadow-red-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Technical Specifications Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-black/70 border border-zinc-800/80">
          <div className="flex items-center gap-2.5 mb-3 text-red-400 font-display font-bold">
            <Crosshair className="w-5 h-5 text-red-500" />
            <span>Aim Lock কারিগরি বিবরণ</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Aim Lock মোডটি মূলত ক্রসহেয়ার স্ট্যাবিলাইজার ও টার্গেট অ্যাঙ্কর হিসেবে কাজ করে। যখন আপনি কোনো টার্গেট বা এনিমি পয়েন্টের দিকে তাক করেন, তখন অ্যালগরিদম স্ক্রিনের রিয়েল-টাইম কোঅর্ডিনেট ভেক্টর ক্যালকুলেট করে এবং টার্গেট সীমানার মধ্যে ক্রসহেয়ার লক করে রাখে।
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>সাপোর্ট: হেডশট লক</span>
            <span aria-hidden="true">·</span>
            <span>জিরো রিকয়েল গাইড</span>
            <span aria-hidden="true">·</span>
            <span>স্মুথ ড্র্যাগ</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-black/70 border border-zinc-800/80">
          <div className="flex items-center gap-2.5 mb-3 text-red-400 font-display font-bold">
            <Sparkles className="w-5 h-5 text-red-500" />
            <span>Aimbot ফুল ট্র্যাকিং বিবরণ</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Aimbot ফিচারটি নির্বাচিত ফিল্ড অব ভিউ (FOV Range) এর মধ্যে চলমান সকল টার্গেটের ডাইনামিক গতি ট্র্যাকিং করে। ৩৬০ ডিগ্রি রাডারের মাধ্যমে দ্রুততম সময়ের মধ্যে ক্রসহেয়ার সঠিক পজিশনে সোয়াইপ ও লক হয়, যা বিজলীর গতিতে ফায়ারিং অ্যাকুরেসি নিশ্চিত করে।
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>FOV রেঞ্জ: ৪৫° - ১৮০°</span>
            <span aria-hidden="true">·</span>
            <span>অটো ক্যালকুলেশন</span>
            <span aria-hidden="true">·</span>
            <span>হাই-স্পিড সিঙ্ক</span>
          </div>
        </div>
      </div>
    </section>
  );
};
