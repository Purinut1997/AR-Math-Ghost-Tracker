import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, PenTool, Eraser } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mathQuestion: string;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({
  isOpen,
  onClose,
  mathQuestion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#f8fafc'); // chalk white
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize canvas to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : color;
    ctx.lineWidth = isEraser ? 28 : lineWidth;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <div>
              <h3 className="text-sm font-semibold text-emerald-400">กระดานทดเลขปราบผี</h3>
              <p className="text-xs text-slate-400 line-clamp-1">{mathQuestion}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 bg-slate-800/80 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEraser(false);
                sounds.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                !isEraser ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              ชอล์ก
            </button>
            <button
              onClick={() => {
                setIsEraser(true);
                sounds.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                isEraser ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              แปรงลบ
            </button>
          </div>

          {/* Color picks */}
          {!isEraser && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">สี:</span>
              {[
                { label: 'ขาว', hex: '#f8fafc' },
                { label: 'เขียวเรืองแสง', hex: '#34d399' },
                { label: 'เหลืองทอง', hex: '#fbbf24' },
                { label: 'ฟ้าวิญญาณ', hex: '#38bdf8' },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    setColor(c.hex);
                    sounds.playClick();
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    color === c.hex ? 'scale-110 border-white' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          )}

          <button
            onClick={clearCanvas}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 transition-colors font-medium ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            ล้างกระดาน
          </button>
        </div>

        {/* Canvas area (Blackboard look) */}
        <div className="relative flex-1 min-h-[320px] bg-slate-950 p-2 overflow-hidden touch-none cursor-crosshair">
          {/* Subtle chalkboard texture grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full block rounded-xl"
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl shadow-lg transition-transform active:scale-95 text-sm"
          >
            พร้อมตอบคำถามแล้ว!
          </button>
        </div>
      </div>
    </div>
  );
};
