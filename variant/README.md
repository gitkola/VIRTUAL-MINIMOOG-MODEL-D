# Minimoog Model-D Web Synthesizer 🎹

A professional, zero-dependency, browser-based emulation of the legendary Minimoog Model-D analog synthesizer. Built entirely with Vanilla JavaScript, HTML5, CSS3, and the native **Web Audio API**.

This project authentically recreates the iconic architecture and signal flow of the original hardware, complete with a beautifully styled, procedurally generated user interface.

## ✨ Features

### 🎛 Authentic Sound Engine

* **3 Free-Running Oscillators:** Exact range multipliers (32', 16', 8', 4', 2', LO) and classic waveforms (Triangle, Sawtooth, Square/Pulse).
* **Moog-Style Ladder Filter:** A 4-pole (24dB/octave) cascaded low-pass filter utilizing native Biquad filters to emulate the iconic Moog "growl".
* **Overdrive/Feedback Loop:** Simulated mixer overdrive based on the classic hardware trick of routing the main output back into the external input.
* **Noise Generator:** Custom algorithm approximating both White and Pink noise.
* **Dedicated Envelopes:** ADS (Attack, Decay, Sustain) envelopes for both Loudness (VCA) and Filter Contour, interacting perfectly with the hardware-accurate Decay switch.

### 🎹 Performance Controls

* **On-Screen Keyboard:** Fully clickable/touchable 44-key manual.
* **Hardware QWERTY Integration:** Play the synth using your computer keyboard with zero latency.
* **LHS (Left-Hand Side) Panel:**
  * Pitch Bend Wheel (spring-loaded, +/- 7 semitones).
  * Modulation Wheel (controls Oscillator/Filter detuning).
  * Glide (Portamento) and independent LFO rate controls.

### 🎛️ Built-in Extras

* **8-Step Sequencer:** Per-step note selection, velocity, and mute toggles. Includes precision Web Audio scheduling, adjustable BPM, and Spacebar play/stop functionality.
* **Master Effects:** Adjustable Delay (Time & Feedback) and Convolution Reverb.
* **Preset Management:** Save, load, export, and import your patches locally as JSON files. Ships with default patches like "Init", "Fat Bass", and "Classic Lead".

---

## 🚀 Getting Started

Because this application has **zero external dependencies**, running it is as simple as opening a file:

1. Save the provided code as `index.html`.
2. Double-click the file to open it in any modern web browser (Chrome, Firefox, Safari, Edge).
3. Click the **"START AUDIO"** overlay to initialize the Web Audio context.

---

## 🕹️ Keyboard Mapping

You can play the synthesizer using your computer's QWERTY keyboard.

| Key / Shortcut | Action |
| :--- | :--- |
| **A, S, D, F, G, H, J, K, L, ;, '** | Play White Keys |
| **W, E, T, Y, U, O, P** | Play Black Keys |
| **Z** | Shift Octave Down |
| **X** | Shift Octave Up |
| **Spacebar** | Play / Stop Sequencer |
| **-** / **_** | Decrease Sequencer BPM |
| **+** / **=** | Increase Sequencer BPM |

---

## 🧬 Technical Architecture

This application pushes the limits of the browser's native capabilities:

* **Audio Context Setup:** Uses `AudioContext` to route standard Web Audio nodes (`OscillatorNode`, `GainNode`, `BiquadFilterNode`).
* **Component-Level Modeling:**
  * The **Ladder Filter** is achieved by cascading four low-pass `BiquadFilterNode`s in series, dividing the global resonance (Q) amongst them to prevent digital clipping while maintaining the steep 24dB slope.
  * The **Pink Noise** is generated dynamically using Paul Kellet's refinement method via a custom `AudioBuffer`.
  * The **Reverb** uses an algorithmically generated Impulse Response (IR) loaded into a `ConvolverNode`.
* **Precise Scheduling:** The sequencer circumvents JavaScript's `setInterval` drift by looking ahead and scheduling note events directly against the `AudioContext.currentTime` clock.
* **Procedural DOM:** To keep the codebase lightweight, the complex hardware UI is generated dynamically via JavaScript objects (`SYNTH_LAYOUT`), minimizing HTML boilerplate while utilizing CSS Grid and Flexbox for responsive, stacked layouts on mobile screens.

---

## 📱 Mobile Compatibility

The UI relies heavily on modern CSS layout techniques. While a traditional Minimoog panel is wide and horizontal, this application will intelligently wrap the UI modules (Mixer, Oscillators, Modifiers) to fit vertically on mobile and tablet screens, ensuring all parameters remain accessible.

*(Note: On mobile, Web Audio requires a screen tap to initialize. Tap the "Start Audio" screen to begin).*

---

## 📝 License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT). Feel free to fork, modify, and integrate into your own web-audio experiments!
