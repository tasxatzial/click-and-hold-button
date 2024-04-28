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
 * The returned object of {@link ClickAndHold}.
 * @typedef {Object} ClickAndHoldAPI
 * @property {Function} setText
 *           Sets the text of the click-and-hold element.
 * @property {Function} setAriaLabel
 *           Sets the aria-label of the click-and-hold element.
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
 * 2) A '--hold-duration' custom CSS property (measured in ms).
 * 3) A 'data-active-hold' attribute during the hold phase.
 *
 * @param {HTMLElement} rootEl
 *        The root container of the click-and-hold element. 
 * @param {number} duration
 *        Required duration (ms) for a completed (not cancelled) hold phase.
 * @param {Callbacks}
 * @return {ClickAndHoldAPI}
 */
function ClickAndHold(rootEl, duration, Callbacks) {
    const {onHoldStart, onHoldComplete, onHoldCancel} = Callbacks;
    const element = createButton();
    let state = initState();
    let animationState = initAnimationState();
    const startEventsNames = ['mousedown', 'touchstart', 'keydown'];
    const endEventsNames = ['keyup', 'blur', 'mouseup', 'mouseleave', 'mouseout', 'touchend', 'touchcancel'];
    addHoldStartListeners();
    addHoldEndListeners();
    element.style.setProperty('--hold-duration', duration + 'ms');
    element.setAttribute('data-click-and-hold', '');
    rootEl.appendChild(element);

    return {
        setText,
        setAriaLabel
    };

    function createButton() {
        const container = document.createElement('div');
        container.className = 'click-and-hold';
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'application');
        const containerFill = document.createElement('div');
        containerFill.className = 'fill';
        const containerText = document.createElement('span');
        containerText.className = 'text';
        container.appendChild(containerFill);
        container.appendChild(containerText);

        return container;
    }

    function setText(text) {
        const textContainer = element.querySelector('span');
        textContainer.textContent = text;
    }

    function setAriaLabel(text) {
        element.setAttribute('aria-label', text);
    }

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
        startEventsNames.forEach(type => element.addEventListener(type, _onHoldStart));
    }

    function removeHoldStartListeners() {
        startEventsNames.forEach(type => element.removeEventListener(type, _onHoldStart));
    }

    function addHoldEndListeners() {
        endEventsNames.forEach(type => element.addEventListener(type, _onHoldEnd));
    }

    function _onHoldStart(e) {
        if (e.type === 'keydown' && !KeyboardUtils.is_Space(e)) {
            return;
        }
        if (e.type === 'mousedown' && e.button !== 0) {
            return;
        }
        state.eventType = e.type;
        element.setAttribute('data-active-hold', '');
        onHoldStart();
        removeHoldStartListeners();
        window.requestAnimationFrame(step);
    }

    function _onHoldEnd(e) {
        e.preventDefault();
        if ((state.eventType === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (state.eventType === 'mousedown' && ((e.type === 'mouseup' && e.button === 0) || e.type === 'mouseleave' || e.type === 'mouseout')) ||
            (state.eventType === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                element.removeAttribute('data-active-hold');
                if (!animationState.done) {
                    window.cancelAnimationFrame(animationState.timerID);
                    onHoldCancel();
                    element.style.setProperty('--fill-percent', '0%');
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
            element.style.setProperty('--fill-percent', count + '%');
            if (count >= 100) {
                animationState.done = true;
            }
        }
        
        if (animationState.done) {
            element.removeAttribute('data-active-hold');
            onHoldComplete();
            element.style.setProperty('--fill-percent', '0%');
        } else {
            animationState.previousTimeStamp = timestamp;
            animationState.timerID = window.requestAnimationFrame(step);
        }
    }
}

export default ClickAndHold;
