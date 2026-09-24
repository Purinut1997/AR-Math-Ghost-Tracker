import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Camera,
  Radio,
  Sparkles,
  HelpCircle,
  Backpack,
  Award,
  ShieldAlert,
  Clock,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface GameManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameManualModal: React.FC<GameManualModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'combat' | 'items' | 'curriculum' | 'safety'>('basics');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="absolute inset-0 horror-vignette pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-black/95 border border-red-900/70 rounded-3xl shadow-[0_0_60px_rgba(239,68,68,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-red-950/80 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-xl shadow-inner">
              📖
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>คู่มือการสืบคดี & ปราบผีคณิตศาสตร์</span>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-800/60 px-2 py-0.5 rounded-full font-mono">
                  MANUAL
                </span>
              </h2>
              <p className="text-xs text-red-400 font-mono">
                AR Math Ghost Tracker • Created by MIKPURINUT
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

        {/* Tab Navigation */}
        <div className="flex border-b border-red-950/80 bg-black/60 px-3 sm:px-5 gap-1.5 pt-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('basics');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x shrink-0 ${
              activeTab === 'basics'
                ? 'bg-slate-950 text-red-300 border-red-900/80 border-b-2 border-b-slate-950'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-red-400" />
            <span>1. การตามหาวิญญาณ</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('combat');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x shrink-0 ${
              activeTab === 'combat'
                ? 'bg-slate-950 text-red-300 border-red-900/80 border-b-2 border-b-slate-950'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>2. การสะกดวิญญาณ</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('items');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x shrink-0 ${
              activeTab === 'items'
                ? 'bg-slate-950 text-red-300 border-red-900/80 border-b-2 border-b-slate-950'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Backpack className="w-3.5 h-3.5 text-rose-400" />
            <span>3. ไอเทม & คลังแสง</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('curriculum');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x shrink-0 ${
              activeTab === 'curriculum'
                ? 'bg-slate-950 text-red-300 border-red-900/80 border-b-2 border-b-slate-950'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>4. โลจิคโจทย์ ป.1 - ป.6</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('safety');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x shrink-0 ${
              activeTab === 'safety'
                ? 'bg-slate-950 text-red-300 border-red-900/80 border-b-2 border-b-slate-950'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>5. ความปลอดภัย</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'basics' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-900/50 flex gap-3">
                <span className="text-2xl">📡</span>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    สังเกตสัญญาณเรดาร์ (Ghost Sonar Radar)
                  </h4>
                  <p className="text-xs text-slate-300">
                    ที่มุมซ้ายบนของหน้าจอจะมีวงแหวนเรดาร์และระดับ EMF ตรวจจับคลื่นแม่เหล็กไฟฟ้า เมื่อคุณหมุนกล้องไปรอบๆ จุดสีแดงจะบ่งบอกทิศทางและระยะห่างของวิญญาณ หากเข้าใกล้ต่ำกว่า 1.4 เมตร จะเกิดสถานะ <strong>SIGNAL LOCKED</strong> พร้อมเสียงหัวใจเต้นตึกตัก!
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    การถ่ายภาพสิ่งของในโลกจริง
                  </h4>
                  <p className="text-xs text-slate-300">
                    ส่องกล้องไปที่สิ่งของในห้องเรียน เช่น โต๊ะไม้, เก้าอี้, ตำราเรียน, กระเป๋านักเรียน, หรือนาฬิกา จากนั้นกด <strong>ปุ่มชัตเตอร์สีแดง</strong> ระบบ AI จะสแกนวิเคราะห์ภาพและปลุกวิญญาณประจำสิ่งของนั้นออกมา
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex gap-3">
                <span className="text-2xl">🏫</span>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    ปุ่มสุ่มสำรวจจุดเกิดเหตุ (Sample School Spots)
                  </h4>
                  <p className="text-xs text-slate-300">
                    หากอุปกรณ์ของคุณไม่มีกล้อง หรืออยู่ในห้องที่แสงน้อย สามารถกดเลือกสถานที่จำลอง เช่น "กระดานดำและชอล์ก", "โต๊ะเรียนไม้ ป.3", หรือ "ห้องสมุดโรงเรียน" เพื่อเล่นได้ทันทีโดยไม่ต้องเปิดกล้องจริง
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'combat' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-900/50 flex gap-3">
                <span className="text-2xl">🧮</span>
                <div>
                  <h4 className="font-bold text-amber-200 text-sm mb-1">
                    แก้คำสาปสมการตัวเลข (Math Exorcism)
                  </h4>
                  <p className="text-xs text-slate-300">
                    วิญญาณแต่ละตนจะถูกจองจำด้วยโจทย์คณิตศาสตร์ตามระดับชั้นที่คุณเลือก (ป.1 - ป.6) เลือกรหัสคำตอบที่ถูกต้องจาก 4 ตัวเลือกเพื่อปลดปล่อยวิญญาณสู่สุคติ
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    กระดานทดเลขเวทมนตร์ (Scratchpad)
                  </h4>
                  <p className="text-xs text-slate-300">
                    กดปุ่ม <strong>"ดินสอทดเลข"</strong> ในหน้าต่างเผชิญหน้าเพื่อเปิดกระดานวาดเขียน สามารถใช้นิ้วหรือเมาส์ทดคำนวณเลข ลบ ขีดเส้นใต้ ได้อิสระโดยไม่ต้องพึ่งกระดาษจริง
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex gap-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    โหมดจำกัดเวลา (Time Attack Mode)
                  </h4>
                  <p className="text-xs text-slate-300">
                    คุณจะมีเวลา 60 วินาทีในการคิดคำนวณ หากเวลาน้อยกว่า 15 วินาที เสียงหัวใจจะเต้นรัวเร็วขึ้นเพื่อกดดัน หากหมดเวลาวิญญาณจะหลบหนีไป (สามารถปิดโหมดจับเวลาได้ที่เมนูตั้งค่า)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/50">
                <h4 className="font-bold text-rose-200 text-sm mb-2 flex items-center gap-1.5">
                  <span>🎒</span>
                  <span>คลังอาวุธและไอเทมในกระเป๋า (Arsenal)</span>
                </h4>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2 bg-black/40 p-2 rounded-xl border border-red-950">
                    <span className="text-lg">📿</span>
                    <div>
                      <strong className="text-white">ยันต์ตัดคำสาป (Elimination Talisman):</strong>
                      <p>กดใช้ในหน้าเผชิญหน้าเพื่อตัดตัวเลือกที่ผิดทิ้งไป 2 ข้อทันที</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-black/40 p-2 rounded-xl border border-red-950">
                    <span className="text-lg">⏳</span>
                    <div>
                      <strong className="text-white">นาฬิกาทรายหยุดวิญญาณ (Ghost Hourglass):</strong>
                      <p>เพิ่มเวลาให้ตัวเองอีก 30 วินาทีเมื่อเวลาใกล้หมด</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-black/40 p-2 rounded-xl border border-red-950">
                    <span className="text-lg">🔦</span>
                    <div>
                      <strong className="text-white">ไฟฉายส่องรหัสลับ (UV Lens):</strong>
                      <p>ฉายแสงรังสี UV เผยตัวเลขหลักหน่วยของคำตอบที่ถูกต้อง</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-900/50 flex gap-3">
                <span className="text-2xl">📜</span>
                <div>
                  <h4 className="font-bold text-amber-300 text-sm mb-1">
                    รับใบประกาศนียบัตรเกียรติยศ (Printable Certificate)
                  </h4>
                  <p className="text-xs text-slate-300">
                    เมื่อคุณสะสมแต้มและปลดปล่อยวิญญาณได้มากขึ้น ระดับฉายาของคุณจะอัปเกรด สามารถกดเปิดใบประกาศเกียรติคุณพิมพ์เป็น PDF หรือแชร์อวดเพื่อนได้ทันที!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-900/50 flex gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="font-bold text-blue-200 text-sm mb-1">
                    ระบบสุ่มโจทย์ไร้ขีดจำกัดด้วย AI (Infinite Dynamic Generation)
                  </h4>
                  <p className="text-xs text-slate-300">
                    <strong>มีโจทย์กี่ข้อ?</strong> — ไม่มีจำนวนข้อจำกัดตายตัว! ระบบใช้ <strong>Gemini Multimodal AI</strong> เป็น Game Master ร่วมกับโปรแกรม Procedural Generator วิเคราะห์สิ่งของที่ผู้เล่นถ่ายภาพสดๆ และสร้างโจทย์ใหม่แบบเรียลไทม์ ทำให้เล่นซ้ำได้ไม่มีวันหมด
                  </p>
                  <p className="text-xs text-blue-300 mt-1 font-semibold">
                    🎲 สุ่มโจทย์หรือไม่? — สุ่ม 100% ทั้งสิ่งของ, ตัวเลขในโจทย์, สตอรี่ผี และสลับตำแหน่งตัวเลือกทั้ง 4 ข้อทุกครั้ง
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-2.5 flex items-center gap-1.5">
                  <span>🎓</span>
                  <span>โลจิคการออกแบบโจทย์ตามหลักสูตร (ป.1 - ป.6)</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 flex items-start gap-2.5">
                    <span className="font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-lg shrink-0">
                      ป.1
                    </span>
                    <div>
                      <strong className="text-slate-100">การบวกและการลบพื้นฐาน (ไม่เกิน 20 ถึง 100)</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        เน้นการนับสิ่งของรอบตัว, การเพิ่มเข้า/หักออก, และการเปรียบเทียบจำนวน เช่น มีสมุด A เล่ม เพิ่มอีก B เล่ม
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 flex items-start gap-2.5">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg shrink-0">
                      ป.2
                    </span>
                    <div>
                      <strong className="text-slate-100">การบวก-ลบไม่เกิน 1,000 และแม่สูตรคูณเริ่มต้น</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        สูตรคูณแม่ 2, 3, 5, 10 และโจทย์ปัญหาการวัดความยาวเซนติเมตร
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 flex items-start gap-2.5">
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-lg shrink-0">
                      ป.3
                    </span>
                    <div>
                      <strong className="text-slate-100">การคูณ-หาร 1-2 หลัก และโจทย์ปัญหา 2 ขั้นตอน (ระคน)</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        การจัดแถวโต๊ะเรียน, การแบ่งกลุ่มสิ่งของเท่าๆ กัน, และการคำนวณระคน เช่น (แถว × ตัว) - นักเรียนนั่ง
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 flex items-start gap-2.5">
                    <span className="font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-lg shrink-0">
                      ป.4
                    </span>
                    <div>
                      <strong className="text-slate-100">การคูณ-หารหลายหลัก และเศษส่วนเบื้องต้น</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        การคำนวณจำนวนมาก, พื้นที่รูปสี่เหลี่ยม, และการบวก-ลบเศษส่วนที่ตัวส่วนเท่ากัน
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 flex items-start gap-2.5">
                    <span className="font-mono font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-lg shrink-0">
                      ป.5
                    </span>
                    <div>
                      <strong className="text-slate-100">เศษส่วน, ทศนิยม 1-2 ตำแหน่ง และร้อยละ/เปอร์เซ็นต์</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        การลดราคาสินค้า (%), ปริมาตรทรงสี่เหลี่ยมมุมฉาก, และการคูณทศนิยม
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 flex items-start gap-2.5">
                    <span className="font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-lg shrink-0">
                      ป.6
                    </span>
                    <div>
                      <strong className="text-slate-100">สมการตัวแปรเดียว (หาค่า x), กำไร-ขาดทุน และอัตราส่วน</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        การแก้สมการเชิงเส้น เช่น ax + b = c, การคำนวณกำไร/ขาดทุน, และพื้นที่รูปหลายเหลี่ยม
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-600/60">
                <h4 className="font-bold text-red-200 text-sm mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>คำเตือนความปลอดภัยสำหรับนักล่าวิญญาณ</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                  <li>
                    <strong>ระวังสิ่งกีดขวางรอบตัว:</strong> ในระหว่างส่องกล้อง AR ให้มองสภาพแวดล้อมจริงเสมอ ไม่เดินถอยหลังหรือวิ่ง
                  </li>
                  <li>
                    <strong>ห้ามเล่นใกล้บันไดหรือถนน:</strong> เล่นเฉพาะในพื้นที่ปลอดภัย เช่น ในห้องเรียน หรือในห้องนั่งเล่น
                  </li>
                  <li>
                    <strong>เล่นในที่ที่มีแสงสว่างเพียงพอ:</strong> แม้เกมจะมีธีมสยองขวัญ แต่กล้องต้องการแสงเพื่อสแกนวัตถุได้อย่างแม่นยำ
                  </li>
                  <li>
                    <strong>พักสายตา:</strong> หากเล่นต่อเนื่องเกิน 20 นาที ควรพักสายตาอย่างน้อย 5 นาที
                  </li>
                </ul>
              </div>

              {/* Creator Badge Box */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-red-900/40 text-center">
                <p className="text-xs text-slate-400">เกมถูกออกแบบเพื่อส่งเสริมการเรียนรู้คณิตศาสตร์ผ่านจินตนาการ</p>
                <p className="text-sm font-bold text-red-400 font-mono mt-1 tracking-wider">
                  Created by MIKPURINUT
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-red-950/80 flex items-center justify-between text-xs text-slate-400 px-5">
          <span className="font-mono text-slate-500">VERSION 2.5 • AR MATH EXORCIST</span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            เข้าใจแล้ว พร้อมลุย!
          </button>
        </div>
      </div>
    </div>
  );
};
