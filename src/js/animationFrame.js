import KeyboardUtils from './keyboardUtils.js';

export default function ClickAndHold(element, onHoldRun, onHoldCompleted, duration) {
    const animation = {};
    const state = {};

    (function () {
        if (element.hasAttribute('data-click-and-hold')) {
            throw new Error('Already a click and hold element');
        }
        resetAnimation();
        addHoldStartListeners();
        addHoldEndListeners();
        element.setAttribute('data-click-and-hold', '');
    })();

    function resetAnimation() {
        animation.done = false;
        animation.timerID = null;
        animation.start = null;
        animation.previousTimeStamp = null;
    }

    function addHoldStartListeners() {
        ['mousedown', 'touchstart']
            .forEach(type => element.addEventListener(type, onHoldStart));
        element.addEventListener('keydown', keydownListener);
    }

    function addHoldEndListeners() {
        ['keyup', 'blur', 'mouseup', 'mouseleave', 'mouseout', 'touchend', 'touchcancel']
            .forEach(type => element.addEventListener(type, onHoldEnd));
    }

    function keydownListener(e) {
        if (KeyboardUtils.is_Space(KeyboardUtils.getKeyName(e))) {
            onHoldStart(e);
        }
    }

    function onHoldStart(e) {
        e.preventDefault();
        state.eventType = e.type;
        element.setAttribute('data-active-hold', '');
        ['mousedown', 'touchstart']
            .forEach(type => element.removeEventListener(type, onHoldStart));
        element.removeEventListener('keydown', keydownListener);
        window.requestAnimationFrame(step);
    }

    function onHoldEnd(e) {
        e.preventDefault();
        if ((state.eventType === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (state.eventType === 'mousedown' && (e.type === 'mouseup' || e.type === 'mouseleave' || e.type === 'mouseout')) ||
            (state.eventType === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                if (!animation.done) {
                    window.cancelAnimationFrame(animation.timerID);
                    onHoldCompleted(false);
                }
                element.removeAttribute('data-active-hold');
                resetAnimation();
                state.eventType = null;
                addHoldStartListeners();
        }
    }

    function step(timestamp) {
        if (animation.start === null) {
            animation.start = timestamp;
        }
        const elapsed = timestamp - animation.start;
    
        if (animation.previousTimeStamp !== timestamp) {
            const count = (elapsed * 100 / duration).toFixed(2)
            onHoldRun(count);
            if (count >= 100) {
                animation.done = true;
            }
        }
        
        if (animation.done) {
            onHoldCompleted(true);
            element.removeAttribute('data-active-hold');
        } else {
            animation.previousTimeStamp = timestamp;
            animation.timerID = window.requestAnimationFrame(step);
        }
    }
}
