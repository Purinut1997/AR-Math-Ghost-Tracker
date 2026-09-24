import React, { useRef, useState, useEffect } from 'react';
import { X, Share2, Award, Sparkles, CheckCircle2, ShieldCheck, Printer, Edit2, Check } from 'lucide-react';
import { PlayerStats } from '../types';
import { sounds } from '../utils/audio';
import { getRankByExp } from '../utils/progression';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  playerName?: string;
  onUpdatePlayerName?: (name: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  stats,
  playerName = 'ยอดนักสืบวิญญาณแห่งโรงเรียน',
  onUpdatePlayerName,
}) => {
  const certRef = useRef<HTMLDivElement | null>(null);
  const [currentName, setCurrentName] = useState(playerName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const rankInfo = getRankByExp(stats.exp || 0);

  useEffect(() => {
    setCurrentName(playerName);
  }, [playerName]);

  if (!isOpen) return null;

  const dateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    if (onUpdatePlayerName && currentName.trim()) {
      onUpdatePlayerName(currentName.trim());
    }
  };

  const handleShare = async () => {
    sounds.playFanfare();
    const shareText = `ฉันปลดปล่อยวิญญาณคณิตศาสตร์ได้แล้ว ${stats.ghostsExorcised} ตน (ระดับ: ${stats.rank}) ในเกม AR Math Ghost Tracker!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ใบประกาศนียบัตรปราบผีคณิตศาสตร์',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} - มาลองเล่นกันเลยที่: ${window.location.href}`);
        setToastMessage('คัดลอกข้อความและลิงก์ความสำเร็จลงคลิปบอร์ดแล้ว!');
      } catch {
        setToastMessage(`สถิติของคุณ: ปลดปล่อยแล้ว ${stats.ghostsExorcised} ตน (${stats.rank})`);
      }
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="absolute inset-0 horror-vignette pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-black/95 border border-amber-900/60 rounded-3xl shadow-[0_0_60px_rgba(217,119,6,0.25)] flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Modal Controls */}
        <div className="p-3 sm:p-4 border-b border-amber-950/60 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="text-sm sm:text-base font-bold text-amber-200 font-mono tracking-wide">
              ใบประกาศนียบัตรเกียรติคุณนักปราบผีคณิตศาสตร์
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-amber-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Printable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <div
            ref={certRef}
            className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1c1917] via-[#0c0a09] to-[#1c1917] border-4 border-double border-amber-600/70 text-center shadow-2xl overflow-hidden"
          >
            {/* Corner Filigrees / Ornaments */}
            <div className="absolute top-2 left-2 text-amber-500/60 text-lg font-serif">✥</div>
            <div className="absolute top-2 right-2 text-amber-500/60 text-lg font-serif">✥</div>
            <div className="absolute bottom-2 left-2 text-amber-500/60 text-lg font-serif">✥</div>
            <div className="absolute bottom-2 right-2 text-amber-500/60 text-lg font-serif">✥</div>

            {/* Inner Gold Border */}
            <div className="absolute inset-2 border border-amber-500/20 rounded-xl pointer-events-none" />

            {/* Academy Crest / Ghost Emblem */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-300 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] mb-3">
              <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-3xl">
                👻
              </div>
            </div>

            <p className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold mb-1">
              ACADEMY OF MATHEMATICAL OCCULT SCIENCES
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-amber-100 font-serif tracking-wide drop-shadow-md">
              ใบประกาศนียบัตรเกียรติยศ
            </h1>
            <p className="text-xs text-amber-300/80 italic mt-0.5">
              AR Math Ghost Tracker: ตำนานสมการซ่อนแอบ
            </p>

            <div className="my-5 py-3 border-y border-amber-700/30">
              <p className="text-xs text-stone-400 mb-1">ขอมอบประกาศนียบัตรฉบับนี้เพื่อยกย่องให้แก่</p>
              
              {isEditingName ? (
                <div className="flex items-center justify-center gap-2 max-w-sm mx-auto my-1">
                  <input
                    type="text"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    maxLength={30}
                    placeholder="พิมพ์ชื่อของคุณ..."
                    autoFocus
                    className="px-3 py-1.5 rounded-xl bg-stone-900 border border-amber-500 text-amber-200 text-sm font-bold text-center w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl transition-transform active:scale-95"
                    title="บันทึกชื่อ"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 group">
                  <h2 className="text-lg sm:text-2xl font-bold tracking-wide font-serif text-amber-300">
                    "{currentName}"
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="opacity-60 group-hover:opacity-100 p-1 text-amber-400 hover:text-white transition-opacity"
                    title="แก้ไขชื่อผู้รับเกียรติบัตร"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="text-xs text-stone-300 max-w-md mx-auto mt-2 leading-relaxed">
                ผู้มีความกล้าหาญและสติปัญญาอันเฉียบแหลม สามารถถอดรหัสคำสาปสมการตัวเลข ปลดปล่อยวิญญาณแห่งโรงเรียนร้างสู่สุคติได้สำเร็จ
              </p>
            </div>

            {/* Stats Summary Grid in Certificate */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4 max-w-md mx-auto">
              <div className="p-2 sm:p-2.5 rounded-xl bg-stone-900/80 border border-amber-700/40">
                <span className="text-[10px] text-stone-400 block font-mono">วิญญาณสู่สุคติ</span>
                <span className="text-base sm:text-lg font-bold text-amber-300 font-mono">
                  {stats.ghostsExorcised} ตน
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-stone-900/80 border border-amber-700/40">
                <span className="text-[10px] text-stone-400 block font-mono">คะแนนพลังปัญญา</span>
                <span className="text-base sm:text-lg font-bold text-yellow-400 font-mono">
                  {stats.score} แต้ม
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-stone-900/80 border border-amber-700/40">
                <span className="text-[10px] text-stone-400 block font-mono">ยศนักล่าวิญญาณ</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400 truncate block mt-0.5">
                  Lv.{rankInfo.currentRank.level} {rankInfo.currentRank.title} {rankInfo.currentRank.emoji}
                </span>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="mt-6 pt-4 border-t border-amber-800/20 flex items-center justify-between text-left text-[11px] text-stone-400 font-mono">
              <div>
                <p className="text-stone-300 font-bold">วันที่มีผลรับรอง:</p>
                <p>{dateStr}</p>
              </div>

              {/* Red Wax Seal */}
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-red-900 via-rose-700 to-red-600 border border-red-400 flex flex-col items-center justify-center text-white shadow-lg shadow-red-950 font-bold text-[8px] uppercase tracking-tighter">
                <span>SEAL OF</span>
                <span>MATH</span>
                <span>★ EXORCIST ★</span>
              </div>

              <div className="text-right">
                <p className="text-stone-300 font-bold">ผู้คุมเกม (Game Master):</p>
                <p className="text-amber-400/90 font-serif italic text-xs">ครูใหญ่ภาควิชาวิญญาณ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Alert Message if any */}
        {toastMessage && (
          <div className="mx-4 mb-2 p-2.5 rounded-xl bg-amber-950/90 border border-amber-600/80 text-amber-200 text-xs text-center font-mono animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 bg-slate-950 border-t border-amber-950/60 flex items-center justify-between gap-3">
          <p className="text-xs text-stone-400 hidden sm:block">
            🌟 ปลดปล่อยวิญญาณเพิ่มขึ้นเพื่ออัปเกรดระดับฉายาในใบประกาศ!
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-xl text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              พิมพ์ / บันทึก PDF
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-bold rounded-xl text-xs transition-transform active:scale-95 shadow-md shadow-amber-950"
            >
              <Share2 className="w-4 h-4" />
              แชร์ความสำเร็จ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
