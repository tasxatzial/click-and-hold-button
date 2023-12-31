import KeyboardUtils from './keyboardUtils.js';


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
 * The function also adds a data-click-and-hold attribute on the element and
 * a data-active-hold during the hold phase.
 * 
 * @param {HTMLElement} element
 *        The target click-and-hold element.
 * @param {Function} onHoldComplete
 *        Runs when the hold phase is completed (not cancelled).
 * @param {number} duration
 *        Time in ms needed to trigger onHoldCompleted.
 * @return {ClickAndHoldAPI}
 * @throws {Error}
 *         If the element already has click-and-hold functionality.
 */
function ClickAndHold(element, onHoldComplete, duration) {
    element.style.setProperty('--hold-duration', duration + 'ms');
    const state = {};
    const startEvents = ['mousedown', 'touchstart', 'keydown'];
    const endEvents = ['keyup', 'blur', 'mouseup', 'mouseleave', 'mouseout', 'touchend', 'touchcancel'];
    if (element.hasAttribute('data-click-and-hold')) {
        throw new Error("Already a click-and-hold element");
    }
    resetState();
    addHoldStartListeners();
    addHoldEndListeners();
    element.setAttribute('data-click-and-hold', '');
    return {
        clear
    };

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
        state.durationTimeout = setTimeout(() => {
            element.removeAttribute('data-active-hold');
            onHoldComplete();
        }, duration);
        removeHoldStartListeners();
    }

    function onHoldEnd(e) {
        e.preventDefault();
        if ((state.eventType === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (state.eventType === 'mousedown' && ((e.type === 'mouseup' && e.button === 0) || e.type === 'mouseleave' || e.type === 'mouseout')) ||
            (state.eventType === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                element.removeAttribute('data-active-hold');
                clearTimeout(state.durationTimeout);
                resetState();
                addHoldStartListeners();
        }
    }

    function clear() {
        element.removeAttribute('data-active-hold');
        element.removeAttribute('data-click-and-hold');
        element.style.removeProperty('--duration');
        removeHoldEndListeners();
        removeHoldStartListeners();
        clearTimeout(state.durationTimeout);
        resetState();
    }
}

export default ClickAndHold;
