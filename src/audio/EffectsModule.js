export class EffectsModule {
    constructor(audioContext) {
        this.ctx = audioContext;

        this.input = this.ctx.createGain();
        this.output = this.ctx.createGain();

        // Delay setup
        this.delayNode = this.ctx.createDelay(5.0); // max 5 seconds
        this.delayTimeValue = 0.3; // seconds
        this.delayFeedbackValue = 0.4;
        this.delayMixValue = 0.3;

        this.delayFeedbackGain = this.ctx.createGain();
        this.delayMixGain = this.ctx.createGain();
        this.dryMixGain = this.ctx.createGain();

        // Connections for delay
        this.input.connect(this.delayNode);
        this.delayNode.connect(this.delayFeedbackGain);
        this.delayFeedbackGain.connect(this.delayNode);
        this.delayNode.connect(this.delayMixGain);

        this.input.connect(this.dryMixGain);

        // Reverb setup (simple Convolver approximation using generated buffer)
        this.convolver = this.ctx.createConvolver();
        this.reverbMixGain = this.ctx.createGain();
        this.reverbMixValue = 0.2;

        this.createReverbImpulse(2.0, 2.0); // 2 seconds

        this.input.connect(this.convolver);
        this.convolver.connect(this.reverbMixGain);

        // Routing to output
        this.dryMixGain.connect(this.output);
        this.delayMixGain.connect(this.output);
        this.reverbMixGain.connect(this.output);

        this.updateDelay();
        this.updateReverb();
    }

    createReverbImpulse(duration, decay) {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.ctx.createBuffer(2, length, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Exponential decay noise
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
            }
        }
        this.convolver.buffer = impulse;
    }

    updateDelay() {
        this.delayNode.delayTime.value = this.delayTimeValue;
        this.delayFeedbackGain.gain.value = this.delayFeedbackValue;
        this.delayMixGain.gain.value = this.delayMixValue;
        this.dryMixGain.gain.value = 1.0 - this.delayMixValue;
    }

    updateReverb() {
        this.reverbMixGain.gain.value = this.reverbMixValue;
    }
}
