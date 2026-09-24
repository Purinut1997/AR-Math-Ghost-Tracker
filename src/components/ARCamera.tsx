import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  Upload,
  Zap,
  ZapOff,
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
  const [emfLevel, setEmfLevel] = useState<number>(2); // 1 to 5
  const [visionFilter, setVisionFilter] = useState<VisionFilter>('horror');
  const [showVirtualSpots, setShowVirtualSpots] = useState<boolean>(false);
  const [selectedSpotImage, setSelectedSpotImage] = useState<string | null>(null);

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
        setCameraError('ไม่สามารถเข้าถึงกล้องได้ (สามารถใช้ปุ่มอัปโหลดรูป หรือเลือกฉากจำลองโรงเรียนด้านล่าง)');
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

    // If using virtual spot image
    if (selectedSpotImage) {
      onCaptureImage(selectedSpotImage);
      return;
    }

    // Capture from video stream
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply mirror if user facing camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onCaptureImage(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playShutter();
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

  // Vision Filter CSS Classes
  const getFilterStyle = () => {
    switch (visionFilter) {
      case 'horror':
        // Atmospheric found-footage horror movie look: dark, high contrast, desaturated, gritty tint
        return 'contrast-[140%] brightness-[72%] saturate-[70%] hue-rotate-[-10deg]';
      case 'night':
        // Eerie night-vision camcorder green
        return 'contrast-[145%] brightness-[80%] saturate-[140%] hue-rotate-[90deg] sepia-[30%]';
      case 'spectral':
        // Paranormal ultraviolet ghost frequency
        return 'contrast-[155%] brightness-[75%] hue-rotate-[245deg] invert-[0.12]';
      case 'shadow':
        // Pitch black shadows with stark silhouette highlights
        return 'contrast-[175%] brightness-[65%] grayscale';
      default:
        return 'contrast-[135%] brightness-[75%] saturate-[75%]';
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
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main Viewfinder Video or Simulated Spot */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {selectedSpotImage ? (
          <img
            src={selectedSpotImage}
            alt="Virtual Spot"
            className={`w-full h-full object-cover transition-all duration-300 ${getFilterStyle()}`}
          />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover transition-all duration-300 ${
              facingMode === 'user' ? 'scale-x-[-1]' : ''
            } ${getFilterStyle()}`}
          />
        )}

        {/* Ambient Dark Horror Flashlight Spotlight Beam */}
        <div className="absolute inset-0 flashlight-spotlight pointer-events-none" />

        {/* Cinema Horror Heavy Vignette & Darkened Edges */}
        <div className="absolute inset-0 horror-vignette pointer-events-none" />

        {/* Vision Filter Specific Color Grading Overlays */}
        {visionFilter === 'horror' && (
          <div className="absolute inset-0 bg-teal-950/25 mix-blend-color-burn pointer-events-none" />
        )}
        {visionFilter === 'night' && (
          <div className="absolute inset-0 bg-emerald-950/40 mix-blend-color-burn pointer-events-none" />
        )}
        {visionFilter === 'spectral' && (
          <div className="absolute inset-0 bg-purple-950/30 mix-blend-overlay pointer-events-none" />
        )}
        {visionFilter === 'shadow' && (
          <div className="absolute inset-0 bg-slate-950/50 mix-blend-multiply pointer-events-none" />
        )}

        {/* Drifting Ghostly Mist & Fog Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -inset-10 horror-fog opacity-35"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(130, 180, 160, 0.22), transparent 70%), radial-gradient(ellipse 50% 30% at 30% 40%, rgba(70, 90, 120, 0.18), transparent 60%)',
            }}
          />
        </div>

        {/* Retro Camcorder / Found-Footage Scanlines & Noise */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 vhs-flicker"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.65) 3px, rgba(0,0,0,0.65) 4px)',
          }}
        />

        {/* Analyzing Laser Animation */}
        {isAnalyzing && (
          <div className="absolute inset-0 pointer-events-none z-30">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
            <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[1px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-4" />
              <div className="bg-slate-900/90 border border-emerald-500/50 px-5 py-2.5 rounded-2xl shadow-xl text-center">
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
              <span className="text-red-500 font-bold tracking-wider">● REC [NIGHT]</span>
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

        {/* Right Side: Camera Tools in a cohesive pill */}
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1 rounded-2xl border border-red-950/80 shadow-md">
          {/* Vision Filter Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setVisionFilter((prev) => {
                if (prev === 'horror') return 'night';
                if (prev === 'night') return 'spectral';
                if (prev === 'spectral') return 'shadow';
                return 'horror';
              });
            }}
            className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              visionFilter === 'horror'
                ? 'bg-slate-950 border-red-500/70 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                : visionFilter === 'night'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : visionFilter === 'spectral'
                ? 'bg-purple-950 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-black border-slate-700 text-slate-200'
            }`}
            title={`ฟิลเตอร์ภาพ: ${visionFilter}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold uppercase hidden xs:inline">
              {visionFilter}
            </span>
          </button>

          {/* Torch toggle if available */}
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={`p-1.5 rounded-xl border transition-all ${
                torchOn
                  ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
              title="เปิด/ปิดไฟฉาย"
            >
              {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            </button>
          )}

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
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 border border-emerald-500/20 rounded-3xl flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
          {/* Target Corners */}
          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-red-500/80" />
          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-red-500/80" />
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-red-500/80" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-red-500/80" />

          {/* Center Crosshair */}
          <div className="w-9 h-9 rounded-full border border-dashed border-red-500/50 animate-spin" style={{ animationDuration: '14s' }} />
          <div className="absolute w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
        </div>

        {/* Scanning Status Text (Placed below reticle with safe margin) */}
        <div className="mt-3 bg-black/85 backdrop-blur-sm px-3.5 py-1 rounded-full border border-red-900/60 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
          <span>{selectedSpotImage ? 'ล็อคเป้าหมายวัตถุหลอนแล้ว' : 'เล็งกล้องไปที่วัตถุในเงามืด'}</span>
        </div>

        {cameraError && !selectedSpotImage && (
          <div className="mt-2.5 max-w-sm p-2.5 bg-red-950/90 border border-red-800 rounded-xl text-center text-xs text-red-200 pointer-events-auto shadow-lg">
            {cameraError}
          </div>
        )}
      </div>

      {/* AR HUD: Bottom Controls */}
      <div className="relative z-10 px-4 pt-2 pb-4 sm:pb-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto flex flex-col items-center gap-2.5 shrink-0">
        {/* Quick Mode bar */}
        <div className="flex items-center gap-2">
          {/* Virtual Spots Button */}
          <button
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
            disabled={isAnalyzing}
            onClick={handleCapture}
            className={`group relative p-1 rounded-full transition-transform active:scale-90 ${
              isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="กดเพื่อสแกนวิญญาณในวัตถุ"
          >
            {/* Outer Pulsing Glow */}
            <div className="absolute inset-0 rounded-full bg-red-600/30 animate-ping opacity-60" />
            <div className="relative w-20 h-20 rounded-full border-4 border-red-500/80 flex items-center justify-center bg-black/90 shadow-[0_0_30px_rgba(239,68,68,0.5)] group-hover:scale-105 group-hover:border-red-400 transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center text-white shadow-inner">
                <Camera className="w-7 h-7 drop-shadow-md" />
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
