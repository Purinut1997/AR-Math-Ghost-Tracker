import React from 'react';
import { DailyBounty } from '../utils/progression';
import { X, Target, Gift, CheckCircle2, Sparkles, Flame, Clock } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DailyBountiesModalProps {
  isOpen?: boolean;
  bounties: DailyBounty[];
  onClaimBounty: (bountyId: string) => void;
  onClose: () => void;
}

export const DailyBountiesModal: React.FC<DailyBountiesModalProps> = ({
  isOpen = true,
  bounties,
  onClaimBounty,
  onClose,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-950 border border-red-950/80 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-red-950/80 bg-black/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                <span>เควสต์ล่าวิญญาณประจำวัน</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-900/60 text-red-300 border border-red-800/60">
                  รีเซ็ตทุกเที่ยงคืน
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                ทำภารกิจสะกดวิญญาณเพื่อรับ EXP และไอเทมเวทมนตร์ฟรี
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bounties List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {bounties.map((bounty) => {
            const isCompleted = bounty.current >= bounty.target;
            const pct = Math.min(100, Math.round((bounty.current / bounty.target) * 100));

            return (
              <div
                key={bounty.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  bounty.claimed
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-60'
                    : isCompleted
                    ? 'bg-gradient-to-r from-red-950/60 to-slate-900/90 border-red-600/70 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl mt-0.5">{bounty.emoji}</span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        {bounty.title}
                        {isCompleted && !bounty.claimed && (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            ● สำเร็จแล้ว!
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {bounty.description}
                      </p>

                      {/* Reward Badge */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          +{bounty.rewardExp} EXP
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/60 flex items-center gap-1">
                          <Gift className="w-3 h-3 text-purple-400" />
                          {bounty.rewardItemName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Claim Button / Status */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {bounty.claimed ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold px-2 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        รับแล้ว
                      </span>
                    ) : isCompleted ? (
                      <button
                        onClick={() => {
                          sounds.playFanfare();
                          onClaimBounty(bounty.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-900/50 transition-all active:scale-95 animate-pulse"
                      >
                        กดรับรางวัล!
                      </button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {bounty.current} / {bounty.target}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {!bounty.claimed && (
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-red-950/70 bg-black/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> เควสต์ใหม่จะมาทุกวันเวลา 00:00 น.
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
