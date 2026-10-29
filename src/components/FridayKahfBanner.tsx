import React, { useState } from 'react';
import { BookOpen, Play, Sparkles, X, Sun, ChevronRight } from 'lucide-react';
import { Reciter } from '../types/quran';

interface FridayKahfBannerProps {
  onOpenKahfReader: () => void;
  onPlayKahfAudio: () => void;
  currentReciter: Reciter;
}

export const FridayKahfBanner: React.FC<FridayKahfBannerProps> = ({
  onOpenKahfReader,
  onPlayKahfAudio,
  currentReciter
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if today is Friday (5) or let user access anytime
  const isFriday = new Date().getDay() === 5;

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-900/90 via-amber-800 to-emerald-950 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-amber-600/30 relative overflow-hidden transition-all mb-6">
      
      {/* Decorative subtle background icon */}
      <div className="absolute right-4 -bottom-4 text-amber-500/10 font-arabic text-7xl select-none pointer-events-none">
        الكهف
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{isFriday ? 'Friday Sunnah Today' : 'Sunnah of Friday'}</span>
            </span>
            <span className="text-xs text-amber-200 font-arabic font-semibold">
              سُورَةُ الكَهْفِ
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Surah Al-Kahf (The Cave — 18) Reading & Audio Recitation
          </h3>

          <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
            "Whoever reads Surah Al-Kahf on the day of Jumu'ah, Allah will illuminate for him light between the two Fridays." (Sunan al-Bayhaqi)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenKahfReader}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-white text-slate-900 hover:bg-amber-50 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
            <span>Read Surah 18</span>
          </button>

          <button
            onClick={onPlayKahfAudio}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Listen with {currentReciter.name.split(' ')[0]}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1.5 text-amber-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
