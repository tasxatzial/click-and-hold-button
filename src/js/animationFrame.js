import KeyboardUtils from './keyboardUtils.js';


/**
 * Invoked multiple times during the hold phase. It runs ~X times per
 * second, where X matches the screen refresh rate.
 * @callback onHoldRun
 * @param {number} percent
 *        A number that indicates the percentage of the elapsed time
 *        until the hold phase is completed. Numbers will be evenly
 *        distributed between 0 and ~100.
 */

/**
 * Runs when the hold phase is completed or cancelled.
 * @callback onHoldComplete
 * @param {boolean} isComplete
 *        True only if the hold phase has been completed, else false.
 */

/**
 * The returned object of {@link ClickAndHold}.
 * @typedef {Object} ClickAndHoldAPI
 * @property {Function} clear
 *           Removes the click-and-hold functionality from the element that
 *           was passed as an argument to {@link ClickAndHold}.
 */

/**
 * Adds click-and-hold functionality to an element.
 * 
 * The action can be initiated by:
 * 1) A 'mousedown' event.
 * 2) A 'touchstart' event.
 * 3) A 'keydown' event by the space key.
 * 
 * The action can be cancelled by:
 * 1) A 'keyup' or 'blur' event if the action was initiated by a 'keydown' event.
 * 2) A 'mouseup' or 'mouseleave' or 'mouseout' event if the action was initiated
 * by a 'mousedown' event.
 * 3) A 'touchend' or 'touchcancel' event if the action was initiated by a
 * 'touchstart' event.
 * 
 * The function also adds on the element:
 * 1) A 'data-click-and-hold' attribute.
 * 2) A '--hold-duration' custom css property (measured in ms).
 * 3) A 'data-active-hold' attribute during the hold phase.
 *
 * @param {HTMLElement} element
 *        The target click-and-hold element.
 * @param {number} duration
 *        Required duration (ms) for a completed (not cancelled) hold phase.
 * @param {Function} onHoldComplete
 *        Runs when the hold phase is completed or cancelled.
 * @param {Function} onHoldRun
 *        Runs during the hold phase. Optional parameter.
 * @return {ClickAndHoldAPI}
 * @throws {Error}
 *         If the element already has click-and-hold functionality.
 */
function ClickAndHold(element, duration, onHoldComplete, onHoldRun = () => {}) {
    element.style.setProperty('--hold-duration', duration + 'ms');
    const animation = {};
    const state = {};
    const startEvents = ['mousedown', 'touchstart', 'keydown'];
    const endEvents = ['keyup', 'blur', 'mouseup', 'mouseleave', 'mouseout', 'touchend', 'touchcancel'];
    if (element.hasAttribute('data-click-and-hold')) {
        throw new Error('Already a click-and-hold element');
    }
    resetAnimation();
    addHoldStartListeners();
    addHoldEndListeners();
    element.setAttribute('data-click-and-hold', '');
    return {
        clear
    };

    function resetAnimation() {
        animation.done = false;
        animation.timerID = null;
        animation.start = null;
        animation.previousTimeStamp = null;
    }

    function resetState() {
        state.eventType = null;
    }

    function addHoldStartListeners() {
        startEvents.forEach(type => element.addEventListener(type, onHoldStart));
    }

    function removeHoldStartListeners() {
        startEvents.forEach(type => element.removeEventListener(type, onHoldStart));
    }

    function addHoldEndListeners() {
        endEvents.forEach(type => element.addEventListener(type, onHoldEnd));
    }

    function removeHoldEndListeners() {
        endEvents.forEach(type => element.removeEventListener(type, onHoldEnd));
    }

    function onHoldStart(e) {
        if (e.type === 'keydown' && !KeyboardUtils.is_Space(e)) {
            return;
        }
        if (e.type === 'mousedown' && e.button !== 0) {
            return;
        }
        state.eventType = e.type;
        element.setAttribute('data-active-hold', '');
        removeHoldStartListeners();
        window.requestAnimationFrame(step);
    }

    function onHoldEnd(e) {
        e.preventDefault();
        if ((state.eventType === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (state.eventType === 'mousedown' && ((e.type === 'mouseup' && e.button === 0) || e.type === 'mouseleave' || e.type === 'mouseout')) ||
            (state.eventType === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                element.removeAttribute('data-active-hold');
                if (!animation.done) {
                    window.cancelAnimationFrame(animation.timerID);
                    onHoldComplete(false);
                }
                resetAnimation();
                resetState();
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
            element.removeAttribute('data-active-hold');
            onHoldComplete(true);
        } else {
            animation.previousTimeStamp = timestamp;
            animation.timerID = window.requestAnimationFrame(step);
        }
    }

    function clear() {
        element.removeAttribute('data-active-hold');
        element.removeAttribute('data-click-and-hold');
        removeHoldEndListeners();
        removeHoldStartListeners();
        window.cancelAnimationFrame(animation.timerID);
        resetAnimation();
        resetState();
    }
}

export default ClickAndHold;
