// Progression & Level System, Ranks, and Daily Bounties for AR Math Ghost Tracker
import { GradeLevel, ItemType, PlayerInventory } from '../types';

export interface ExorcistRankDef {
  level: number;
  title: string;
  emoji: string;
  minExp: number;
  maxExp: number;
  description: string;
}

export const EXORCIST_RANKS: ExorcistRankDef[] = [
  {
    level: 1,
    title: 'ผู้ฝึกส่องวิญญาณ',
    emoji: '🕯️',
    minExp: 0,
    maxExp: 149,
    description: 'เพิ่งเริ่มสัมผัสคลื่นอาถรรพ์และแก้โจทย์เลขเบื้องต้น',
  },
  {
    level: 2,
    title: 'จอมขมังเวทชอล์กดำ',
    emoji: '🖍️',
    minExp: 150,
    maxExp: 399,
    description: 'เชี่ยวชาญการเขียนยันต์ตัวเลขและแกะรอยตามห้องเรียน',
  },
  {
    level: 3,
    title: 'หมอผีคณิตศาสตร์',
    emoji: '📿',
    minExp: 400,
    maxExp: 799,
    description: 'สะกดวิญญาณได้อย่างรวดเร็วด้วยการคิดเลขในใจ',
  },
  {
    level: 4,
    title: 'ผู้พิทักษ์สมการศักดิ์สิทธิ์',
    emoji: '🔮',
    minExp: 800,
    maxExp: 1399,
    description: 'สามารถถอดรหัสคำสาปที่ซับซ้อนและปลดปล่อยวิญญาณดุร้าย',
  },
  {
    level: 5,
    title: 'ปรมาจารย์สะกดวิญญาณ',
    emoji: '⚡',
    minExp: 1400,
    maxExp: 2299,
    description: 'วิญญาณทั่วทั้งโรงเรียนต่างเกรงกลัวความแม่นยำทางคณิตศาสตร์',
  },
  {
    level: 6,
    title: 'ตำนานจอมเวทปราบมารนิรันดร์',
    emoji: '👑',
    minExp: 2300,
    maxExp: 99999,
    description: 'ก้าวข้ามทุกมิติคำสาป ผู้พิทักษ์ความสงบสุขของโรงเรียน',
  },
];

export function getRankByExp(exp: number = 0): {
  currentRank: ExorcistRankDef;
  nextRank: ExorcistRankDef | null;
  progressPercent: number;
  expIntoLevel: number;
  expRequiredForLevel: number;
  expToNext: number;
} {
  const currentRank =
    EXORCIST_RANKS.slice()
      .reverse()
      .find((r) => exp >= r.minExp) || EXORCIST_RANKS[0];

  const currentIndex = EXORCIST_RANKS.findIndex((r) => r.level === currentRank.level);
  const nextRank = currentIndex < EXORCIST_RANKS.length - 1 ? EXORCIST_RANKS[currentIndex + 1] : null;

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      progressPercent: 100,
      expIntoLevel: exp - currentRank.minExp,
      expRequiredForLevel: 1000,
      expToNext: 0,
    };
  }

  const expRequiredForLevel = nextRank.minExp - currentRank.minExp;
  const expIntoLevel = Math.max(0, exp - currentRank.minExp);
  const progressPercent = Math.min(100, Math.round((expIntoLevel / expRequiredForLevel) * 100));
  const expToNext = Math.max(0, nextRank.minExp - exp);

  return {
    currentRank,
    nextRank,
    progressPercent,
    expIntoLevel,
    expRequiredForLevel,
    expToNext,
  };
}

// ==========================================
// DAILY EXORCISM BOUNTIES (เควสต์ประจำวัน)
// ==========================================
export interface DailyBounty {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  current: number;
  rewardExp: number;
  rewardScore: number;
  rewardItem?: ItemType;
  rewardItemName?: string;
  claimed: boolean;
}

export function getDailyBountiesKey(): string {
  const now = new Date();
  return `ar_bounties_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}

export function loadOrCreateDailyBounties(): DailyBounty[] {
  if (typeof window === 'undefined') return [];
  const key = getDailyBountiesKey();
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}

  const defaultBounties: DailyBounty[] = [
    {
      id: 'bounty-exorcise-3',
      title: 'สะกดวิญญาณ 3 ตัว',
      description: 'สแกนวัตถุและแก้โจทย์ปราบผีให้สำเร็จ 3 ตัว',
      emoji: '👻',
      target: 3,
      current: 0,
      rewardExp: 60,
      rewardScore: 100,
      rewardItem: 'talisman',
      rewardItemName: 'ยันต์ตัดตัวเลือกผิด',
      claimed: false,
    },
    {
      id: 'bounty-streak-2',
      title: 'สมาธิปราบผีต่อเนื่อง',
      description: 'ตอบถูกสะกดวิญญาณต่อเนื่อง (Streak) ให้ถึง 2 ครั้ง',
      emoji: '🔥',
      target: 2,
      current: 0,
      rewardExp: 80,
      rewardScore: 150,
      rewardItem: 'hourglass',
      rewardItemName: 'นาฬิกาทรายต่อเวลา',
      claimed: false,
    },
    {
      id: 'bounty-solve-5',
      title: 'ยอดนักคิดเลขแห่งรัตติกาล',
      description: 'แก้โจทย์สะกดวิญญาณสำเร็จสะสมครบ 5 ข้อ',
      emoji: '📚',
      target: 5,
      current: 0,
      rewardExp: 120,
      rewardScore: 200,
      rewardItem: 'uv_light',
      rewardItemName: 'ไฟฉาย UV ส่องคำตอบ',
      claimed: false,
    },
    {
      id: 'bounty-streak-3',
      title: 'ผู้ชำระล้างคำสาประดับเซียน',
      description: 'ตอบถูกสะกดวิญญาณต่อเนื่อง (Streak) ถึง 3 ครั้ง',
      emoji: '⚡',
      target: 3,
      current: 0,
      rewardExp: 150,
      rewardScore: 250,
      rewardItem: 'holy_water',
      rewardItemName: 'น้ำมนต์สะกดวิญญาณ x2',
      claimed: false,
    },
  ];

  try {
    localStorage.setItem(key, JSON.stringify(defaultBounties));
  } catch {}

  return defaultBounties;
}

export function saveDailyBounties(bounties: DailyBounty[]) {
  if (typeof window === 'undefined') return;
  const key = getDailyBountiesKey();
  try {
    localStorage.setItem(key, JSON.stringify(bounties));
  } catch {}
}

// ==========================================
// THAI GHOST TEXT-TO-SPEECH (สังเคราะห์เสียงผี)
// ==========================================
let activeGhostAudio: HTMLAudioElement | null = null;

function speakWithSpeechSynthesis(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.pitch = 0.7; // deep ghostly tone
    utterance.rate = 0.9;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const thVoice = voices.find((v) => v.lang.includes('th') || v.name.toLowerCase().includes('thai'));
    if (thVoice) {
      utterance.voice = thVoice;
    }

    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
  }
}

export function speakGhostVoice(text: string, onEnd?: () => void): boolean {
  if (typeof window === 'undefined') return false;

  stopGhostVoice();

  // Try pristine server-side Thai TTS endpoint first (compatible with ALL browsers & platforms)
  try {
    const audioUrl = `/api/tts?text=${encodeURIComponent(text.trim())}`;
    const audio = new Audio(audioUrl);
    audio.playbackRate = 0.92; // haunting, eerie cadence
    activeGhostAudio = audio;

    audio.onended = () => {
      activeGhostAudio = null;
      onEnd?.();
    };

    audio.onerror = () => {
      activeGhostAudio = null;
      // Fallback to Web Speech API
      speakWithSpeechSynthesis(text, onEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play failed, falling back to speech synthesis:', err);
        activeGhostAudio = null;
        speakWithSpeechSynthesis(text, onEnd);
      });
    }
    return true;
  } catch (err) {
    console.warn('Direct audio creation failed:', err);
    speakWithSpeechSynthesis(text, onEnd);
    return true;
  }
}

export function stopGhostVoice() {
  if (activeGhostAudio) {
    try {
      activeGhostAudio.pause();
      activeGhostAudio.currentTime = 0;
    } catch {}
    activeGhostAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
