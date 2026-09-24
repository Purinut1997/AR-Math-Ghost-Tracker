import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, HelpCircle, CheckCircle2, AlertCircle, RefreshCw, PenTool, Flame, Ghost, BookOpen, Volume2, Camera } from 'lucide-react';
import { GhostEncounter, PlayerInventory, ItemType } from '../types';
import { sounds } from '../utils/audio';
import { ScratchpadModal } from './ScratchpadModal';
import { speakGhostVoice, stopGhostVoice } from '../utils/progression';

interface GhostEncounterModalProps {
  encounter: GhostEncounter | null;
  isOpen: boolean;
  onClose: () => void;
  onExorcised: (encounter: GhostEncounter, attempts: number, isDoubleReward?: boolean) => void;
  onFailed?: () => void;
  timedMode?: boolean;
  inventory?: PlayerInventory;
  onUseItem?: (item: ItemType) => boolean;
  onOpenPolaroid?: (encounter: GhostEncounter) => void;
}

export const GhostEncounterModal: React.FC<GhostEncounterModalProps> = ({
  encounter,
  isOpen,
  onClose,
  onExorcised,
  onFailed,
  timedMode = true,
  inventory = { talisman: 1, hourglass: 1, uv_light: 1, holy_water: 1, salt_barrier: 1 },
  onUseItem,
  onOpenPolaroid,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [isJumpscareActive, setIsJumpscareActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHolyWaterActive, setIsHolyWaterActive] = useState(false);
  const [isSaltBarrierActive, setIsSaltBarrierActive] = useState(false);
  const isProcessedRef = useRef(false);

  const triggerJumpscare = () => {
    setIsJumpscareActive(true);
    if (sounds.horrorStyle === 'realistic') {
      sounds.playHorrorStinger();
      setTimeout(() => {
        sounds.playGhostAppears();
      }, 180);
    } else {
      sounds.playGhostAppears();
      sounds.playBoo();
    }
    setTimeout(() => {
      setIsJumpscareActive(false);
    }, 450);
  };

  useEffect(() => {
    if (isOpen && encounter) {
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setIsTimedOut(false);
      setAttempts(0);
      setWrongChoices([]);
      setTimeLeft(60);
      setShowHint(false);
      setHintMessage(null);
      setIsHolyWaterActive(false);
      setIsSaltBarrierActive(false);
      isProcessedRef.current = false;
      
      // Trigger encounter revelation jumpscare
      triggerJumpscare();
    }
    return () => {
      stopGhostVoice();
    };
  }, [isOpen, encounter]);

  const handleVoiceSpeak = () => {
    sounds.playClick();
    if (isSpeaking) {
      stopGhostVoice();
      setIsSpeaking(false);
      return;
    }
    if (encounter?.narrative) {
      setIsSpeaking(true);
      sounds.playGhostWhisper();
      speakGhostVoice(encounter.narrative, () => setIsSpeaking(false));
    }
  };

  // Timer countdown if timed mode is enabled and not answered
  useEffect(() => {
    if (!isOpen || !timedMode || isAnswered || isTimedOut) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        // Heartbeat tension when time is running out (under 15s)
        if (next <= 15 && next > 0) {
          sounds.playHeartbeat(next <= 6 ? 1.4 : 0.9);
        }
        return Math.max(0, next);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timedMode, isAnswered, isTimedOut]);

  // Handle timeout event cleanly outside state updater
  useEffect(() => {
    if (isOpen && timedMode && timeLeft === 0 && !isTimedOut && !isAnswered) {
      setIsTimedOut(true);
      sounds.playGhostAnger();
      onFailed?.();
    }
  }, [timeLeft, isOpen, timedMode, isTimedOut, isAnswered, onFailed]);

  if (!isOpen || !encounter) return null;

  const handleSelectChoice = (choice: number) => {
    if (isAnswered || isTimedOut || isProcessedRef.current) return;
    sounds.playClick();
    setSelectedAnswer(choice);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (Number(choice) === Number(encounter.correct_answer)) {
      isProcessedRef.current = true;
      setIsAnswered(true);
      setIsCorrect(true);
      // Play exorcism purification bell + sparkle + voice
      sounds.playPurifySuccess();
      setTimeout(() => {
        sounds.playGhostVoicePurified();
      }, 700);

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });

      onExorcised(encounter, newAttempts, isHolyWaterActive);
    } else {
      sounds.playWrongAnswer();
      setTimeout(() => {
        sounds.playGhostVoiceWrong();
      }, 500);
      setWrongChoices((prev) => [...prev, choice]);
      if (isSaltBarrierActive) {
        setHintMessage('🧂 ม่านเกลือศักดิ์สิทธิ์ปกป้องสตรีคของคุณไว้ ไม่ให้สูญหาย!');
      } else if (onFailed) {
        onFailed();
      }
    }
  };

  // Quick Item Usage Handlers
  const handleUseTalisman = () => {
    if (isAnswered || isTimedOut) return;
    if ((inventory.talisman || 0) <= 0) {
      sounds.playWrongAnswer();
      return;
    }
    if (onUseItem && onUseItem('talisman')) {
      sounds.playTalismanBurn();
      // Eliminate up to 2 wrong choices safely comparing numbers
      const wrongAvailable = encounter.choices.filter(
        (c) => Number(c) !== Number(encounter.correct_answer) && !wrongChoices.includes(c)
      );
      const toEliminate = wrongAvailable.slice(0, 2);
      setWrongChoices((prev) => [...prev, ...toEliminate]);
    }
  };

  const handleUseHourglass = () => {
    if (isAnswered || isTimedOut || !timedMode) return;
    if ((inventory.hourglass || 0) <= 0) {
      sounds.playWrongAnswer();
      return;
    }
    if (onUseItem && onUseItem('hourglass')) {
      sounds.playItemUse();
      setTimeLeft((prev) => prev + 30);
    }
  };

  const handleUseUV = () => {
    if (isAnswered || isTimedOut) return;
    if ((inventory.uv_light || 0) <= 0) {
      sounds.playWrongAnswer();
      return;
    }
    if (onUseItem && onUseItem('uv_light')) {
      sounds.playItemUse();
      // Generate a dynamic hint based on the question and correct answer
      const lastDigit = Math.abs(Math.round(Number(encounter.correct_answer)) % 10);
      const hint = `แสง UV ส่องเห็นรหัสลับ: คำตอบของสมการนี้ลงท้ายด้วยเลข ${lastDigit}!`;
      setHintMessage(hint);
    }
  };

  const handleUseHolyWater = () => {
    if (isAnswered || isTimedOut || isHolyWaterActive) return;
    if ((inventory.holy_water || 0) <= 0) {
      sounds.playWrongAnswer();
      return;
    }
    if (onUseItem && onUseItem('holy_water')) {
      sounds.playHolyWater();
      setIsHolyWaterActive(true);
      setHintMessage('🍶 ชำระล้างด้วยน้ำมนต์ศักดิ์สิทธิ์! หากสะกดวิญญาณได้ จะได้รับแต้มและ EXP คูณ 2!');
    }
  };

  const handleUseSaltBarrier = () => {
    if (isAnswered || isTimedOut || isSaltBarrierActive) return;
    if ((inventory.salt_barrier || 0) <= 0) {
      sounds.playWrongAnswer();
      return;
    }
    if (onUseItem && onUseItem('salt_barrier')) {
      sounds.playItemUse();
      setIsSaltBarrierActive(true);
      const wrongAvailable = encounter.choices.filter(
        (c) => Number(c) !== Number(encounter.correct_answer) && !wrongChoices.includes(c)
      );
      if (wrongAvailable.length > 0) {
        setWrongChoices((prev) => [...prev, wrongAvailable[0]]);
      }
      setHintMessage('🧂 โรยม่านเกลือศักดิ์สิทธิ์! ป้องกันสตรีคไม่ให้ขาดหากตอบผิด และตัด 1 ช้อยส์ลวงแล้ว!');
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-lg overflow-y-auto">
      {/* Creepy ambient vignette overlay in modal */}
      <div className="absolute inset-0 horror-vignette pointer-events-none" />

      {/* Red Jumpscare Shockwave & Glitch Flash */}
      {isJumpscareActive && (
        <div className="absolute inset-0 z-50 pointer-events-none glitch-flash bg-red-950/70 mix-blend-color-dodge flex items-center justify-center">
          <div className="w-full h-full bg-red-600/30 backdrop-blur-[2px]" />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,0,0.8) 4px, rgba(0,0,0,0.9) 6px)',
            }}
          />
        </div>
      )}

      <div
        className={`relative w-full max-w-xl max-h-[92vh] flex flex-col bg-slate-950/95 border border-red-950/80 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(239,68,68,0.25)] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 ${
          isJumpscareActive ? 'jumpscare-shake ring-4 ring-red-600/80' : ''
        }`}
      >
        {/* Background photo preview with dark vignette & horror tint */}
        {encounter.imageSnapshot && (
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <img
              src={encounter.imageSnapshot}
              alt="Snapshot"
              className="w-full h-full object-cover filter blur-[3px] grayscale contrast-150"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
          </div>
        )}

        {/* Top Header / Scanner Frequency (Sticky, No Overlap) */}
        <div className="relative z-10 px-4 py-3 flex items-center justify-between border-b border-red-950/70 bg-black/60 shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
            <span className="text-xs font-mono tracking-wider text-red-400 font-bold uppercase truncate drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]">
              ⚠️ คำสาปวิญญาณ · ชั้น {encounter.gradeLevel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {timedMode && !isAnswered && (
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  timeLeft <= 10
                    ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
                    : 'bg-slate-900 border border-slate-700 text-slate-300'
                }`}
              >
                ⏱️ {timeLeft}s
              </span>
            )}
            <button
              onClick={() => {
                sounds.playClick();
                setShowScratchpad(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-700/60 rounded-lg text-xs font-medium transition-colors active:scale-95 shadow-sm"
              title="เปิดกระดานทดเลข"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>กระดานทด</span>
            </button>
          </div>
        </div>

        {/* Hunter's Quick Bag (Use Items in battle) (Sticky, Scrollable horizontally if needed) */}
        {!isAnswered && (
          <div className="relative z-10 px-3 sm:px-4 py-2 flex items-center justify-between bg-black/50 border-b border-red-950/40 shrink-0 gap-2 overflow-x-auto select-none">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">🎒 ไอเทมช่วย:</span>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={handleUseTalisman}
                disabled={(inventory.talisman || 0) <= 0}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border transition-all ${
                  (inventory.talisman || 0) > 0
                    ? 'bg-red-950/70 hover:bg-red-900 border-red-700 text-red-200 active:scale-95'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                }`}
                title="ยันต์ตัดตัวเลือกผิด 2 ข้อ"
              >
                <span>📿 ตัดช้อยส์</span>
                <span className="font-mono text-[10px] font-bold text-amber-400">({inventory.talisman || 0})</span>
              </button>

              {timedMode && (
                <button
                  onClick={handleUseHourglass}
                  disabled={(inventory.hourglass || 0) <= 0}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border transition-all ${
                    (inventory.hourglass || 0) > 0
                      ? 'bg-amber-950/70 hover:bg-amber-900 border-amber-700 text-amber-200 active:scale-95'
                      : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                  title="เพิ่มเวลาคิดเลข 30 วินาที"
                >
                  <span>⏳ +30วิ</span>
                  <span className="font-mono text-[10px] font-bold text-amber-400">({inventory.hourglass || 0})</span>
                </button>
              )}

              <button
                onClick={handleUseUV}
                disabled={(inventory.uv_light || 0) <= 0}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border transition-all ${
                  (inventory.uv_light || 0) > 0
                    ? 'bg-purple-950/70 hover:bg-purple-900 border-purple-700 text-purple-200 active:scale-95'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                }`}
                title="ส่องหาตัวเลขหลักหน่วยของคำตอบ"
              >
                <span>🔦 แสง UV</span>
                <span className="font-mono text-[10px] font-bold text-amber-400">({inventory.uv_light || 0})</span>
              </button>

              <button
                onClick={handleUseHolyWater}
                disabled={(inventory.holy_water || 0) <= 0 || isHolyWaterActive}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border transition-all ${
                  isHolyWaterActive
                    ? 'bg-cyan-900 border-cyan-400 text-cyan-200 font-bold ring-2 ring-cyan-500/50'
                    : (inventory.holy_water || 0) > 0
                    ? 'bg-cyan-950/70 hover:bg-cyan-900 border-cyan-700 text-cyan-200 active:scale-95'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                }`}
                title="ดื่มน้ำมนต์รับ EXP และแต้ม x2 เมื่อปราบสำเร็จ"
              >
                <span>🍶 น้ำมนต์ x2</span>
                <span className="font-mono text-[10px] font-bold text-cyan-300">
                  {isHolyWaterActive ? '✓' : `(${inventory.holy_water || 0})`}
                </span>
              </button>

              <button
                onClick={handleUseSaltBarrier}
                disabled={(inventory.salt_barrier || 0) <= 0 || isSaltBarrierActive}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border transition-all ${
                  isSaltBarrierActive
                    ? 'bg-emerald-900 border-emerald-400 text-emerald-200 font-bold ring-2 ring-emerald-500/50'
                    : (inventory.salt_barrier || 0) > 0
                    ? 'bg-emerald-950/70 hover:bg-emerald-900 border-emerald-700 text-emerald-200 active:scale-95'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                }`}
                title="โรยม่านเกลือปกป้องสตรีคและตัด 1 ช้อยส์ลวง"
              >
                <span>🧂 ม่านเกลือ</span>
                <span className="font-mono text-[10px] font-bold text-emerald-300">
                  {isSaltBarrierActive ? '✓' : `(${inventory.salt_barrier || 0})`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Encounter Content Body */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-3 space-y-3">

        {hintMessage && !isAnswered && (
          <div className="relative z-10 mx-5 mt-2.5 p-2.5 bg-purple-950/80 border border-purple-600/70 rounded-xl text-center text-xs text-purple-200 font-mono shadow-md animate-in fade-in">
            {hintMessage}
          </div>
        )}

        {/* Ghost Avatar & Title */}
        <div className="relative z-10 px-5 pt-4 text-center">
          <button
            onClick={() => triggerJumpscare()}
            title="แตะเพื่อรับสัมผัสจังหวะตกใจ (Jumpscare Reaction)"
            className="group relative inline-block my-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            {/* Spectral Aura */}
            <div
              className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
                isCorrect
                  ? 'bg-yellow-400/50 scale-150 animate-pulse'
                  : 'bg-red-600/35 animate-pulse scale-125 group-hover:scale-140'
              }`}
            />
            <div
              className={`relative text-7xl select-none transition-transform duration-500 spooky-float`}
            >
              {isCorrect ? '✨' + encounter.ghost_emoji : encounter.ghost_emoji}
            </div>

            {/* Tap to scare badge */}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/90 border border-red-900/80 text-[10px] text-red-300 font-mono px-2.5 py-0.5 rounded-full whitespace-nowrap opacity-85 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-md shadow-black">
              ⚡ สัมผัสจังหวะหลอน (Jumpscare)
            </span>
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {encounter.ghost_type}
          </h2>

          {/* Narrative Speech Bubble */}
          <div className="mt-3 mx-auto max-w-md p-3.5 rounded-2xl bg-black/80 border border-red-950/90 text-slate-300 text-sm leading-relaxed shadow-xl relative backdrop-blur-sm">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rotate-45 border-l border-t border-red-950/90" />
            <div className="flex items-start justify-between gap-2.5">
              <p className="italic text-slate-200 flex-1">
                "{encounter.narrative}"
              </p>
              <button
                type="button"
                onClick={handleVoiceSpeak}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-mono transition-all active:scale-95 ${
                  isSpeaking
                    ? 'bg-red-600 border-red-500 text-white animate-pulse'
                    : 'bg-red-950/70 hover:bg-red-900 border-red-700/60 text-red-300'
                }`}
                title="ฟังเสียงหลอนวิญญาณพูด"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{isSpeaking ? 'กำลังพูด...' : 'ฟังเสียง'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Math Curse Section */}
        <div className="relative z-10 px-5 py-4">
          <div className="p-4 rounded-2xl bg-black/90 border border-red-900/50 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base text-red-500">📜</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                สมการสะกดวิญญาณ (จงแก้ปริศนาเพื่อปลดปล่อย)
              </span>
            </div>
            <p className="text-base sm:text-lg font-medium text-white leading-relaxed font-mono">
              {encounter.math_question}
            </p>
          </div>

          {/* Result Banner if answered */}
          {isAnswered && isCorrect ? (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-center animate-in fade-in slide-in-from-bottom-2 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-base sm:text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                คำสาปถูกชำระล้างแล้ว! วิญญาณสู่สุคติ!
              </div>
              <p className="text-xs text-emerald-200/90 mt-1">
                วิญญาณขอบคุณเธอที่ช่วยคิดคำตอบที่ถูกต้อง ({encounter.correct_answer}) ได้รับแต้มคะแนนสะสม!
              </p>

              {/* Step-by-step Solution Breakdown */}
              <div className="mt-3.5 p-3 rounded-2xl bg-black/70 border border-emerald-500/50 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-mono">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>📜 คัมภีร์ถอดรหัสคำสาป (วิธีคิดละเอียด)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                    เฉลย: {encounter.correct_answer}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {(encounter.explanation_steps && encounter.explanation_steps.length > 0
                    ? encounter.explanation_steps
                    : [
                        `วิเคราะห์โจทย์: ${encounter.math_question}`,
                        `คำนวณตามหลักคณิตศาสตร์จนได้ผลลัพธ์`,
                        `ดังนั้นคำตอบที่ถูกต้องคือ ${encounter.correct_answer}`,
                      ]
                  ).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed text-slate-200">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Polaroid & Continue */}
              <div className="mt-3.5 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenPolaroid?.(encounter);
                  }}
                  className="w-full sm:flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-red-800 hover:border-red-600 text-rose-300 font-bold rounded-xl transition-all active:scale-98 text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Camera className="w-4 h-4 text-rose-400" />
                  <span>📸 บันทึกรูปโพลารอยด์</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                  }}
                  className="w-full sm:flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-98 text-xs"
                >
                  เข้าสู่สมุดวิญญาณ & ล่าต่อ ➔
                </button>
              </div>
            </div>
          ) : isTimedOut ? (
            <div className="mt-4 p-4 rounded-2xl bg-red-950/90 border border-red-500/80 text-center animate-in fade-in slide-in-from-bottom-2 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              <div className="flex items-center justify-center gap-2 text-red-300 font-bold text-base sm:text-lg">
                <AlertCircle className="w-6 h-6 text-red-400 animate-pulse" />
                เวลาหมดแล้ว! วิญญาณหลบหนีไปในเงามืด!
              </div>
              <p className="text-xs text-red-200/90 mt-1">
                คำสาปสลายหายไปพร้อมกับวิญญาณ คำตอบที่ถูกต้องคือ ({encounter.correct_answer}) ไม่เป็นไรนะ มาดูวิธีคิดกัน!
              </p>

              {/* Step-by-step Solution Breakdown for Timeout */}
              <div className="mt-3.5 p-3 rounded-2xl bg-black/70 border border-red-500/50 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>📜 คัมภีร์เฉลยวิธีคิดเพื่อเรียนรู้</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-700/60 font-mono">
                    คำตอบ: {encounter.correct_answer}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {(encounter.explanation_steps && encounter.explanation_steps.length > 0
                    ? encounter.explanation_steps
                    : [
                        `วิเคราะห์โจทย์: ${encounter.math_question}`,
                        `คำนวณตามหลักคณิตศาสตร์จนได้ผลลัพธ์`,
                        `ดังนั้นคำตอบที่ถูกต้องคือ ${encounter.correct_answer}`,
                      ]
                  ).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed text-slate-200">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="mt-4 w-full py-3 bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-98 text-sm font-mono"
              >
                ออกค้นหาวิญญาณตัวใหม่ ➔
              </button>
            </div>
          ) : (
            /* Choices Grid */
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2.5">
                {encounter.choices.map((choice, index) => {
                  const isWrong = wrongChoices.includes(choice);
                  const isSelected = selectedAnswer === choice;

                  return (
                    <button
                      key={index}
                      disabled={isWrong || isAnswered || isTimedOut}
                      onClick={() => handleSelectChoice(choice)}
                      className={`group relative p-4 rounded-xl border text-center transition-all ${
                        isWrong
                          ? 'bg-red-950/60 border-red-900/80 text-red-500 line-through opacity-50 cursor-not-allowed'
                          : isSelected && isCorrect
                          ? 'bg-emerald-700 border-emerald-400 text-white font-bold scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                          : 'bg-slate-900/90 hover:bg-slate-800 border-red-950/80 hover:border-red-600/70 text-slate-100 active:scale-95 shadow-md'
                      }`}
                    >
                      <span className="text-xs text-red-400/80 font-mono block mb-1">
                        ยันต์ผนึกที่ {index + 1}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold font-mono">
                        {choice}
                      </span>
                    </button>
                  );
                })}
              </div>

              {wrongChoices.length > 0 && !isCorrect && (
                <div className="mt-3 flex items-center justify-between text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>คำตอบยังไม่ถูกต้อง ลองคิดทบทวนดูอีกครั้งนะ!</span>
                  </div>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="underline text-amber-300 hover:text-white shrink-0 font-medium"
                  >
                    {showHint ? 'ซ่อนคำใบ้' : 'ขอคำใบ้'}
                  </button>
                </div>
              )}

              {showHint && !isCorrect && (
                <div className="mt-2 p-3 bg-slate-800/90 rounded-xl text-xs text-slate-300 border border-slate-700">
                  💡 <span className="font-semibold text-emerald-400">คำใบ้ผู้คุมเกม:</span>{' '}
                  ลองเปิด <strong>กระดานทดเลข</strong> ที่มุมขวาบนเพื่อเขียนตั้งบวก/ลบ/คูณ/หารทีละขั้นตอนดูสิ!
                </div>
              )}
            </div>
          )}
        </div>
        </div>

        {/* Footer info (Sticky, Never Overlapped) */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>👻 จำนวนครั้งที่ตอบ: {attempts}</span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              if (!isAnswered) {
                onFailed?.();
              }
              onClose();
            }}
            className="hover:text-red-400 text-slate-400 transition-colors py-1 px-2"
          >
            หนีออกจากพื้นที่ (ยอมแพ้)
          </button>
        </div>
      </div>

      {/* Scratchpad whiteboard modal */}
      <ScratchpadModal
        isOpen={showScratchpad}
        onClose={() => setShowScratchpad(false)}
        mathQuestion={encounter.math_question}
      />
    </div>
  );
};
