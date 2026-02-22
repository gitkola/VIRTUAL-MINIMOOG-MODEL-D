import { Knob } from './components/Knob.js';
import { Switch } from './components/Switch.js';
import { PresetManager } from '../audio/PresetManager.js';

export class UIBuilder {
  constructor(container, audioEngine) {
    this.container = container;
    this.ae = audioEngine;

    this.knobs = {};
    this.switches = {};

    this.build();
  }

  build() {
    this.container.innerHTML = `
      <div class="synth-container">
        <!-- Control Panel -->
        <div class="control-panel">
          
          <!-- Controllers Section -->
          <div class="section">
            <div class="section-header">Controllers</div>
            <div class="knob-row">
              <div class="knob-group">
                <div id="tune-knob"></div>
                <div class="knob-label">Tune</div>
              </div>
              <div class="knob-group">
                <div id="glide-knob"></div>
                <div class="knob-label">Glide</div>
              </div>
            </div>
            <div id="mod-mix-knob"></div>
            <div class="knob-label">Modulation Mix</div>
          </div>
          
          <!-- Oscillator Bank -->
          <div class="section" style="flex: 2;">
            <div class="section-header">Oscillator Bank</div>
            
            <div class="knob-row">
              <div class="knob-label">Oscillator-1<br>Frequency</div>
              <div class="knob-group">
                <div id="osc1-range-knob"></div>
                <div class="knob-label">Range</div>
              </div>
              <div class="knob-group">
                <div id="osc1-wave-knob"></div>
                <div class="knob-label">Waveform</div>
              </div>
            </div>
            
            <div class="knob-row">
               <div class="knob-label">Oscillator-2<br>Frequency</div>
               <div class="knob-group">
                <div id="osc2-tune-knob"></div>
              </div>
              <div class="knob-group">
                <div id="osc2-range-knob"></div>
              </div>
              <div class="knob-group">
                <div id="osc2-wave-knob"></div>
              </div>
            </div>
            
            <div class="knob-row">
               <div class="knob-label">Oscillator-3<br>Frequency</div>
               <div class="knob-group">
                <div id="osc3-tune-knob"></div>
              </div>
              <div class="knob-group">
                <div id="osc3-range-knob"></div>
              </div>
              <div class="knob-group">
                <div id="osc3-wave-knob"></div>
              </div>
            </div>
          </div>
          
          <!-- Mixer -->
          <div class="section">
            <div class="section-header">Mixer</div>
            <div class="knob-row" style="flex-direction: column;">
              <div class="knob-group" style="flex-direction: row;">
                <div class="knob-label" style="text-align: right; width: 40px;">Osc 1</div>
                <div id="mix-osc1-knob"></div>
                <div id="mix-osc1-switch"></div>
              </div>
              <div class="knob-group" style="flex-direction: row;">
                <div class="knob-label" style="text-align: right; width: 40px;">Osc 2</div>
                <div id="mix-osc2-knob"></div>
                <div id="mix-osc2-switch"></div>
              </div>
              <div class="knob-group" style="flex-direction: row;">
                <div class="knob-label" style="text-align: right; width: 40px;">Osc 3</div>
                <div id="mix-osc3-knob"></div>
                <div id="mix-osc3-switch"></div>
              </div>
              <div class="knob-group" style="flex-direction: row;">
                <div class="knob-label" style="text-align: right; width: 40px;">Noise</div>
                <div id="mix-noise-knob"></div>
                <div id="mix-noise-switch"></div>
              </div>
            </div>
          </div>
          
          <!-- Modifiers -->
          <div class="section">
            <div class="section-header">Modifiers</div>
            <div class="knob-row">
              <div class="knob-group">
                <div id="cutoff-knob"></div>
                <div class="knob-label">Cutoff<br>Frequency</div>
              </div>
              <div class="knob-group">
                <div id="emphasis-knob"></div>
                <div class="knob-label">Filter<br>Emphasis</div>
              </div>
              <div class="knob-group">
                <div id="contour-knob"></div>
                <div class="knob-label">Amount<br>of Contour</div>
              </div>
            </div>
            <div class="section-header" style="font-size: 10px; margin-top: 10px;">Loudness Contour</div>
            <div class="knob-row">
               <div class="knob-group">
                <div id="attack-knob"></div>
                <div class="knob-label">Attack Time</div>
              </div>
              <div class="knob-group">
                <div id="decay-knob"></div>
                <div class="knob-label">Decay Time</div>
              </div>
              <div class="knob-group">
                <div id="sustain-knob"></div>
                <div class="knob-label">Sustain Level</div>
              </div>
            </div>
          </div>
          
          <!-- Output -->
          <div class="section">
             <div class="section-header">Output</div>
             <div class="knob-group">
                <div id="volume-knob"></div>
                <div class="knob-label">Volume</div>
                <div id="power-switch" class="switch-orange"></div>
                <div class="knob-label" style="color:var(--accent-orange)">Power</div>
             </div>
          </div>
          
        </div>
        
        <!-- Keyboard Panel -->
        <div class="keyboard-panel">
          <div id="keyboard-container" class="keys"></div>
        </div>
        
        <!-- Bottom Panel (Sequencer & Effects) -->
        <div class="bottom-panel">
          
          <!-- Sequencer -->
          <div class="section sequencer-section">
            <div class="section-header">8-Step Sequencer</div>
            <div class="seq-steps" id="seq-steps-container"></div>
            <div class="seq-controls">
               <button id="seq-play-btn" class="moog-button">PLAY/STOP</button>
               <div class="knob-group">
                 <div id="seq-tempo-knob"></div>
                 <div class="knob-label">Tempo (BPM)</div>
               </div>
               <div class="seq-tempo-display" id="seq-tempo-display">120</div>
            </div>
          </div>
          
          <!-- Effects -->
          <div class="section effects-section">
            <div class="section-header">Effects</div>
            <div class="knob-row">
              <div class="knob-group">
                <div id="fx-delay-time-knob"></div>
                <div class="knob-label">Delay Time</div>
              </div>
              <div class="knob-group">
                <div id="fx-delay-mix-knob"></div>
                <div class="knob-label">Delay Mix</div>
              </div>
              <div class="knob-group">
                <div id="fx-reverb-mix-knob"></div>
                <div class="knob-label">Reverb Mix</div>
              </div>
            </div>
          </div>
          
        </div>
        
        <!-- Preset Management -->
        <div class="preset-panel">
          <select id="preset-select"><option value="">-- Load Preset --</option></select>
          <input type="text" id="preset-name" placeholder="Preset Name..." />
          <button id="preset-save-btn" class="moog-button">Save</button>
          <button id="preset-export-btn" class="moog-button">Export ALL</button>
        </div>
        
      </div>
    `;

    this.initializeComponents();
  }

  initializeComponents() {
    // === OUTPUT ===
    this.knobs.volume = new Knob(document.getElementById('volume-knob'), {
      min: 0, max: 1, value: 0.5, step: 0.01,
      onChange: (v) => { if (this.ae.masterGain) this.ae.masterGain.gain.value = v; }
    });
    this.switches.power = new Switch(document.getElementById('power-switch'), {
      state: true,
      onChange: (v) => { if (this.ae.audioContext) v ? this.ae.resume() : this.ae.audioContext.suspend(); }
    });

    // === CONTROLLERS ===
    this.knobs.tune = new Knob(document.getElementById('tune-knob'), { min: -100, max: 100, value: 0 }); // cents
    this.knobs.glide = new Knob(document.getElementById('glide-knob'), { min: 0, max: 5, value: 0 }); // seconds
    this.knobs.modMix = new Knob(document.getElementById('mod-mix-knob'), { min: 0, max: 1, value: 0.5 }); // Osc3 vs Noise

    // === OSCILLATOR BANK ===
    // Osc 1
    this.knobs.osc1Range = new Knob(document.getElementById('osc1-range-knob'), {
      min: 0, max: 5, value: 3, step: 1, // LO, 32', 16', 8', 4', 2'
      onChange: (v) => { this.ae.oscillators[0].range = [0.5, 1, 2, 4, 8, 16][v]; }
    });
    this.knobs.osc1Wave = new Knob(document.getElementById('osc1-wave-knob'), {
      min: 0, max: 5, value: 2, step: 1, // triang, triang-saw, saw, square, wide pulse, narrow pulse
      onChange: (v) => { this.ae.oscillators[0].osc.type = ['triangle', 'sawtooth', 'sawtooth', 'square', 'square', 'square'][v]; }
    });

    // Osc 2
    this.knobs.osc2Tune = new Knob(document.getElementById('osc2-tune-knob'), { min: -7, max: 7, value: 0, step: 0.1 }); // semitones
    this.knobs.osc2Range = new Knob(document.getElementById('osc2-range-knob'), { min: 0, max: 5, value: 3, step: 1 });
    this.knobs.osc2Wave = new Knob(document.getElementById('osc2-wave-knob'), { min: 0, max: 5, value: 2, step: 1 });

    // Osc 3
    this.knobs.osc3Tune = new Knob(document.getElementById('osc3-tune-knob'), { min: -7, max: 7, value: 0, step: 0.1 });
    this.knobs.osc3Range = new Knob(document.getElementById('osc3-range-knob'), { min: 0, max: 5, value: 3, step: 1 });
    this.knobs.osc3Wave = new Knob(document.getElementById('osc3-wave-knob'), { min: 0, max: 5, value: 2, step: 1 });

    // === MIXER ===
    const setupMixerOsc = (id, target) => {
      this.knobs[`mix${id}`] = new Knob(document.getElementById(`mix-${id.toLowerCase()}-knob`), {
        min: 0, max: 1, value: 0.8,
        onChange: (v) => {
          const st = this.switches[`mix${id}`] ? this.switches[`mix${id}`].state : true;
          this.ae.mixer.setLevel(target, st ? v : 0);
        }
      });
      this.switches[`mix${id}`] = new Switch(document.getElementById(`mix-${id.toLowerCase()}-switch`), {
        state: true,
        onChange: (st) => { this.ae.mixer.setLevel(target, st ? this.knobs[`mix${id}`].value : 0); }
      });
      this.knobs[`mix${id}`].onChange(0.8);
    };

    setupMixerOsc('Osc1', 'osc1');
    setupMixerOsc('Osc2', 'osc2');
    setupMixerOsc('Osc3', 'osc3');
    setupMixerOsc('Noise', 'noise');

    // === MODIFIERS ===
    this.knobs.cutoff = new Knob(document.getElementById('cutoff-knob'), {
      min: 20, max: 20000, value: 1000,
      onChange: (v) => { this.ae.filter.setCutoff(v); }
    });
    this.knobs.emphasis = new Knob(document.getElementById('emphasis-knob'), {
      min: 0, max: 1, value: 0,
      onChange: (v) => { this.ae.filter.setEmphasis(v); }
    });
    this.knobs.contourAmount = new Knob(document.getElementById('contour-knob'), { min: 0, max: 10000, value: 4000 });

    // Envelopes
    this.knobs.attack = new Knob(document.getElementById('attack-knob'), {
      min: 0.01, max: 10, value: 0.01,
      onChange: (v) => { this.ae.envelopes.loudness.attackTime = v; this.ae.envelopes.filter.attackTime = v; }
    });
    this.knobs.decay = new Knob(document.getElementById('decay-knob'), {
      min: 0.01, max: 10, value: 0.5,
      onChange: (v) => {
        this.ae.envelopes.loudness.decayTime = v;
        this.ae.envelopes.filter.decayTime = v;
        this.ae.envelopes.loudness.releaseTime = v; // Minimoog shares decay/release
        this.ae.envelopes.filter.releaseTime = v;
      }
    });
    this.knobs.sustain = new Knob(document.getElementById('sustain-knob'), {
      min: 0, max: 1, value: 0.5,
      onChange: (v) => { this.ae.envelopes.loudness.sustainLevel = v; this.ae.envelopes.filter.sustainLevel = v; }
    });

    // === EFFECTS ===
    this.knobs.fxDelayTime = new Knob(document.getElementById('fx-delay-time-knob'), {
      min: 0.01, max: 2.0, value: 0.3,
      onChange: (v) => { this.ae.effects.delayTimeValue = v; this.ae.effects.updateDelay(); }
    });
    this.knobs.fxDelayMix = new Knob(document.getElementById('fx-delay-mix-knob'), {
      min: 0, max: 1, value: 0.3,
      onChange: (v) => { this.ae.effects.delayMixValue = v; this.ae.effects.updateDelay(); }
    });
    this.knobs.fxReverbMix = new Knob(document.getElementById('fx-reverb-mix-knob'), {
      min: 0, max: 1, value: 0.2,
      onChange: (v) => { this.ae.effects.reverbMixValue = v; this.ae.effects.updateReverb(); }
    });

    // === SEQUENCER ===
    const seqContainer = document.getElementById('seq-steps-container');
    this.seqKnobs = [];

    for (let i = 0; i < 8; i++) {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'seq-step';

      const pitchLabel = document.createElement('div');
      pitchLabel.className = 'knob-label';
      pitchLabel.innerText = 'Pitch';

      const pitchKnobEl = document.createElement('div');

      const velLabel = document.createElement('div');
      velLabel.className = 'knob-label';
      velLabel.innerText = 'Vel';

      const velKnobEl = document.createElement('div');

      const indicator = document.createElement('div');
      indicator.className = 'seq-indicator';
      indicator.id = `seq-ind-${i}`;

      stepDiv.appendChild(indicator);
      stepDiv.appendChild(pitchLabel);
      stepDiv.appendChild(pitchKnobEl);
      stepDiv.appendChild(velLabel);
      stepDiv.appendChild(velKnobEl);
      seqContainer.appendChild(stepDiv);

      const pitchKnob = new Knob(pitchKnobEl, {
        min: 0, max: 1, value: 0.5,
        onChange: (v) => { this.ae.sequencer.steps[i].pitch = v; }
      });

      const velKnob = new Knob(velKnobEl, {
        min: 0, max: 1, value: 0.8,
        onChange: (v) => { this.ae.sequencer.steps[i].velocity = v; }
      });

      this.seqKnobs.push({ pitchKnob, velKnob });
    }

    this.ae.sequencer.onStep = (step) => {
      // Clear all indicators
      for (let i = 0; i < 8; i++) {
        document.getElementById(`seq-ind-${i}`).classList.remove('active');
      }
      document.getElementById(`seq-ind-${step}`).classList.add('active');
    };

    document.getElementById('seq-play-btn').addEventListener('click', () => {
      if (this.ae.sequencer.isPlaying) {
        this.ae.sequencer.stop();
      } else {
        this.ae.sequencer.start();
      }
    });

    const tempoDisplay = document.getElementById('seq-tempo-display');
    this.knobs.seqTempo = new Knob(document.getElementById('seq-tempo-knob'), {
      min: 40, max: 240, value: 120, step: 0.1,
      onChange: (v) => {
        this.ae.sequencer.tempo = v;
        tempoDisplay.innerText = v.toFixed(1);
      }
    });

    // === PRESETS ===
    this.presetManager = new PresetManager(this);
    const selectBox = document.getElementById('preset-select');

    const updateSelect = () => {
      selectBox.innerHTML = '<option value="">-- Load Preset --</option>';
      Object.keys(this.presetManager.presets).forEach(p => {
        const opt = document.createElement('option');
        opt.value = p; opt.innerText = p;
        selectBox.appendChild(opt);
      });
    };
    updateSelect();

    selectBox.addEventListener('change', (e) => {
      if (e.target.value) {
        this.presetManager.loadPreset(e.target.value);
        e.target.value = ''; // Reset select after loading
      }
    });

    document.getElementById('preset-save-btn').addEventListener('click', () => {
      const presetNameInput = document.getElementById('preset-name');
      const presetName = presetNameInput.value.trim() || 'New Preset';
      this.presetManager.savePreset(presetName);
      presetNameInput.value = ''; // Clear input after saving
      updateSelect();
    });

    document.getElementById('preset-export-btn').addEventListener('click', () => {
      this.presetManager.exportPresets();
    });

    // Attach simple keyboard UI logic
    this.buildKeyboard();
  }

  buildKeyboard() {
    const container = document.getElementById('keyboard-container');
    const numKeys = 44; // Standard Minimoog is 44 keys (F-C)

    const pattern = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white'];
    // Start note index for F usually (pattern index 5)
    let patternIndex = 5;

    // We will place all white keys, and absolute position black keys
    let whiteKeyCount = 0;

    for (let i = 0; i < numKeys; i++) {
      const type = pattern[patternIndex % 12];
      const typeStr = type;

      const keyEl = document.createElement('div');

      if (type === 'white') {
        keyEl.className = 'key-white';
        container.appendChild(keyEl);
        whiteKeyCount++;
      } else {
        keyEl.className = 'key-black';
        // Calculate left position based on how many white keys came before
        // A black key sits between the previous white key and the current invisible white key slot
        keyEl.style.left = `calc(${(whiteKeyCount / 26) * 100}%)`; // Approximation
        container.appendChild(keyEl);
      }

      patternIndex++;
    }
  }
}
