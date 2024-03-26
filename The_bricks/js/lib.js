x = 0;//zogica in canvas
y = 0;
dx = 0;
dy = 0;
WIDTH = 0;
HEIGHT = 0;
r = 0;
ctx = null;

paddlex = 0;
paddled = 0;
paddleh = 0;//ploscek
paddlew = 0;
rightDown = false;
leftDown = false;

canvasMinX = 0;//premikanje ploscka z misko
canvasMaxX = 0;

tocke = 0;
bricks = [];//opeke
NROWS = 0;
NCOLS = 0;
BRICKWIDTH = 0;
BRICKHEIGHT = 0;
PADDING = 0;
BRICKTOP = 0;
rsOblak = true;
oblak = new Image();
oblak.src = "img/cloud.png";
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
}
$(document).mousemove(onMouseMove);
$(document).mousedown(()=>{if(playing)document.querySelector("html").style.cursor="grabbing";});
$(document).mouseup(()=>{if(playing)document.querySelector("html").style.cursor="grab";});

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "#8080a0";
    ctx.strokeStyle = "#8080a0";
    ctx.fill();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function clearRect(x,y,w,h) {
    ctx.clearRect(x, y, w, h);
}