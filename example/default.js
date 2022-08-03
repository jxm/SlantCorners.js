document.addEventListener("DOMContentLoaded", ()=>{
    init();
    window.addEventListener("resize", ()=>{
        init();
    })
    
});

function init() {
    
    let box1 = document.getElementById("box1");
    let cc = new CornerSlant(box1);
    
    /**
    cc.fill("orange", [16, 0, 32, 0]);
    cc.outline("black", 3, [16, 0, 32, 0]);
    cc.replaceBackground();
    **/
    
    let op = cc.outerPoints([0, 16, 16, 32]);
    let ip = cc.innerPoints(op, 5);
    
    let ctx = cc.canvas.getContext("2d");
    ctx.beginPath();
    cc.drawRound(op, 4);
    cc.drawRound(ip, 2);
    ctx.clip("evenodd");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cc.canvas.width, cc.canvas.height);

    
    //let ip = ccex3.innerPoints(ex3op, 5);
    //let exip2 = ccex3.innerPoints(ex3op, 8);
    //ccex3.drawOutline(exip1, exip2, "#333");
    cc.replaceBackground();
    
}