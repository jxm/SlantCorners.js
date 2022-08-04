# SlantCorners.js

## Intro

The CornerSlant.js library creates a background with real slanted corners (no pseudo element hacks). It creates a background using the `<canvas>`, then replaces the background on the element.

## Quick-start

First, we load the library, in the `<head>` tag of your html file, and your script above the closing `</body>` tag.

```
<script type="text/javascript" src="CornerSlant.js"></script>
```

```
<script type="text/javascript" src="default.js"></script>
```



A simple way to initialize the actions are on page load and on window resize, as elements can change their size when you scale the window. Suppose we plan to initialize the script in the `init()` function:

```
document.addEventListener("DOMContentLoaded", ()=>{
    init();
    window.addEventListener("resize", ()=>{
        init();
    })
});
```

Given we want a slanted corner background or a slanted corner outline on elements with classes `slant-corner-bg` and `slant-corner-outline` respectively, we write the following `init()` function.

```
function init() {

    let bg_color = "#909090";
    let outline_color = "#909090";
    let outline_size = 5; //px
    let corners = [0, 16, 0, 16];

    let slant_bg = document.getElementsByClassName("slant-corner-bg");
    let slant_outline = document.getElementsByClassName("slant-corner-outline");

    for (let i=0; i<slant_bg.length; i++) {
        let elem = slant_bg[i];
        let cs = new SlantCorners(elem);
        cs.fill(corners, bg_color);
    }

    for (let i=0; i<slant_outline.length; i++) {
        let elem = slant_outline[i];
        let cs = new SlantCorners(elem);
        cs.outline(corners, outline_size, outline_color);
    }
    
}

```

## API

### Constructor

**SlantCorners.constructor(element)**

Initialize the SlantCorner class with a DOM element object.

```
let sc = new SlantCorner(element);
```

### Simple Methods

These methods generate the background and automatically add it to the element.

**SlantCorners.fill(corners, color)**

Fills the entire background of the element.

**SlantCorners.outline(corners, width, color)**

Outlines the border of the element.

**SlantCorners.outlineFill(corners, width, outline_color, bg_color)**

Fills the element background and outlines.

#### Arguments

`corner`: A length 4 array that specifies the size of each corner [top-left, top-right, bottom-right, bottom-left]

`width`: An integer that specifies the width of the outline

`color`: A color for the canvas context `fillStyle` attribute.