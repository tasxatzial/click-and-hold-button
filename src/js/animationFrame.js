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
 * 2) A 'mouseup' or 'mouseleave' or 'mouseout' event if the action was initiated
 * by a 'mousedown' event.
 * 3) A 'touchend' or 'touchcancel' event if the action was initiated by a
 * 'touchstart' event.
 * 
 * The function also adds on the element:
 * 1) A 'data-click-and-hold' attribute.
 * 2) A '--hold-duration' custom CSS property (in ms).
 * 3) A 'data-active-hold' attribute during the hold phase.
 * 4) A '--complete-percent' custom CSS property that shows the completed percentage
 * of the hold phase.
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
    let state = initState();
    let animationState = initAnimationState();
    const startEventsNames = ['mousedown', 'touchstart', 'keydown'];
    const endEventsNames = ['keyup', 'blur', 'mouseup', 'mouseleave', 'mouseout', 'touchend', 'touchcancel'];
    addHoldStartListeners();
    addHoldEndListeners();
    btnEl.style.setProperty('--hold-duration', duration + 'ms');
    btnEl.setAttribute('data-click-and-hold', '');

    function initAnimationState() {
        return {
            done: false,
            timerID: null,
            start: null,
            previousTimeStamp: null
        }
    }

    function initState() {
        return {
            eventType: null
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
        state.eventType = e.type;
        btnEl.setAttribute('data-active-hold', '');
        onHoldStart();
        removeHoldStartListeners();
        window.requestAnimationFrame(step);
    }

    function _onHoldEnd(e) {
        e.preventDefault();
        if ((state.eventType === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (state.eventType === 'mousedown' && ((e.type === 'mouseup' && e.button === 0) || e.type === 'mouseleave' || e.type === 'mouseout')) ||
            (state.eventType === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                btnEl.removeAttribute('data-active-hold');
                if (!animationState.done) {
                    window.cancelAnimationFrame(animationState.timerID);
                    onHoldCancel();
                    btnEl.style.setProperty('--complete-percent', '0%');
                }
                animationState = initAnimationState();
                state = initState();
                addHoldStartListeners();
        }
    }

    function step(timestamp) {
        if (animationState.start === null) {
            animationState.start = timestamp;
        }
        const elapsed = timestamp - animationState.start;

        if (animationState.previousTimeStamp !== timestamp) {
            const count = (elapsed * 100 / duration).toFixed(2);
            btnEl.style.setProperty('--complete-percent', count + '%');
            if (count >= 100) {
                animationState.done = true;
            }
        }
        
        if (animationState.done) {
            btnEl.removeAttribute('data-active-hold');
            onHoldComplete();
            btnEl.style.setProperty('--complete-percent', '0%');
        } else {
            animationState.previousTimeStamp = timestamp;
            animationState.timerID = window.requestAnimationFrame(step);
        }
    }
}

export default ClickAndHold;
