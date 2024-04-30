x = 0;//zogica in canvas
y = 0;
dx = 0;
dy = 0;
bl =[{x:0,y:0,dx:0,dy:0}];
sp=2.3;
WIDTH = 0;
HEIGHT = 0;
r = 0;
numBalls=1;
lvl=1;
ctx = null;

paddlex = 0;
paddled = 0;
paddleh = 0;//ploscek
paddlew = 0;
rightDown = false;
leftDown = false;

canvasMinX = 0;//premikanje ploscka z misko
canvasMinY = 0;//premikanje ploscka z misko
canvasMaxX = 0;

tocke = 0;
bricks = [];//opeke
NROWS = 0;
NCOLS = 0;
BRICKWIDTH = 0;
BRICKHEIGHT = 0;
PADDING = 0;
BRICKTOP = 0;
maxHard=0;
rsOblak = true;
oblak = new Image();
oblak.src = "img/cloud.png";
crack = new Image();
crack.src = "img/crack.png";
sekunde = -1;
intTimer=null;
izpisTimer="";
lc=window.localStorage;
paused=false;
abd=0;
hitp=0;
grabing=false;
beamangle=0;
beampos={x:0,y:0};
beamsep=0;
beamset=false;
flying=false;
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key));
}
//nastavljanje leve in desne tipke
function onKeyDown(evt) {
    if (evt.keyCode == 39){
        rightDown = true;
    }else if(evt.keyCode == 37){
        leftDown = true;
    }
}
function onKeyUp(evt) {
    if (evt.keyCode == 39){
        rightDown = false;
    }else if(evt.keyCode == 37){
        leftDown = false;
    }
}
$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp); 
paddlem=0;
function onMouseMove(evt) {//drzi gumb da premikas
    if (evt.buttons!==0&&evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
        var xp=paddlex;
        paddlex = evt.pageX - canvasMinX - paddlem;
        if((paddlex+paddlew) > WIDTH)paddlex = WIDTH-paddlew;
        if(paddlex<0) paddlex = 0;
        paddled = paddlex-xp;
    }else{
        paddlem = evt.pageX - paddlex - canvasMinX;
    }
    if(grabing){
        var dlx=beampos.x+canvasMinX-evt.pageX;
        var dly=beampos.y+canvasMinY-evt.pageY;
        beamangle=Math.atan(1/(dly/dlx))-Math.PI;//+Math.PI/2;
        beamsep=Math.min(Math.sqrt(dly*dly+dlx*dlx)/20+7,40);
    }
}
$(document).mousemove(onMouseMove);
$(document).mousedown((evt)=>{
    if(playing)document.querySelector("html").style.cursor="grabbing";
    if(playing){/*beampos={y:HEIGHT,x:evt.pageX - canvasMinX};*/grabing=true;}
});
$(document).mouseup((evt)=>{
    if(playing)document.querySelector("html").style.cursor="grab";
    if(playing)grabing=false;
});

function circle(x, y, r) {
    circle(x,y,r, "#8080a0");
}
function circle(x, y, r, st) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = st;
    ctx.strokeStyle = st;
    ctx.fill();
}
function ring(x, y, r, t) {
    circle(x,y,r, "#8080a0");
    circle(x,y,r-t, "#000000ff");
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}
function img(img,sx,sy,sw,sh,tx,ty,tw,th){
    ctx.drawImage(img, 
        sx, sx, 
        sw, sh, 
        tx, ty, 
        tw, th);
}
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function clearRect(x,y,w,h) {
    ctx.clearRect(x, y, w, h);
}
function timer(){
    sekunde++;
    var sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0"+sekundeI;
    var minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0"+minuteI;
    izpisTimer = minuteI + ":" + sekundeI;
    $("#cas").html(izpisTimer);
}

function bounds(arr, a, b){
    return a>=0&&a<arr.length && b>=0&&b<arr[a].length;
}
function drawBeam(sep, pos, angle){
    var xb=pos.x ;
    var yb=pos.y//beampos.y - canvasMinY ;
    //console.log(beamangle+" "+x+" "+y);
    for (var i = 0; i < 10; i++) {
        circle(xb,yb,3,"#8080a0");
        yb+=sep*Math.cos(angle);
        xb+=sep*Math.sin(angle);
    }
}

function hitb(xc, yc){
    bricks[xc][yc].b -= 1;
    if(bricks[xc][yc].b==0){
        tocke += bricks[xc][yc].v;
    }else{
        tocke += bricks[xc][yc].f;
    }
    $("#tocke").html(tocke);
    
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function genBricks(brarr, nrows, frac, hits, value){
    
    for (var i=0; i < nrows; i++) {
        brarr.unshift(new Array(NCOLS));
        for (j=0; j < NCOLS; j++) {
            if(Math.random()>frac){
                brarr[0][j] = {h:0,b:0,v:0,f:0,e:Math.random()<0.1};
                continue;
            }
            var h = hits;
            var v = value;
            if(Math.random()<0.1){h=hits*2;v=value*2;}
            brarr[0][j] = {
                h:h,
                b:h,
                v:1,
                f:v,
                e:false
            };
        }
    }
    return brarr;
}



































//        drawBeam(20, {x:600,y:400}, anglc);
//        drawBeam(20, {x:600,y:400}, anglx);
//        drawBeam(20, {x:600,y:400}, angly);
        /*
        if(Math.abs(ccy)>Math.abs(ccx)){
            if(abd>r/2&&bounds(bricks, row, col)&&bricks[row][col].b!==0){
                var tmx = (cmx-r*snx+colwidth*NCOLS)%colwidth;
                if(tmx>(PADDING/2-r)&&tmx<(PADDING/2+BRICKWIDTH+r)){
                    abd=0;
                    //col+=snx;
                    hit=1;
                }else{
                    hit=0;
                }
            }
        }else{
            if(abd>r/2&&bounds(bricks, row, col)&&bricks[row][col].b!==0){
                var tmy = (cmy-r*sny+rowheight*NROWS)%rowheight;
                if(tmy>(PADDING/2-r)&&tmy<(PADDING/2+BRICKHEIGHT+r)){
                    abd=0;
                    //row+=sny;
                    hit=-1;
                }else{
                    hit=0;
                }
            }
        }
        if(Math.abs(ccx)>colwidth/2-r&&Math.abs(ccy)>rowheight/2-r
                &&Math.sign(ccx)==snx&&Math.sign(ccy)==sny&&
                hit!=hitp){
            if(bounds(bricks, row+sny, col)&&bricks[row+sny][col].b===0){
                if(bounds(bricks, row, col+snx)&&bricks[row][col+snx].b===0){
                    hit=0;
                    if(bounds(bricks, row+sny, col+snx)&&bricks[row+sny][col+snx].b!==0){
                        var rcx=Math.abs(Math.abs(ccx)-colwidth/2);
                        var rcy=Math.abs(Math.abs(ccy)-rowheight/2);
                        var atg=Math.atan(rcy/rcx);
                        dx = dx*Math.cos(atg)+dy*Math.sin(atg);
                        dy = dy*Math.cos(atg)+dx*Math.sin(atg);
                        
                        
                        
                        bricks[row+sny][col+snx].b -= 1;
                        if(bricks[row+sny][col+snx].b==0){
                            tocke += bricks[row+sny][col+snx].v;
                        }else{
                            tocke += bricks[row+sny][col+snx].f;
                        }
                        $("#tocke").html(tocke);
                    }
                }
            }
        }
        */