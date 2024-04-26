import Animation from './animation.js';
import AnimationFrame from './animationFrame.js';


const COLORS = ['235 185 235', '190 114 247', '168 168 255', '127 199 127', '192 143 0', '247 157 83', '252 120 120'];
const state = {
    activeColor: 0
}
const holdDuration = 500; // 500ms

/* Set the initial background color of body */
setBodyColor();

/* CSS transition */
const btn1El = document.querySelector('.click-and-hold.animation[data-btn="1"]');
const btn1 = Animation(
    btn1El,
    holdDuration,
    (isComplete) => {
        if (isComplete) {
            state.activeColor++;
            setBodyColor();
        }
    }
);

/* requestAnimationFrame + CSS transform */
const btn2El = document.querySelector('.click-and-hold.animation-frame[data-btn="2"]');
const btn2 = AnimationFrame(
    btn2El,
    holdDuration,
    (isComplete) => {
        btn2El.style.setProperty('--bg-fill', '0%');
        if (isComplete) {
            state.activeColor++;
            setBodyColor();
        }
    },
    (percent) => {
        btn2El.style.setProperty('--bg-fill', percent + '%');
    }
);

/* requestAnimationFrame + CSS transition */
const btn3El = document.querySelector('.click-and-hold.animation-frame[data-btn="3"]');
const btn3 = AnimationFrame(
    btn3El,
    holdDuration,
    (isComplete) => {
        if (isComplete) {
            state.activeColor++;
            setBodyColor();
        }
    },
);

function setBodyColor() {
    document.body.style.setProperty('--bg-clr', COLORS[state.activeColor % COLORS.length]);
}
