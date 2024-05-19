import KeyboardUtils from './keyboardUtils.js';


/**
 * Object holding the callbacks of {@link ClickAndHold}.
 * @typedef {Object} Callbacks
 * @property {Function} onHoldStart
 *           Will run when the hold phase starts.
 * @property {Function} onHoldEnd
 *           Will run when the hold phase ends.
 * @property {Function} onHoldCancel
 *           Will run when the hold phase is cancelled.
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
 * 2) A 'mouseup' or 'mouseleave' event if the action was initiated
 * by a 'mousedown' event.
 * 3) A 'touchend' or 'touchcancel' event if the action was initiated by a
 * 'touchstart' event.
 * 
 * The function also adds on the element:
 * 1) A 'data-click-and-hold' attribute.
 * 2) A '--hold-duration' custom CSS property (in ms).
 * 3) A 'data-active-hold' attribute during the hold phase.
 * 
 * @param {HTMLElement} btnEl
 *        The target click-and-hold element.
 * @param {number} duration
 *        Required duration (ms) for a completed (not cancelled) hold phase.
 * @param {Callbacks}
 * @return undefined
 */
function ClickAndHold(btnEl, duration, Callbacks) {
    const {onHoldStart, onHoldComplete, onHoldCancel} = Callbacks;
    const startEventsNames = ['mousedown', 'touchstart', 'keydown'];
    const endEventsNames = ['keyup', 'blur', 'mouseup', 'mouseleave', 'touchend', 'touchcancel'];
    let state = initState();
    btnEl.style.setProperty('--hold-duration', duration + 'ms');
    btnEl.setAttribute('data-click-and-hold', '');
    addHoldEndListeners();
    addHoldStartListeners();

    function initState() {
        return {
            event: null,
            completed: false
        }
    }

    function addHoldStartListeners() {
        startEventsNames.forEach(type => btnEl.addEventListener(type, _onHoldStart));
    }

    function removeHoldStartListeners() {
        startEventsNames.forEach(type => btnEl.removeEventListener(type, _onHoldStart));
    }

    function addHoldEndListeners() {
        endEventsNames.forEach(type => btnEl.addEventListener(type, _onHoldEnd));
    }

    function _onHoldStart(e) {
        if (e.type === 'keydown' && !KeyboardUtils.is_Space(e)) {
            return;
        }
        if (e.type === 'mousedown' && e.button !== 0) {
            return;
        }
        e.preventDefault();
        state.event = e;
        btnEl.setAttribute('data-active-hold', '');
        onHoldStart(e);
        state.durationTimeout = setTimeout(() => {
            state.completed = true;
            btnEl.removeAttribute('data-active-hold');
            onHoldComplete(e);
        }, duration);
        removeHoldStartListeners();
    }

    function _onHoldEnd(e) {
        e.preventDefault();
        if ((state.event?.type === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (state.event?.type === 'mousedown' && ((e.type === 'mouseup' && e.button === 0) || e.type === 'mouseleave')) ||
            (state.event?.type === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                btnEl.removeAttribute('data-active-hold');
                if (!state.completed) {
                    onHoldCancel(e);
                }
                clearTimeout(state.durationTimeout);
                state = initState();
                addHoldStartListeners();
        }
    }
}

export default ClickAndHold;
