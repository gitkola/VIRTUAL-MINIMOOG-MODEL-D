export class OscillatorModule {
    constructor(audioContext) {
        this.ctx = audioContext;
        this.osc = this.ctx.createOscillator();
        this.gainNode = this.ctx.createGain();
        this.osc.connect(this.gainNode);

        // Default Minimoog parameters
        this.range = 8; // 32', 16', 8', 4', 2', LO
        this.waveform = 'sawtooth'; // triangle, sawtooth, square, wide pulse, narrow pulse
        this.detune = 0; // cents

        this.osc.type = this.waveform;
        this.gainNode.gain.value = 1.0;
    }

    start() {
        this.osc.start();
    }

    stop() {
        this.osc.stop();
    }

    setFrequency(freq) {
        this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    }
}
