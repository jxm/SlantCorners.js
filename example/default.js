document.addEventListener("DOMContentLoaded", ()=>{
    init();
    window.addEventListener("resize", ()=>{
        init();
    })
    
});

function init() {
    
    let box1 = document.getElementById("box1");
    let cc = new CutCornerBG(box1);
    
    cc.fill("orange", [16, 0, 32, 0]);
    cc.outline("black", 3, [16, 0, 32, 0]);
    cc.replaceBackground();
    
}