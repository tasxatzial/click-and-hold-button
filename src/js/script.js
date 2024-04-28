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
const btn1root = document.querySelector('[data-btn="css-transition"]');
const btn1 = Animation(btn1root, holdDuration, callbacks);
btn1.setText('CSS animation');
btn1.setAriaLabel('Click and hold button');

/* requestAnimationFrame + CSS transform */
const btn2root = document.querySelector('[data-btn="animationFrame-css-transform"]');
const btn2 = AnimationFrame(btn2root, holdDuration, callbacks);
btn2.setText('Animation frame + CSS transform');
btn2.setAriaLabel('Click and hold button');

/* requestAnimationFrame + CSS transition */
const btn3root = document.querySelector('[data-btn="animationFrame-css-transition"]');
const btn3 = AnimationFrame(btn3root, holdDuration, callbacks);
btn3.setText('Animation frame + CSS transition');
btn3.setAriaLabel('Click and hold button');
