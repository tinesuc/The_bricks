
function drawIt() {
    
    function init() {
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        x = WIDTH/4 + 50;//zogica in canvas
        y = 140//HEIGHT/2;
        dx = 2;
        dy = 4;
        r = 10;
        tocke = 0;
        $("#tocke").html(tocke);
        return setInterval(draw, 10);
    }

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 10;
        paddlew = 75;
    }
    function init_mouse() {
        canvasMinX = $("canvas").offset().left;
        canvasMaxX = canvasMinX + WIDTH;
    }
    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 5;
        NCOLS = 7;
        BRICKWIDTH = (WIDTH/NCOLS) - 1;
        BRICKHEIGHT = 15;
        PADDING = 50;
        BRICKTOP = 20;
        rsOblak = false;
        bricks = new Array(NROWS);
        for (i=0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j=0; j < NCOLS; j++) {
                bricks[i][j] = {h:1,v:1};
            }
        }
    }
    
    var intervalId = init();
    init_paddle();
    init_mouse();
    initbricks();
    
    
    function draw() {
        clear();
        circle(x, y, 10);
        //premik plošèice levo in desno
        if(rightDown){
            if((paddlex+paddlew) < WIDTH){
                paddlex += 5;
                paddled = 5;
            }else{
                paddlex = WIDTH-paddlew;
            }
        }else if(leftDown){
            if(paddlex>0){
                paddlex -=5;
                paddled = -5;
            }else{
                paddlex=0;
            }
        }
        rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);
        
        //riši opeke
        for (i=0; i < NROWS; i++) {
            for (j=0; j < NCOLS; j++) {
                if (bricks[i][j].h > 0) {
                    ctx.fillStyle="#954a00";
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING, (i * (BRICKHEIGHT + PADDING)) + PADDING + BRICKTOP, BRICKWIDTH, BRICKHEIGHT);
                    if(oblak.complete&&rsOblak){
                        ctx.drawImage(oblak, (j * (BRICKWIDTH + PADDING)) + PADDING, (i * (BRICKHEIGHT + PADDING)) + PADDING + BRICKTOP, BRICKWIDTH, BRICKHEIGHT);
                    }
                }
            }
        }
        var rowheight = BRICKHEIGHT + PADDING ;//širina in višina opek z paddingom
        var colwidth = BRICKWIDTH + PADDING;
        
        var cmy = (y - BRICKTOP - PADDING/2)%rowheight;
        var row = (y - BRICKTOP + r - PADDING)/rowheight;
        if(cmy<(PADDING/2-r)||cmy>(PADDING/2+BRICKHEIGHT+r)){row=-1;}else{row=Math.floor(row);}//èe je v paddingu ne zadene opeke
        
        var cmx = (x - PADDING/2)%colwidth;
        var col = (x + r - PADDING)/colwidth;
        if(cmx<(PADDING/2-r)||cmx>(PADDING/2+BRICKWIDTH+r)){col=-1;}else{col=Math.floor(col);}
        //Èe smo zadeli opeko, vrni povratno kroglo in oznaèi v tabeli, da opeke ni veè
        if (row < NROWS  && row >= 0 && col < NCOLS && col >= 0 && bricks[row][col].h > 0) {
            if(cmx<(PADDING/2)&&Math.sign(dx)===1||
                cmx>(PADDING/2+BRICKWIDTH)&&Math.sign(dx)===-1){
                dx=-dx;//odbijaj tudi pri strani opeke
            }else{
                dy = -dy; 
            }
            tocke += bricks[row][col].v;
            $("#tocke").html(tocke);
            bricks[row][col].h -= 1;
        }
        
  
        if (x + dx > WIDTH-r || x + dx < 0+r){
            dx = -dx;
        }
        if (y + dy < 0+r){
            dy = -dy;
        }
        else if(y + dy > HEIGHT-r-paddleh){
            if (x > paddlex - r && x < paddlex + paddlew + r){
                dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
                dy = -dy;
            }else{
                clearInterval(intervalId);
                document.querySelector("html").style.cursor="default";
                playing=false;
                x = 150;
                y = 150;
            }
        }
        x += dx;
        y += dy;
    }
    

}







document.addEventListener("DOMContentLoaded", (event) => {
    playB=document.querySelector('#play');
    playB.addEventListener("click", (event) => {
        if(!playing){
            document.querySelector("html").style.cursor="grab";
            playing=true;
            drawIt();
        }
    });
    
});




























