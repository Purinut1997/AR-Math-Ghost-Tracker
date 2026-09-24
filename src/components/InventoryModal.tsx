import React, { useState } from 'react';
import { X, Backpack, Sparkles, Plus, AlertCircle, ShoppingBag } from 'lucide-react';
import { PlayerInventory, ItemType, InventoryItem } from '../types';
import { sounds } from '../utils/audio';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: PlayerInventory;
  score: number;
  onBuyItem: (itemId: ItemType, cost: number) => void;
}

export const ITEMS_CATALOG: InventoryItem[] = [
  {
    id: 'talisman',
    name: 'ยันต์ตัดคำสาป (Elimination Talisman)',
    emoji: '📿',
    description: 'ตัดตัวเลือกคำตอบที่ผิดออกไป 2 ข้อทันทีในระหว่างการสะกดวิญญาณ',
    count: 0,
    cost: 50,
  },
  {
    id: 'hourglass',
    name: 'นาฬิกาทรายหยุดวิญญาณ (Ghost Hourglass)',
    emoji: '⏳',
    description: 'เพิ่มเวลาคิดเลขให้ตัวเองอีก 30 วินาทีในโหมดจับเวลา',
    count: 0,
    cost: 40,
  },
  {
    id: 'uv_light',
    name: 'ไฟฉายส่องรหัสลับ (UV Revelation Lens)',
    emoji: '🔦',
    description: 'เผยคำใบ้วิธีคิดเลขที่ซ่อนอยู่บนตัววิญญาณ ช่วยให้หาคำตอบได้ง่ายขึ้น',
    count: 0,
    cost: 60,
  },
  {
    id: 'holy_water',
    name: 'น้ำมนต์สะกดวิญญาณ (Sacred Water)',
    emoji: '🍶',
    description: 'ชำระล้างคำสาป รับค่าประสบการณ์ EXP และแต้มคะแนนคูณ 2 เมื่อปราบผีสำเร็จ!',
    count: 0,
    cost: 75,
  },
  {
    id: 'salt_barrier',
    name: 'เกลือศักดิ์สิทธิ์สะกดวิญญาณ (Salt Barrier)',
    emoji: '🧂',
    description: 'คุ้มครองสตรีคไม่ให้หลุดแม้จะตอบผิด พร้อมตัด 1 ช้อยส์ที่ผิดออกไปทันที',
    count: 0,
    cost: 55,
  },
];

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  score,
  onBuyItem,
}) => {
  const [purchaseMsg, setPurchaseMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBuy = (item: InventoryItem) => {
    if (score < item.cost) {
      sounds.playWrongAnswer();
      setPurchaseMsg(`แต้มไม่เพียงพอ! ต้องการอีก ${item.cost - score} แต้ม (ตอบคำถามสะกดวิญญาณเพื่อรับแต้ม)`);
      setTimeout(() => setPurchaseMsg(null), 3000);
      return;
    }

    sounds.playItemUse();
    onBuyItem(item.id, item.cost);
    setPurchaseMsg(`ซื้อ "${item.name}" สำเร็จแล้ว!`);
    setTimeout(() => setPurchaseMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="absolute inset-0 horror-vignette pointer-events-none" />

      <div className="relative w-full max-w-lg bg-black/95 border border-red-950/80 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-red-950/80 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎒</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                กระเป๋าอุปกรณ์ปราบผี (Hunter's Arsenal)
              </h3>
              <p className="text-xs text-red-400 font-mono">
                ไอเทมเวทมนตร์ช่วยแก้คำสาปตัวเลข
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

        {/* Current Score Balance Strip */}
        <div className="p-3 bg-red-950/40 border-b border-red-950/70 flex items-center justify-between px-5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span>แต้มพลังปัญญาปัจจุบัน:</span>
            <span className="text-amber-400 font-mono font-bold text-sm">{score} แต้ม</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            ★ ปราบผีสำเร็จ = +70 ถึง 150 แต้ม (+โบนัสสตรีค)
          </span>
        </div>

        {purchaseMsg && (
          <div className="mx-4 mt-3 p-2.5 bg-red-950/80 border border-red-700/60 rounded-xl text-center text-xs text-red-200 animate-in fade-in">
            {purchaseMsg}
          </div>
        )}

        {/* Items List */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          {ITEMS_CATALOG.map((item) => {
            const currentCount = inventory[item.id] || 0;
            const canAfford = score >= item.cost;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-950/90 border border-red-950/80 hover:border-red-800/60 transition-colors flex items-center gap-3.5 shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-black border border-red-900/60 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  {item.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-lg shrink-0 ml-2">
                      มีอยู่: {currentCount} ชิ้น
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold font-mono shrink-0 transition-all flex flex-col items-center justify-center ${
                    canAfford
                      ? 'bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white shadow-md active:scale-95'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                  title={canAfford ? 'ซื้อไอเทม' : 'แต้มไม่พอ'}
                >
                  <span>ซื้อ</span>
                  <span className="text-[10px] opacity-90">{item.cost} แต้ม</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 border-t border-red-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>💡 สามารถกดใช้ไอเทมได้ทันทีในหน้าต่างเผชิญหน้ากับวิญญาณ</span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-red-950 text-slate-200 rounded-xl font-medium"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
