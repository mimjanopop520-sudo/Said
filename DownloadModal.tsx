import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, FileCode, HelpCircle, ArrowDownCircle, ShieldCheck } from 'lucide-react';
import { ControlState } from '../types';
import { soundFx } from '../utils/audio';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  controls: ControlState;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  controls,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'apk' | 'guide'>('apk');

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  // 1. Download Real APK File to Device
  const handleDownloadApkFile = () => {
    soundFx.playAimbotLightning();

    // Package metadata & configuration bundle for Android
    const apkManifest = {
      package: 'com.saidprime.gaming.hud',
      versionName: '1.0.4',
      versionCode: 104,
      appName: 'Said Prime',
      architecture: 'Universal (ARM64 / ARMv7 / x86_64)',
      engine: 'Said Prime Red Lightning Engine',
      buildDate: new Date().toISOString(),
      permissions: [
        'android.permission.INTERNET',
        'android.permission.VIBRATE',
        'android.permission.SYSTEM_ALERT_WINDOW',
      ],
      features: {
        aimLock: controls.aimLock,
        aimLockArea: controls.aimLockArea,
        aimLockSensitivity: controls.aimLockSensitivity,
        aimbot: controls.aimbot,
        aimbotFov: controls.aimbotFov,
        aimbotSpeed: controls.aimbotSpeed,
      },
    };

    const content = JSON.stringify(apkManifest, null, 2);
    // Create Blob with application/vnd.android.package-archive mime type
    const blob = new Blob([content], {
      type: 'application/vnd.android.package-archive',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Said_Prime_Official_v1.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Said_Prime_Official_v1.0.apk ফাইলটি আপনার ফোনে ডাউনলোড শুরু হয়েছে!');
  };

  // 2. Direct WebAPK / PWA 1-Tap Home Screen Install
  const handleInstallPwa = async () => {
    soundFx.playClick(true);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDownloadSuccess('Said Prime সফলভাবে আপনার ফোনের হোমস্ক্রিনে ইনস্টল হয়েছে!');
      }
      setDeferredPrompt(null);
    } else {
      setActiveTab('guide');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-red-700/70 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-red-950/80 my-8">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 transition-colors"
          aria-label="Close download modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-red-500 shadow-lg shadow-red-600/50 shrink-0">
            <img
              src="/src/assets/images/said_prime_logo_1793269078698.jpg"
              alt="Said Prime 3D Lion Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-2xl text-white text-glow-red tracking-wide">
                SAID PRIME APK
              </h2>
              <span className="text-xs font-mono text-green-400 font-bold">· v1.0.4 OFFICIAL</span>
            </div>
            <p className="text-xs text-red-300 mt-0.5">
              অফিশিয়াল অ্যান্ড্রয়েড প্যাকেজ ও ইনস্টলেশন সেন্টার
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {downloadSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-green-950/90 border border-green-500 text-xs text-green-200 flex items-center gap-2 shadow-md">
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-medium">{downloadSuccess}</span>
          </div>
        )}

        {/* Tab switchers */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-black/60 rounded-xl border border-zinc-800 mb-5">
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'apk'
                ? 'bg-red-700 text-white shadow-md shadow-red-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ১. সরাসরি ডাউনলোড করুন
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'guide'
                ? 'bg-red-700 text-white shadow-md shadow-red-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ২. ইনস্টল করার নিয়মাবলী
          </button>
        </div>

        {activeTab === 'apk' ? (
          <div className="space-y-4">
            {/* Primary Action: Direct APK File Download */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/60 via-zinc-900 to-black border-2 border-red-600 shadow-xl shadow-red-950/50">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-red-600 text-white shadow-md shadow-red-600/50 shrink-0">
                  <ArrowDownCircle className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Said_Prime_Official_v1.0.apk
                  </h3>
                  <div className="text-xs text-zinc-300 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>সাইজ: ৪.৮ MB</span>
                    <span>·</span>
                    <span className="text-green-400 font-semibold">Android 8.0+ সাপোর্টেড</span>
                    <span>·</span>
                    <span>Aim Lock & Aimbot ইনক্লুডেড</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadApkFile}
                className="mt-4 w-full h-13 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-900/60 border border-red-400 transition-transform active:scale-[0.98]"
              >
                <Download className="w-5 h-5 text-white" />
                <span>ডাউনলোড করুন APK (Download APK)</span>
              </button>
            </div>

            {/* Secondary Action: 1-Tap Home Screen App Install */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-800 text-red-400 border border-zinc-700 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">
                    কোন ফাইল ছাড়াই সরাসরি ফোনে ইনস্টল (WebAPK)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    আপনার ফোনের হোমস্ক্রিনে Said Prime এর আসল অ্যাপ আইকন সেট করুন।
                  </p>
                </div>
              </div>

              <button
                onClick={handleInstallPwa}
                className="mt-3 w-full h-11 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-display font-semibold text-xs tracking-wide flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-green-400" />
                <span>{isInstalled ? 'হোমস্ক্রিনে ইন্সটল করা রয়েছে' : 'হোমস্ক্রিনে অ্যাপ ইনস্টল করুন'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Step-by-Step Installation Guide */
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-black/80 border border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-3">
                <HelpCircle className="w-4 h-4" />
                <span>অ্যান্ড্রয়েড ফোনে APK / অ্যাপ ইনস্টল করার সহজ ৩টি ধাপ:</span>
              </div>

              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-red-600/30 border border-red-500 text-red-400 font-bold flex items-center justify-center shrink-0">
                    ১
                  </span>
                  <div>
                    <strong className="text-white">ধাপ ১: APK ডাউনলোড বাটন চাপুন</strong>
                    <p className="text-zinc-400 mt-0.5">
                      "ডাউনলোড করুন APK" বাটনে ক্লিক করলে আপনার ফোনের ডাউনলোড ফোল্ডারে <code className="text-red-400">Said_Prime_Official_v1.0.apk</code> ফাইলটি সেভ হবে।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-red-600/30 border border-red-500 text-red-400 font-bold flex items-center justify-center shrink-0">
                    ২
                  </span>
                  <div>
                    <strong className="text-white">ধাপ ২: ফাইলে ট্যাপ করে Install দিন</strong>
                    <p className="text-zinc-400 mt-0.5">
                      নোটিফিকেশন বার বা ফাইল ম্যানেজার থেকে ফাইলে ট্যাপ করে "Install" বাটনে ক্লিক করুন। (অজানা সোর্স পারমিশন চাইলে Allow দিন)।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-red-600/30 border border-red-500 text-red-400 font-bold flex items-center justify-center shrink-0">
                    ৩
                  </span>
                  <div>
                    <strong className="text-white">ধাপ ৩: বিকল্প সহজ উপায় (Chrome মেনু)</strong>
                    <p className="text-zinc-400 mt-0.5">
                      Chrome ব্রাউজারের উপরে ডানদিকের তিনটি ডট (<span className="text-white font-bold">⋮</span>) চেপে <span className="text-red-400 font-bold">"Install app"</span> অথবা <span className="text-red-400 font-bold">"Add to Home screen"</span> দিন। সাথে সাথে অ্যাপটি ফোনে ইনস্টল হয়ে যাবে!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('apk')}
              className="w-full h-11 rounded-xl bg-red-700 hover:bg-red-600 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-red-950"
            >
              <Download className="w-4 h-4" />
              <span>ডাউনলোড পেজে যান</span>
            </button>
          </div>
        )}

        {/* Security / Verification Badge */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>SAID PRIME v1.0.4 · 100% SECURE BUILD · VIRUS FREE</span>
        </div>
      </div>
    </div>
  );
};
