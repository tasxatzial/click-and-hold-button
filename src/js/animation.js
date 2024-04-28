import KeyboardUtils from './keyboardUtils.js';


/**
 * Runs when the hold phase is completed or cancelled.
 * @callback onHoldComplete
 * @param {boolean} isComplete
 *        True only if the hold phase has been completed, else false.
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
 * @param {Function} onHoldComplete
 *        Runs when the hold phase is completed or cancelled.
 * @return {ClickAndHoldAPI}
 */
function ClickAndHold(rootEl, duration, onHoldComplete) {
    const element = createButton();
    let state = initState();
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

    function initState() {
        return {
            eventType: null,
            completed: false
        }
    }

    function addHoldStartListeners() {
        startEventsNames.forEach(type => element.addEventListener(type, onHoldStart));
    }

    function removeHoldStartListeners() {
        startEventsNames.forEach(type => element.removeEventListener(type, onHoldStart));
    }

    function addHoldEndListeners() {
        endEventsNames.forEach(type => element.addEventListener(type, onHoldEnd));
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
            state.completed = true;
            element.removeAttribute('data-active-hold');
            onHoldComplete(true);
        }, duration);
        removeHoldStartListeners();
    }

    function onHoldEnd(e) {
        e.preventDefault();
        if ((state.eventType === 'keydown' && (e.type === 'keyup' || e.type === 'blur')) ||
            (state.eventType === 'mousedown' && ((e.type === 'mouseup' && e.button === 0) || e.type === 'mouseleave' || e.type === 'mouseout')) ||
            (state.eventType === 'touchstart' && (e.type === 'touchend' || e.type === 'touchcancel'))) {
                element.removeAttribute('data-active-hold');
                if (!state.completed) {
                    onHoldComplete(false);
                }
                clearTimeout(state.durationTimeout);
                state = initState();
                addHoldStartListeners();
        }
    }
}

export default ClickAndHold;
