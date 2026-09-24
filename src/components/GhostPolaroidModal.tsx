import React, { useRef, useState } from 'react';
import { GhostEncounter } from '../types';
import { X, Download, Share2, Sparkles, Check, Camera } from 'lucide-react';
import { sounds } from '../utils/audio';

interface GhostPolaroidModalProps {
  encounter: GhostEncounter;
  playerName?: string;
  isOpen?: boolean;
  onClose: () => void;
}

export const GhostPolaroidModal: React.FC<GhostPolaroidModalProps> = ({
  encounter,
  playerName = 'นักล่าวิญญาณแห่งโรงเรียนร้าง',
  isOpen = true,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const formattedDate = new Date(encounter.timestamp).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDownload = () => {
    sounds.playClick();
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 640;
      const height = 800;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setDownloading(false);
        return;
      }

      // 1. Polaroid White Frame
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Subtle vintage texture / border
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, width - 8, height - 8);

      // 2. Photo Area (Dark eerie background)
      const photoX = 40;
      const photoY = 40;
      const photoW = width - 80;
      const photoH = 540;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(photoX, photoY, photoW, photoH);

      const renderCardRest = () => {
        // Overlay vignette on photo
        const grad = ctx.createRadialGradient(
          photoX + photoW / 2,
          photoY + photoH / 2,
          photoW / 4,
          photoX + photoW / 2,
          photoY + photoH / 2,
          photoW / 1.5
        );
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = grad;
        ctx.fillRect(photoX, photoY, photoW, photoH);

        // Ghost Emoji
        ctx.font = '80px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(encounter.ghost_emoji, photoX + photoW / 2, photoY + photoH / 2 - 20);

        // Red Rubber Stamp "สะกดสำเร็จ / EXORCISED"
        ctx.save();
        ctx.translate(photoX + photoW - 130, photoY + 110);
        ctx.rotate((-18 * Math.PI) / 180);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 5;
        ctx.strokeRect(-100, -35, 200, 70);

        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 22px monospace';
        ctx.fillText('EXORCISED', 0, -5);
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('สะกดสำเร็จ', 0, 18);
        ctx.restore();

        // Target Stamp at bottom photo
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(photoX, photoY + photoH - 45, photoW, 45);

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`● CLASSIFIED #${encounter.id.slice(-6)}`, photoX + 15, photoY + photoH - 18);

        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'right';
        ctx.fillText(`ชั้น ${encounter.gradeLevel}`, photoX + photoW - 15, photoY + photoH - 18);

        // 3. Bottom Polaroid Handwritten Notes
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(encounter.ghost_type, photoX + 5, photoY + photoH + 50);

        ctx.fillStyle = '#475569';
        ctx.font = '16px sans-serif';
        ctx.fillText(`ผู้ปราบ: ${playerName}`, photoX + 5, photoY + photoH + 85);
        ctx.fillText(`วันเวลา: ${formattedDate}`, photoX + 5, photoY + photoH + 115);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 14px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('AR Math Ghost Tracker', photoX + photoW - 5, photoY + photoH + 115);

        // Trigger download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `ghost-polaroid-${encounter.id}.png`;
        link.href = dataUrl;
        link.click();
        setDownloading(false);
      };

      if (encounter.imageSnapshot) {
        const img = new Image();
        if (encounter.imageSnapshot.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => {
          ctx.drawImage(img, photoX, photoY, photoW, photoH);
          renderCardRest();
        };
        img.onerror = () => {
          renderCardRest();
        };
        img.src = encounter.imageSnapshot;
      } else {
        renderCardRest();
      }
    } catch {
      setDownloading(false);
    }
  };

  const handleCopyShare = async () => {
    sounds.playClick();
    const shareText = `👻 ข้าได้ปราบ "${encounter.ghost_type}" คำสาปวิชาคณิตศาสตร์ชั้น ${encounter.gradeLevel} ใน AR Math Ghost Tracker แล้ว! 🏆 มาลองปราบผีด้วยกันเลย!`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white bg-slate-900/80 rounded-full border border-slate-700 transition-colors"
          title="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Polaroid Card Frame */}
        <div
          ref={cardRef}
          className="w-full bg-slate-100 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(239,68,68,0.2)] border-2 border-slate-300 relative select-none transform hover:scale-[1.01] transition-transform"
        >
          {/* Top Tape Decal */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/60 border border-amber-300/60 rotate-1 shadow-xs" />

          {/* Photo Window */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 border border-slate-700/80 shadow-inner flex items-center justify-center">
            {encounter.imageSnapshot ? (
              <img
                src={encounter.imageSnapshot}
                alt="Ghost Snapshot"
                className="w-full h-full object-cover filter contrast-125 brightness-90"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-950 via-red-950/60 to-black flex items-center justify-center" />
            )}

            {/* Ghost Avatar Float */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-6xl drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse">
                {encounter.ghost_emoji}
              </span>
            </div>

            {/* Red Stamp EXORCISED */}
            <div className="absolute top-4 right-4 pointer-events-none transform -rotate-12 border-4 border-red-600 bg-red-600/10 px-3 py-1 rounded shadow-lg">
              <span className="block font-mono text-red-600 font-extrabold text-xs tracking-wider">
                EXORCISED
              </span>
              <span className="block text-[10px] text-red-600 font-bold text-center">
                สะกดสำเร็จ
              </span>
            </div>

            {/* Bottom Photo HUD strip */}
            <div className="absolute bottom-0 inset-x-0 bg-black/75 px-3 py-1 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="text-red-400 font-bold">● CLASSIFIED</span>
              <span className="text-emerald-400 font-bold">ชั้น {encounter.gradeLevel}</span>
            </div>
          </div>

          {/* Handwritten Note Area */}
          <div className="mt-3 pt-2 text-slate-800 space-y-1">
            <h3 className="font-bold text-lg text-slate-900 leading-tight">
              {encounter.ghost_type}
            </h3>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <span className="font-medium text-slate-700">ผู้สะกด:</span> {playerName}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-300/80">
              <span>{formattedDate}</span>
              <span className="font-mono text-slate-400">AR Math Ghost Tracker</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full mt-4 flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/40 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'กำลังบันทึกภาพ...' : 'บันทึกรูปภาพ (PNG)'}</span>
          </button>

          <button
            onClick={handleCopyShare}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors active:scale-95"
            title="คัดลอกข้อความแชร์"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-xs">คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-300" />
                <span>แชร์</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
