import Transition from './transition.js';
import AnimationFrame from './animationFrame.js';


const COLORS = ['235 185 235', '190 114 247', '168 168 255', '127 199 127', '192 143 0', '247 157 83', '252 120 120'];
const state = {
    activeColor: 0
}
const holdDuration = 500; // 500ms

/* Set the initial background color of body */
setBodyColor();

/* Add click-and-hold functionality based on CSS transition */
const btnTr = document.querySelector('.click-and-hold.transition');
const TR = Transition(
    btnTr,
    (isComplete) => {
        if (isComplete) {
            state.activeColor++;
            setBodyColor();
        }
    },
    holdDuration
);

/* Add click-and-hold functionality based on requestAnimationFrame */
const btnAF = document.querySelector('.click-and-hold.animation-frame');
const AF = AnimationFrame(btnAF,
    (percent) => {
        btnAF.style.setProperty('--bg-fill', percent + '%');
    },
    (isComplete) => {
        btnAF.style.setProperty('--bg-fill', '0%');
        if (isComplete) {
            state.activeColor++;
            setBodyColor();
        }
    },
    holdDuration
);

function setBodyColor() {
    document.body.style.setProperty('--bg-clr', COLORS[state.activeColor % COLORS.length]);
}
