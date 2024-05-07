
function drawIt() {
    $('#pauza').on("click", (event) => {
        pause();
    });
    $("#koncaj").on("click", (e) => {
        end();
    });
    $(document).keyup((e) => {
        if (e.keyCode == 27) {
            pause();
        }
    });

    function init() {
        //lc.scores="";
        if (lc.scores == null || lc.scores.length == 0)
            lc.setObj("scores", [{t: 0, s: 0}]);
        //console.log(lc);
        //console.log(typeof lc.getObj("scores"));
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        r = 7;
        bl = [{x: WIDTH / 2 + 50, y: HEIGHT - r, dx: 0, dy: 0}];
        x = bl[0].x;
        y = bl[0].y;
//        dx = 1;
//        dy = 2;
        for (var i = 0; i < bl.length; i++) {
            
        }
        console.log(bl[0].x+" "+bl[0].y);
        //waitPull(0, x, y, 0, 0);
        beampos = {x: x, y: y};
        beamset = false;
        flying = false;
        //}
       // var end = true;
        //for (var i = 0; i < bl.length; i++) {
        //    end = end&&bl[i].c;
        //}
        //if(end){
//        lvl++;
//        NROWS++;
//        genBricks(bricks, 1, 0.2, lvl, lvl);
            //for (var i = 0; i < bl.length; i++) {
             //   bl[i].c=false;
           // }
        //}
        
        
        tocke = 0;
        var mxtck=0;
        var sc = lc.getObj("scores");
        for (var i = 0; i < sc.length; i++) {
            mxtck = Math.max(mxtck, sc[i].s);
        }
        $("#topt").html(mxtck);
        $("#tocke").html(tocke);
        sekunde = 0;
        izpisTimer = "00:00";
        timer();
        intTimer = setInterval(timer, 1000);
        return setInterval(draw, 5);
    }

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 10;
        paddlew = 75;
    }
    function init_mouse() {
        canvasMinX = $("canvas").offset().left;
        canvasMinY = $("canvas").offset().top;
        canvasMaxX = canvasMinX + WIDTH;
    }
    function initbricks() { //inicializacija opek - polnjenje v tabelo
        PADDING = 2;
        //var bc=Math.floor(WIDTH/(50-PADDING));

//        NROWS = 4;
//        NCOLS = 7;
        NROWS = 5;
        NCOLS = 10;
        BRICKWIDTH = (WIDTH / NCOLS - PADDING) - 1;
        BRICKHEIGHT = BRICKWIDTH;
        BRICKTOP = 20;
        BRICKLEFT = (WIDTH - (BRICKWIDTH + PADDING) * NCOLS) / 2;
        rsOblak = false;
        bricks = [];
        genBricks(bricks, NROWS, 0.2, lvl, lvl);
    }

    intervalId = init();
    init_paddle();
    init_mouse();
    initbricks();

function nexb(i){
    if(i>=bl.length)return;
    bl[i].s=true;
    setTimeout(nexb(i+1), 500);
}

    function draw() {
        //if(!playing)return;
        if (beamset && !grabing && !flying) {
            dy = 2 * Math.cos(beamangle);
            dx = 2 * Math.sin(beamangle);
//            yb+=sep*Math.cos(angle);
//            xb+=sep*Math.sin(angle);
            var scalr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            var absp = sp / (scalr == 0 ? 1 : scalr);
            dx *= absp;
            dy *= absp;
            bl= new Array(numBalls);
            for (var i = 0; i < bl.length; i++) {
                bl[i]={x:0,y:0,dx:0,dy:0, s:false, c:false};
                bl[i].dx = dx;
                bl[i].dy = dy;
                bl[i].x = beampos.x;
                bl[i].y = HEIGHT - r;
            }
            setTimeout(nexb(1), 500);
            bl[0].s = true;
            beamset = false;
            flying = true;
            first=false;
            return ;
        }
        
        clear();
         //drawBeam(20, {x:300,y:400}, beamangle);
        for (var bli = 0; bli < bl.length; bli++) {
            for (var i = 0; i < NROWS; i++) {
                for (var j = 0; j < NCOLS; j++) {
                    var xs = (j * (BRICKWIDTH + PADDING)) + PADDING + BRICKLEFT;
                    var ys = (i * (BRICKHEIGHT + PADDING)) + PADDING + BRICKTOP;
                    if (bricks[i][j].b > 0) {
                        var proc = (bricks[i][j].b) / bricks[i][j].h;
                        var c = HSVtoRGB((1 * (1 - bricks[i][j].h / 100)), 1, 1);
                        //ctx.fillStyle="HSL("+Math.floor((100*(1-bricks[i][j].h/maxHard))%100)+", 255, 255)";
                        //if(Math.random()<0.001)console.log(""+c.r+", "+c.g+", "+c.b+"");
                        ctx.fillStyle = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
                        rect(xs, ys, BRICKWIDTH, BRICKHEIGHT);
                        ctx.font = BRICKHEIGHT + "px sans-serif";
                        var txm = ctx.measureText(bricks[i][j].b);
                        ctx.font = BRICKHEIGHT * BRICKWIDTH / txm.width + "px sans-serif";
                        if (BRICKHEIGHT * BRICKWIDTH / txm.width > BRICKHEIGHT)
                            ctx.font = BRICKHEIGHT * 0.9 + "px sans-serif";

                        txm = ctx.measureText(bricks[i][j].b);
                        ctx.fillStyle = "white";
                        ctx.strokeText(bricks[i][j].b, xs + (BRICKWIDTH - txm.width) / 2, ys + BRICKHEIGHT * 7 / 8, BRICKWIDTH * 0.95);
                        ctx.fillStyle = "black";
                        ctx.fillText(bricks[i][j].b, xs + (BRICKWIDTH - txm.width) / 2, ys + BRICKHEIGHT * 7 / 8, BRICKWIDTH * 0.95);
                        var sx = Math.floor(proc * 50);
                        var tx = Math.floor(proc * BRICKWIDTH * 0.5);
                        var ty = Math.floor(proc * BRICKHEIGHT * 0.5);
                        img(crack,
                                sx, sx,
                                (1 - proc) * 100, (1 - proc) * 100,
                                xs + tx, ys + ty,
                                (1 - proc) * BRICKWIDTH, (1 - proc) * BRICKHEIGHT);

                        if (oblak.complete && rsOblak) {
                            ctx.drawImage(oblak, xs, ys, BRICKWIDTH, BRICKHEIGHT);
                        }
                    }
                    if (bricks[i][j].e == true) {
                        ring(xs + BRICKWIDTH / 2, ys + BRICKHEIGHT / 2, BRICKWIDTH / 3, BRICKWIDTH / 9);
                    }
                }
            }
            
            
            
            
            if(!bl[bli].s)continue;
//            x=sx
//            y=sy
//            dx=sdx
//            dy=sdy
            var x = bl[bli].x;
            var y = bl[bli].y;
            var dx = bl[bli].dx;
            var dy = bl[bli].dy;


            circle(x, y, r, "#8080a0");

            //        var fx =-100;
            //        var fy= -50;
            //        var fa = Math.atan2(fx,fy);//-Math.PI/2;
            //        drawBeam(20, {x:400,y:400}, fa);
            //        drawBeam(10, {x:500,y:400}, Math.PI/4);
            //        drawBeam(15, {x:500,y:400}, Math.PI/2);
            //        drawBeam(20, {x:500,y:400}, Math.PI*3/4);
            //premik ploščice levo in desno
//            if(rightDown){
//                if((paddlex+paddlew) < WIDTH){
//                    paddlex += 5;
//                    paddled = 5;
//                }else{
//                    paddlex = WIDTH-paddlew;
//                }
//            }else if(leftDown){
//                if(paddlex>0){
//                    paddlex -=5;
//                    paddled = -5;
//                }else{
//                    paddlex=0;
//                }
//            }
//            rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);

            //riši opeke
            
            var rowheight = BRICKHEIGHT + PADDING;//širina in višina opek z paddingom
            var colwidth = BRICKWIDTH + PADDING;
            var sny = Math.sign(dy);
            var snx = Math.sign(dx);

            var cmy = (y - BRICKTOP - PADDING / 2 + dy) % rowheight;
            var row = (y - BRICKTOP - PADDING / 2 + dy) / rowheight;

            var cmx = (x - BRICKLEFT - PADDING / 2 + dx) % colwidth;
            var col = (x - BRICKLEFT - PADDING / 2 + dx) / colwidth;
            //edges - dir of movement, corners - position


            if (cmy < (PADDING / 2 - r) || cmy > (PADDING / 2 + BRICKHEIGHT + r)) {
                row = -1;
            } else {
                row = Math.floor(row);
            }//če je v paddingu ne zadene opeke
            if (cmx < (PADDING / 2 - r) || cmx > (PADDING / 2 + BRICKWIDTH + r)) {
                col = -1;
            } else {
                col = Math.floor(col);
            }//če je v paddingu ne zadene opeke
            var hit = 0;
            var ccx = cmx + dx - colwidth / 2;
            var ccy = cmy + dy - rowheight / 2;
            //for all dir (3)
            //angle 8th root of sin cos of angle
            //dist of cos snd sin + radius
            //less than abs distance from center and ball
            //bounce based on existance of brick
            //rediract angle based on angle
            var xcx = (snx == -1 ? -cmx - colwidth / 2 : colwidth - cmx + colwidth / 2);//dist to brick
            var xcy = (sny == -1 ? -cmy - rowheight / 2 : rowheight - cmy + rowheight / 2);
            //console.log(xcx+"  "+xcy);
            var angl = Math.atan2(dx, dy);//+Math.PI/2;
            var anglc = Math.atan2(xcx, xcy);//+Math.PI/2;
            var anglx = Math.atan2(xcx, -cmy + rowheight / 2);//+Math.PI/2;
            var angly = Math.atan2(-cmx + colwidth / 2, xcy);//+Math.PI/2;
            //angl=(xcy<0)?angl+Math.PI:angl
            var snc = Math.sqrt(Math.sqrt(Math.abs(Math.sin(anglc))));
            var cnc = Math.sqrt(Math.sqrt(Math.abs(Math.cos(anglc))));
            var bcdc = Math.sqrt(Math.pow(snc * rowheight / 2, 2) + Math.pow(cnc * colwidth / 2, 2));//distance to endge of brick
            var abdc = Math.sqrt(Math.pow(xcy, 2) + Math.pow(xcx, 2));//absolute distance

            var sinx = Math.sqrt(Math.sqrt(Math.sqrt(Math.abs(Math.sin(anglx)))));
            var cnx = Math.sqrt(Math.sqrt(Math.sqrt(Math.abs(Math.cos(anglx)))));
            var bcdx = Math.sqrt(Math.pow(sinx * rowheight / 2, 2) + Math.pow(cnx * colwidth / 2, 2));//distance to endge of brick
            var abdx = Math.sqrt(Math.pow(-cmy + rowheight / 2, 2) + Math.pow(xcx, 2));//absolute distance
            if (abdx - r < bcdx && bounds(bricks, row, col + snx) && bricks[row][col + snx].b !== 0) {
                //console.log("xcol "+angl+" "+bcdx);
                hitb(row, col + snx);
                dx = -dx;
            } else if (abdc - r < bcdc && bounds(bricks, row + sny, col + snx) && bricks[row + sny][col + snx].b !== 0) {
                //console.log("ccol "+angl+" "+bcdc);
                hitb(row + sny, col + snx);
                var rfang = anglc - 2 * angl;
                dx = dx * Math.cos(rfang);
                dy = dy * Math.cos(rfang);
            }
            var siny = Math.sqrt(Math.sqrt(Math.sqrt(Math.abs(Math.sin(anglx)))));
            var cny = Math.sqrt(Math.sqrt(Math.sqrt(Math.abs(Math.cos(anglx)))));
            var bcdy = Math.sqrt(Math.pow(siny * rowheight / 2, 2) + Math.pow(cny * colwidth / 2, 2));//distance to endge of brick
            var abdy = Math.sqrt(Math.pow(xcy, 2) + Math.pow(-cmx + colwidth / 2, 2));//absolute distance
            if (abdy - r < bcdy && bounds(bricks, row + sny, col) && bricks[row + sny][col].b !== 0) {
                //console.log("yhit "+angl+" "+bcdy);
                hitb(row + sny, col);
                dy = -dy;
            } else if (abdc - r < bcdc && bounds(bricks, row + sny, col + snx) && bricks[row + sny][col + snx].b !== 0) {
                //console.log("ccol "+angl+" "+bcdc);
                hitb(row + sny, col + snx);
                var rfang = anglc - 2 * angl;
                dx = dx * Math.cos(rfang);
                dy = dy * Math.cos(rfang);
            }
            var abdb = Math.sqrt(Math.pow(cmy - rowheight / 2, 2) + Math.pow(cmx - colwidth / 2, 2));//absolute distance
            if (abdb - r < BRICKWIDTH / 2.5 && bounds(bricks, row, col) && bricks[row][col].e == true) {
                bricks[row][col].e = false;
                numBalls++;
            }
            //console.log(numBalls);
            var scalr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            var absp = sp / (scalr == 0 ? 1 : scalr);
            dx *= absp;
            dy *= absp;
            //console.log(dx+" "+dy+" "+x+" "+y);



            if (x + dx > WIDTH - r || x + dx < 0 + r) {
                dx = -dx;
            }
            if (y + dy < 0 + r/* || y + dy > HEIGHT-r*/) {
                dy = -dy;
            } else if (y + dy > HEIGHT - r + 1) {
                waitPull(bli, x, y, dx, dy);
            }
            x += dx;
            y += dy;

            bl[bli].x = x;
            bl[bli].y = y;
            bl[bli].dx = dx;
            bl[bli].dy = dy;
        }
        if (grabing && !flying) {
            beamset = true;
            //drawBeam(20, {x:300,y:200}, beamangle);
            drawBeam(beamsep, {x: beampos.x, y: beampos.y}, beamangle);
        }
    }

    function pause() {
        if (!playing)
            return;
        if (paused) {
            paused = false;
            $('#left').removeClass("pauza");
            intTimer = setInterval(timer, 1000);
            document.querySelector("html").style.cursor = "grab";
            intervalId = setInterval(draw, 10);
        } else {
            $('#left').addClass("pauza");
            paused = true;
            clearInterval(intervalId);
            clearInterval(intTimer);
            document.querySelector("html").style.cursor = "default";

        }
    }

    function end() {
        clearInterval(intervalId);
        clearInterval(intTimer);
        paused = false;
        $('#left').removeClass("pauza");
        $('#pauza').off();
        $("#koncaj").off();
        $(document).off("keyup");
        document.querySelector("html").style.cursor = "default";
        playing = false;
        var sc = lc.getObj("scores");
        $("#topt").html(Math.max(...sc.s));
        //console.log(sc);
        sc.push({t: sekunde, s: tocke});
        lc.setObj("scores", sc);
    }
    function waitPull(bli, x, y, dx, dy) {
        //console.log(bl[bli]);
        bl[bli].dx=0;
        bl[bli].dy=0;
        bl[bli].x=x;
        bl[bli].y=y;
        bl[bli].c=true;
        if(!first){
            beampos = {x: x, y: y};
            beamset = false;
            flying = false;
            first=true;
        }
        var ends = true;
        for (var i = 0; i < bl.length; i++) {
            ends = ends&&bl[i].c;
        }
        if(ends){
            lvl++;
            NROWS++;
            genBricks(bricks, 1, 0.2, lvl, lvl);
            for (var i = 0; i < bl.length; i++) {
                bl[i].c=false;
                bl[i].s=false;
            }
            first=false;
        }
    }
}







document.addEventListener("DOMContentLoaded", (event) => {
    $('#play').on("click", (event) => {
        if (!playing) {
            document.querySelector("html").style.cursor = "grab";
            playing = true;
            drawIt();
        }
    });



});




























