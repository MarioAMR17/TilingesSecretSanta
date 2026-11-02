function noiseBuffer(ctx, duration) {
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function hit(ctx, time, duration, peakGain, freq, q = 0.8) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, duration);

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(peakGain, time + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(time);
  source.stop(time + duration);
}

export function createRevealAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  function playDrumroll(duration = 3) {
    const start = ctx.currentTime + 0.03;
    const end = start + duration;
    let t = start;
    while (t < end) {
      const progress = (t - start) / duration;
      hit(ctx, t, 0.08, 0.3, 170 + Math.random() * 50);
      const interval = 0.17 - progress * 0.11;
      t += Math.max(interval, 0.045);
    }
  }

  function playCrash() {
    const time = ctx.currentTime;
    hit(ctx, time, 1.1, 0.45, 5000, 0.5);
    hit(ctx, time, 0.9, 0.3, 1500, 0.6);
    hit(ctx, time, 0.5, 0.35, 220, 1.2);
  }

  function playBoom() {
    const time = ctx.currentTime;

    // Golpe grave que cae de tono, el "cuerpo" de la explosión.
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.5);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.0001, time);
    oscGain.gain.linearRampToValueAtTime(0.6, time + 0.02);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.9);

    osc.connect(oscGain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.9);

    // Estallido de ruido encima, el "crack" inicial.
    hit(ctx, time, 0.35, 0.5, 900, 0.6);
    hit(ctx, time, 0.6, 0.35, 250, 0.9);
  }

  function close() {
    ctx.close().catch(() => {});
  }

  return { ctx, playDrumroll, playCrash, playBoom, close };
}
