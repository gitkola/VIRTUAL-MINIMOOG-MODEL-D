export class MixerModule {
    constructor(audioContext) {
        this.ctx = audioContext;

        this.output = this.ctx.createGain();

        // Individual mix levels
        this.gains = {
            osc1: this.ctx.createGain(),
            osc2: this.ctx.createGain(),
            osc3: this.ctx.createGain(),
            noise: this.ctx.createGain(),
            external: this.ctx.createGain()
        };

        // Connect all to output
        Object.values(this.gains).forEach(gain => {
            gain.connect(this.output);
            gain.gain.value = 0; // default off
        });

        // Noise generator setup
        this.noiseBuffer = null;
        this.noiseSource = null;
        this.createNoiseBuffer();
    }

    createNoiseBuffer() {
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    }

    startNoise(type = 'white') {
        if (this.noiseSource) this.noiseSource.stop();
        this.noiseSource = this.ctx.createBufferSource();
        this.noiseSource.buffer = this.noiseBuffer;
        this.noiseSource.loop = true;

        // Basic pink noise filter (3dB/octave lowpass)
        if (type === 'pink') {
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            this.noiseSource.connect(filter);
            filter.connect(this.gains.noise);
        } else {
            this.noiseSource.connect(this.gains.noise);
        }
        this.noiseSource.start();
    }

    connect(destination) {
        this.output.connect(destination);
    }

    setLevel(source, value) {
        if (this.gains[source]) {
            this.gains[source].gain.value = value;
        }
    }
}
