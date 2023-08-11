import KeyboardUtils from './keyboardUtils.js';


/**
 * Invoked multiple times during the hold phase. It runs ~X times per
 * second, where X matches the screen refresh rate.
 * @callback onHoldRun
 * @param {number} percent
 *        A number from 0 to ~100 that indicates the percentage of the
 *        elapsed time until the hold phase is completed.
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
 *           Removes the click and hold functionality from the element that
 *           was passed as an argument to {@link ClickAndHold}.
 */

/**
 * Adds click and hold functionality to an element.
 * 
 * The click phase can be initiated with:
 * 1) A 'mousedown' or 'touchstart' event.
 * 2) Press of space key after the element has received focus.
 * 
 * The hold phase can be cancelled with:
 * 1) A 'keyup' event triggered by the release of the space key.
 * 2) A 'blur' or 'mouseup' or 'mousleave' or 'mouseout' or 'touchend' or
 *    'touchcancel' event.
 * 
 * The function also adds a data-click-and-hold attribute on the element and
 * a data-active-hold during the hold phase.
 *
 * @param {HTMLElement} element
 *        The target click and hold element.
 * @param {Function} onHoldRun
 *        Runs during the hold phase.
 * @param {Function} onHoldComplete
 *        Runs when the hold phase is completed or cancelled.
 * @param {number} duration
 *        Time in ms needed for a completed (not cancelled) hold phase.
 * @return {ClickAndHoldAPI}
 * @throws {Error}
 *         If the element already has click and hold functionality.
 */
function ClickAndHold(element, onHoldRun, onHoldComplete, duration) {
    const animation = {};
    const state = {};
    if (element.hasAttribute('data-click-and-hold')) {
        throw new Error('Already a click and hold element');
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

    function keydownListener(e) {
        if (KeyboardUtils.is_Space(KeyboardUtils.getKeyName(e))) {
            onHoldStart(e);
        }
    }

    function addHoldStartListeners() {
        ['mousedown', 'touchstart']
            .forEach(type => element.addEventListener(type, onHoldStart));
        element.addEventListener('keydown', keydownListener);
    }

    function removeHoldStartListeners() {
        ['mousedown', 'touchstart']
            .forEach(type => element.removeEventListener(type, onHoldStart));
        element.removeEventListener('keydown', keydownListener);
    }

    function addHoldEndListeners() {
        ['keyup', 'blur', 'mouseup', 'mouseleave', 'mouseout', 'touchend', 'touchcancel']
            .forEach(type => element.addEventListener(type, onHoldEnd));
    }

    function removeHoldEndListeners() {
        ['keyup', 'blur', 'mouseup', 'mouseleave', 'mouseout', 'touchend', 'touchcancel']
            .forEach(type => element.removeEventListener(type, onHoldEnd));
    }

    function onHoldStart(e) {
        e.preventDefault();
        state.eventType = e.type;
        element.setAttribute('data-active-hold', '');
        removeHoldStartListeners();
        window.requestAnimationFrame(step);
    }

    function onHoldEnd(e) {
        e.preventDefault();
        if ((state.eventType === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (state.eventType === 'mousedown' && (e.type === 'mouseup' || e.type === 'mouseleave' || e.type === 'mouseout')) ||
            (state.eventType === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                if (!animation.done) {
                    window.cancelAnimationFrame(animation.timerID);
                    onHoldComplete(false);
                }
                element.removeAttribute('data-active-hold');
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
            onHoldComplete(true);
            element.removeAttribute('data-active-hold');
        } else {
            animation.previousTimeStamp = timestamp;
            animation.timerID = window.requestAnimationFrame(step);
        }
    }

    function clear() {
        removeHoldEndListeners();
        removeHoldStartListeners();
        window.cancelAnimationFrame(animation.timerID);
        resetAnimation();
        resetState();
        element.removeAttribute('data-active-hold');
        element.removeAttribute('data-click-and-hold');
    }
}

export default ClickAndHold;
