export class EnvelopeModule {
    constructor(audioContext) {
        this.ctx = audioContext;

        // Minimoog ADS Envelope parameters (Time in seconds)
        // T-1 Attack Time (10 m-sec to 10 sec)
        // T-2 Decay Time (10 m-sec to 10 sec)
        // T-3 Sustain Level (0 to 10)
        // Return to zero uses T-2 Decay time in Minimoog (unless switch is off)
        this.attackTime = 0.01;
        this.decayTime = 0.5;
        this.sustainLevel = 0.5;
        this.releaseTime = 0.5; // Shared with decay or isolated
    }

    triggerAttack(targetParam, amount = 1, baseValue = 0, time = this.ctx.currentTime) {
        // Cancel scheduled changes
        targetParam.cancelScheduledValues(time);

        // Start at current base value
        targetParam.setValueAtTime(targetParam.value, time);

        // Attack phase
        const peak = baseValue + amount;
        targetParam.linearRampToValueAtTime(peak, time + this.attackTime);

        // Decay to sustain phase
        const sustainVal = baseValue + (amount * this.sustainLevel);
        targetParam.setTargetAtTime(sustainVal, time + this.attackTime, this.decayTime / 3);
    }

    triggerRelease(targetParam, baseValue = 0, time = this.ctx.currentTime) {
        targetParam.cancelScheduledValues(time);

        // Release phase
        targetParam.setValueAtTime(targetParam.value, time);
        targetParam.setTargetAtTime(baseValue, time, this.releaseTime / 3);
    }
}
