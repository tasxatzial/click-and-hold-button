import Transition from './transition.js';
import AnimationFrame from './animationFrame.js';

const btnTr = document.querySelector('.click-and-hold.transition');
const btnAF = document.querySelector('.click-and-hold.animation-frame');
const duration = 500; // 500ms
const COLORS = ['235,185,235', '204,146,247', '168,168,255', '127,199,127', '207,207,122', '252,209,129', '252,146,146'];
let colorIdx = 0;

setBodyColor();
btnTr.style.setProperty('--duration', duration + 'ms');

Transition(btnTr, onHoldCompleteTr, duration);
AnimationFrame(btnAF, onHoldRunAF, onHoldCompleteAF, duration);

function setBodyColor() {
    document.body.style.setProperty('--bg-clr', COLORS[colorIdx % COLORS.length]);
}

function onHoldCompleteTr() {
    colorIdx++;
    setBodyColor();
}

function onHoldRunAF(count) {
    btnAF.style.setProperty('--bg-fill', count + '%');
}

function onHoldCompleteAF(hasCompleted) {
    btnAF.style.setProperty('--bg-fill', '0%');
    if (hasCompleted) {
        colorIdx++;
        setBodyColor();
    }
}
