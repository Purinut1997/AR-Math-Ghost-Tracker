import React, { useState, useEffect } from 'react';
import { Radar, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface GhostRadarHUDProps {
  onSignalLocked?: () => void;
}

export const GhostRadarHUD: React.FC<GhostRadarHUDProps> = () => {
  const [distance, setDistance] = useState<number>(3.8); // in meters: 0.5m (very close) to 8m (far)
  const [directionAngle, setDirectionAngle] = useState<number>(45); // angle in degrees 0-360
  const [radarBeepEnabled, setRadarBeepEnabled] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Proximity simulation using device orientation or simulated motion
  useEffect(() => {
    let internalDist = 4.2;
    let internalAngle = Math.random() * 360;

    const handleDeviceMotion = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null) {
        // Adjust angle based on real gyro/compass
        const compass = e.alpha || 0;
        const tilt = Math.abs(e.beta || 0);
        // Distance fluctuates as user moves device around
        const distFromCenter = Math.min(6, Math.max(0.6, (tilt % 30) / 4 + 1.2));
        setDistance(Number(distFromCenter.toFixed(1)));
        setDirectionAngle(Math.round((compass + 180) % 360));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceMotion, true);
    }

    // Interval to simulate drift & proximity fluctuation
    const interval = setInterval(() => {
      // Simulate ghost moving slowly or user scanning
      const delta = (Math.random() - 0.5) * 0.8;
      internalDist = Math.max(0.7, Math.min(6.5, internalDist + delta));
      internalAngle = (internalAngle + (Math.random() - 0.48) * 20 + 360) % 360;

      setDistance(Number(internalDist.toFixed(1)));
      setDirectionAngle(Math.round(internalAngle));

      const locked = internalDist < 1.4;
      setIsLocked(locked);

      // Play proximity beep & heartbeat based on distance
      if (radarBeepEnabled) {
        if (internalDist < 1.4) {
          sounds.playRadarPing();
          sounds.playHeartbeat(1.1);
        } else if (internalDist < 2.5 && Math.random() > 0.35) {
          sounds.playRadarPing();
        } else if (Math.random() > 0.7) {
          sounds.playEmfTick();
        }
      }
    }, 1200);

    return () => {
      clearInterval(interval);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceMotion, true);
      }
    };
  }, [radarBeepEnabled]);

  // Calculate radar blip coordinates on 100x100 radar circle
  const radius = Math.min(38, (distance / 6.5) * 38);
  const rad = (directionAngle * Math.PI) / 180;
  const blipX = 50 + radius * Math.cos(rad);
  const blipY = 50 + radius * Math.sin(rad);

  return (
    <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-red-950/80 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
      {/* Mini Circular Sonar Radar Display */}
      <div className="relative w-12 h-12 rounded-full border border-red-900/60 bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Radar concentric range rings */}
        <div className="absolute w-8 h-8 rounded-full border border-red-950/50" />
        <div className="absolute w-4 h-4 rounded-full border border-red-950/70" />
        <div className="absolute w-full h-[1px] bg-red-950/50" />
        <div className="absolute h-full w-[1px] bg-red-950/50" />

        {/* Radar sweeping line */}
        <div
          className="absolute inset-0 origin-center animate-spin pointer-events-none"
          style={{
            animationDuration: isLocked ? '1.5s' : '3s',
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(239, 68, 68, 0.4) 40deg, transparent 55deg)',
          }}
        />

        {/* Center player marker */}
        <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#10b981]" />

        {/* Ghost Signal Blip */}
        <div
          className={`absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
            isLocked
              ? 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-ping'
              : 'bg-rose-400 shadow-[0_0_5px_rgba(244,63,94,0.8)]'
          }`}
          style={{
            left: `${blipX}%`,
            top: `${blipY}%`,
          }}
        />
      </div>

      {/* Proximity readout info */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <Radar className={`w-3.5 h-3.5 ${isLocked ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[10px] font-mono tracking-wider uppercase text-slate-300 font-bold">
            {isLocked ? 'SIGNAL LOCKED' : 'GHOST RADAR'}
          </span>
          <button
            onClick={() => setRadarBeepEnabled(!radarBeepEnabled)}
            className="text-slate-500 hover:text-slate-300 ml-1 p-0.5"
            title={radarBeepEnabled ? 'ปิดเสียงเรดาร์' : 'เปิดเสียงเรดาร์'}
          >
            {radarBeepEnabled ? (
              <Volume2 className="w-3 h-3 text-red-400" />
            ) : (
              <VolumeX className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-xs font-mono font-bold ${
            isLocked ? 'text-red-400 animate-pulse' : distance < 2.5 ? 'text-amber-400' : 'text-slate-300'
          }`}>
            {distance}m
          </span>
          <span className="text-[9px] font-mono text-slate-500">
            {isLocked ? '• ผีประชิดตัว!' : distance < 2.5 ? '• สัญญาณแรง' : '• สแกนหาวัตถุ'}
          </span>
        </div>
      </div>
    </div>
  );
};
