export function playBeep(duration = 500, frequency = 440) {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration / 1000);
  osc.onended = () => ctx.close();
}

export function playSiren() {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.connect(gain);
  gain.connect(ctx.destination);
  const duration = 1.5;
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + duration / 2);
  osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + duration);
  osc.start();
  osc.stop(ctx.currentTime + duration);
  osc.onended = () => ctx.close();
}
