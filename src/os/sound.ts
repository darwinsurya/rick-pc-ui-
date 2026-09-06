class SoundSystemImpl {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private musicGain: GainNode | null = null;
  enabled = true;
  uiEnabled = true;
  volume = 0.7;
  private musicPlaying = false;
  private musicTimer: number | null = null;

  private ensure(): void {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
      this.sfx = this.ctx.createGain();
      this.sfx.gain.value = 1;
      this.sfx.connect(this.master);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.35;
      this.musicGain.connect(this.master);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setVolume(v: number): void {
    this.volume = v / 100;
    if (this.master) this.master.gain.value = this.volume;
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (this.master) this.master.gain.value = on ? this.volume : 0;
    if (!on) this.stopMusic();
  }

  setUIEnabled(on: boolean): void {
    this.uiEnabled = on;
  }

  isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    vol: number,
    delay = 0,
    glide = 0,
    dest?: GainNode,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const d = dest || this.sfx;
    if (!d) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    const t = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(freq, t);
    if (glide) osc.frequency.exponentialRampToValueAtTime(glide, t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(d);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  play(freq: number, duration: number, type: OscillatorType, vol?: number, delay?: number, glide?: number): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(freq, duration, type, vol ?? 0.1, delay ?? 0, glide ?? 0, this.sfx ?? undefined);
  }

  click(): void {
    if (!this.enabled || !this.uiEnabled) return;
    this.ensure();
    const jitter = Math.random() * 40;
    this.tone(550 + jitter, 0.05, 'square', 0.07);
    window.setTimeout(() => this.tone(820 + jitter, 0.05, 'square', 0.05), 35);
  }

  hover(): void {
    if (!this.enabled || !this.uiEnabled) return;
    this.ensure();
    this.tone(420, 0.025, 'square', 0.035);
  }

  typing(): void {
    if (!this.enabled || !this.uiEnabled) return;
    this.ensure();
    this.tone(880 + Math.random() * 240, 0.02, 'square', 0.028);
  }

  startup(): void {
    if (!this.enabled) return;
    this.ensure();
    const notes = [392, 523, 659, 784];
    notes.forEach((n, i) => this.tone(n, 0.2, 'triangle', 0.13, i * 0.13, 0, this.sfx ?? undefined));
    window.setTimeout(() => this.tone(523, 0.5, 'sine', 0.15, 0, 1047, this.sfx ?? undefined), 1000);
  }

  login(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(523, 0.15, 'sine', 0.14, 0, 0, this.sfx ?? undefined);
    this.tone(784, 0.25, 'sine', 0.18, 0.13, 0, this.sfx ?? undefined);
    this.tone(1047, 0.4, 'sine', 0.22, 0.28, 0, this.sfx ?? undefined);
  }

  portalOpen(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(200, 0.8, 'sawtooth', 0.12, 0, 2000, this.sfx ?? undefined);
    this.tone(300, 0.8, 'triangle', 0.12, 0.05, 2500, this.sfx ?? undefined);
    this.tone(150, 0.8, 'square', 0.04, 0.1, 1500, this.sfx ?? undefined);
  }

  portalClose(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(2000, 0.5, 'sawtooth', 0.12, 0, 200, this.sfx ?? undefined);
    this.tone(2500, 0.5, 'triangle', 0.1, 0.05, 300, this.sfx ?? undefined);
  }

  windowOpen(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(600, 0.1, 'sine', 0.09, 0, 0, this.sfx ?? undefined);
    this.tone(900, 0.15, 'sine', 0.11, 0.05, 0, this.sfx ?? undefined);
    this.tone(1200, 0.2, 'sine', 0.09, 0.1, 0, this.sfx ?? undefined);
  }

  windowClose(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(1200, 0.12, 'sine', 0.11, 0, 0, this.sfx ?? undefined);
    this.tone(800, 0.15, 'sine', 0.09, 0.05, 0, this.sfx ?? undefined);
    this.tone(400, 0.2, 'sine', 0.07, 0.1, 0, this.sfx ?? undefined);
  }

  minimize(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(700, 0.1, 'sine', 0.08, 0, 350, this.sfx ?? undefined);
  }

  maximize(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(350, 0.1, 'sine', 0.1, 0, 700, this.sfx ?? undefined);
  }

  error(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(200, 0.3, 'sawtooth', 0.16, 0, 0, this.sfx ?? undefined);
    this.tone(150, 0.4, 'sawtooth', 0.16, 0.28, 0, this.sfx ?? undefined);
    this.tone(100, 0.5, 'sawtooth', 0.14, 0.6, 0, this.sfx ?? undefined);
  }

  success(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(523, 0.1, 'sine', 0.13, 0, 0, this.sfx ?? undefined);
    this.tone(784, 0.2, 'sine', 0.13, 0.1, 0, this.sfx ?? undefined);
    this.tone(1047, 0.25, 'sine', 0.13, 0.2, 0, this.sfx ?? undefined);
  }

  powerOn(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(40, 0.6, 'sine', 0.15, 0, 400, this.sfx ?? undefined);
  }

  powerOff(): void {
    if (!this.enabled) return;
    this.ensure();
    this.tone(400, 0.6, 'sine', 0.15, 0, 40, this.sfx ?? undefined);
  }

  toggleMusic(): void {
    if (this.musicPlaying) this.stopMusic();
    else this.startMusic();
  }

  startMusic(): void {
    if (this.musicPlaying) return;
    this.ensure();
    if (!this.ctx || !this.musicGain) return;
    this.musicPlaying = true;
    const bar = 0.21;
    this.musicGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(0.32, this.ctx.currentTime + 0.5);
    const bass = [110, 0, 110, 0, 110, 0, 131, 0, 98, 0, 98, 0, 98, 0, 147, 0];
    const scale = [440, 523.25, 587.33, 659.25];
    let step = 0;
    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || !this.musicPlaying) return;
      const now = this.ctx.currentTime;
      const b = bass[step % bass.length];
      if (b > 0) {
        this.tone(b, bar * 0.9, 'sawtooth', 0.28, 0, 0, this.musicGain ?? undefined);
        this.tone(b, bar * 0.35, 'square', 0.2, 0, 0, this.musicGain ?? undefined);
      }
      if (Math.random() < 0.18) {
        this.tone(scale[Math.floor(Math.random() * scale.length)], 0.12, 'triangle', 0.1, 0, 0, this.musicGain ?? undefined);
      }
      step++;
    }, bar * 1000);
  }

  stopMusic(): void {
    if (!this.musicPlaying) return;
    this.musicPlaying = false;
    if (this.musicTimer) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, this.ctx.currentTime);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
    }
  }
}

export const Sound = new SoundSystemImpl();