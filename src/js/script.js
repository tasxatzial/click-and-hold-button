import Transition from './transition.js';
import AnimationFrame from './animationFrame.js';


const COLORS = ['235 185 235', '190 114 247', '168 168 255', '127 199 127', '192 143 0', '247 157 83', '252 120 120'];
const holdDuration = 500; // 500ms

/* Add click-and-hold functionality based on CSS transition */
const btnTr = document.querySelector('.click-and-hold.transition');
const TR = Transition(btnTr, onHoldCompleteTr, holdDuration);

/* Add click-and-hold functionality based on requestAnimationFrame */
const btnAF = document.querySelector('.click-and-hold.animation-frame');
const AF = AnimationFrame(btnAF, onHoldRunAF, onHoldCompleteAF, holdDuration);

/* Set the initial background color of body */
let colorIdx = 0;
setBodyColor();

function setBodyColor() {
    document.body.style.setProperty('--bg-clr', COLORS[colorIdx % COLORS.length]);
}

function setBodyNextColor() {
    colorIdx++;
    setBodyColor();
}

/* Runs when the hold phase of the button that uses CSS transition is completed. */
function onHoldCompleteTr() {
    setBodyNextColor();
}

/* Invoked multiple times during the hold phase of the button that uses
requestAnimationFrame. It runs ~X times per second, where X matches the screen
refresh rate. The values for percent will be evenly distributed between
0 and ~100. */
function onHoldRunAF(percent) {
    btnAF.style.setProperty('--bg-fill', percent + '%');
}

/* Runs when the hold phase of the button that uses requestAnimationFrame
ends (cancelled or completed). isComplete will be true if it is completed and
false if it is cancelled. */
function onHoldCompleteAF(isComplete) {
    btnAF.style.setProperty('--bg-fill', '0%');
    if (isComplete) {
        setBodyNextColor();
    }
}
