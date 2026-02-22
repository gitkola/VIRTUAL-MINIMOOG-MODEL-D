import './style.css';
import { AudioEngine } from './src/audio/AudioEngine.js';
import { UIBuilder } from './src/ui/UIBuilder.js';

let ae = null;
let ui = null;

const appDiv = document.querySelector('#app');
appDiv.innerHTML = `
  <div style="text-align:center; margin-top: 50vh;">
    <h1>Virtual Minimoog Model D</h1>
    <button id="start-engine" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Start Audio Engine</button>
  </div>
`;

document.getElementById('start-engine').addEventListener('click', () => {
    if (!ae) {
        ae = new AudioEngine();
        ae.resume();
        ui = new UIBuilder(appDiv, ae);
    }
});

let activeKeys = {};
let octaveShift = 0; // Shift by octaves (-2 to +2)

const baseKeyMap = {
    'KeyA': 261.63, // C4
    'KeyW': 277.18, // C#4
    'KeyS': 293.66, // D4
    'KeyE': 311.13, // D#4
    'KeyD': 329.63, // E4
    'KeyF': 349.23, // F4
    'KeyT': 369.99, // F#4
    'KeyG': 392.00, // G4
    'KeyY': 415.30, // G#4
    'KeyH': 440.00, // A4
    'KeyU': 466.16, // A#4
    'KeyJ': 493.88, // B4
    'KeyK': 523.25  // C5
};

window.addEventListener('keydown', (e) => {
    if (e.repeat) return;

    // Global shortcuts that don't need AE running immediately
    if (e.code === 'KeyZ') {
        octaveShift = Math.max(-2, octaveShift - 1);
        return;
    }
    if (e.code === 'KeyX') {
        octaveShift = Math.min(2, octaveShift + 1);
        return;
    }

    if (!ae) return; // Wait until AE is started via UI button

    if (e.code === 'Space') {
        e.preventDefault();
        if (ae.sequencer.isPlaying) ae.sequencer.stop();
        else ae.sequencer.start();
        return;
    }

    if (e.key === '-' || e.key === '_') {
        ae.sequencer.tempo = Math.max(40, ae.sequencer.tempo - 0.1);
        if (ui && ui.knobs.seqTempo) ui.knobs.seqTempo.onChange(ae.sequencer.tempo);
        return;
    }
    if (e.key === '=' || e.key === '+') {
        ae.sequencer.tempo = Math.min(240, ae.sequencer.tempo + 0.1);
        if (ui && ui.knobs.seqTempo) ui.knobs.seqTempo.onChange(ae.sequencer.tempo);
        return;
    }

    if (baseKeyMap[e.code]) {
        activeKeys[e.code] = true;
        const freq = baseKeyMap[e.code] * Math.pow(2, octaveShift);
        ae.triggerNoteOn(freq);
    }
});

window.addEventListener('keyup', (e) => {
    if (!ae) return;

    if (baseKeyMap[e.code]) {
        delete activeKeys[e.code];
        // Monophonic behavior: only release if no keys are held
        if (Object.keys(activeKeys).length === 0) {
            ae.triggerNoteOff();
        } else {
            // Re-trigger the last note held
            const lastKey = Object.keys(activeKeys).pop();
            if (lastKey) {
                const freq = baseKeyMap[lastKey] * Math.pow(2, octaveShift);
                ae.triggerNoteOn(freq);
            }
        }
    }
});
