import KeyboardUtils from './keyboardUtils.js';

export default class ClickAndHold {
    constructor(element, onHoldCompleted, duration) {
        if (element.hasAttribute('data-click-and-hold')) {
            throw new Error("Element is already a click and hold element");
        }
        this.onHoldStart = this.onHoldStart.bind(this);
        this.onHoldEnd = this.onHoldEnd.bind(this);
        this.keydownListener = this.keydownListener.bind(this);
        this.element = element;
        this.duration = duration;
        this.onHoldCompleted = onHoldCompleted;
        this.addHoldStartListeners();
        this.addHoldEndListeners();
        element.setAttribute('data-click-and-hold', '');
    }

    keydownListener(e) {
        if (KeyboardUtils.is_Space(KeyboardUtils.getKeyName(e))) {
            this.onHoldStart(e);
        }
    }

    addHoldStartListeners() {
        this.element.addEventListener('keydown', this.keydownListener, {once: true});
        ['mousedown', 'touchstart']
            .forEach(type => this.element.addEventListener(type, this.onHoldStart, {once: true}));
    }

    addHoldEndListeners() {
        ['keyup', 'blur', 'mouseup', 'mouseleave', 'mouseout', 'touchend', 'touchcancel']
            .forEach(type => this.element.addEventListener(type, this.onHoldEnd));
    }
    
    onHoldStart(e) {
        e.preventDefault();
        this.eventType = e.type;
        this.element.setAttribute('data-active-hold', '');
        this.durationTimeout = setTimeout(() => {
            this.onHoldCompleted();
            this.element.removeAttribute('data-active-hold');
        }, this.duration);

        this.element.removeEventListener('keydown', this.keydownListener);
        ['mousedown', 'touchstart']
            .forEach(type => this.element.removeEventListener(type, this.onHoldStart));
    }

    onHoldEnd(e) {
        e.preventDefault();
        if ((this.eventType === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (this.eventType === 'mousedown' && (e.type === 'mouseup' || e.type === 'mouseleave' || e.type === 'mouseout')) ||
            (this.eventType === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                clearTimeout(this.durationTimeout);
                this.element.removeAttribute('data-active-hold');
                this.eventType = null;
                this.addHoldStartListeners();
        }
    }
}
