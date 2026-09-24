const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to write a 16-bit mono or stereo WAV file
function createWavBuffer(sampleRate, channels, sampleGenerator, durationSec) {
  const totalSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = channels * 2;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const progress = i / totalSamples;
    const [left, right] = sampleGenerator(t, progress, i, totalSamples);

    // Clamp to -1.0 to 1.0 and convert to Int16
    const clampedLeft = Math.max(-1, Math.min(1, left));
    const clampedRight = Math.max(-1, Math.min(1, right !== undefined ? right : left));

    const intLeft = Math.floor(clampedLeft * 32767);
    const intRight = Math.floor(clampedRight * 32767);

    buffer.writeInt16LE(intLeft, offset);
    offset += 2;
    if (channels === 2) {
      buffer.writeInt16LE(intRight, offset);
      offset += 2;
    }
  }

  return buffer;
}

console.log('Generating procedural horror sound effects and ambience...');

const SAMPLE_RATE = 44100;

// 1. HAUNTING AMBIENCE LOOP (12.0 seconds seamless horror drone)
// Sub rumble + dissonant tritone spectral pads + whispering wind texture + binaural suspense pulse
const ambienceBuffer = createWavBuffer(SAMPLE_RATE, 2, (t, p, i, total) => {
  // Seamless loop envelope (fade in/out seamlessly at boundaries)
  const loopEnv = Math.sin(p * Math.PI);

  // Sub bass drone at 55Hz (A1) and detuned 55.8Hz
  const subL = Math.sin(2 * Math.PI * 55 * t) * 0.28;
  const subR = Math.sin(2 * Math.PI * 55.6 * t) * 0.28;

  // Dissonant dark pad: Tritone interval (110Hz and 155.56Hz Eb)
  const pad1 = Math.sin(2 * Math.PI * (110 + Math.sin(t * 0.4) * 1.5) * t) * 0.16;
  const pad2 = Math.sin(2 * Math.PI * (155.56 + Math.cos(t * 0.3) * 1.8) * t) * 0.14;

  // Minor second eerie frequency beating (220Hz and 233Hz Bb) with slow tremolo
  const eerieMod = (Math.sin(2 * Math.PI * 0.25 * t) + 1) * 0.5;
  const eerieHighL = Math.sin(2 * Math.PI * 220 * t) * (0.07 * eerieMod);
  const eerieHighR = Math.sin(2 * Math.PI * 233.08 * t) * (0.07 * eerieMod);

  // Wind hiss texture using pseudo noise modulated by low frequency
  const noise = (Math.sin(i * 12.9898 + t) * 43758.5453) % 1;
  const windFilter = Math.sin(t * 1.2) * 0.5 + 0.5;
  const windL = (noise - 0.5) * 0.04 * windFilter;
  const windR = (((noise * 2.3) % 1) - 0.5) * 0.04 * windFilter;

  // Ghostly bell overtone chime in the distance (at t = 3s and t = 8s)
  let distantBell = 0;
  [2.5, 7.5].forEach((strikeTime) => {
    if (t >= strikeTime && t <= strikeTime + 3.0) {
      const strikeAge = t - strikeTime;
      const decay = Math.exp(-strikeAge * 1.8);
      distantBell += (Math.sin(2 * Math.PI * 880 * strikeAge) +
                      Math.sin(2 * Math.PI * 1320 * strikeAge) * 0.5 +
                      Math.sin(2 * Math.PI * 1760 * strikeAge) * 0.25) * decay * 0.09;
    }
  });

  const left = (subL + pad1 + eerieHighL + windL + distantBell) * (0.6 + 0.4 * loopEnv);
  const right = (subR + pad2 + eerieHighR + windR + distantBell * 0.7) * (0.6 + 0.4 * loopEnv);
  return [left, right];
}, 12.0);
fs.writeFileSync(path.join(OUTPUT_DIR, 'ambience_horror_school.wav'), ambienceBuffer);
console.log('✓ ambience_horror_school.wav created (12s loop)');

// 2. JUMPSCARE / GHOST ENCOUNTER STINGER (1.8 seconds)
// Sudden impact shockwave + metallic distortion screech + sub bass drop
const stingerBuffer = createWavBuffer(SAMPLE_RATE, 2, (t, p) => {
  const env = Math.exp(-t * 2.5); // fast decay
  // Sub drop from 120Hz down to 35Hz
  const subFreq = Math.max(35, 120 - t * 90);
  const sub = Math.sin(2 * Math.PI * subFreq * t) * env * 0.6;

  // Dissonant metallic screech (FM modulation)
  const mod = Math.sin(2 * Math.PI * 173 * t) * 400;
  const screech = Math.sin(2 * Math.PI * (640 + mod) * t) * Math.exp(-t * 3.5) * 0.35;

  // Harsh noise burst at instant 0
  const noiseEnv = Math.exp(-t * 12.0);
  const burst = (Math.random() * 2 - 1) * noiseEnv * 0.4;

  const out = sub + screech + burst;
  return [out, out * 0.95];
}, 1.8);
fs.writeFileSync(path.join(OUTPUT_DIR, 'sfx_ghost_stinger.wav'), stingerBuffer);
console.log('✓ sfx_ghost_stinger.wav created');

// 3. AR RADAR / EMF DETECTOR PING (0.75 seconds)
// High-tech sonar ping with rapid Geiger clicks
const radarBuffer = createWavBuffer(SAMPLE_RATE, 2, (t) => {
  // Sine ping 980Hz decaying
  const ping = Math.sin(2 * Math.PI * 980 * t) * Math.exp(-t * 6.0) * 0.35;
  const harmonic = Math.sin(2 * Math.PI * 1960 * t) * Math.exp(-t * 9.0) * 0.15;

  // Geiger clicks
  let click = 0;
  const clickTimes = [0.08, 0.18, 0.25, 0.32, 0.48, 0.61];
  clickTimes.forEach((ct) => {
    if (t >= ct && t < ct + 0.015) {
      const cAge = t - ct;
      click += (Math.random() * 2 - 1) * Math.exp(-cAge * 300) * 0.4;
    }
  });

  return [ping + harmonic + click, ping + harmonic * 0.8 + click * 1.1];
}, 0.75);
fs.writeFileSync(path.join(OUTPUT_DIR, 'sfx_radar_ping.wav'), radarBuffer);
console.log('✓ sfx_radar_ping.wav created');

// 4. EXORCISM / PURIFICATION CELEBRATION CHIME (2.5 seconds)
// Celestial sacred bells cascading in a pentatonic harmony with shimmering reverberation
const exorcismBuffer = createWavBuffer(SAMPLE_RATE, 2, (t) => {
  // Arpeggio notes: C6 (1046Hz), E6 (1318Hz), G6 (1567Hz), C7 (2093Hz)
  const notes = [
    { freq: 1046.5, time: 0.0 },
    { freq: 1318.5, time: 0.12 },
    { freq: 1567.9, time: 0.24 },
    { freq: 2093.0, time: 0.38 },
    { freq: 2637.0, time: 0.52 },
  ];

  let left = 0;
  let right = 0;

  notes.forEach((note, idx) => {
    if (t >= note.time) {
      const dt = t - note.time;
      const decay = Math.exp(-dt * 2.2);
      const fundamental = Math.sin(2 * Math.PI * note.freq * dt);
      const overtone = Math.sin(2 * Math.PI * note.freq * 2.01 * dt) * 0.3;
      const sparkle = Math.sin(2 * Math.PI * note.freq * 3.0 * dt) * 0.15;
      const val = (fundamental + overtone + sparkle) * decay * 0.22;
      if (idx % 2 === 0) {
        left += val;
        right += val * 0.7;
      } else {
        left += val * 0.7;
        right += val;
      }
    }
  });

  // Warm resonant low chime chord
  if (t >= 0.4) {
    const dt = t - 0.4;
    const baseDecay = Math.exp(-dt * 1.2);
    const lowChime = (Math.sin(2 * Math.PI * 523.25 * dt) + Math.sin(2 * Math.PI * 659.25 * dt) * 0.5) * baseDecay * 0.15;
    left += lowChime;
    right += lowChime;
  }

  return [left, right];
}, 2.5);
fs.writeFileSync(path.join(OUTPUT_DIR, 'sfx_exorcism_chime.wav'), exorcismBuffer);
console.log('✓ sfx_exorcism_chime.wav created');

// 5. CURSE FAILURE / TIMEOUT JUMPSCARE (1.5 seconds)
// Low demonic rumble with dissonant horror shock
const failBuffer = createWavBuffer(SAMPLE_RATE, 2, (t) => {
  const env = Math.exp(-t * 2.2);
  const lowThud = Math.sin(2 * Math.PI * (80 - t * 40) * t) * env * 0.55;
  // Dissonant low tritone (70Hz and 99Hz)
  const tritone = (Math.sin(2 * Math.PI * 70 * t) + Math.sin(2 * Math.PI * 99 * t)) * env * 0.35;
  // Ghostly reverse gasp
  const noise = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.12 * Math.exp(-t * 1.5);
  return [lowThud + tritone + noise, lowThud + tritone * 0.9 + noise];
}, 1.5);
fs.writeFileSync(path.join(OUTPUT_DIR, 'sfx_curse_fail.wav'), failBuffer);
console.log('✓ sfx_curse_fail.wav created');

// 6. SACRED WATER (HOLY WATER) ITEM BLESSING (1.8 seconds)
// Pure water drop ripple + celestial blessing soundwave
const holyWaterBuffer = createWavBuffer(SAMPLE_RATE, 2, (t) => {
  // Water droplet chirp (pitch sweeps up quickly: 400Hz to 1200Hz)
  let drop = 0;
  if (t < 0.25) {
    const dropFreq = 400 + (t / 0.25) * 800;
    drop = Math.sin(2 * Math.PI * dropFreq * t) * Math.sin((t / 0.25) * Math.PI) * 0.45;
  }

  // Sacred angelic resonant glow
  let glow = 0;
  if (t >= 0.1) {
    const dt = t - 0.1;
    const decay = Math.exp(-dt * 1.8);
    glow = (Math.sin(2 * Math.PI * 659.25 * dt) +
            Math.sin(2 * Math.PI * 987.77 * dt) * 0.6 +
            Math.sin(2 * Math.PI * 1318.5 * dt) * 0.35) * decay * 0.25;
  }

  return [drop + glow, drop * 0.85 + glow];
}, 1.8);
fs.writeFileSync(path.join(OUTPUT_DIR, 'sfx_holy_water.wav'), holyWaterBuffer);
console.log('✓ sfx_holy_water.wav created');

// 7. TALISMAN ELIMINATION / PAPER BURN (1.2 seconds)
// Mystical fire whoosh + parchment burning sizzle
const talismanBuffer = createWavBuffer(SAMPLE_RATE, 2, (t) => {
  const whooshEnv = Math.sin(Math.min(1, t / 0.7) * Math.PI);
  const whooshFreq = 220 + Math.sin(t * 5) * 120;
  const whoosh = Math.sin(2 * Math.PI * whooshFreq * t) * whooshEnv * 0.3;

  // Crackling fire noise
  const crackle = (Math.random() > 0.85 ? (Math.random() * 2 - 1) : 0) * Math.exp(-t * 2.0) * 0.4;
  return [whoosh + crackle, whoosh + crackle * 0.9];
}, 1.2);
fs.writeFileSync(path.join(OUTPUT_DIR, 'sfx_talisman_burn.wav'), talismanBuffer);
console.log('✓ sfx_talisman_burn.wav created');

// 8. CAMERA AR SCANNER SHUTTER SNAP (0.6 seconds)
// Mechanical camera click + high-frequency spectral flash
const shutterBuffer = createWavBuffer(SAMPLE_RATE, 2, (t) => {
  let click1 = 0;
  let click2 = 0;
  if (t < 0.05) click1 = (Math.random() * 2 - 1) * Math.exp(-t * 90) * 0.6;
  if (t >= 0.08 && t < 0.15) click2 = (Math.random() * 2 - 1) * Math.exp(-(t - 0.08) * 80) * 0.5;

  const scanTone = Math.sin(2 * Math.PI * (1400 + t * 600) * t) * Math.exp(-t * 6.0) * 0.2;
  return [click1 + click2 + scanTone, click1 + click2 + scanTone];
}, 0.6);
fs.writeFileSync(path.join(OUTPUT_DIR, 'sfx_camera_shutter.wav'), shutterBuffer);
console.log('✓ sfx_camera_shutter.wav created');

// 9. AI GHOST SPOKEN WHISPERS IN THAI (บันทึกเป็นไฟล์เสียงจริงในเกม)
console.log('Fetching AI Ghost voice lines in Thai for specific game events...');

const ghostVoiceLines = [
  {
    fileName: 'voice_ghost_intro.mp3',
    text: 'จงแก้คำสาปตัวเลข ก่อนที่เวลาจะหมดลง...',
  },
  {
    fileName: 'voice_ghost_wrong.mp3',
    text: 'เจ้าตอบผิด คำสาปยังคงอยู่...',
  },
  {
    fileName: 'voice_ghost_purified.mp3',
    text: 'ขอบคุณที่ช่วยคิดเลข ปลดปล่อยวิญญาณสู่สุคติ...',
  },
  {
    fileName: 'voice_radar_detected.mp3',
    text: 'ตรวจพบพลังงานวิญญาณสถิตอยู่ใกล้ๆ นี้...',
  },
];

async function downloadThaiVoice(text, targetPath) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=th&client=tw-ob`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(targetPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ ${path.basename(targetPath)} created (${fs.statSync(targetPath).size} bytes)`);
          resolve(true);
        });
      } else {
        console.warn(`Failed to fetch ${url} (status: ${res.statusCode})`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.warn(`Error fetching ${targetPath}:`, err.message);
      resolve(false);
    });
  });
}

(async () => {
  for (const line of ghostVoiceLines) {
    const target = path.join(OUTPUT_DIR, line.fileName);
    await downloadThaiVoice(line.text, target);
  }
  console.log('🎉 All game audio files generated successfully into /public/audio!');
})();
