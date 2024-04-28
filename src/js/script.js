import Animation from './animation.js';
import AnimationFrame from './animationFrame.js';


const holdDuration = 500; // 500ms

function onHoldStart() {
    console.log('hold start');
}

function onHoldComplete() {
    console.log('hold complete');
}

function onHoldCancel() {
    console.log('hold cancel');
}

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
