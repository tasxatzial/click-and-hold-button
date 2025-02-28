# Click-and-hold button

A click-and-hold button is a user interface element that demands users to click on the button and maintain that click for a specific period before the associated action is executed.

This project demonstrates how to add basic click-and-hold functionality to elements using plain JavaScript. Mouse, keyboard, and touch events are supported.

[Live version](https://tasxatzial.github.io/click-and-hold-button/src/index.html)

## Implementation

Two implementations, `animation.js` and `animationFrame.js` are provided.

Both add to the button:

* A `data-click-and-hold` attribute.
* A `--hold-duration` custom CSS property (measured in ms).
* A `data-active-hold` attribute when the hold phase is initiated. The attribute is removed when the hold phase is completed (lasting for at least the specified duration) or cancelled (lasting less than the specified duration).

Additionally, `animationFrame.js` adds an extra custom CSS property `--complete-percent` that indicates the elapsed time since the start of the hold phase as a percentage of the hold duration. This number is updated ~X times per second, where X matches the screen refresh rate. For example, a duration of 0.2 seconds and a refresh rate of 60 Hz will give us 0.2 * 60 = ~12 numbers evenly distributed between 0 and ~100.

### Initialization

The user needs to define 3 functions:

* A function that will run when the hold phase starts.
* A function that will run when the hold phase is completed.
* A function that will run when the hold phase is cancelled.

### Animations

In both implementations, the animation can be created using either a CSS transition or animation that use the `data-active-hold` property. In `animationFrame.js` the animation can also be created with a CSS transform that uses the `--complete-percent` property.

## Dependencies

None. The project uses only HTML, CSS, JavaScript.

## Use

See [script.js](src/js/script.js), [style.css](src/style.css), [index.html](src/index.html) for a demo use of both implementations.

## Run locally

Download the 'src' folder and use a local web server to serve its contents.
