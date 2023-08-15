# Click-and-hold button

A click-and-hold button is a user interface element that demands users to click on the button and maintain that click for a specific period before the associated action is executed.

This simple project demonstrates how to add basic click-and-hold functionality to elements using pure Javascript.

## Implementation

The main difference between the two buttons is the implementation of their animation.

In one button the animation is triggered by adding a class to the corresponding element. This starts a simple CSS transition.

The animation of the other button is triggered by repeated calls of `requestAnimationFrame`.

## Use

[animationFrame.js](src/js/animationFrame.js) and [transition.js](src/js/transition.js) contain the two implementations and explain how to use them.

[script.js](src/js/script.js) is the main entry script that demonstrates their use.

## Run locally

Download the 'src' folder and setup a local web server to serve its contents.
