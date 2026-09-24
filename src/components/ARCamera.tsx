import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  Upload,
  Zap,
  ZapOff,
  Sun,
  Crosshair,
  Compass,
  Radio,
  Eye,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { VisionFilter } from '../types';
import { sounds } from '../utils/audio';
import { SAMPLE_SCHOOL_SPOTS, SampleSpot } from '../utils/sampleImages';
import { GhostRadarHUD } from './GhostRadarHUD';

interface ARCameraProps {
  onCaptureImage: (imageBase64: string) => void;
  isAnalyzing: boolean;
}

export const ARCamera: React.FC<ARCameraProps> = ({
  onCaptureImage,
  isAnalyzing,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [spotlightOn, setSpotlightOn] = useState<boolean>(true);
  const [brightnessBoost, setBrightnessBoost] = useState<number>(1.3); // Default +30% bright so it's never dark
  const [emfLevel, setEmfLevel] = useState<number>(2); // 1 to 5
  const [visionFilter, setVisionFilter] = useState<VisionFilter>('clear'); // Default clear bright view
  const [showVirtualSpots, setShowVirtualSpots] = useState<boolean>(false);
  const [selectedSpotImage, setSelectedSpotImage] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Helper to create an atmospheric radar scan canvas when no camera or photo is loaded
  const createFallbackCanvas = (): string => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dark horror school atmosphere gradient
        const grad = ctx.createRadialGradient(320, 240, 50, 320, 240, 320);
        grad.addColorStop(0, '#132822');
        grad.addColorStop(1, '#05070a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 640, 480);

        // Paranormal grid
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(60, 40, 520, 400);

        // Center reticle
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(320, 240, 70, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = '14px monospace';
        ctx.fillText('EMF ANOMALY DETECTED [PARANORMAL RADAR]', 80, 70);
        return canvas.toDataURL('image/jpeg', 0.85);
      }
    } catch {}
    return '';
  };

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        if (selectedSpotImage) {
          // In virtual spot mode, don't keep hardware camera open
          return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง');
        }

        // Stop previous tracks
        if (videoRef.current && videoRef.current.srcObject) {
          const oldStream = videoRef.current.srcObject as MediaStream;
          oldStream.getTracks().forEach((t) => t.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setHasCamera(true);

        // Check torch capability
        const track = stream.getVideoTracks()[0];
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
        setHasTorch(!!capabilities.torch);
      } catch (err: any) {
        console.warn('Camera access issue:', err);
        setHasCamera(false);
        setCameraError('ไม่สามารถเปิดกล้องจริงได้ ระบบได้เตรียมฉากจำลองโรงเรียนอาถรรพ์ให้ใช้งานแทนได้ทันที');
        // Automatically default to the first haunted school spot if not already set, so viewfinder is never empty
        setSelectedSpotImage((prev) => prev || SAMPLE_SCHOOL_SPOTS[0].imageUrl);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, selectedSpotImage]);

  // Fluctuating EMF Meter
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate paranormal readings
      const base = Math.floor(Math.random() * 3) + 1; // 1-3
      const spike = Math.random() > 0.7 ? 4 : Math.random() > 0.9 ? 5 : base;
      setEmfLevel(spike);
      if (spike >= 4) {
        sounds.playEmfTick();
      }
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const toggleCamera = () => {
    sounds.playClick();
    setSelectedSpotImage(null);
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const toggleTorch = async () => {
    sounds.playClick();
    if (!videoRef.current || !videoRef.current.srcObject) return;
    const stream = videoRef.current.srcObject as MediaStream;
    const track = stream.getVideoTracks()[0];
    if (track && hasTorch) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn(!torchOn);
      } catch (e) {
        console.error('Torch error:', e);
      }
    }
  };

  const handleCapture = () => {
    if (isAnalyzing) return;
    sounds.playShutter();

    // Trigger visual shutter flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 220);

    // If using virtual spot image
    if (selectedSpotImage) {
      onCaptureImage(selectedSpotImage);
      return;
    }

    let capturedDataUrl: string | null = null;
    const video = videoRef.current;

    // Safely capture from video stream
    try {
      if (video && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Apply mirror if user facing camera
          if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          // Brighten snapshot if camera boost is active so AI analysis gets clear images
          if (brightnessBoost > 1.0) {
            ctx.filter = `brightness(${brightnessBoost})`;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          capturedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
      }
    } catch (err) {
      console.warn('Direct video capture error, falling back to simulated snapshot:', err);
    }

    // Bulletproof fallback: If video was not ready or browser threw canvas error
    if (!capturedDataUrl) {
      const fallbackUrl = SAMPLE_SCHOOL_SPOTS[0]?.imageUrl || createFallbackCanvas();
      setSelectedSpotImage(fallbackUrl);
      capturedDataUrl = fallbackUrl;
    }

    onCaptureImage(capturedDataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playShutter();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 220);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSelectedSpotImage(dataUrl);
        onCaptureImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSampleSpot = async (spot: SampleSpot) => {
    sounds.playClick();
    setSelectedSpotImage(spot.imageUrl);
    setShowVirtualSpots(false);
  };

  // Dynamic CSS filter calculating brightness boost & eerie color palettes without darkening the scene
  const getFilterCss = () => {
    const b = Math.round(100 * brightnessBoost);
    switch (visionFilter) {
      case 'clear':
        // Crisp, natural, bright viewfinder
        return `contrast(102%) brightness(${b}%) saturate(105%)`;
      case 'night':
        // High-sensitivity Night Vision: significantly amplifies ambient light in green phosphor spectrum
        return `contrast(115%) brightness(${Math.round(b * 1.35)}%) saturate(130%) hue-rotate(90deg) sepia(15%)`;
      case 'spectral':
        // Paranormal ultraviolet ghost frequency (bright purple/cyan luminescence)
        return `contrast(110%) brightness(${Math.round(b * 1.2)}%) hue-rotate(240deg) saturate(120%)`;
      case 'horror':
        // Atmospheric found-footage ghost cam: vibrant clarity with cold cinematic tone
        return `contrast(110%) brightness(${Math.round(b * 1.05)}%) saturate(92%) hue-rotate(-5deg)`;
      case 'shadow':
        // High-contrast paranormal monochrome
        return `contrast(125%) brightness(${Math.round(b * 1.15)}%) grayscale(100%)`;
      default:
        return `contrast(102%) brightness(${b}%) saturate(100%)`;
    }
  };

  const cycleBrightness = () => {
    sounds.playClick();
    setBrightnessBoost((prev) => {
      if (prev <= 1.05) return 1.3;
      if (prev <= 1.35) return 1.6;
      if (prev <= 1.65) return 2.0;
      return 1.0;
    });
  };

  const cycleVisionFilter = () => {
    sounds.playClick();
    setVisionFilter((prev) => {
      if (prev === 'clear') return 'night';
      if (prev === 'night') return 'spectral';
      if (prev === 'spectral') return 'horror';
      if (prev === 'horror') return 'shadow';
      return 'clear';
    });
  };

  const toggleFlashlight = () => {
    sounds.playClick();
    if (hasTorch) {
      toggleTorch();
    } else {
      setSpotlightOn(!spotlightOn);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-black select-none">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onClick={(e) => {
          (e.target as HTMLInputElement).value = '';
        }}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Instant Shutter Flash Overlay */}
      {isFlashing && (
        <div className="absolute inset-0 z-50 bg-white/70 pointer-events-none transition-opacity duration-150" />
      )}

      {/* Main Viewfinder Video or Simulated Spot */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {selectedSpotImage ? (
          <img
            src={selectedSpotImage}
            alt="Virtual Spot"
            style={{ filter: getFilterCss() }}
            className="w-full h-full object-cover transition-all duration-300"
          />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            onLoadedMetadata={(e) => {
              (e.target as HTMLVideoElement).play().catch(() => {});
            }}
            style={{ filter: getFilterCss() }}
            className={`w-full h-full object-cover transition-all duration-300 ${
              facingMode === 'user' ? 'scale-x-[-1]' : ''
            }`}
          />
        )}

        {/* Ambient Illuminating Flashlight Spotlight Beam (Brightens dark center) */}
        {spotlightOn && (
          <div className="absolute inset-0 flashlight-spotlight pointer-events-none transition-opacity duration-300" />
        )}

        {/* Subtle Frame Vignette (Keeps screen fully bright & clear) */}
        <div className="absolute inset-0 horror-vignette pointer-events-none" />

        {/* Gentle Screen Color Grading (Screen blend to preserve all brightness) */}
        {visionFilter === 'night' && (
          <div className="absolute inset-0 bg-emerald-500/10 mix-blend-screen pointer-events-none" />
        )}
        {visionFilter === 'spectral' && (
          <div className="absolute inset-0 bg-purple-500/15 mix-blend-screen pointer-events-none" />
        )}
        {visionFilter === 'horror' && (
          <div className="absolute inset-0 bg-teal-500/10 mix-blend-screen pointer-events-none" />
        )}

        {/* Drifting Ghostly Mist Layer (Gentle translucent atmosphere) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div
            className="absolute -inset-10 horror-fog"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(130, 220, 180, 0.15), transparent 70%)',
            }}
          />
        </div>

        {/* Retro Camcorder Scanlines (Subtle translucent highlight, not darkening) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 vhs-flicker"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.08) 4px)',
          }}
        />

        {/* Analyzing Laser Animation */}
        {isAnalyzing && (
          <div className="absolute inset-0 pointer-events-none z-30">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-4" />
              <div className="bg-slate-900/95 border border-emerald-500/50 px-5 py-2.5 rounded-2xl shadow-xl text-center">
                <p className="text-emerald-400 font-bold text-sm tracking-wide animate-pulse">
                  🔮 กำลังวิเคราะห์คลื่นวิญญาณในวัตถุ...
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  ผู้คุมเกมกำลังตรวจสอบประวัติศาสตร์ความอาฆาตและคำสาปสมการ
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AR HUD: Top Toolbar (Clean, No Overlap) */}
      <div className="relative z-10 px-3 sm:px-4 py-2 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/90 via-black/50 to-transparent gap-2 shrink-0">
        {/* Left Side: Real-time Sonar Proximity Radar & Status */}
        <div className="flex items-center gap-2">
          <GhostRadarHUD />

          {/* Compact EMF & REC readout */}
          <div className="hidden sm:flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-mono text-[10px] bg-black/80 px-2 py-0.5 rounded-full border border-red-950/80">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
              <span className="text-red-500 font-bold tracking-wider">● REC [AR-CAM]</span>
            </div>

            {/* Compact EMF Meter */}
            <div className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded-full border border-red-950/80">
              <Radio className={`w-3 h-3 ${emfLevel >= 4 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-[9px] font-mono text-slate-400 mr-0.5">EMF</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className={`w-1.5 h-2 rounded-xs transition-colors ${
                      lvl <= emfLevel
                        ? lvl >= 4
                          ? 'bg-red-500 shadow-[0_0_6px_#ef4444]'
                          : lvl === 3
                          ? 'bg-yellow-400'
                          : 'bg-emerald-400'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Camera Tools */}
        <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-md">
          {/* Quick Brightness Boost Button */}
          <button
            onClick={cycleBrightness}
            className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              brightnessBoost > 1.0
                ? 'bg-amber-950/70 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="ปรับความสว่างกล้อง (+30% / +60% / +100%)"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold">
              {brightnessBoost > 1.0 ? `+${Math.round((brightnessBoost - 1) * 100)}%` : 'แสงปกติ'}
            </span>
          </button>

          {/* Flashlight / Torch Toggle */}
          <button
            onClick={toggleFlashlight}
            className={`p-1.5 rounded-xl border transition-all ${
              (hasTorch ? torchOn : spotlightOn)
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title={hasTorch ? 'เปิด/ปิดไฟฉายเครื่อง' : 'เปิด/ปิดสปอตไลท์ส่องสว่าง'}
          >
            {(hasTorch ? torchOn : spotlightOn) ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
          </button>

          {/* Vision Filter Toggle */}
          <button
            onClick={cycleVisionFilter}
            className={`px-2 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              visionFilter === 'clear'
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : visionFilter === 'night'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : visionFilter === 'spectral'
                ? 'bg-purple-950 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : visionFilter === 'horror'
                ? 'bg-red-950 border-red-500/70 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                : 'bg-black border-slate-600 text-slate-300'
            }`}
            title={`ฟิลเตอร์ภาพ: ${visionFilter}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold uppercase hidden sm:inline">
              {visionFilter === 'clear' ? 'ชัดเจน' : visionFilter}
            </span>
          </button>

          {/* Switch Camera */}
          <button
            onClick={toggleCamera}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all active:rotate-180"
            title="สลับกล้องหน้า/หลัง"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AR HUD: Center Reticle Target (Proportionate, no collision) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none px-4 py-2">
        {/* Reticle Box */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 border border-emerald-500/30 rounded-3xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(16,185,129,0.15)]">
          {/* Target Corners */}
          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-red-500/90" />
          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-red-500/90" />
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-red-500/90" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-red-500/90" />

          {/* Center Crosshair */}
          <div className="w-9 h-9 rounded-full border border-dashed border-red-500/60 animate-spin" style={{ animationDuration: '14s' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
        </div>

        {/* Scanning Status Text */}
        <div className="mt-3 bg-black/85 backdrop-blur-sm px-3.5 py-1 rounded-full border border-red-900/60 text-[11px] font-mono text-slate-200 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
          <span>{selectedSpotImage ? 'ล็อคเป้าหมายวัตถุหลอนแล้ว' : 'เล็งกล้องไปที่วัตถุหรือคนรอบตัว'}</span>
        </div>

        {/* Quick Brightness & Spotlight helper chip */}
        <div className="mt-2.5 flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={cycleBrightness}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 hover:bg-black border border-amber-500/50 text-amber-300 text-xs font-medium shadow-lg backdrop-blur-md active:scale-95 transition-all"
            title="แตะเพื่อเพิ่มแสงสว่างกล้องทันที"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>เร่งแสงกล้อง: {brightnessBoost > 1.0 ? `+${Math.round((brightnessBoost - 1) * 100)}%` : 'ปกติ'}</span>
          </button>

          <button
            type="button"
            onClick={toggleFlashlight}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium shadow-lg backdrop-blur-md active:scale-95 transition-all ${
              (hasTorch ? torchOn : spotlightOn)
                ? 'bg-yellow-950/80 border-yellow-400 text-yellow-300'
                : 'bg-black/85 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="เปิด/ปิดไฟฉายสปอตไลท์"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>{(hasTorch ? torchOn : spotlightOn) ? 'ไฟฉาย: เปิด' : 'เปิดไฟฉาย'}</span>
          </button>
        </div>

        {cameraError && !selectedSpotImage && (
          <div className="mt-2.5 max-w-sm p-3 bg-red-950/90 border border-red-800 rounded-xl text-center text-xs text-red-200 pointer-events-auto shadow-lg flex flex-col items-center gap-2">
            <p>{cameraError}</p>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedSpotImage(SAMPLE_SCHOOL_SPOTS[0].imageUrl);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors"
            >
              🕯️ แตะเพื่อใช้ฉากจำลองห้องเรียน (กดถ่ายรูปได้ทันที)
            </button>
          </div>
        )}
      </div>

      {/* AR HUD: Bottom Controls */}
      <div className="relative z-10 px-4 pt-2 pb-4 sm:pb-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto flex flex-col items-center gap-2.5 shrink-0">
        {/* Quick Mode bar */}
        <div className="flex items-center gap-2">
          {/* Virtual Spots Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowVirtualSpots(!showVirtualSpots);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 backdrop-blur-md transition-colors active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>ฉากจำลองโรงเรียน</span>
          </button>

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              fileInputRef.current?.click();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 backdrop-blur-md transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            อัปโหลดรูปภาพ
          </button>

          {selectedSpotImage && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedSpotImage(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-medium border border-red-800"
            >
              กลับสู่กล้องจริง
            </button>
          )}
        </div>

        {/* Shutter / Capture Button */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            disabled={isAnalyzing}
            onClick={handleCapture}
            className={`group relative p-1 rounded-full transition-transform active:scale-90 ${
              isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="กดเพื่อสแกนวิญญาณในวัตถุ"
          >
            {/* Outer Pulsing Glow */}
            <div className="absolute inset-0 rounded-full bg-red-600/30 animate-ping opacity-60 pointer-events-none" />
            <div className="relative w-20 h-20 rounded-full border-4 border-red-500/80 flex items-center justify-center bg-black/90 shadow-[0_0_30px_rgba(239,68,68,0.5)] group-hover:scale-105 group-hover:border-red-400 transition-all pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center text-white shadow-inner pointer-events-none">
                <Camera className="w-7 h-7 drop-shadow-md pointer-events-none" />
              </div>
            </div>
          </button>
        </div>
        <p className="text-[11px] text-slate-400 font-mono tracking-wide flex items-center gap-1.5">
          <span className="text-red-500">👁️</span>
          <span>แตะชัตเตอร์สีแดงเพื่อปลุกวิญญาณที่ซ่อนอยู่</span>
        </p>
      </div>

      {/* Virtual School Spots Drawer */}
      {showVirtualSpots && (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-black/95 border-t border-red-950/80 p-4 rounded-t-3xl shadow-2xl max-h-[60vh] overflow-y-auto backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🕯️</span>
              <h4 className="text-sm font-bold text-slate-200">เลือกสถานที่หลอนในโรงเรียนร้าง</h4>
            </div>
            <button
              onClick={() => setShowVirtualSpots(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900 rounded-lg"
            >
              ปิด
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SAMPLE_SCHOOL_SPOTS.map((spot) => (
              <button
                key={spot.id}
                onClick={() => handleSelectSampleSpot(spot)}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-left hover:border-red-600/70 transition-all shadow-md"
              >
                <div className="w-full h-24 overflow-hidden relative">
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover filter contrast-125 brightness-75 group-hover:scale-105 group-hover:brightness-90 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="p-2 bg-slate-950">
                  <p className="text-xs font-bold text-slate-200 group-hover:text-red-400 transition-colors truncate">
                    {spot.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{spot.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
