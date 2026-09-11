import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { Music, Volume2, VolumeX, SlidersHorizontal } from 'lucide-react';

export const MusicPlayerToggle: React.FC = () => {
  const { isBgmPlaying, isMuted, volume, toggleBgm, toggleMute, setVolume } = useAudio();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <div className="relative flex items-center gap-1.5 bg-[#0f1812] border border-[#1e2f23] rounded-lg px-2 py-1">
      {/* Play/Pause Ambient Music */}
      <button
        onClick={toggleBgm}
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold transition-all ${
          isBgmPlaying
            ? 'bg-[#00b259]/20 text-[#00e575] border border-[#00b259]/40'
            : 'text-gray-400 hover:text-gray-200 hover:bg-[#16231a]'
        }`}
        title={isBgmPlaying ? 'Pause ambient cyber music' : 'Start ambient cyber music'}
      >
        <Music className="w-3.5 h-3.5" />
        <span className="hidden sm:inline text-[11px] font-mono">
          {isBgmPlaying ? 'AMBIENT ON' : 'MUSIC'}
        </span>

        {/* Dynamic animated audio wave bars */}
        {isBgmPlaying && (
          <div className="flex items-end gap-0.5 h-3 ml-0.5">
            <span className="w-0.5 bg-[#00e575] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
            <span className="w-0.5 bg-[#00e575] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
            <span className="w-0.5 bg-[#00e575] rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-1.5" />
          </div>
        )}
      </button>

      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        className={`p-1 rounded text-xs transition-colors ${
          isMuted ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'
        }`}
        title={isMuted ? 'Unmute audio effects' : 'Mute audio effects'}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Volume slider toggle button */}
      <button
        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
        className={`inline-flex items-center gap-1 rounded px-1.5 py-1 text-[10px] font-mono transition-colors ${
          showVolumeSlider ? 'text-[#00e575] bg-[#00b259]/10' : 'text-gray-500 hover:text-gray-300'
        }`}
        title="Adjust volume"
        aria-label="Adjust volume"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{Math.round(volume * 100)}%</span>
      </button>

      {showVolumeSlider && (
        <div className="absolute right-0 top-10 bg-[#0e1611] border border-[#213426] rounded-lg p-2 shadow-xl z-50 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-[#00b259] h-1.5 bg-[#1b2c20] rounded-lg cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
