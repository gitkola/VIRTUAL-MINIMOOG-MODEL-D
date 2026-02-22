export class PresetManager {
    constructor(uiBuilder) {
        this.ui = uiBuilder;
        this.presets = JSON.parse(localStorage.getItem('minimoog-presets')) || {};

        // Add default preset if empty
        if (Object.keys(this.presets).length === 0) {
            this.presets['Default'] = this.getCurrentState();
            this.saveToStorage();
        }
    }

    getCurrentState() {
        const state = {
            knobs: {},
            switches: {},
            sequencer: {
                tempo: this.ui.ae.sequencer.tempo,
                steps: this.ui.ae.sequencer.steps.map(s => ({ pitch: s.pitch, velocity: s.velocity }))
            }
        };

        // Get all knob values
        for (const [key, knob] of Object.entries(this.ui.knobs)) {
            state.knobs[key] = knob.value;
        }

        // Get all switch values
        for (const [key, sw] of Object.entries(this.ui.switches)) {
            state.switches[key] = sw.state;
        }

        return state;
    }

    applyState(state) {
        try {
            if (state.knobs) {
                for (const [key, value] of Object.entries(state.knobs)) {
                    if (this.ui.knobs[key]) {
                        this.ui.knobs[key].value = value;
                        this.ui.knobs[key].updateVisuals();
                        this.ui.knobs[key].onChange(value);
                    }
                }
            }

            if (state.switches) {
                for (const [key, value] of Object.entries(state.switches)) {
                    if (this.ui.switches[key]) {
                        this.ui.switches[key].state = value;
                        this.ui.switches[key].updateVisuals();
                        this.ui.switches[key].onChange(value);
                    }
                }
            }

            if (state.sequencer) {
                if (state.sequencer.tempo && this.ui.knobs.seqTempo) {
                    this.ui.knobs.seqTempo.value = state.sequencer.tempo;
                    this.ui.knobs.seqTempo.updateVisuals();
                    this.ui.knobs.seqTempo.onChange(state.sequencer.tempo);
                }
                if (state.sequencer.steps && this.ui.seqKnobs) {
                    for (let i = 0; i < 8; i++) {
                        if (state.sequencer.steps[i]) {
                            this.ui.seqKnobs[i].pitchKnob.value = state.sequencer.steps[i].pitch;
                            this.ui.seqKnobs[i].pitchKnob.updateVisuals();
                            this.ui.seqKnobs[i].pitchKnob.onChange(state.sequencer.steps[i].pitch);

                            this.ui.seqKnobs[i].velKnob.value = state.sequencer.steps[i].velocity;
                            this.ui.seqKnobs[i].velKnob.updateVisuals();
                            this.ui.seqKnobs[i].velKnob.onChange(state.sequencer.steps[i].velocity);
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Failed to apply preset state", e);
        }
    }

    savePreset(name) {
        if (!name.trim()) return;
        this.presets[name] = this.getCurrentState();
        this.saveToStorage();
    }

    loadPreset(name) {
        if (this.presets[name]) {
            this.applyState(this.presets[name]);
        }
    }

    exportPresets() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.presets));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "minimoog_presets.json");
        dlAnchorElem.click();
    }

    saveToStorage() {
        localStorage.setItem('minimoog-presets', JSON.stringify(this.presets));
    }
}
