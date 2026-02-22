export class Sequencer {
    constructor(audioEngine) {
        this.ae = audioEngine;
        this.steps = Array(8).fill().map(() => ({ pitch: 0, velocity: 0.8 }));

        this.isPlaying = false;
        this.currentStep = 0;
        this.tempo = 120; // BPM

        this.nextNoteTime = 0.0;
        this.lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
        this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

        this.timerID = null;

        // Base frequency for step 0 logic (e.g. C4 = 261.63)
        this.baseFrequency = 261.63;
    }

    nextNote() {
        const secondsPerBeat = 60.0 / this.tempo;
        // Assuming 16th notes for steps
        this.nextNoteTime += 0.25 * secondsPerBeat;

        this.currentStep++;
        if (this.currentStep === 8) {
            this.currentStep = 0;
        }
    }

    scheduleNote(stepNumber, time) {
        const step = this.steps[stepNumber];

        // Optional: Only play if velocity > 0.1, or similar threshold
        if (step.velocity > 0.05) {
            // Calculate frequency based on pitch offset (e.g., -12 to +12 semitones)
            // pitch is stored as 0 to 1 value typically from a knob, let's map it:
            // assuming knob 0-1 maps to -12 to +12 semitones
            const semitones = Math.round((step.pitch * 24) - 12);
            const freq = this.baseFrequency * Math.pow(2, semitones / 12);

            // Schedule note on
            this.ae.oscillators[0].osc.frequency.setValueAtTime(freq, time);
            this.ae.oscillators[1].osc.frequency.setValueAtTime(freq * 1.01, time);
            this.ae.oscillators[2].osc.frequency.setValueAtTime(freq * 0.99, time);

            // Trigger envelopes (a bit hacky since envelope doesn't take time yet, we would need to refactor EnvelopeModule, but we can call it immediately or use setTimeout for demo, or better yet fix EnvelopeModule to take time).
            // For immediate Web Audio API scheduling, we actually need to update EnvelopeModule to accept a `time` parameter.
            // Let's assume we update EnvelopeModule next to take time.
            this.ae.triggerNoteOn(freq, time, step.velocity);

            // Schedule note off (assuming 16th note length roughly)
            const noteLength = (60.0 / this.tempo) * 0.2;
            this.ae.triggerNoteOff(time + noteLength);
        }

        // UI Callback
        if (this.onStep) {
            // Schedule UI update slightly before the note plays
            setTimeout(() => this.onStep(stepNumber), (time - this.ae.audioContext.currentTime) * 1000);
        }
    }

    scheduler() {
        while (this.nextNoteTime < this.ae.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentStep, this.nextNoteTime);
            this.nextNote();
        }
        this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.currentStep = 0;
        this.nextNoteTime = this.ae.audioContext.currentTime + 0.05;
        this.scheduler();
    }

    stop() {
        this.isPlaying = false;
        clearTimeout(this.timerID);
    }
}
