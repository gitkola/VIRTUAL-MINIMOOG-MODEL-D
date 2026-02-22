export class FilterModule {
    constructor(audioContext) {
        this.ctx = audioContext;

        // Moog Ladder Filter approximation using BiquadFilterNode
        // A true 24dB Moog filter requires a custom AudioWorklet or cascading 4 lowpass filters.
        // We'll cascade 4 filters for a sharper 24dB/oct cutoff, mimicking a ladder filter.
        this.filters = [];
        for (let i = 0; i < 4; i++) {
            const f = this.ctx.createBiquadFilter();
            f.type = 'lowpass';
            this.filters.push(f);
            if (i > 0) {
                this.filters[i - 1].connect(f);
            }
        }

        this.input = this.filters[0];
        this.output = this.filters[3];

        // Resonance (Emphasis)
        // We add a feedback loop from the end to the start for resonance.
        this.resonanceGain = this.ctx.createGain();
        this.resonanceGain.gain.value = 0;
        this.filters[3].connect(this.resonanceGain);
        this.resonanceGain.connect(this.filters[0]);

        this.setCutoff(20000); // Max initial cutoff
    }

    setCutoff(freq) {
        // Distribute cutoff across all 4 filters
        this.filters.forEach(f => f.frequency.value = freq);
    }

    setEmphasis(val) {
        // 0 to 1 value
        // High resonance in a Moog can self-oscillate
        this.resonanceGain.gain.value = val * 0.9;
    }

    connect(destination) {
        this.output.connect(destination);
    }
}
