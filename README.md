# Click-and-hold button

A click-and-hold button is a user interface element that demands users to click on the button and maintain that click for a specific period before the associated action is executed.

This project demonstrates how to add basic click-and-hold functionality to elements using plain JavaScript. Mouse, keyboard, and touch events are supported.

## Implementation

Two implementations are provided. In both, a `data-active-hold` class is added to the button when the hold phase is initiated. The class is removed when the hold phase is completed (lasting for at least the specified period) or cancelled (lasting less than the specified period).

### [animationFrame.js](src/js/animationFrame.js)

In this implementation, the animation is created by repeated calls of `window.requestAnimationFrame`. The user needs to define two functions:

* One that will repeatedly run during the hold phase. It takes as a parameter a number that indicates the percentage of the elapsed time until the hold phase is completed. The function will run ~X times per second, where X matches the screen refresh rate. So for a period of 0.2 seconds and a refresh rate of 60 Hz, the function will run 0.2 * 60 = ~12 times, and its arguments will be ~12 numbers evenly distributed between 0 and ~100.

* One that will run when the hold phase ends. It takes as a parameter a boolean that indicates whether the hold phase is completed.

### [transition.js](src/js/transition.js)

In this implementation, the animation is triggered using the `data-active-hold` class in CSS. The user needs to define only the function that will run when the hold phase is ends. It takes as a parameter a boolean that indicates whether the hold phase is completed.

## Dependencies

None. The project uses only HTML, CSS, JavaScript.

## Use

See [script.js](src/js/script.js), [style.css](src/style.css), [index.html](src/index.html) for a demo use of both implementations.

## Run locally

Download the 'src' folder and use a local web server to serve its contents.
