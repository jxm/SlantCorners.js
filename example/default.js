document.addEventListener("DOMContentLoaded", ()=>{
    init();
    window.addEventListener("resize", ()=>{
        init();
    })
    
});

function init() {

    let bg_color = "#b0b0b0";
    let outline_color = "#000099";
    let outline_size = 5; //px
    let corners = [0, 16, 0, 16];

    let slant_bg = document.getElementsByClassName("slant-corner-bg");
    let slant_outline = document.getElementsByClassName("slant-corner-outline");
    let slant_bgoutline = document.getElementsByClassName("slanted-corner-bg-outline");

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
    
    for (let i=0; i<slant_bgoutline.length; i++) {
        let elem = slant_bgoutline[i];
        let cs = new SlantCorners(elem);
        cs.fillOutline(corners, outline_size, bg_color, outline_color);
    }
    
}