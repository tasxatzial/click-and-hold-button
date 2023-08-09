import KeyboardUtils from './keyboardUtils.js';


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
 * @param {Function} onHoldCompleted
 *        Runs when the hold phase is completed (not cancelled).
 * @param {number} duration
 *        Time in ms needed to trigger onHoldCompleted.
 * @return {ClickAndHoldAPI}
 * @throws {Error}
 *         If the element already has click and hold functionality.
 */
function ClickAndHold(element, onHoldCompleted, duration) {
    const state = {};

    (function() {
        if (element.hasAttribute('data-click-and-hold')) {
            throw new Error("Already a click and hold element");
        }
        addHoldStartListeners();
        addHoldEndListeners();
        element.setAttribute('data-click-and-hold', '');
    })();

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
            onHoldCompleted();
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

    return {
        clear
    };
}

export default ClickAndHold;
