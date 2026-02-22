export class Knob {
    constructor(element, options) {
        this.element = element;
        this.min = options.min || 0;
        this.max = options.max || 1;
        this.value = options.value || this.min;
        this.step = options.step || 0.01;
        this.onChange = options.onChange || (() => { });

        this.isDragging = false;
        this.startY = 0;
        this.startValue = this.value;

        this.build();
        this.updateVisuals();
        this.addEventListeners();
    }

    build() {
        this.element.classList.add('moog-knob-container');

        this.knobInner = document.createElement('div');
        this.knobInner.classList.add('moog-knob');

        this.indicator = document.createElement('div');
        this.indicator.classList.add('moog-knob-indicator');
        this.knobInner.appendChild(this.indicator);

        this.element.appendChild(this.knobInner);
    }

    addEventListeners() {
        this.knobInner.addEventListener('mousedown', this.startDrag.bind(this));
        this.knobInner.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });

        window.addEventListener('mousemove', this.drag.bind(this));
        window.addEventListener('touchmove', this.drag.bind(this), { passive: false });

        window.addEventListener('mouseup', this.stopDrag.bind(this));
        window.addEventListener('touchend', this.stopDrag.bind(this));
    }

    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        this.startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        this.startValue = this.value;
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const deltaY = this.startY - currentY;

        // Sensitivity: 150px drag represents full range
        const range = this.max - this.min;
        let newValue = this.startValue + (deltaY / 150) * range;

        // Clamp
        newValue = Math.max(this.min, Math.min(this.max, newValue));

        // Step rounding
        if (this.step) {
            newValue = Math.round(newValue / this.step) * this.step;
        }

        if (newValue !== this.value) {
            this.value = newValue;
            this.updateVisuals();
            this.onChange(this.value);
        }
    }

    stopDrag() {
        this.isDragging = false;
    }

    updateVisuals() {
        // Moog knobs rotate from about -135deg to +135deg
        const percentage = (this.value - this.min) / (this.max - this.min);
        const rotation = -135 + (percentage * 270);
        this.knobInner.style.transform = `rotate(${rotation}deg)`;
    }
}
