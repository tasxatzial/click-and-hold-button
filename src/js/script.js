import ClickAndHoldTransition from './ClickAndHoldTransition.js';
import ClickAndHoldAnimationFrame from './ClickAndHoldAnimationFrame.js';

const btnTransition = document.querySelector('.click-and-hold.transition');
const btnAnimationFrame = document.querySelector('.click-and-hold.animation-frame');
const duration = 1000; // 1s
const COLORS = ['235,185,235', '204,146,247', '168,168,255', '127,199,127', '207,207,122', '252,209,129', '252,146,146'];
let colorIdx = 0;

setBodyColor(colorIdx);
setBtnTransitionedColor(colorIdx);
setBtnAnimationFrameColor();
btnTransition.style.setProperty('--duration', duration + 'ms');

new ClickAndHoldTransition(btnTransition, onHoldEndTransition, duration);
ClickAndHoldAnimationFrame(btnAnimationFrame, onHoldRunAnimationFrame, onHoldEndAnimationFrame, duration);

function setBodyColor(color) {
    document.body.style.setProperty('--bg-clr', COLORS[color % COLORS.length]);
}

function setBtnTransitionedColor(color) {
    btnTransition.style.setProperty('--bg-next-clr',  COLORS[(color + 1) % COLORS.length]);
}

function setBtnAnimationFrameColor() {
    btnAnimationFrame.style.setProperty('--bg-fill', '0%');
}

function onHoldEndTransition() {
    colorIdx++;
    setBodyColor(colorIdx);
    setBtnTransitionedColor(colorIdx);
}

function onHoldRunAnimationFrame(count) {
    btnAnimationFrame.style.setProperty('--bg-fill', count + '%');
}

function onHoldEndAnimationFrame(finished) {
    setBtnAnimationFrameColor();
    colorIdx++;
    if (finished) {
        setBodyColor(colorIdx);
        setBtnTransitionedColor(colorIdx);
    }
}
