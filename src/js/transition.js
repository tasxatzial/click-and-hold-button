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
    const state = {};
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

    function keydownListener(e) {
        if (KeyboardUtils.is_Space(KeyboardUtils.getKeyName(e))) {
            onHoldStart(e);
        }
    }

    function addHoldStartListeners() {
        element.addEventListener('keydown', keydownListener);
        ['mousedown', 'touchstart']
            .forEach(type => element.addEventListener(type, onHoldStart));
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
        state.durationTimeout = setTimeout(() => {
            onHoldComplete();
            element.removeAttribute('data-active-hold');
        }, duration);
        removeHoldStartListeners();
    }

    function onHoldEnd(e) {
        e.preventDefault();
        if ((state.eventType === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (state.eventType === 'mousedown' && (e.type === 'mouseup' || e.type === 'mouseleave' || e.type === 'mouseout')) ||
            (state.eventType === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                clearTimeout(state.durationTimeout);
                element.removeAttribute('data-active-hold');
                resetState();
                addHoldStartListeners();
        }
    }

    function clear() {
        removeHoldEndListeners();
        removeHoldStartListeners();
        clearTimeout(state.durationTimeout);
        resetState();
        element.removeAttribute('data-active-hold');
        element.removeAttribute('data-click-and-hold');
    }
}

export default ClickAndHold;
