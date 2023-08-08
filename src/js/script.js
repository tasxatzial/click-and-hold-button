

const btnTransition = document.querySelector('.click-and-hold.transition');
const duration = 1000; // 1s
const COLORS = ['235,185,235', '204,146,247', '168,168,255', '127,199,127', '207,207,122', '252,209,129', '252,146,146'];
let colorIdx = 0;

setBodyColor(colorIdx);
setBtnTransitionedColor(colorIdx);
btnTransition.style.setProperty('--duration', duration + 'ms');

function setBodyColor(color) {
    document.body.style.setProperty('--bg-clr', COLORS[color % COLORS.length]);
}

function setBtnTransitionedColor(color) {
    btnTransition.style.setProperty('--bg-next-clr',  COLORS[(color + 1) % COLORS.length]);
}

function callback() {
    colorIdx++;
    setBodyColor(colorIdx);
    setBtnTransitionedColor(colorIdx);
}
