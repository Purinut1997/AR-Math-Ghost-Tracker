// Web Audio API Synthesizer for AR Math Ghost Tracker - Horror Game Audio Engine
export type HorrorAudioStyle = 'realistic' | 'classic';

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public ambienceEnabled: boolean = true;
  public horrorStyle: HorrorAudioStyle = 'realistic';

  // Ambient Drone Audio Nodes & File Player
  private bgmAudio: HTMLAudioElement | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSources: {
    stop?: () => void;
    disconnect?: () => void;
  }[] = [];
  private ambientTimer: any = null;
  private isAmbienceRunning: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('ar_ghost_sound_enabled');
      if (savedSound !== null) {
        this.enabled = savedSound === 'true';
      }

      const savedAmbience = localStorage.getItem('ar_ghost_ambience_enabled');
      if (savedAmbience !== null) {
        this.ambienceEnabled = savedAmbience === 'true';
      }

      const savedStyle = localStorage.getItem('ar_ghost_horror_style') as HorrorAudioStyle;
      if (savedStyle === 'realistic' || savedStyle === 'classic') {
        this.horrorStyle = savedStyle;
      }

      // Auto unlock audio context on first user interaction
      const unlockAudio = () => {
        this.initCtx();
        if (this.enabled && this.ambienceEnabled) {
          this.startHorrorAmbience();
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
    }
  }

  // Play custom game audio files from /audio/
  public playAudioFile(filePath: string, volume: number = 0.8): HTMLAudioElement | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    try {
      const audio = new Audio(filePath);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.play().catch(() => {});
      return audio;
    } catch {
      return null;
    }
  }

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(val?: boolean): boolean {
    this.enabled = val !== undefined ? val : !this.enabled;
    localStorage.setItem('ar_ghost_sound_enabled', String(this.enabled));
    if (this.enabled) {
      this.playClick();
      if (this.ambienceEnabled) {
        this.startHorrorAmbience();
      }
    } else {
      this.stopHorrorAmbience();
    }
    return this.enabled;
  }

  public toggleAmbience(val?: boolean): boolean {
    this.ambienceEnabled = val !== undefined ? val : !this.ambienceEnabled;
    localStorage.setItem('ar_ghost_ambience_enabled', String(this.ambienceEnabled));
    if (this.ambienceEnabled && this.enabled) {
      this.startHorrorAmbience();
      this.playClick();
    } else {
      this.stopHorrorAmbience();
    }
    return this.ambienceEnabled;
  }

  public setHorrorStyle(style: HorrorAudioStyle) {
    this.horrorStyle = style;
    localStorage.setItem('ar_ghost_horror_style', style);
    this.playClick();
  }

  // ==========================================
  // 1. HAUNTING AMBIENCE DRONE (BGM บรรยากาศหลอน)
  // Continuous horror soundscape using generated game audio file + procedural synth layers
  // ==========================================
  public startHorrorAmbience() {
    if (!this.enabled || !this.ambienceEnabled || this.isAmbienceRunning) return;
    this.isAmbienceRunning = true;

    // A. Play custom game horror ambience audio file (looping)
    if (typeof window !== 'undefined') {
      try {
        if (!this.bgmAudio) {
          this.bgmAudio = new Audio('/audio/bgm_ghost_school_theme.wav');
          this.bgmAudio.loop = true;
          this.bgmAudio.volume = 0.42;
        }
        this.bgmAudio.currentTime = 0;
        this.bgmAudio.play().catch(() => {});
      } catch {}
    }

    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      // Master ambient gain with smooth fade in
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, t);
      masterGain.gain.linearRampToValueAtTime(0.12, t + 3.0);
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      // Layer A: Sparkling Crystal Wind Chimes (แทนเสียง Sub-Bass หึ่งๆ ด้วยกระดิ่งลมแก้วคริสตัลใส)
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(880, t); // A5 crystalline
      chimeGain.gain.setValueAtTime(0.04, t);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(masterGain);
      chimeOsc.start(t);

      // Layer B: Warm Mid-Range Celestial String Pad (เสียงคอร์ดอบอุ่น ย่านกลาง 220Hz-330Hz ไม่มีเบสหึ่ง)
      const pad1 = this.ctx.createOscillator();
      const pad2 = this.ctx.createOscillator();
      const padFilter = this.ctx.createBiquadFilter();
      const padGain = this.ctx.createGain();

      pad1.type = 'sine';
      pad2.type = 'triangle';
      pad1.frequency.setValueAtTime(220, t); // A3 (Mid tone)
      pad2.frequency.setValueAtTime(261.63, t); // C4 (Mid tone)

      // High-pass filter to guarantee zero sub-bass rumble
      padFilter.type = 'highpass';
      padFilter.frequency.setValueAtTime(180, t);
      padFilter.Q.setValueAtTime(1.0, t);

      padGain.gain.setValueAtTime(0.06, t);

      pad1.connect(padFilter);
      pad2.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(masterGain);

      pad1.start(t);
      pad2.start(t);

      // Layer C: Ghostly howling wind (Filtered pink/white noise sweep)
      const bufferLength = this.ctx.sampleRate * 4; // 4 seconds noise loop
      const noiseBuffer = this.ctx.createBuffer(1, bufferLength, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferLength; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise approximation
        lastOut = (lastOut + 0.02 * white) / 1.02;
        output[i] = lastOut * 3.5;
      }

      const windSource = this.ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(280, t);
      windFilter.Q.setValueAtTime(3.5, t);

      // LFO filter sweep for howling draft
      const windLfo = this.ctx.createOscillator();
      const windLfoGain = this.ctx.createGain();
      windLfo.frequency.setValueAtTime(0.15, t); // Slow 0.15Hz sweep
      windLfoGain.gain.setValueAtTime(140, t);
      windLfo.connect(windFilter.frequency);
      windLfo.start(t);

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.2, t);

      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      windSource.start(t);

      this.ambientSources = [
        { stop: () => chimeOsc.stop(), disconnect: () => chimeOsc.disconnect() },
        { stop: () => pad1.stop(), disconnect: () => pad1.disconnect() },
        { stop: () => pad2.stop(), disconnect: () => pad2.disconnect() },
        { stop: () => windSource.stop(), disconnect: () => windSource.disconnect() },
        { stop: () => windLfo.stop(), disconnect: () => windLfo.disconnect() },
      ];

      // Occasional faint spectral whisper in the distance
      this.ambientTimer = setInterval(() => {
        if (this.isAmbienceRunning && this.enabled && Math.random() > 0.45) {
          this.playGhostWhisper(true);
        }
      }, 14000);
    } catch {
      this.isAmbienceRunning = false;
    }
  }

  public stopHorrorAmbience() {
    this.isAmbienceRunning = false;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch {}
    }
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, t);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
        setTimeout(() => {
          this.ambientSources.forEach((src) => {
            try {
              src.stop?.();
              src.disconnect?.();
            } catch {}
          });
          this.ambientSources = [];
        }, 1300);
      } catch {
        this.ambientSources = [];
      }
    }
  }

  public isThemePlaying(): boolean {
    return this.isAmbienceRunning;
  }

  public toggleGameTheme(): boolean {
    if (this.isAmbienceRunning) {
      this.stopHorrorAmbience();
      return false;
    } else {
      this.startHorrorAmbience();
      return true;
    }
  }

  // ==========================================
  // 2. TENSION HEARTBEAT (เสียงหัวใจเต้นตึกตัก)
  // Double-pulse visceral low end for proximity/timer tension
  // ==========================================
  public playHeartbeat(volumeMultiplier = 1.0) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // First beat (Lub) - deep and heavy
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(58, t);
    osc1.frequency.exponentialRampToValueAtTime(32, t + 0.12);

    gain1.gain.setValueAtTime(0.35 * volumeMultiplier, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.15);

    // Second beat (Dub) - slightly softer and higher
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(52, t + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(28, t + 0.28);

    gain2.gain.setValueAtTime(0.24 * volumeMultiplier, t + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.18);
    osc2.stop(t + 0.32);
  }

  // ==========================================
  // 3. HORROR JUMP STINGER (เสียงผีโผล่สยองขวัญ / จัมป์สแกร์)
  // Deep sub impact + metallic distortion screech + ghost vocal wail
  // ==========================================
  public playHorrorStinger() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/sfx_ghost_stinger.wav', 0.85);
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Layer 1: Sub Bass Boom Impact
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(95, t);
    sub.frequency.exponentialRampToValueAtTime(26, t + 0.45);

    subGain.gain.setValueAtTime(0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.52);

    // Layer 2: Dissonant horror cluster chord (minor 2nd / tritone screech)
    const clusterFreqs = [587.33, 622.25, 880.0, 932.33]; // D5, Eb5, A5, Bb5 (hair-raising discord)
    clusterFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      // Pitch jitter vibrato
      osc.frequency.linearRampToValueAtTime(freq * (1 + (idx % 2 === 0 ? 0.03 : -0.03)), t + 0.2);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.48);
    });

    // Layer 3: Ghost vocal screech / wail sweep
    this.playGhostVoice(t + 0.06);
  }

  // ==========================================
  // 4. GHOST VOICE / SPECTRAL FORMANT WAIL
  // ==========================================
  private playGhostVoice(startTime: number) {
    if (!this.ctx) return;
    const t = startTime;

    const voiceOsc = this.ctx.createOscillator();
    const voiceGain = this.ctx.createGain();

    // Spooky vibrato LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(6.0, t);
    lfoGain.gain.setValueAtTime(18, t);
    lfo.connect(voiceOsc.frequency);
    lfo.start(t);
    lfo.stop(t + 1.1);

    voiceOsc.type = 'sawtooth';
    voiceOsc.frequency.setValueAtTime(180, t);
    voiceOsc.frequency.exponentialRampToValueAtTime(260, t + 0.3);
    voiceOsc.frequency.exponentialRampToValueAtTime(130, t + 1.0);

    // Formant filters for spooky "OO-AA-OO" vowel
    const formant = this.ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.setValueAtTime(450, t);
    formant.frequency.linearRampToValueAtTime(680, t + 0.4);
    formant.frequency.linearRampToValueAtTime(380, t + 1.0);
    formant.Q.setValueAtTime(4.5, t);

    voiceGain.gain.setValueAtTime(0.001, t);
    voiceGain.gain.linearRampToValueAtTime(0.24, t + 0.12);
    voiceGain.gain.exponentialRampToValueAtTime(0.001, t + 1.05);

    voiceOsc.connect(formant);
    formant.connect(voiceGain);
    voiceGain.connect(this.ctx.destination);

    voiceOsc.start(t);
    voiceOsc.stop(t + 1.1);
  }

  // ==========================================
  // 5. GHOST APPARITION CALL (Used on ghost encounter)
  // Switches based on Horror Style (Realistic vs Classic)
  // ==========================================
  public playBoo() {
    if (this.horrorStyle === 'realistic') {
      this.playHorrorStinger();
    } else {
      // Classic friendly "Boo"
      this.playClassicBoo();
    }
  }

  public playGhostAppears() {
    this.playBoo();
  }

  private playClassicBoo() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bOsc = this.ctx.createOscillator();
    const bGain = this.ctx.createGain();
    bOsc.type = 'sine';
    bOsc.frequency.setValueAtTime(180, t);
    bOsc.frequency.exponentialRampToValueAtTime(75, t + 0.08);

    bGain.gain.setValueAtTime(0.25, t);
    bGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    bOsc.connect(bGain);
    bGain.connect(this.ctx.destination);
    bOsc.start(t);
    bOsc.stop(t + 0.09);

    this.playGhostVoice(t + 0.04);
  }

  // ==========================================
  // 6. GHOST ANGER / WRONG ANSWER WAIL (เสียงวิญญาณโกรธเกรี้ยว)
  // Glitch static + descending groan + hollow metallic strike
  // ==========================================
  public playWrongAnswer() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/sfx_curse_fail.wav', 0.8);
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Glitch static burst
    const bufferSize = this.ctx.sampleRate * 0.25;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (i % 2 === 0 ? 0.9 : -0.9);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(200, t + 0.25);
    noiseFilter.Q.setValueAtTime(3.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
    noise.stop(t + 0.26);

    // Eerie descending moan
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(210, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.45);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.46);
  }

  // ==========================================
  // 7. GHOST WHISPER (เสียงกระซิบวิญญาณ)
  // ==========================================
  public playGhostWhisper(subtle = false) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = subtle ? 1.6 : 0.9;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, t);
    filter.frequency.exponentialRampToValueAtTime(450, t + duration);
    filter.Q.setValueAtTime(7.0, t);

    const gain = this.ctx.createGain();
    const maxGain = subtle ? 0.05 : 0.14;
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(maxGain, t + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + duration);
  }

  // ==========================================
  // GHOST ANGER / ESCAPE (เสียงผีหนีหรือคำรามเมื่อหมดเวลา)
  // ==========================================
  public playGhostAnger() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.8);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.86);

    // Also trigger ghostly whisper
    this.playGhostWhisper(false);
  }

  // ==========================================
  // 8. HOLY TEMPLE BELL / EXORCISM CHIME (ระฆังปราบมาร)
  // Deep singing bowl resonant harmonics with glorious decay
  // ==========================================
  public playHolyBell() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Bell partials (fundamental + inharmonic overtones)
    const partials = [
      { freq: 329.63, gain: 0.3, decay: 2.2 }, // E4
      { freq: 659.25, gain: 0.18, decay: 1.8 }, // E5
      { freq: 987.77, gain: 0.12, decay: 1.4 }, // B5
      { freq: 1318.51, gain: 0.08, decay: 1.1 }, // E6
      { freq: 1760.0, gain: 0.05, decay: 0.8 }, // A6
    ];

    partials.forEach((p) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, t);

      gain.gain.setValueAtTime(p.gain, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + p.decay + 0.05);
    });
  }

  // ==========================================
  // 9. EXORCISM SUCCESS (ระฆังธรรมจักร + ประกายดาวปัญญา)
  // ==========================================
  public playPurifySuccess() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/sfx_exorcism_chime.wav', 0.85);
    this.playHolyBell();
    setTimeout(() => {
      this.playSparkle();
    }, 180);
  }

  // ==========================================
  // 10. EMF METER / SPIRIT BOX TICKS & RADAR PING
  // ==========================================
  public playRadarPing() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/sfx_radar_ping.wav', 0.75);
    this.playEmfTick();
  }

  public playEmfTick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Geiger crackle + electrical pulse
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(45, t + 0.025);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  // ==========================================
  // 11. SPARKLE (Correct Math Solution)
  // ==========================================
  public playSparkle() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const sparkleNotes = [1318.51, 1567.98, 1760.0, 2093.0, 2637.02, 3135.96, 3520.0, 4186.01];

    sparkleNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteTime = t + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.14, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.38);
    });
  }

  // ==========================================
  // 12. CAMERA SHUTTER & UI CLICKS
  // ==========================================
  public playShutter() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/sfx_camera_shutter.wav', 0.85);
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.09);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playClick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playItemUse() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.25);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  // Sacred Water item effect
  public playHolyWater() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/sfx_holy_water.wav', 0.85);
    this.playItemUse();
  }

  // Talisman paper burning swoosh
  public playTalismanBurn() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/sfx_talisman_burn.wav', 0.85);
    this.playItemUse();
  }

  // AI Ghost Voices
  public playGhostVoiceIntro() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/voice_ghost_intro.mp3', 0.95);
  }

  public playGhostVoiceWrong() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/voice_ghost_wrong.mp3', 0.95);
  }

  public playGhostVoicePurified() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/voice_ghost_purified.mp3', 0.95);
  }

  public playRadarDetectedVoice() {
    if (!this.enabled) return;
    this.playAudioFile('/audio/voice_radar_detected.mp3', 0.95);
  }

  public playFanfare() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }
}

export const sounds = new SoundManager();
