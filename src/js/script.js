import Animation from './animation.js';
import AnimationFrame from './animationFrame.js';


/* ----------------------------------------------------------------*/
/* Initialize click and hold elements */

const holdDuration = 500; // 500ms
const callbacks = {onHoldStart, onHoldComplete, onHoldCancel};

/* CSS transition */
const btn1El = document.querySelector('[data-btn="css-transition"]');
Animation(btn1El, holdDuration, callbacks);

/* requestAnimationFrame + CSS transform */
const btn2El = document.querySelector('[data-btn="animationFrame-css-transform"]');
AnimationFrame(btn2El, holdDuration, callbacks);

/* requestAnimationFrame + CSS transition */
const btn3El = document.querySelector('[data-btn="animationFrame-css-transition"]');
AnimationFrame(btn3El, holdDuration, callbacks);

/* ----------------------------------------------------------------*/
/* update DOM and display event */

const maxEventsToShow = 12;
const events = document.querySelector('.events');

function initInsertEvent(id) {
    return function(e, name) {
        const btnType = e.target.closest('.click-and-hold').getAttribute('data-btn');
        const eventName = `<p data-btn=${btnType} class="event-text">${id}. Hold ${name}</p>`
        if (events.children.length === maxEventsToShow) {
            events.removeChild(events.children[0]);
        }
        events.insertAdjacentHTML('beforeend', eventName);
        id++;
    }
}

const insertEvent = initInsertEvent(0);

function onHoldStart(e) {
    insertEvent(e, 'start');
}

function onHoldComplete(e) {
    insertEvent(e, 'complete');
}

function onHoldCancel(e) {
    insertEvent(e, 'cancel');
}
