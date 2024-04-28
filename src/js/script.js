import Animation from './animation.js';
import AnimationFrame from './animationFrame.js';


const COLORS = ['235 185 235', '190 114 247', '168 168 255', '127 199 127', '192 143 0', '247 157 83', '252 120 120'];
const state = {
    activeColor: 0
}
const holdDuration = 500; // 500ms

/* Set the initial background color of body */
updateBodyColor();

/* CSS transition */
const btn1 = Animation(
    document.querySelector('[data-btn="css-transition"]'),
    holdDuration,
    (isComplete) => {
        if (isComplete) {
            state.activeColor++;
            updateBodyColor();
        }
    }
);

btn1.setText('CSS animation');
btn1.setAriaLabel('Click and hold button');

/* requestAnimationFrame + CSS transform */
const btn2 = AnimationFrame(
    document.querySelector('[data-btn="animationFrame-css-transform"]'),
    holdDuration,
    (isComplete) => {
        if (isComplete) {
            state.activeColor++;
            updateBodyColor();
        }
    }
);

btn2.setText('Animation frame + CSS transform');
btn2.setAriaLabel('Click and hold button');

/* requestAnimationFrame + CSS transition */
const btn3 = AnimationFrame(
    document.querySelector('[data-btn="animationFrame-css-transition"]'),
    holdDuration,
    (isComplete) => {
        if (isComplete) {
            state.activeColor++;
            updateBodyColor();
        }
    },
);

btn3.setText('Animation frame + CSS transition');
btn3.setAriaLabel('Click and hold button');

function updateBodyColor() {
    document.body.style.setProperty('--body-bg-clr', COLORS[state.activeColor % COLORS.length]);
}
