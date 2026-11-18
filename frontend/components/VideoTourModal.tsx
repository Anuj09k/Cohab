import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Sparkles } from 'lucide-react';

interface VideoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  flatTitle: string;
}

export const VideoTourModal: React.FC<VideoTourModalProps> = ({
  isOpen,
  onClose,
  videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  flatTitle,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-slate-100 shadow-2xl relative flex flex-col">
        {/* Top Floating Controls */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white shadow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>15s Flat Walkthrough</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-[9/16] max-h-[520px] bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Center Play/Pause indicator on tap */}
          <div
            onClick={togglePlay}
            className="absolute inset-0 cursor-pointer flex items-center justify-center"
          >
            {!isPlaying && (
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            )}
          </div>

          {/* Bottom Video Controls Overlay */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
            <div>
              <p className="text-xs font-bold text-white drop-shadow">{flatTitle}</p>
              <p className="text-[10px] text-slate-300 drop-shadow">Natural daylight & kitchen hygiene check</p>
            </div>
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Recorded in daylight to inspect ventilation, water taps, and room dimensions.
          </p>
        </div>
      </div>
    </div>
  );
};
