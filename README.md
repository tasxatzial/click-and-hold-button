# Click-and-hold button

A click-and-hold button is a user interface element that demands users to click on the button and maintain that click for a specific period before the associated action is executed.

This simple project demonstrates how to add basic click-and-hold functionality to elements using pure Javascript.

## Implementation

Two implementations are provided:

1) In [animationFrame.js](src/js/animationFrame.js) the animation is created by repeated calls of `requestAnimationFrame`.

2) In [transition.js](src/js/transition.js) the animation is triggered by adding a class to the corresponding element. This starts a simple CSS transition.

## Use

The .js files listed above explain how to add click-and-hold functionality to an element.

[script.js](src/js/script.js), [style.css](src/style.css), [index.html](src/index.html) demonstrate how to use each implementation.

## Run locally

Download the 'src' folder and setup a local web server to serve its contents.
