class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.45;
  private bgmTimer: number | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    const savedMute = localStorage.getItem('gfg_sound_muted');
    const savedVol = localStorage.getItem('gfg_sound_volume');
    if (savedMute !== null) this.isMuted = savedMute === 'true';
    if (savedVol !== null) this.volume = parseFloat(savedVol);
  }

  private initContext(): boolean {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      try {
        this.ctx = new AudioCtx();
      } catch {
        return false;
      }
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => undefined);
    }
    return true;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('gfg_sound_muted', String(muted));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('gfg_sound_volume', String(this.volume));
  }

  public isMusicPlaying(): boolean {
    return this.isBgmPlaying;
  }

  // --- KAHOOT-INSPIRED GAME-LIKE BACKGROUND MUSIC SYNTHESIZER ---
  public toggleBackgroundMusic(): boolean {
    if (!this.initContext()) return false;
    if (this.isBgmPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startKahootStyleMusic();
      return true;
    }
  }

  private startKahootStyleMusic() {
    if (!this.ctx || this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // Upbeat, playful Kahoot-inspired pentatonic bassline & synth chords
    // C Major / A Minor energetic game loop (BPM ~125)
    const melody = [
      { freq: 261.63, dur: 0.18, isBass: false }, // C4
      { freq: 329.63, dur: 0.18, isBass: false }, // E4
      { freq: 392.00, dur: 0.18, isBass: false }, // G4
      { freq: 523.25, dur: 0.22, isBass: false }, // C5
      { freq: 130.81, dur: 0.35, isBass: true },  // C3 (Bass kick)
      { freq: 440.00, dur: 0.18, isBass: false }, // A4
      { freq: 392.00, dur: 0.18, isBass: false }, // G4
      { freq: 329.63, dur: 0.25, isBass: false }, // E4
      { freq: 110.00, dur: 0.35, isBass: true },  // A2 (Bass kick)
    ];

    let noteIdx = 0;
    const intervalMs = 240; // ~125 BPM groove

    this.bgmTimer = window.setInterval(() => {
      if (!this.ctx || !this.isBgmPlaying) return;
      if (this.isMuted) return;

      const note = melody[noteIdx % melody.length];
      noteIdx++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = note.isBass ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(note.freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(note.isBass ? 400 : 1200, this.ctx.currentTime);

      const baseVol = note.isBass ? this.volume * 0.18 : this.volume * 0.12;
      gain.gain.setValueAtTime(baseVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + note.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + note.dur);
    }, intervalMs);
  }

  private stopBackgroundMusic() {
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.isBgmPlaying = false;
  }

  // --- SOUND EFFECTS (Kahoot-inspired interactive SFX) ---

  public playClick() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Kahoot-style bright correct/success arpeggio fanfare
  public playSuccess() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(this.volume * 0.3, this.ctx.currentTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.08);
      osc.stop(this.ctx.currentTime + i * 0.08 + 0.28);
    });
  }

  // Kahoot-style podium rank up whoosh
  public playRankUp() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046, this.ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(this.volume * 0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.24);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.24);
  }

  public playAlert() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.setValueAtTime(180, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  public playSubmission() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.07);
      gain.gain.linearRampToValueAtTime(this.volume * 0.28, this.ctx.currentTime + idx * 0.07 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.07);
      osc.stop(this.ctx.currentTime + idx * 0.07 + 0.35);
    });
  }
}

export const soundService = new SoundService();
