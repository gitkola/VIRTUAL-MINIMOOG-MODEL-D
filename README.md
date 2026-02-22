# Virtual Minimoog Model D

A high-performance, browser-based recreation of the classic Minimoog Model D analog synthesizer, built with Vanilla JavaScript, Web Audio API, and Vanilla CSS.

## Features

- **Accurate Audio Architecture**: 3 Oscillators (with multiple waveforms and ranges), Mixer (with noise generator), Moog-style 24dB Ladder Filter, and dedicated ADS Envelopes for Loudness and Filter.
- **Classic UI**: A meticulously designed, hardware-accurate layout featuring the distinct sections: Controllers, Oscillator Bank, Mixer, Modifiers, and Output.
- **Hardware Integration**:
  - `A` - `K`: Play notes (C Major scale mapping).
  - `Z` / `X`: Octave down / up.
  - `Spacebar`: Play/Stop Sequencer.
  - `-` / `+`: Decrease/Increase Tempo.
- **Built-in Sequencer**: An 8-step sequencer with independent pitch and velocity controls per step.
- **Effects Section**: Integrated digital Delay and Reverb.
- **Preset Management**: Save, load, export, and import complete synthesizer states natively in JSON format.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone or download the repository.
2. Navigate to the project directory:

   ```bash
   cd VIRTUAL-MINIMOOG-MODEL-D
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

### Running the App

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to the local server address provided (usually `http://localhost:3001` or `http://localhost:3000`).

## Usage

1. Click **Start Audio Engine** to initialize the Web Audio API context.
2. Use the on-screen knobs to shape your sound.
3. Play notes using your computer keyboard or build a sequence using the 8-Step Sequencer panel.
4. Save your favorite sounds using the Preset panel at the bottom.

## Technologies Used

- **Vanilla JS**: No heavy frameworks, ensuring maximum performance and direct access to Web Audio APIs.
- **Web Audio API**: For low-latency, high-quality synthesized sound production.
- **Vite**: For fast, modern local development and bundling.
- **Vanilla CSS**: Custom styling recreating the legendary hardware look with modern responsiveness.
