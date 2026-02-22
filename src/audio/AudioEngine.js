import { OscillatorModule } from './OscillatorModule.js';
import { MixerModule } from './MixerModule.js';
import { FilterModule } from './FilterModule.js';
import { EnvelopeModule } from './EnvelopeModule.js';
import { EffectsModule } from './EffectsModule.js';
import { Sequencer } from './Sequencer.js';

export class AudioEngine {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.5;

        // Initialize Modules
        this.mixer = new MixerModule(this.audioContext);
        this.filter = new FilterModule(this.audioContext);
        this.effects = new EffectsModule(this.audioContext);

        this.envelopes = {
            filter: new EnvelopeModule(this.audioContext),
            loudness: new EnvelopeModule(this.audioContext)
        };

        this.sequencer = new Sequencer(this);

        // Minimoog has 3 Oscillators
        this.oscillators = [
            new OscillatorModule(this.audioContext),
            new OscillatorModule(this.audioContext),
            new OscillatorModule(this.audioContext)
        ];

        // Connect audio paths
        // Osc -> Mixer -> Filter -> VCA(Master) -> Effects -> Destination

        // Connect oscillators and noise to mixer
        this.oscillators[0].gainNode.connect(this.mixer.gains.osc1);
        this.oscillators[1].gainNode.connect(this.mixer.gains.osc2);
        this.oscillators[2].gainNode.connect(this.mixer.gains.osc3);

        // Mixer to Filter
        this.mixer.output.connect(this.filter.input);

        // Filter to Master Gain (VCA)
        this.filter.output.connect(this.masterGain);

        // Master Gain to Effects
        this.masterGain.connect(this.effects.input);

        // Effects to Destination
        this.effects.output.connect(this.audioContext.destination);

        // Start noise
        this.mixer.startNoise('pink');

        // Master gain envelope target
        this.masterGain.gain.value = 0; // Starts silent

        this.isInitialized = true;
    }

    resume() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        // Lazy start of oscillators to comply with web audio policies
        this.oscillators.forEach(osc => {
            try { osc.start(); } catch (e) { } // ignore if already started
        });
    }

    triggerNoteOn(frequency, time = this.audioContext.currentTime, velocity = 1.0) {
        this.resume();

        // Set oscillator frequencies (basic hard-coded detune for fatness right now)
        this.oscillators[0].osc.frequency.setValueAtTime(frequency, time);
        this.oscillators[1].osc.frequency.setValueAtTime(frequency * 1.01, time); // slight detune
        this.oscillators[2].osc.frequency.setValueAtTime(frequency * 0.99, time); // slight detune

        // Loudness envelope
        this.envelopes.loudness.triggerAttack(this.masterGain.gain, 0.5 * velocity, 0, time);

        // Filter envelope (Amount of Contour)
        const baseCutoff = this.filter.filters[0].frequency.value; // Approximate base
        const contourAmount = 4000 * velocity; // Velocity affects contour amount
        this.envelopes.filter.triggerAttack(this.filter.filters[0].frequency, contourAmount, baseCutoff, time);
        this.envelopes.filter.triggerAttack(this.filter.filters[1].frequency, contourAmount, baseCutoff, time);
        this.envelopes.filter.triggerAttack(this.filter.filters[2].frequency, contourAmount, baseCutoff, time);
        this.envelopes.filter.triggerAttack(this.filter.filters[3].frequency, contourAmount, baseCutoff, time);
    }

    triggerNoteOff(time = this.audioContext.currentTime) {
        this.envelopes.loudness.triggerRelease(this.masterGain.gain, 0, time);

        // Return filter to base
        this.envelopes.filter.triggerRelease(this.filter.filters[0].frequency, this.filter.filters[0].frequency.value, time);
        this.envelopes.filter.triggerRelease(this.filter.filters[1].frequency, this.filter.filters[1].frequency.value, time);
        this.envelopes.filter.triggerRelease(this.filter.filters[2].frequency, this.filter.filters[2].frequency.value, time);
        this.envelopes.filter.triggerRelease(this.filter.filters[3].frequency, this.filter.filters[3].frequency.value, time);
    }
}
