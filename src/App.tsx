import React, { useState, useEffect } from 'react';
import {
  Ghost,
  BookOpen,
  Settings,
  Volume2,
  VolumeX,
  Flame,
  Award,
  HelpCircle,
  Sparkles,
  Target,
  Backpack,
  Award as AwardIcon,
  Home,
  HelpCircle as HelpIcon,
} from 'lucide-react';
import { GhostEncounter, GradeLevel, PlayerStats, PlayerInventory, ItemType, DailyBounty } from './types';
import { sounds } from './utils/audio';
import { loadOrCreateDailyBounties, saveDailyBounties, getRankByExp } from './utils/progression';
import { ARCamera } from './components/ARCamera';
import { GhostEncounterModal } from './components/GhostEncounterModal';
import { GhostDexModal } from './components/GhostDexModal';
import { SettingsModal } from './components/SettingsModal';
import { InventoryModal } from './components/InventoryModal';
import { CertificateModal } from './components/CertificateModal';
import { MainMenu } from './components/MainMenu';
import { GameManualModal } from './components/GameManualModal';
import { GhostPolaroidModal } from './components/GhostPolaroidModal';
import { DailyBountiesModal } from './components/DailyBountiesModal';

export default function App() {
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(() => {
    return (localStorage.getItem('ar_ghost_grade') as GradeLevel) || 'ป.3';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('ar_ghost_sound_enabled') !== 'false';
  });

  const [timedMode, setTimedMode] = useState<boolean>(() => {
    return localStorage.getItem('ar_ghost_timed_mode') !== 'false';
  });

  const [history, setHistory] = useState<GhostEncounter[]>(() => {
    try {
      const saved = localStorage.getItem('ar_ghost_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('ar_ghost_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        const exp = parsed.exp || 0;
        const rankData = getRankByExp(exp);
        return {
          ...parsed,
          exp,
          level: rankData.currentRank.level,
          expToNextLevel: rankData.expToNext,
          rank: rankData.currentRank.title,
        };
      }
    } catch {}
    const defaultRank = getRankByExp(0);
    return {
      ghostsExorcised: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      totalAttempts: 0,
      rank: defaultRank.currentRank.title,
      level: defaultRank.currentRank.level,
      exp: 0,
      expToNextLevel: defaultRank.expToNext,
    };
  });

  const [bounties, setBounties] = useState<DailyBounty[]>(() => loadOrCreateDailyBounties());
  const [showDailyBounties, setShowDailyBounties] = useState<boolean>(false);
  const [polaroidTarget, setPolaroidTarget] = useState<GhostEncounter | null>(null);

  useEffect(() => {
    saveDailyBounties(bounties);
  }, [bounties]);

  const [currentView, setCurrentView] = useState<'menu' | 'game'>('menu');
  const [showManual, setShowManual] = useState<boolean>(false);
  const [activeEncounter, setActiveEncounter] = useState<GhostEncounter | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showGhostDex, setShowGhostDex] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showStoryIntro, setShowStoryIntro] = useState<boolean>(() => {
    return !localStorage.getItem('ar_ghost_intro_seen');
  });
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('ar_ghost_player_name') || 'ยอดนักสืบวิญญาณแห่งโรงเรียน';
  });

  const handleUpdatePlayerName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('ar_ghost_player_name', name);
  };

  const handleClaimBounty = (bountyId: string) => {
    setBounties((prev) =>
      prev.map((b) => {
        if (b.id !== bountyId || b.claimed) return b;
        setStats((s) => {
          const nextExp = (s.exp || 0) + b.rewardExp;
          const rankData = getRankByExp(nextExp);
          return {
            ...s,
            exp: nextExp,
            level: rankData.currentRank.level,
            expToNextLevel: rankData.expToNext,
            rank: rankData.currentRank.title,
            score: s.score + b.rewardScore,
          };
        });
        if (b.rewardItem) {
          const itemKey = b.rewardItem;
          setInventory((inv) => ({
            ...inv,
            [itemKey]: (inv[itemKey] || 0) + 1,
          }));
        }
        return { ...b, claimed: true };
      })
    );
  };

  const handleEncounterFailed = () => {
    if (stats.streak > 0) {
      setStats((prev) => ({
        ...prev,
        streak: 0,
      }));
    }
  };

  const [inventory, setInventory] = useState<PlayerInventory>(() => {
    try {
      const saved = localStorage.getItem('ar_ghost_inventory');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      talisman: 2,
      hourglass: 2,
      uv_light: 1,
    };
  });

  useEffect(() => {
    localStorage.setItem('ar_ghost_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const handleBuyItem = (itemId: ItemType, cost: number) => {
    if (stats.score < cost) return;
    setStats((prev) => ({
      ...prev,
      score: prev.score - cost,
    }));
    setInventory((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleUseItemInEncounter = (item: ItemType): boolean => {
    if ((inventory[item] || 0) <= 0) return false;
    setInventory((prev) => ({
      ...prev,
      [item]: Math.max(0, prev[item] - 1),
    }));
    return true;
  };

  // Save changes to localStorage with quota overflow protection
  useEffect(() => {
    localStorage.setItem('ar_ghost_grade', gradeLevel);
  }, [gradeLevel]);

  useEffect(() => {
    try {
      localStorage.setItem('ar_ghost_history', JSON.stringify(history));
    } catch {
      // If base64 photos exceed quota (5MB), prune snapshots of older ghosts while preserving all records
      try {
        const pruned = history.map((item, idx) =>
          idx >= 6 ? { ...item, imageSnapshot: undefined } : item
        );
        localStorage.setItem('ar_ghost_history', JSON.stringify(pruned));
      } catch (err) {
        console.warn('Unable to persist full history to localStorage:', err);
      }
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('ar_ghost_stats', JSON.stringify(stats));
    } catch (err) {
      console.warn('Unable to persist stats:', err);
    }
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('ar_ghost_timed_mode', String(timedMode));
  }, [timedMode]);

  const handleResetAllData = () => {
    localStorage.removeItem('ar_ghost_history');
    localStorage.removeItem('ar_ghost_stats');
    localStorage.removeItem('ar_ghost_inventory');
    localStorage.removeItem('ar_ghost_bounties_v1');
    setHistory([]);
    setInventory({ talisman: 2, hourglass: 2, uv_light: 1 });
    const defaultRank = getRankByExp(0);
    setStats({
      ghostsExorcised: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      totalAttempts: 0,
      rank: defaultRank.currentRank.title,
      level: defaultRank.currentRank.level,
      exp: 0,
      expToNextLevel: defaultRank.expToNext,
    });
    setBounties(loadOrCreateDailyBounties());
  };

  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setSoundEnabled(next);
  };

  const handleCaptureImage = async (imageBase64: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/scan-ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageBase64,
          gradeLevel,
        }),
      });

      if (!res.ok) {
        throw new Error('ไม่สามารถวิเคราะห์ภาพถ่ายได้');
      }

      const data = await res.json();
      const encounter: GhostEncounter = {
        id: 'ghost-' + Date.now(),
        ghost_type: data.ghost_type,
        ghost_emoji: data.ghost_emoji,
        narrative: data.narrative,
        math_question: data.math_question,
        correct_answer: data.correct_answer,
        choices: data.choices,
        imageSnapshot: imageBase64,
        timestamp: Date.now(),
        gradeLevel,
        exorcised: false,
        explanation_steps: data.explanation_steps || [
          `พิจารณาโจทย์คณิตศาสตร์: ${data.math_question}`,
          `คำนวณตามหลักขั้นตอนทีละขั้น`,
          `ดังนั้นคำตอบที่ถูกต้องคือ ${data.correct_answer}`,
        ],
      };

      setActiveEncounter(encounter);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExorcised = (encounter: GhostEncounter, attempts: number) => {
    const points = attempts === 1 ? 150 : attempts === 2 ? 100 : 70;
    const streakBonus = Math.min(stats.streak * 20, 100);
    const earnedScore = points + streakBonus;

    const expGained = (attempts === 1 ? 70 : 50) + Math.min(stats.streak * 10, 50);
    const newExp = (stats.exp || 0) + expGained;
    const rankData = getRankByExp(newExp);

    const newStreak = stats.streak + 1;
    const newBestStreak = Math.max(stats.bestStreak, newStreak);
    const newExorcisedCount = stats.ghostsExorcised + 1;

    const updatedStats: PlayerStats = {
      ghostsExorcised: newExorcisedCount,
      score: stats.score + earnedScore,
      streak: newStreak,
      bestStreak: newBestStreak,
      totalAttempts: stats.totalAttempts + attempts,
      rank: rankData.currentRank.title,
      level: rankData.currentRank.level,
      exp: newExp,
      expToNextLevel: rankData.expToNext,
    };

    setStats(updatedStats);

    // Update Daily Bounties progress
    setBounties((prev) =>
      prev.map((b) => {
        if (b.claimed) return b;
        let nextCur = b.current;
        if (b.id === 'bounty-exorcise-3') {
          nextCur = Math.min(b.target, b.current + 1);
        } else if (b.id === 'bounty-streak-2') {
          nextCur = Math.min(b.target, Math.max(b.current, newStreak));
        } else if (b.id === 'bounty-solve-5') {
          nextCur = Math.min(b.target, b.current + 1);
        }
        return { ...b, current: nextCur };
      })
    );

    const updatedEncounter = { ...encounter, exorcised: true };
    setHistory((prev) => [updatedEncounter, ...prev]);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col font-sans select-none text-slate-100">
      {/* Global horror atmosphere ambient overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 horror-vignette opacity-70" />

      {/* Main Menu View or AR Hunt Gameplay View */}
      {currentView === 'menu' ? (
        <MainMenu
          onStartGame={() => setCurrentView('game')}
          onOpenManual={() => setShowManual(true)}
          onOpenGhostDex={() => setShowGhostDex(true)}
          onOpenInventory={() => setShowInventory(true)}
          onOpenCertificate={() => setShowCertificate(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenDailyBounties={() => setShowDailyBounties(true)}
          unclaimedBountiesCount={bounties.filter((b) => b.current >= b.target && !b.claimed).length}
          gradeLevel={gradeLevel}
          setGradeLevel={setGradeLevel}
          stats={stats}
          inventory={inventory}
          soundEnabled={soundEnabled}
          toggleSound={handleToggleSound}
        />
      ) : (
        <>
          {/* Top Navigation Bar in AR Mode - Dedicated Header (No Overlap) */}
          <header className="relative z-30 w-full h-14 px-2 sm:px-4 flex items-center justify-between pointer-events-auto bg-black/95 border-b border-red-950/80 shadow-md shrink-0 select-none">
            {/* Left: Back to Menu + Grade Pill + Streak */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentView('menu');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-700/60 text-xs font-mono font-bold text-red-200 transition-all active:scale-95 shadow-sm"
                title="กลับไปหน้าเมนูหลัก"
              >
                <Home className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">เมนู</span>
              </button>

              {/* Grade Level Badge / Selector Shortcut */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowSettings(true);
                }}
                className="flex items-center gap-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 px-2 py-1 rounded-xl text-xs font-mono font-bold text-slate-200 transition-colors"
                title="เปลี่ยนระดับชั้นเรียน"
              >
                <span className="text-emerald-400">ชั้น</span>
                <span>{gradeLevel}</span>
              </button>

              {/* Streak Indicator */}
              {stats.streak > 0 && (
                <div className="flex items-center gap-1 bg-red-950/80 border border-red-600/60 text-red-300 px-2 py-1 rounded-xl text-xs font-mono font-bold shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-red-400 text-red-400 animate-pulse" />
                  <span>{stats.streak}</span>
                </div>
              )}
            </div>

            {/* Center Brand Title (Desktop / Tablet) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center text-xs shadow-md border border-red-700/50">
                👻
              </div>
              <h1 className="text-xs font-bold tracking-wider font-mono text-slate-200">
                <span className="text-red-500">AR MATH</span> GHOST TRACKER
              </h1>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Daily Bounties Quests Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowDailyBounties(true);
                }}
                className="relative flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-900/70 text-purple-300 text-xs font-mono font-bold transition-transform active:scale-95 shadow-sm"
                title="เควสต์ประจำวัน"
              >
                <Target className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">เควสต์</span>
                {bounties.some((b) => b.current >= b.target && !b.claimed) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </button>

              {/* Hunter Arsenal Inventory Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowInventory(true);
                }}
                className="relative flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950/90 text-rose-300 text-xs font-mono font-bold transition-transform active:scale-95 shadow-sm"
                title="กระเป๋าอุปกรณ์ปราบผี"
              >
                <Backpack className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">กระเป๋า</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-[10px] text-white font-mono">
                  {(inventory.talisman || 0) + (inventory.hourglass || 0) + (inventory.uv_light || 0)}
                </span>
              </button>

              {/* Ghost Compendium (Dex) Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowGhostDex(true);
                }}
                className="relative flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950/90 text-amber-300 text-xs font-mono font-bold transition-transform active:scale-95 shadow-sm"
                title="สมุดบันทึกวิญญาณ"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">สมุดผี</span>
                {history.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-[10px] text-black font-bold font-mono">
                    {history.length}
                  </span>
                )}
              </button>

              {/* Certificate Award Button */}
              <button
                onClick={() => {
                  sounds.playFanfare();
                  setShowCertificate(true);
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950/90 text-yellow-400 transition-colors"
                title="ใบประกาศนียบัตรเกียรติยศ"
              >
                <AwardIcon className="w-4 h-4" />
              </button>

              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950/90 text-slate-300 transition-colors"
                title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-red-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Settings / Manual Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowSettings(true);
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-950/90 text-slate-300 transition-colors"
                title="ตั้งค่า & คู่มือ"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Main AR Viewfinder & Capture Interface (Underneath header, strictly no overlap) */}
          <main className="relative flex-1 w-full overflow-hidden">
            <ARCamera
              onCaptureImage={handleCaptureImage}
              isAnalyzing={isAnalyzing}
            />
          </main>
        </>
      )}

      {/* Game How-to-Play Manual Modal */}
      <GameManualModal
        isOpen={showManual}
        onClose={() => setShowManual(false)}
      />

      {/* Ghost Encounter Battle Modal */}
      <GhostEncounterModal
        encounter={activeEncounter}
        isOpen={!!activeEncounter}
        onClose={() => setActiveEncounter(null)}
        onExorcised={handleExorcised}
        onFailed={handleEncounterFailed}
        timedMode={timedMode}
        inventory={inventory}
        onUseItem={handleUseItemInEncounter}
        onOpenPolaroid={(enc) => setPolaroidTarget(enc)}
      />

      {/* Ghost Compendium Modal */}
      <GhostDexModal
        isOpen={showGhostDex}
        onClose={() => setShowGhostDex(false)}
        ghosts={history}
        stats={stats}
        onOpenCertificate={() => setShowCertificate(true)}
        onOpenPolaroid={(enc) => setPolaroidTarget(enc)}
      />

      {/* Hunter Arsenal Inventory Modal */}
      <InventoryModal
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        inventory={inventory}
        score={stats.score}
        onBuyItem={handleBuyItem}
      />

      {/* Exorcist Honors Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        stats={stats}
        playerName={playerName}
        onUpdatePlayerName={handleUpdatePlayerName}
      />

      {/* Daily Bounties Quest Modal */}
      <DailyBountiesModal
        isOpen={showDailyBounties}
        onClose={() => setShowDailyBounties(false)}
        bounties={bounties}
        onClaimBounty={handleClaimBounty}
      />

      {/* Ghost Polaroid Result Modal */}
      {polaroidTarget && (
        <GhostPolaroidModal
          encounter={polaroidTarget}
          isOpen={!!polaroidTarget}
          playerName={playerName}
          onClose={() => setPolaroidTarget(null)}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        gradeLevel={gradeLevel}
        setGradeLevel={setGradeLevel}
        soundEnabled={soundEnabled}
        toggleSound={handleToggleSound}
        timedMode={timedMode}
        setTimedMode={setTimedMode}
        historyCount={history.length}
        onResetAllData={handleResetAllData}
      />

      {/* First-time Welcome & Story Intro Modal */}
      {showStoryIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="absolute inset-0 horror-vignette pointer-events-none" />
          <div className="relative w-full max-w-md bg-black/95 border border-red-900/70 rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-600/50 mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg shadow-red-950/80 spooky-float">
              👻
            </div>

            <h2 className="text-xl font-bold text-white tracking-wide">
              ยินดีต้อนรับสู่โรงเรียนอาถรรพ์!
            </h2>
            <p className="text-xs text-red-400 font-semibold mt-1 font-mono">
              "AR GHOST TRACKER: ตำนานสมการซ่อนแอบ"
            </p>

            <div className="my-4 text-xs text-slate-300 space-y-2 text-left bg-slate-950/90 p-4 rounded-2xl border border-red-950/80 leading-relaxed shadow-inner">
              <p>
                🏫 ในยามค่ำคืน <strong>วิญญาณนักเรียนผู้สอบตกวิชาเลข</strong> ได้ตื่นขึ้นและสิงสถิตอยู่ตามมุมมืดและสิ่งของรอบตัวเธอ!
              </p>
              <p>
                📷 <strong>วิธีสำรวจ:</strong> เล็งกล้องไปที่สิ่งของในห้อง (เช่น โต๊ะ, เก้าอี้, ตำราเรียน, กระเป๋า) แล้วกดชัตเตอร์สีแดงเพื่อปลุกวิญญาณ
              </p>
              <p>
                ✨ <strong>สะกดวิญญาณ:</strong> แก้คำสาปสมการตัวเลขให้ถูกต้อง เพื่อปลดปล่อยวิญญาณให้สู่สุคติและชำระล้างคำสาป!
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playBoo();
                setShowStoryIntro(false);
                localStorage.setItem('ar_ghost_intro_seen', 'true');
              }}
              className="w-full py-3 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-red-950/80 active:scale-95 transition-all text-sm tracking-wide border border-red-600/40"
            >
              เปิดโหมดล่าผี [เข้าสู่ความมืด] ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
