export class MusicManager {
  constructor() {
    this.context = null;
    this.isStarted = false;
    this.loopId = null;
  }

  start() {
    if (this.isStarted) return;
    this.context = new AudioContext();
    this.isStarted = true;

    const pattern = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
    let index = 0;

    this.loopId = setInterval(() => {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = 'square';
      osc.frequency.value = pattern[index % pattern.length];
      gain.gain.value = 0.03;
      osc.connect(gain);
      gain.connect(this.context.destination);
      osc.start();
      osc.stop(this.context.currentTime + 0.2);
      index += 1;
    }, 300);
  }
}
