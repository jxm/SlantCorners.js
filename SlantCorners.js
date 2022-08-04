/*
CutCornerBG class
*/

class SlantCorners
{
    
    constructor(e) {
        
        this.element = e;
        
        this.canvas = document.createElement("canvas");
        this.canvas.width = e.offsetWidth;
        this.canvas.height = e.offsetHeight;
        
        this.default_curve_factor = 4;
    }
    
    fill(corners, color) {
        
        this.drawFill(corners, color);
        this.replaceBackground();
        
    }
    
    fillOutline(corners, width, bg_color, outline_color) {
        
        this.drawFill(corners, bg_color);
        this.drawOutline(corners, width, outline_color);
        this.replaceBackground();
        
    }
    
    outline(corners, width, color) {
        
        this.drawOutline(corners, width, color);
        this.replaceBackground();
        
    }
    
    drawFill(corners, color) {
        
        let ctx = this.canvas.getContext("2d");
        
        let op = this.outerPoints(corners);
        
        ctx.beginPath();
        this.drawFilter(op, this.default_curve_factor);
        ctx.fillStyle = color;
        ctx.fill();
        
    }
    
    drawFilter(p, d) {
        let ctx = this.canvas.getContext("2d");
        
        for (let i=0; i<p.length; i++) {
            
            if (d <=0) {
                if (i==0) {
                    ctx.moveTo(p[0][0], p[0][1]);
                } else {
                    ctx.lineTo(p[i][0], p[i][1]);
                }
                continue;   
            }
            
            let prev = i-1;
            if (i == 0) { prev = p.length-1 }
            let next = i+1;
            if (i >= p.length-1) { next = 0 }
            
            let angle1 = Math.atan2( p[prev][1]-p[i][1], p[prev][0]-p[i][0] );
            let angle2 = Math.atan2( p[next][1]-p[i][1], p[next][0]-p[i][0] );
            
            let p1 = [];
            let p2 = [];
            p1[0] = p[i][0] + Math.cos(angle1)*d;
            p1[1] = p[i][1] + Math.sin(angle1)*d;
            p2[0] = p[i][0] + Math.cos(angle2)*d;
            p2[1] = p[i][1] + Math.sin(angle2)*d;
            
            if (i==0) {
                ctx.moveTo(p1[0], p1[1]);
            } else {
                ctx.lineTo(p1[0], p1[1]);
            }
            ctx.quadraticCurveTo(p[i][0], p[i][1], p2[0], p2[1]);
            
        }
        
        ctx.closePath();
        
    }
    
    drawOutline(corners, width, color) {
        
        let ctx = this.canvas.getContext("2d");
        
        let op = this.outerPoints(corners);
        let ip = this.innerPoints(op, width);
        
        ctx.beginPath();
        this.drawFilter(op, this.default_curve_factor);
        this.drawFilter(ip, this.default_curve_factor);
        ctx.clip("evenodd");
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
    }
    
    
    
    cutPoint(corner, point, size) {
        if (!size) {
            return [point];
        }
        
        //set coefficients
        let sw;
        let sh;
        let ew;
        let eh;
        
        //0, 0
        if (corner.match("tl")) {
            sw = 0;
            sh = size;
            ew = size;
            eh = 0;
        } else if (corner.match("tr")) {
            sw = -size;
            sh = 0;
            ew = 0;
            eh = size;
        } else if (corner.match("br")) {
            sw = 0
            sh = -size;
            ew = -size;
            eh = 0;
        } else if (corner.match("bl")) {
            sw = size;
            sh = 0;
            ew = 0;
            eh = -size;
        }
        
        let start = [point[0]+sw, point[1]+sh];
        let end = [point[0]+ew, point[1]+eh];
        
        return [start, end];
    }
    
    getSlope(x1, y1, x2, y2) {
        if (x1 == x2) {
            return "undefined";
        }
        return (y2-y1)/(x2-x1);
    }
    
    getPerpendicular(m) {
        if (m == "undefined") {
            return 0;
        }
        return Math.atan(1/m);
    }
    
    getB(slope, x, y) {
        return -y-slope*x;
    }
    
    innerPoints(op, stroke) {
        
        let center = [this.canvas.width/2, this.canvas.height/2];
        let ip = [];
        
        for (let i=0; i<op.length; i++) {
            //direction
            let x_coef = Math.sign(center[0] - op[i][0]);
            let y_coef = Math.sign(center[1] - op[i][1]);
            
            //set labels for previous and next point
            let prev = i-1;
            if (prev < 0) {
                prev = op.length-1;
            }
            let next = i+1;
            if (next >= op.length) {
                next = 0;
            }
            
            //get slopes of lines
            let m1 = this.getSlope(op[prev][0], op[prev][1], op[i][0], op[i][1]);
            let m2 = this.getSlope(op[i][0], op[i][1], op[next][0], op[next][1]);
            
            //get angle of slopes
            let theta1 = this.getPerpendicular(m1);
            let theta2 = this.getPerpendicular(m2);
            
            //center to point
            let check_slope = (center[1]-op[i][1])/(center[0]-op[i][0]);
            
            //point to center
            let ptc = this.getSlope(op[i][0], op[i][1], center[0], center[1]);
            let ptc_theta = Math.atan(ptc)*Math.sign(center[0] - op[i][0]);
            
            let x1_coef = Math.sign(center[0]-op[i][0])*Math.abs(Math.cos(theta1));
            let y1_coef = Math.sign(center[1]-op[i][1])*Math.abs(Math.sin(theta1));
            let x2_coef = Math.sign(center[0]-op[i][0])*Math.abs(Math.cos(theta2));
            let y2_coef = Math.sign(center[1]-op[i][1])*Math.abs(Math.sin(theta2));
            
            //new points on line
            let p1 = [op[i][0] + x1_coef*stroke, op[i][1]+ y1_coef*stroke];
            let p2 = [op[i][0] + x2_coef*stroke, op[i][1]+y2_coef*stroke];
            
            //solve for point
            let inner_p = [];
            if (m1 == "undefined") {
                inner_p[0] = p1[0];
                inner_p[1] = m2*(inner_p[0] - p2[0])+p2[1];
            } else if (m2 == "undefined") {
                inner_p[0] = p2[0];
                inner_p[1] = m1*(inner_p[0] - p1[0])+p1[1];
            } else {
                inner_p[0] = (p2[1]-p1[1]+p1[0]*m1-m2*p2[0])/(m1-m2);
                inner_p[1] = m1*(inner_p[0]-p1[0])+p1[1];
            }
            ip.push(inner_p);
        }
        return ip;
    }
    
    //order of options: tl tr br bl
    outerPoints(sizes) {
        let canvas = this.canvas;
        
        let w = canvas.width;
        let h = canvas.height;
        
        let corners = [
            [0, 0],
            [w, 0],
            [w, h],
            [0, h]
        ];
        let locs = ["tl", "tr", "br", "bl"];
        let points = [];
        
        for (let i=0; i<corners.length;i++) {
            let p = this.cutPoint(locs[i], corners[i], sizes[i]);
            for (let j=0; j<p.length;j++) {
                points.push(p[j]);
            }
        }
        return points;
    }
    
    replaceBackground() {
        
        //get image data
        let img = this.canvas.toDataURL();
        //set as background
        this.element.style.background = "url("+img+") no-repeat";
        this.element.style.backgroundSize = "100% 100%";
        
    }
    
    //draws line with rounded points
    
    
    
}