import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Film, ArrowRight } from 'lucide-react';

interface CinematicVideoPlayerProps {
  onShopClick?: () => void;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({ onShopClick }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const totalDuration = 15; // 15 seconds

  // Web Audio Context for zero-404 procedural ambient spa/laboratory soundtrack
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            return 0; // loop seamlessly
          }
          return Math.round((prev + 0.1) * 10) / 10;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Determine current active cinematic scene based on elapsed seconds
  const currentSceneIndex = currentTime < 4 ? 0 : currentTime < 8 ? 1 : currentTime < 12 ? 2 : 3;

  const scenes = [
    {
      title: 'ACT I: BOTANICAL GENESIS',
      subtitle: 'Cold-Pressed Damask Rose Harvested at Dawn',
      tagline: 'Pure Hydro-Distillation in High Altitude Valleys',
      bgImage: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=1600',
      accent: 'text-rose-300',
      metric: '100% Organic Extraction'
    },
    {
      title: 'ACT II: MOLECULAR PRECISION',
      subtitle: '15% Stabilized L-Ascorbic Acid & Ferulic Synergy',
      tagline: 'Deep Cutaneous Infiltration Without Oxidation',
      bgImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1600',
      accent: 'text-amber-300',
      metric: 'Clinical Grade pH 3.2'
    },
    {
      title: 'ACT III: BARRIER RECONSTRUCTION',
      subtitle: 'Bio-Identical 3:1:1 Ceramide Lipid Mantle',
      tagline: 'Engineered for South Asian Humidity & UV Stress',
      bgImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1600',
      accent: 'text-orange-200',
      metric: '72-Hour Moisture Reservoir'
    },
    {
      title: 'ACT IV: THE RADIANT TRANSFORMATION',
      subtitle: 'The Complete Lumora Daily Protocol',
      tagline: 'Awaken an incandescent glass-like luminosity',
      bgImage: 'https://images.unsplash.com/photo-1512290900672-1f4165509930?auto=format&fit=crop&q=80&w=1600',
      accent: 'text-amber-400',
      metric: 'Visible Results in 14 Days'
    }
  ];

  const currentScene = scenes[currentSceneIndex];

  // Procedural Web Audio synthesis for gentle ambient sound
  const toggleSound = () => {
    if (isMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime); // Relaxing 432 Hz frequency
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        gainNodeRef.current = gain;
        setIsMuted(false);
      } catch {
        setIsMuted(true);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setIsMuted(true);
    }
  };

  return (
    <div className="relative w-full aspect-[16/9] max-h-[580px] bg-[#12100E] rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col justify-between group">
      
      {/* Background Image with Slow Smooth Zoom Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={currentScene.bgImage} 
          alt={currentScene.title}
          className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-110 opacity-70 filter brightness-90"
        />
        {/* Cinematic Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>

      {/* TOP BAR: BRAND WATERMARK & SCENE INDICATOR */}
      <div className="relative z-10 p-6 flex justify-between items-center text-xs tracking-widest text-stone-300">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white uppercase">Lumora Studios</span>
          <span className="text-stone-500">•</span>
          <span className="text-amber-400 font-mono">15s 4K Cinematic Reel</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSound}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
            title={isMuted ? 'Unmute ambient soundscape' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* CENTER EDITORIAL STORYTELLING */}
      <div className="relative z-10 px-8 sm:px-14 max-w-2xl text-left space-y-3 transition-all duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-stone-700/80 text-[10px] uppercase tracking-[0.25em] text-amber-300 font-semibold backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{currentScene.metric}</span>
        </div>

        <h3 className="text-xs uppercase tracking-[0.3em] font-medium text-stone-400">
          {currentScene.title}
        </h3>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
          {currentScene.subtitle}
        </h2>

        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-lg">
          {currentScene.tagline}
        </p>

        {currentSceneIndex === 3 && onShopClick && (
          <button 
            onClick={onShopClick}
            className="mt-3 px-6 py-2.5 bg-[#D4AF37] text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-amber-300 transition-all flex items-center gap-2"
          >
            <span>Shop The Protocol</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* BOTTOM CONTROLS & TIMELINE PROGRESS */}
      <div className="relative z-10 p-6 space-y-3 bg-gradient-to-t from-black/90 to-transparent">
        
        {/* 4-Segment Scene Timeline Bar */}
        <div className="grid grid-cols-4 gap-2">
          {scenes.map((_, i) => {
            const startSec = i * 3.75;
            const endSec = (i + 1) * 3.75;
            let percent = 0;
            if (currentTime >= endSec) percent = 100;
            else if (currentTime > startSec) percent = ((currentTime - startSec) / 3.75) * 100;

            return (
              <div 
                key={i} 
                onClick={() => setCurrentTime(startSec)}
                className="h-1 bg-stone-700/80 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
              >
                <div 
                  className="h-full bg-amber-400 transition-all duration-100" 
                  style={{ width: `${percent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Play / Pause / Replay & Time Display */}
        <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-white text-stone-950 hover:bg-amber-400 transition-colors"
              title={isPlaying ? 'Pause Reel' : 'Play Reel'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            <button 
              onClick={() => { setCurrentTime(0); setIsPlaying(true); }}
              className="p-1.5 text-stone-400 hover:text-white transition-colors"
              title="Restart 15-second Film"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="tracking-widest">
              00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)} / 00:15
            </span>
          </div>

          <div className="text-[11px] text-stone-400 font-sans tracking-wider uppercase hidden sm:block">
            Scene {currentSceneIndex + 1} of 4 • {currentScene.title.split(':')[0]}
          </div>
        </div>

      </div>

    </div>
  );
};
