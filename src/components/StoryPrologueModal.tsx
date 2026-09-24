import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Flame,
  Radio,
  BookOpen,
  ArrowRight,
  Ghost,
} from 'lucide-react';
import { sounds } from '../utils/audio';

export interface StoryScene {
  id: number;
  chapter: string;
  title: string;
  subtitle: string;
  narrative: string;
  subtitles: string[];
  imageUrl: string;
  audioFile: string;
  icon: string;
}

export const STORY_SCENES: StoryScene[] = [
  {
    id: 1,
    chapter: 'บทที่ 1 · แฟ้มลับยามพลบค่ำ',
    title: 'โรงเรียนร้างยามราตรี',
    subtitle: 'The Twilight Schoolyard',
    narrative:
      'ยินดีต้อนรับสู่โรงเรียนแห่งนี้... ในเวลาพลบค่ำ เมื่อแสงอาทิตย์ลับขอบฟ้า และเสียงกริ่งเลิกเรียนเงียบสนิทลง บรรยากาศรอบตัวจะเปลี่ยนไปตลอดกาล...',
    subtitles: [
      'ยินดีต้อนรับสู่โรงเรียนแห่งนี้...',
      'ในเวลาพลบค่ำ เมื่อแสงอาทิตย์ลับขอบฟ้า',
      'และเสียงกริ่งเลิกเรียนเงียบสนิทลง',
      'บรรยากาศรอบตัวจะเปลี่ยนไปตลอดกาล...',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    audioFile: '/audio/story_part1.mp3',
    icon: '🏫',
  },
  {
    id: 2,
    chapter: 'บทที่ 2 · ต้นกำเนิดคำสาป',
    title: 'วิญญาณแห่งสมการที่ถูกลืม',
    subtitle: 'The Curse of the Unsolved Problems',
    narrative:
      'ตำนานเล่าว่า มีวิญญาณที่ติดอยู่ในห้วงเวลา เพราะแก้โจทย์คณิตศาสตร์ไม่สำเร็จ ความอาฆาตทำให้พวกมันเข้าสิงสถิตอยู่ตามสิ่งของรอบตัว โต๊ะ เก้าอี้ และกระดานดำ...',
    subtitles: [
      'ตำนานเล่าว่า มีวิญญาณที่ติดอยู่ในห้วงเวลา',
      'เพราะแก้โจทย์คณิตศาสตร์ไม่สำเร็จ...',
      'ความอาฆาตทำให้พวกมันเข้าสิงสถิตอยู่ตามสิ่งของรอบตัว',
      'โต๊ะ เก้าอี้ และกระดานดำ...',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    audioFile: '/audio/story_part2.mp3',
    icon: '👻',
  },
  {
    id: 3,
    chapter: 'บทที่ 3 · อาวุธแห่งปัญญา',
    title: 'กล้องตรวจคลื่นวิญญาณ AR',
    subtitle: 'The Supernatural Mathematical Radar',
    narrative:
      'มีเพียงกล้องตรวจจับวิญญาณนี้เท่านั้น ที่มองเห็นพวกมันในโลกจริงได้ และหนทางเดียวที่จะปลดปล่อยพวกมัน คือการใช้พลังสมองแก้คำสาปตัวเลขให้ถูกต้อง!',
    subtitles: [
      'มีเพียงกล้องตรวจจับวิญญาณ AR นี้เท่านั้น',
      'ที่มองเห็นพวกมันในโลกจริงได้...',
      'และหนทางเดียวที่จะปลดปล่อยพวกมัน',
      'คือการใช้พลังสมองแก้คำสาปตัวเลขให้ถูกต้อง!',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    audioFile: '/audio/story_part3.mp3',
    icon: '📡',
  },
  {
    id: 4,
    chapter: 'บทที่ 4 · หน้าที่ของผู้พิทักษ์',
    title: 'เริ่มต้นการล่าและปลดปล่อย',
    subtitle: 'Awakening of the Exorcist',
    narrative:
      'บัดนี้ เครื่องมือพร้อมแล้ว จงสแกนค้นหาสิ่งของรอบตัว และปลดปล่อยวิญญาณพวกมันสู่สุคติ!',
    subtitles: [
      'บัดนี้ เครื่องมือพร้อมแล้ว...',
      'จงสแกนค้นหาสิ่งของรอบตัว',
      'และปลดปล่อยวิญญาณพวกมันสู่สุคติ!',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    audioFile: '/audio/story_part4.mp3',
    icon: '⚡',
  },
];

interface StoryPrologueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartHunt: () => void;
}

export const StoryPrologueModal: React.FC<StoryPrologueModalProps> = ({
  isOpen,
  onClose,
  onStartHunt,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeSubtitleIdx, setActiveSubtitleIdx] = useState<number>(0);
  const [autoShowNextTime, setAutoShowNextTime] = useState<boolean>(() => {
    return localStorage.getItem('ar_ghost_skip_prologue') !== 'true';
  });

  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const subtitleIntervalRef = useRef<any>(null);

  const scene = STORY_SCENES[currentIdx];

  // Stop previous voice audio safely
  const stopVoice = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
      voiceAudioRef.current = null;
    }
    if (subtitleIntervalRef.current) {
      clearInterval(subtitleIntervalRef.current);
      subtitleIntervalRef.current = null;
    }
  };

  // Play narration audio for current scene
  const playCurrentSceneAudio = () => {
    stopVoice();
    setActiveSubtitleIdx(0);

    if (!isOpen || !scene) return;

    try {
      const audio = new Audio(scene.audioFile);
      audio.volume = 1.0;
      voiceAudioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        setActiveSubtitleIdx(scene.subtitles.length - 1);
      };

      audio.play().catch(() => {
        // Autoplay may be restricted before user gesture
        setIsPlaying(false);
      });

      setIsPlaying(true);

      // Cycle subtitles smoothly across narration duration (~7-9s)
      const stepDuration = 2200;
      let sIdx = 0;
      subtitleIntervalRef.current = setInterval(() => {
        sIdx++;
        if (sIdx < scene.subtitles.length) {
          setActiveSubtitleIdx(sIdx);
        } else {
          clearInterval(subtitleIntervalRef.current);
        }
      }, stepDuration);
    } catch {
      setIsPlaying(false);
    }
  };

  // Handle scene change or open
  useEffect(() => {
    if (isOpen) {
      // Start background horror ambience softly
      sounds.startHorrorAmbience();
      playCurrentSceneAudio();
    } else {
      stopVoice();
    }

    return () => {
      stopVoice();
    };
  }, [isOpen, currentIdx]);

  if (!isOpen) return null;

  const handleNext = () => {
    sounds.playClick();
    if (currentIdx < STORY_SCENES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      handleFinishAndHunt();
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleToggleVoice = () => {
    sounds.playClick();
    if (isPlaying) {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        playCurrentSceneAudio();
      }
    }
  };

  const handleReplayVoice = () => {
    sounds.playClick();
    playCurrentSceneAudio();
  };

  const handleFinishAndHunt = () => {
    sounds.playHorrorStinger();
    stopVoice();
    onClose();
    onStartHunt();
  };

  const handleToggleAutoShow = (checked: boolean) => {
    setAutoShowNextTime(checked);
    if (!checked) {
      localStorage.setItem('ar_ghost_skip_prologue', 'true');
    } else {
      localStorage.removeItem('ar_ghost_skip_prologue');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-lg overflow-hidden select-none animate-in fade-in duration-300">
      {/* Horror Cinematic Vignette & Grain */}
      <div className="absolute inset-0 horror-vignette opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-red-950/40 pointer-events-none" />

      {/* Main Cinema Box */}
      <div className="relative w-full max-w-3xl bg-slate-950 border border-red-900/80 rounded-3xl shadow-[0_0_60px_rgba(239,68,68,0.3),0_0_30px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Top Cinematic Header */}
        <div className="relative z-10 px-5 py-3.5 bg-black/80 border-b border-red-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{scene.icon}</span>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold flex items-center gap-2">
                <span>{scene.chapter}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {scene.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Control Button */}
            <button
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-red-950 border-red-600 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isPlaying ? 'หยุดเสียงพากย์ชั่วคราว' : 'เปิดเสียงพากย์'}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="hidden sm:inline">กำลังบรรยาย</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">เสียงหยุด</span>
                </>
              )}
            </button>

            {/* Replay Scene Voice */}
            <button
              onClick={handleReplayVoice}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              title="ฟังเสียงบรรยายฉากนี้ใหม่อีกครั้ง"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip / Close */}
            <button
              onClick={() => {
                sounds.playClick();
                stopVoice();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="ปิดหน้าต่างเรื่องเล่า"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scene Visual & Backdrop */}
        <div className="relative flex-1 min-h-[220px] sm:min-h-[320px] overflow-hidden bg-black flex items-center justify-center">
          {/* Animated Atmospheric Photo Backdrop */}
          <img
            key={scene.imageUrl}
            src={scene.imageUrl}
            alt={scene.title}
            className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-75 brightness-75 scale-105 animate-pulse duration-1000"
          />

          {/* Vignette Overlay & Red Supernatural Tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/60" />
          <div className="absolute inset-0 horror-vignette opacity-70" />

          {/* Glowing Math Runes floating in Scene */}
          <div className="absolute inset-0 pointer-events-none opacity-30 font-mono text-xs sm:text-sm text-red-400">
            <span className="absolute top-[18%] left-[12%] animate-pulse">
              {currentIdx === 0 && '21:00 PM · SCHOOL LOCKED'}
              {currentIdx === 1 && 'f(x) = CURSE + GHOST'}
              {currentIdx === 2 && 'EMF FREQ: 980 MHz'}
              {currentIdx === 3 && 'READY FOR AR HUNT'}
            </span>
          </div>

          {/* Dynamic Subtitle Display on Screen */}
          <div className="relative z-10 p-6 sm:p-8 max-w-2xl mx-auto text-center flex flex-col items-center justify-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-mono tracking-wider drop-shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-red-400 animate-spin" />
              <span>{scene.subtitle}</span>
            </div>

            {/* Subtitle Line with Glowing Highlight */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/85 border border-red-950/80 shadow-[0_0_30px_rgba(0,0,0,0.9)] backdrop-blur-md max-w-xl">
              <p className="text-base sm:text-xl font-bold text-white leading-relaxed font-serif tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                "{scene.subtitles[activeSubtitleIdx] || scene.narrative}"
              </p>
            </div>

            {/* Speaking Status Pill */}
            <div className="flex items-center gap-2 text-xs font-mono text-red-300/80">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>
                {isPlaying ? 'กำลังบรรยายเสียงพากย์...' : 'จบการบรรยายฉากนี้'}
              </span>
            </div>
          </div>

          {/* Scene Progress Indicators (Dots) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-red-950/60">
            {STORY_SCENES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  sounds.playClick();
                  setCurrentIdx(idx);
                }}
                className={`transition-all ${
                  currentIdx === idx
                    ? 'w-6 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                    : 'w-2 h-2 rounded-full bg-slate-700 hover:bg-slate-500'
                }`}
                title={`ข้ามไปยัง ${s.chapter}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 sm:p-5 bg-black/95 border-t border-red-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Checkbox: Show auto on game start */}
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoShowNextTime}
              onChange={(e) => handleToggleAutoShow(e.target.checked)}
              className="rounded bg-slate-900 border-red-950 text-red-600 focus:ring-red-500"
            />
            <span>แสดงเรื่องเล่าบทนำนี้ก่อนเริ่มเล่นเสมอ</span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {currentIdx > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>
            )}

            {currentIdx < STORY_SCENES.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white text-xs sm:text-sm font-bold font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400/50 active:scale-95 transition-all"
              >
                <span>ฉากต่อไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishAndHunt}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs sm:text-sm font-bold font-mono flex items-center gap-2 shadow-[0_0_25px_rgba(239,68,68,0.6)] border border-red-300/80 active:scale-95 transition-all"
              >
                <span>เข้าสู่การล่าวิญญาณ [START HUNT]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Quick Skip to Game */}
            {currentIdx < STORY_SCENES.length - 1 && (
              <button
                onClick={handleFinishAndHunt}
                className="px-3 py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors underline"
              >
                ข้ามเข้าเกม
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
