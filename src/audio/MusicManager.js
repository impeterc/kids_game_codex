export class MusicManager {
  constructor() {
    this.context = null;
    this.loopId = null;
  }

  async start() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      console.warn('[audio] Web Audio API not supported in this browser');
      return false;
    }

    if (!this.context) {
      this.context = new AudioContextClass();
    }

    if (this.context.state === 'suspended') {
      try {
        await this.context.resume();
      } catch (error) {
        console.warn('[audio] resume blocked, waiting for another user gesture', error);
        return false;
      }
    }

    if (this.loopId) {
      return true;
    }

    const pattern = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
    let index = 0;

    this.loopId = setInterval(() => {
      if (!this.context || this.context.state !== 'running') {
        return;
      }

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

    return true;
  }
}
