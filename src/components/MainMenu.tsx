import React from 'react';
import {
  Play,
  BookOpen,
  Backpack,
  Award,
  Settings,
  HelpCircle,
  Volume2,
  VolumeX,
  Flame,
  Radio,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Target,
} from 'lucide-react';
import { GradeLevel, PlayerStats, PlayerInventory } from '../types';
import { sounds } from '../utils/audio';
import { getRankByExp } from '../utils/progression';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenStory: () => void;
  onOpenManual: () => void;
  onOpenGhostDex: () => void;
  onOpenInventory: () => void;
  onOpenCertificate: () => void;
  onOpenSettings: () => void;
  onOpenDailyBounties?: () => void;
  unclaimedBountiesCount?: number;
  gradeLevel: GradeLevel;
  setGradeLevel: (grade: GradeLevel) => void;
  stats: PlayerStats;
  inventory: PlayerInventory;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenStory,
  onOpenManual,
  onOpenGhostDex,
  onOpenInventory,
  onOpenCertificate,
  onOpenSettings,
  onOpenDailyBounties,
  unclaimedBountiesCount = 0,
  gradeLevel,
  setGradeLevel,
  stats,
  inventory,
  soundEnabled,
  toggleSound,
}) => {
  const grades: GradeLevel[] = ['ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'];
  const rankInfo = getRankByExp(stats.exp || 0);

  const handleStart = () => {
    sounds.playBoo();
    const skipPrologue = localStorage.getItem('ar_ghost_skip_prologue') === 'true';
    if (!skipPrologue) {
      onOpenStory();
    } else {
      onStartGame();
    }
  };

  const totalItems =
    (inventory.talisman || 0) + (inventory.hourglass || 0) + (inventory.uv_light || 0);

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-y-auto overflow-x-hidden flex flex-col justify-between text-slate-100 select-none">
      {/* Background Horror Art & Atmosphere Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Background Image: Abandoned School Corridor at Midnight */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 filter contrast-125 saturate-50 mix-blend-luminosity scale-105 transform motion-safe:animate-pulse"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80)',
          }}
        />

        {/* Eerie Crimson & Indigo Vignette & Fog Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-red-950/40" />
        <div className="absolute inset-0 horror-vignette opacity-80" />
        <div className="absolute inset-0 flashlight-spotlight opacity-50" />
        <div className="absolute inset-0 horror-fog bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-slate-900/20 to-black/60" />

        {/* Floating Supernatural Mathematical Formula Runes */}
        <div className="absolute inset-0 overflow-hidden opacity-25 font-mono text-xs sm:text-sm text-red-400 select-none pointer-events-none">
          <span className="absolute top-[12%] left-[8%] animate-pulse">√144 = 12</span>
          <span className="absolute top-[28%] right-[10%] opacity-40">x² - 4 = 0</span>
          <span className="absolute top-[45%] left-[5%] opacity-60">π ≈ 3.14159</span>
          <span className="absolute top-[60%] right-[7%] opacity-50">17 × 8 = 136</span>
          <span className="absolute bottom-[22%] left-[12%] opacity-45">3x + 9 = 24</span>
          <span className="absolute bottom-[10%] right-[15%] opacity-70 animate-pulse">∫ e^x dx = e^x + C</span>
        </div>
      </div>

      {/* Top Bar with Live Audio & Quick Settings */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/90 to-transparent">
        {/* Left: Security Camera HUD Indicator */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-red-500 tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
          <span className="font-bold">AR NIGHT-VISION CAM 01</span>
        </div>

        {/* Right: Audio Toggle & Quick Settings */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              toggleSound();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-slate-900 border border-red-950 hover:border-red-700 text-xs font-mono text-slate-300 backdrop-blur-md transition-all shadow-md"
            title={soundEnabled ? 'ปิดเสียงทั้งหมด' : 'เปิดเสียงเอฟเฟกต์'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline text-red-400">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline text-slate-500">MUTED</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-black/70 hover:bg-slate-900 border border-red-950 text-slate-300 backdrop-blur-md transition-colors"
            title="ตั้งค่าเกม"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Center Hero & Cover Area */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 py-4 sm:py-8 flex flex-col items-center justify-center text-center">
        {/* Floating Supernatural Ghost Emblem with Eyes */}
        <div className="relative mb-3 sm:mb-5">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-red-950/80 via-black to-slate-950 border-2 border-red-600/70 shadow-[0_0_50px_rgba(239,68,68,0.4)] flex items-center justify-center spooky-float">
            {/* Glowing Ectoplasmic Ghost Aura */}
            <span className="text-5xl sm:text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] filter">
              👻
            </span>
            {/* Small Math Rune badge inside */}
            <div className="absolute -bottom-2 -right-2 bg-red-600 text-white font-mono font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-red-400 shadow-md">
              f(x)
            </div>
          </div>
          {/* Eerie ground light reflection */}
          <div className="w-28 sm:w-40 h-4 bg-red-600/20 blur-md rounded-full mx-auto mt-2" />
        </div>

        {/* Main Title Typography */}
        <div className="space-y-1 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase mb-1 shadow-inner">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            <span>AUGMENTED REALITY HORROR & MATH</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] font-serif">
            <span className="bg-gradient-to-r from-red-500 via-rose-300 to-amber-200 bg-clip-text text-transparent">
              AR GHOST
            </span>{' '}
            <span className="text-slate-100">TRACKER</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-bold text-red-400/90 font-mono tracking-wide">
            ตำนานสมการซ่อนแอบ [โรงเรียนร้าง]
          </p>
        </div>

        {/* Story Snippet */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mt-1 mb-4 text-center opacity-90">
          เมื่อเสียงกริ่งเลิกเรียนเงียบสงบลง วิญญาณที่สิงสถิตอยู่ในสิ่งของรอบตัวกำลังรอคอยผู้กล้ามาถอดรหัสคำสาปสมการตัวเลขเพื่อปลดปล่อยสู่สุคติ!
        </p>

        {/* Creator Credit Badge (Prominently Highlighted) */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-red-950/90 via-black to-red-950/90 border border-red-600/50 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
          <span className="text-sm">⚡</span>
          <span className="text-xs font-mono font-bold tracking-widest text-red-300 uppercase">
            CREATED BY <span className="text-yellow-400 font-black">MIKPURINUT</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
        </div>

        {/* Quick Grade Selector Bar */}
        <div className="w-full max-w-md bg-black/85 p-3 rounded-2xl border border-red-950/80 mb-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-red-400" />
              <span>เลือกระดับชั้นเรียนของคำถาม:</span>
            </span>
            <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-lg border border-red-800/40">
              ปัจจุบัน: {gradeLevel}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => {
                  sounds.playClick();
                  setGradeLevel(g);
                }}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  gradeLevel === g
                    ? 'bg-gradient-to-r from-red-700 to-rose-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-red-400 scale-105'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Exorcist Level & EXP Progression Card */}
        <div className="w-full max-w-md bg-gradient-to-r from-red-950/70 via-black to-slate-950/90 p-3 rounded-2xl border border-red-900/60 mb-3 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{rankInfo.currentRank.emoji}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white font-mono">
                    Lv.{rankInfo.currentRank.level} {rankInfo.currentRank.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 font-mono">
                    {stats.exp || 0} EXP
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  {rankInfo.currentRank.description}
                </p>
              </div>
            </div>
            {rankInfo.nextRank && (
              <span className="text-[10px] font-mono text-amber-400 font-semibold text-right">
                อีก {rankInfo.expToNext} EXP ถึงขั้นต่อไป
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-red-950">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${rankInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="w-full max-w-md space-y-2.5">
          {/* BIG RED START BUTTON */}
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-700 via-rose-600 to-red-700 hover:from-red-600 hover:via-rose-500 hover:to-red-600 text-white font-bold text-base sm:text-lg tracking-wide font-mono flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(239,68,68,0.5)] border border-red-400/60 active:scale-95 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </div>
            <span>เริ่มสำรวจโรงเรียนร้าง [START HUNT]</span>
          </button>

          {/* STORY PROLOGUE BUTTON */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenStory();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-950/80 via-black to-slate-950/90 hover:from-purple-900/90 hover:to-slate-900 border border-purple-800/60 hover:border-purple-500 text-purple-200 text-xs sm:text-sm font-bold font-mono flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>🎬</span>
            <span>ชมเรื่องเล่าบทนำ [STORY PROLOGUE]</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/60">
              มีเสียงพากย์ AI
            </span>
          </button>

          {/* Secondary Action Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* How To Play Manual Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenManual();
              }}
              className="py-3 px-3 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-red-950 hover:border-red-700/80 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-red-400" />
              <span>คู่มือการเล่น (MANUAL)</span>
            </button>

            {/* Hunter Arsenal Inventory */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenInventory();
              }}
              className="py-3 px-3 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-red-950 hover:border-red-700/80 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Backpack className="w-4 h-4 text-rose-400" />
              <span>กระเป๋าไอเทม ({totalItems})</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Daily Bounties Quests Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenDailyBounties?.();
              }}
              className="py-2.5 px-2 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-purple-900/60 hover:border-purple-600 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors relative"
            >
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span className="truncate">เควสต์ประจำวัน</span>
              {unclaimedBountiesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1.5 right-1.5" />
              )}
            </button>

            {/* Ghost Compendium */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenGhostDex();
              }}
              className="py-2.5 px-2 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-red-950 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>👻 สมุดผี ({stats.ghostsExorcised})</span>
            </button>

            {/* Honors Certificate */}
            <button
              onClick={() => {
                sounds.playFanfare();
                onOpenCertificate();
              }}
              className="py-2.5 px-2 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-amber-950/80 hover:border-amber-700/60 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span className="truncate">ใบประกาศ</span>
            </button>
          </div>
        </div>

        {/* Player Quick Stats Ribbon */}
        {stats.ghostsExorcised > 0 && (
          <div className="mt-5 flex items-center gap-3 text-xs font-mono text-slate-400 bg-black/60 px-4 py-2 rounded-2xl border border-red-950/60">
            <span>ฉายา: <strong className="text-emerald-400">{stats.rank}</strong></span>
            <span>•</span>
            <span>ปราบแล้ว: <strong className="text-amber-300">{stats.ghostsExorcised} ตน</strong></span>
            <span>•</span>
            <span>แต้ม: <strong className="text-yellow-400">{stats.score}</strong></span>
          </div>
        )}
      </main>

      {/* Footer & Credits */}
      <footer className="relative z-10 w-full p-4 text-center border-t border-red-950/40 bg-black/90">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span>AR Math Ghost Tracker</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-red-400 font-bold">Created by MIKPURINUT</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-slate-500">โรงเรียนอาถรรพ์วิชาคณิตศาสตร์</span>
        </div>
      </footer>
    </div>
  );
};
