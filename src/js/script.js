import Animation from './animation.js';
import AnimationFrame from './animationFrame.js';


const holdDuration = 500; // 500ms


/* CSS transition */
const btn1 = Animation(
    document.querySelector('[data-btn="css-transition"]'),
    holdDuration,
    (isComplete) => {
        if (isComplete) {

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

        }
    },
);

btn3.setText('Animation frame + CSS transition');
btn3.setAriaLabel('Click and hold button');
