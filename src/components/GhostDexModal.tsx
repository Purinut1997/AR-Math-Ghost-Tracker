import React from 'react';
import { X, Award, Flame, CheckCircle, Ghost, BookOpen, Star, Camera } from 'lucide-react';
import { GhostEncounter, PlayerStats } from '../types';
import { sounds } from '../utils/audio';

interface GhostDexModalProps {
  isOpen: boolean;
  onClose: () => void;
  ghosts: GhostEncounter[];
  stats: PlayerStats;
  onOpenCertificate?: () => void;
  onOpenPolaroid?: (ghost: GhostEncounter) => void;
}

export const GhostDexModal: React.FC<GhostDexModalProps> = ({
  isOpen,
  onClose,
  ghosts,
  stats,
  onOpenCertificate,
  onOpenPolaroid,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md">
      <div className="absolute inset-0 horror-vignette pointer-events-none" />
      <div className="relative w-full max-w-2xl bg-black/95 border border-red-950/80 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-red-950/80 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                คัมภีร์บันทึกวิญญาณแห่งโรงเรียนร้าง
              </h3>
              <p className="text-xs text-red-400 font-mono">
                รายนามวิญญาณอาฆาตที่ถูกชำระล้างด้วยสมการคณิตศาสตร์
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-red-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Rank & Stats Strip */}
        <div className="p-4 bg-slate-950 border-b border-red-950/80 grid grid-cols-3 gap-3 text-center">
          <div className="p-2.5 rounded-2xl bg-black/80 border border-red-950/80">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold mb-0.5">
              <Award className="w-3.5 h-3.5" />
              ฉายานักล่าวิญญาณ
            </div>
            <p className="text-xs font-bold text-red-300 truncate">{stats.rank}</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/80 border border-red-950/80">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold mb-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
              ปลดปล่อยแล้ว
            </div>
            <p className="text-base font-bold text-white font-mono">{stats.ghostsExorcised} ตน</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-center gap-1 text-orange-400 text-xs font-semibold mb-0.5">
              <Flame className="w-3.5 h-3.5" />
              คะแนนสะสม
            </div>
            <p className="text-base font-bold text-white font-mono">{stats.score} แต้ม</p>
          </div>
        </div>

        {/* Ghosts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {ghosts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center">
              <Ghost className="w-14 h-14 text-slate-600 mb-3 animate-pulse" />
              <p className="text-sm font-medium text-slate-300">ยังไม่มีวิญญาณในบันทึก</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                ใช้กล้องสแกนสิ่งของรอบตัวในโรงเรียนหรือบ้าน แล้วแก้สมการเพื่อปลดปล่อยวิญญาณตนแรก!
              </p>
            </div>
          ) : (
            ghosts.map((g, idx) => (
              <div
                key={g.id || idx}
                className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row gap-3 items-start sm:items-center hover:border-emerald-500/50 transition-colors"
              >
                {/* Image Snapshot or Emoji Icon */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center">
                  {g.imageSnapshot ? (
                    <img
                      src={g.imageSnapshot}
                      alt={g.ghost_type}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <span className="absolute text-2xl drop-shadow-md">
                    {g.ghost_emoji}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">
                      {g.ghost_type}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                      {g.gradeLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 italic line-clamp-1 mt-0.5">
                    "{g.narrative}"
                  </p>
                  <p className="text-xs text-emerald-300 font-medium mt-1">
                    โจทย์: {g.math_question} ➔ คำตอบ: <span className="font-bold underline">{g.correct_answer}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {onOpenPolaroid && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onOpenPolaroid(g);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-rose-300 border border-red-900/60 text-xs transition-colors active:scale-95 shadow-sm"
                      title="เปิดการ์ดโพลารอยด์"
                    >
                      <Camera className="w-3.5 h-3.5 text-rose-400" />
                      <span>โพลารอยด์</span>
                    </button>
                  )}
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(g.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-red-950/80 flex justify-between items-center text-xs text-slate-400 px-5">
          <span>สถิติสตรีคสูงสุด: {stats.bestStreak} ครั้งติดต่อกัน</span>
          <div className="flex items-center gap-2">
            {onOpenCertificate && (
              <button
                onClick={() => {
                  sounds.playFanfare();
                  onClose();
                  onOpenCertificate();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-600/70 text-amber-300 font-bold text-xs transition-colors shadow-md"
              >
                <span>📜 ใบประกาศนียบัตร</span>
              </button>
            )}
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950 text-slate-200 transition-colors font-medium"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
