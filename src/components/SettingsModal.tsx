import React, { useState } from 'react';
import { X, Volume2, VolumeX, Clock, GraduationCap, Check, HardDrive, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { GradeLevel } from '../types';
import { sounds } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeLevel: GradeLevel;
  setGradeLevel: (grade: GradeLevel) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  timedMode: boolean;
  setTimedMode: (val: boolean) => void;
  historyCount?: number;
  onResetAllData?: () => void;
}

const GRADE_INFO: { grade: GradeLevel; title: string; desc: string }[] = [
  { grade: 'ป.1', title: 'ประถมศึกษาปีที่ 1', desc: 'การบวก-ลบเบื้องต้น ตัวเลขไม่เกิน 20' },
  { grade: 'ป.2', title: 'ประถมศึกษาปีที่ 2', desc: 'การบวก-ลบไม่เกิน 100 และการคูณเบื้องต้น' },
  { grade: 'ป.3', title: 'ประถมศึกษาปีที่ 3', desc: 'การบวก ลบ คูณ หารระคน และโจทย์ปัญหา' },
  { grade: 'ป.4', title: 'ประถมศึกษาปีที่ 4', desc: 'การคูณ-หารตัวเลขหลายหลัก และโจทย์ 2-3 ขั้นตอน' },
  { grade: 'ป.5', title: 'ประถมศึกษาปีที่ 5', desc: 'เศษส่วน ทศนิยม และการคำนวณขั้นสูง' },
  { grade: 'ป.6', title: 'ประถมศึกษาปีที่ 6', desc: 'สมการ ร้อยละ เปอร์เซ็นต์ และโจทย์ประยุกต์' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  gradeLevel,
  setGradeLevel,
  soundEnabled,
  toggleSound,
  timedMode,
  setTimedMode,
  historyCount = 0,
  onResetAllData,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md">
      <div className="absolute inset-0 horror-vignette pointer-events-none" />
      <div className="relative w-full max-w-lg bg-black/95 border border-red-950/80 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-red-950/80 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="text-base font-bold text-slate-100">ตั้งค่าการสำรวจอาถรรพ์</h3>
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

        {/* Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Grade Level Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <label className="text-sm font-semibold text-white">
                เลือกระดับชั้นของโจทย์คณิตศาสตร์
              </label>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              ระบบผู้คุมเกมจะปรับระดับความยากของคำสาปคณิตศาสตร์ให้ตรงกับชั้นเรียน
            </p>

            <div className="space-y-2">
              {GRADE_INFO.map((item) => {
                const isSelected = gradeLevel === item.grade;
                return (
                  <button
                    key={item.grade}
                    onClick={() => {
                      sounds.playClick();
                      setGradeLevel(item.grade);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 shadow-sm'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded">
                          {item.grade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound FX & Horror Audio Settings */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            {/* Master Sound FX Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-red-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
                <div>
                  <p className="text-sm font-semibold text-white">เสียงประกอบหลัก (Master Audio)</p>
                  <p className="text-xs text-slate-400">เสียงเรดาร์, เสียงโต้ตอบ, และการสะกดวิญญาณ</p>
                </div>
              </div>
              <button
                onClick={() => {
                  toggleSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                  soundEnabled ? 'bg-red-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Ambient Horror Drone Toggle */}
            <div className="p-3 rounded-2xl bg-black/50 border border-red-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🏚️</span>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">เสียงบรรยากาศวังเวง (Horror Ambience BGM)</p>
                  <p className="text-[11px] text-slate-400">เสียงลมโกรกในโถงทางเดินร้าง คลื่นความถี่ต่ำหลอนหู</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.toggleAmbience();
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  sounds.ambienceEnabled && soundEnabled ? 'bg-rose-700' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    sounds.ambienceEnabled && soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Horror Sound Profile */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                สไตล์เอฟเฟกต์เสียงวิญญาณ (Sound Profile)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.setHorrorStyle('realistic');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    sounds.horrorStyle === 'realistic'
                      ? 'bg-red-950/80 border-red-500 shadow-sm text-red-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span>💀</span>
                    <span>สยองขวัญสมจริง</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    จัมป์สแกร์ระทึก, คอร์ดบาดอารมณ์, หัวใจเต้นแรง
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.setHorrorStyle('classic');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    sounds.horrorStyle === 'classic'
                      ? 'bg-emerald-950/80 border-emerald-500 shadow-sm text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span>👻</span>
                    <span>ผีแฟนตาซีคลาสสิก</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    เสียงการ์ตูนผีแบร่~ นุ่มนวล เหมาะสำหรับเด็กเล็ก
                  </p>
                </button>
              </div>
            </div>

            {/* Audio Feedback Previews */}
            {soundEnabled && (
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  ทดสอบฟังเสียงเอฟเฟกต์ (Horror SFX Soundboard)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => sounds.playHorrorStinger()}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950 hover:border-red-600 text-xs text-red-300 transition-colors"
                  >
                    <span>💀</span>
                    <span>จัมป์สแกร์ผี</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playHeartbeat(1.3)}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950 hover:border-rose-600 text-xs text-rose-300 transition-colors"
                  >
                    <span>💓</span>
                    <span>หัวใจเต้นตึกตัก</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playEmfTick()}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950 hover:border-amber-600 text-xs text-amber-300 transition-colors"
                  >
                    <span>📻</span>
                    <span>เครื่อง EMF ผี</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playHolyBell()}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950 hover:border-yellow-600 text-xs text-yellow-300 transition-colors"
                  >
                    <span>🎐</span>
                    <span>ระฆังปราบมาร</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playGhostWhisper()}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950 hover:border-purple-600 text-xs text-purple-300 transition-colors"
                  >
                    <span>💨</span>
                    <span>เสียงกระซิบ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playWrongAnswer()}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950 hover:border-red-600 text-xs text-red-400 transition-colors"
                  >
                    <span>⚡</span>
                    <span>ผีอาละวาด</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Timed Mode Toggle */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-white">จับเวลาแก้คำสาป (60 วินาที)</p>
                <p className="text-xs text-slate-400">ปิดตัวเลือกนี้หากต้องการเล่นแบบผ่อนคลายไม่จำกัดเวลา</p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setTimedMode(!timedMode);
              }}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                timedMode ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  timedMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Local Storage & Device Cache Management Section */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  การบันทึกข้อมูลในเครื่อง (Device Storage)
                </span>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                บันทึกอัตโนมัติ (LocalStorage)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>ประวัติวิญญาณที่บันทึกไว้:</span>
                <span className="font-mono font-bold text-amber-400">{historyCount} ตน</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>ตำแหน่งจัดเก็บ:</span>
                <span className="font-mono text-slate-400">หน่วยความจำบราวเซอร์ของเครื่องนี้</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                💡 ข้อมูลทั้งหมด (สถิติ, เลเวล, ยศ, ไอเทม, เควสต์, และภาพถ่ายวิญญาณ) ถูกบันทึกลงในหน่วยความจำของเครื่องท่านโดยตรง เมื่อปิดหรือเปิดเว็บใหม่ข้อมูลจะไม่สูญหาย
              </p>
            </div>

            {onResetAllData && (
              <div>
                {!showConfirmReset ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 text-red-400 text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ล้างข้อมูลประวัติและเริ่มเล่นใหม่</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-red-950/70 border border-red-600/80 text-center space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-red-200 font-bold">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>ยืนยันการล้างประวัติในเครื่อง?</span>
                    </div>
                    <p className="text-[11px] text-red-300">
                      คะแนน, ยศ, เลเวล, ไอเทม, และภาพผีทั้งหมดจะถูกรีเซ็ตเริ่มต้นใหม่
                    </p>
                    <div className="flex gap-2 justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playHolyBell();
                          onResetAllData();
                          setShowConfirmReset(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
                      >
                        ยืนยันล้างข้อมูล
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmReset(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-sm transition-colors"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
};
