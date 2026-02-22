export class Switch {
    constructor(element, options) {
        this.element = element;
        this.state = options.state || false; // false = down, true = up typically
        this.onChange = options.onChange || (() => { });
        this.orientation = options.orientation || 'vertical'; // vertical or horizontal

        this.build();
        this.updateVisuals();
        this.addEventListeners();
    }

    build() {
        this.element.classList.add('moog-switch-container', `moog-switch-${this.orientation}`);

        this.switchBody = document.createElement('div');
        this.switchBody.classList.add('moog-switch-body');

        this.switchHandle = document.createElement('div');
        this.switchHandle.classList.add('moog-switch-handle');

        this.switchBody.appendChild(this.switchHandle);
        this.element.appendChild(this.switchBody);
    }

    addEventListeners() {
        this.element.addEventListener('click', () => {
            this.state = !this.state;
            this.updateVisuals();
            this.onChange(this.state);
        });
    }

    updateVisuals() {
        if (this.state) {
            this.element.classList.add('is-on');
        } else {
            this.element.classList.remove('is-on');
        }
    }
}
