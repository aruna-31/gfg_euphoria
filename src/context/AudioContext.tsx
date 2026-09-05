import React, { createContext, useContext, useState } from 'react';
import { soundService } from '../services/soundService';

interface AudioContextType {
  isMuted: boolean;
  volume: number;
  isBgmPlaying: boolean;
  toggleBgm: () => void;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  playClick: () => void;
  playSuccess: () => void;
  playAlert: () => void;
  playRankUp: () => void;
  playSubmission: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMutedState] = useState<boolean>(soundService.getMuted());
  const [volume, setVolumeState] = useState<number>(soundService.getVolume());
  const [isBgmPlaying, setIsBgmPlayingState] = useState<boolean>(false);

  const toggleBgm = () => {
    const playing = soundService.toggleBackgroundMusic();
    setIsBgmPlayingState(playing);
  };

  const toggleMute = () => {
    const next = !isMuted;
    soundService.setMuted(next);
    setIsMutedState(next);
  };

  const handleSetVolume = (newVol: number) => {
    soundService.setVolume(newVol);
    setVolumeState(newVol);
  };

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        volume,
        isBgmPlaying,
        toggleBgm,
        toggleMute,
        setVolume: handleSetVolume,
        playClick: () => soundService.playClick(),
        playSuccess: () => soundService.playSuccess(),
        playAlert: () => soundService.playAlert(),
        playRankUp: () => soundService.playRankUp(),
        playSubmission: () => soundService.playSubmission(),
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
