<?php
    $params = array();
    if (isset($_GET['p'])) {
        $params = split(',', $_GET['p']);
    }
    
    if (isset($params[0])) {
        $minnum1 = $params[0];
    } else {
        $minnum1 = 0;
    }
    
    if (isset($params[0])) {    
        $maxnum1 = $params[1];
    } else {
        $maxnum1 = 7;
    }
    
    if (isset($params[0])) {
        $minnum2 = $params[2];
    } else {
        $minnum2 = 0;
    }
    
    if (isset($params[0])) {
        $maxnum2 = $params[3];
    } else {
        $maxnum2 = 7;
    }
    
    //exit;
?>    
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title> Math Martian (in development) </title>
	<style type="text/css">
		body { background: #000000; margin: 0; padding: 0; }
		p { margin: 8px 32px; }
        #debug {
            position:absolute;
            left:10px;
            top:10px;
            width: 200px;
            color: white;
        }
		#legend {
			text-align: center;
			color: white;
		}	
		#legend h1 { font: normal 1.4em sans-serif; }
		#legend a { color: white; font: normal 1.0em sans-serif; }
	</style>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.js"></script>
<script src="http://www.google.com/jsapi"></script>
<script>

    // Load jQuery
    google.load("jquery", "1");
    
    var minnum1 = <?=$minnum1?>;
    var maxnum1 = <?=$maxnum1?>;
    var minnum2 = <?=$minnum2?>;
    var maxnum2 = <?=$maxnum2?>;
        
        var nGameMode = 1;
        
        var direction = 1;
        var position;
        var count = 0;
        
        var TICKER;
        // Frame rate management
        var nCapAmount = 50;    // ms
        var nTimeStamp = new Date();
        var bCapTicker = true;
        var bCapMode = true;
        var bPause = 0;
        
        // Sprites
        var oMartian;
        var oSaucer = new Array();
        var oAnswer = new Array();
        
        // PRESENTATION
        var oBody;
        var oContainer;
        var oCanvas;
        var oConsole;
        var oScore;
        //var oPrompt;
        //var oTitle;
        //var oLogo;
        var nCanvasWidth = 728; //950;
        //var radarwidth = nCanvasWidth - 16;
        //var radarheight = 32;
        var nCanvasHeight = 400; //320;
        //var nGameStyle;var nRebels; var nSavedRebels;
        var nScore = 0;
            
        
        // todo: how can oMartian best extend a sprite class?
        // could use Duck Typing
        function oMartian(){ 
            this.id = 'martian';
            this.w = 56;
            this.h = 76;
            this.y = nCanvasHeight - this.h;
            this.x = 10;
            this.alive = true;
            this.rate = 10;
            this.direction = 1;
            this.xmin = 10;
            this.xmax = nCanvasWidth - this.w - 10;
            this.visible = true;
            this.currentframe = 0;
            this.background = new Image();
            
            var spritetype = "IMG";
            
            // Place the object
            var o = document.createElement(spritetype);
            o.setAttribute("id",this.id);
            oCanvas.appendChild(o);
            
            // Create a handle on the object
            this.div = document.getElementById(this.id);
            this.div.style.position = "absolute";
            this.div.style.width = this.w + "px";
            this.div.style.height = this.h + "px";
            this.div.style.top = this.y + "px";
            this.div.style.left = this.x + "px";
        }
        
        oMartian.prototype.createFrames = function() {
            this.frame = new Array();
            this.frame[0] = new Array();
            this.frame[1] = new Array();
            
            this.frame[0][0] = new Image();
            this.frame[0][0].src = 'images/martian-1.gif';
            
            this.frame[0][1] = new Image();
            this.frame[0][1].src = 'images/martian-3.gif';
            
            this.frame[0][2] = new Image();
            this.frame[0][2].src = 'images/martian-5.gif';
            
            this.frame[0][3] = new Image();
            this.frame[0][3].src = 'images/martian-7.gif';
            
            this.frame[0][4] = new Image();
            this.frame[0][4].src = 'images/martian-9.gif';
            
            this.frame[0][5] = new Image();
            this.frame[0][5].src = 'images/martian-11.gif';
            
            this.frame[0][6] = new Image();
            this.frame[0][6].src = 'images/martian-13.gif';
            
            this.frame[0][7] = new Image();
            this.frame[0][7].src = 'images/martian-15.gif';
            
            this.frame[1][0] = new Image();
            this.frame[1][0].src = 'images/martian-b15.gif';
            
            this.frame[1][1] = new Image();
            this.frame[1][1].src = 'images/martian-b13.gif';
            
            this.frame[1][2] = new Image();
            this.frame[1][2].src = 'images/martian-b11.gif';
            
            this.frame[1][3] = new Image();
            this.frame[1][3].src = 'images/martian-b9.gif';
            
            this.frame[1][4] = new Image();
            this.frame[1][4].src = 'images/martian-b7.gif';
            
            this.frame[1][5] = new Image();
            this.frame[1][5].src = 'images/martian-b5.gif';
            
            this.frame[1][6] = new Image();
            this.frame[1][6].src = 'images/martian-b3.gif';
            
            this.frame[1][7] = new Image();
            this.frame[1][7].src = 'images/martian-b1.gif';
            
            this.totalframes = 7;
        }
        
        oMartian.prototype.update = function() {
            var ax;
            ax = this.x + this.rate * this.direction;
            if (ax > this.xmax || ax < this.xmin) {
                this.direction *= -1;
            } else {
                this.x = ax;
            }
        }

        oMartian.prototype.advanceframe = function() {
            this.currentframe = this.currentframe + 1;
            var dir;
            if (this.direction == 1) {
                dir = 0;
            } else {
                dir = 1;
            }
            if (this.currentframe > this.totalframes) {
                this.currentframe = 0;
            }
            this.background.src = this.frame[dir][this.currentframe].src;
        }
        
        oMartian.prototype.checkans = function() {
            var saucerpos = new Array();
            var i;
            this.saucerpick;
            //x = 460
            // 150*3 = 450
            
            for (i=0; i<5; i++) {
                saucerpos[i] = 50 + i * 150;
                //alert ('saucerpos = ' + i + "\n" +
                //         'this.x = ' + this.x + "\n");
                if ((saucerpos[i] - 30 - this.w) < this.x && this.x < (saucerpos[i] + 30)) {
                    this.saucerpick = i;
                    var question = oQuestion.num1 + " + " + oQuestion.num2 + " = " + oQuestion.ans;
                    var txt = document.createTextNode(question);
                    emptyDiv(oQuestion.div);
                    oQuestion.div.appendChild(txt); 
                    // does answers[i] match this.ans?    
                    if (oQuestion.answers[i] == oQuestion.ans) {
                        nGameMode = 4;
                        nScore = nScore + 1;
                        var txt = document.createTextNode("Score: " + nScore);
                        emptyDiv(oScore);
                        oScore.appendChild(txt); 
                    } else {
                        nGameMode = 5;
                        if (nScore > 0) {
                            nScore = nScore - 1;
                            var txt = document.createTextNode("Score: " + nScore);
                            emptyDiv(oScore);
                            oScore.appendChild(txt);
                        }
                    }  
                    return true;
                }
            }    
            return false;
        }
        
        // the question
        var oQuestion;
        function oQuestion() {
            // MATH QUESTION PARAMETERS
            this.minnum1 = minnum1;
            this.maxnum1 = maxnum1;
            this.minnum2 = minnum2;
            this.maxnum2 = maxnum2;
            this.minans = 0;
            this.maxans = 100;      // not working!
            
            this.div = document.createElement("DIV");
            this.div.setAttribute("id", "question");
            this.div.style.top = "100px";
            this.div.style.left = "230px";
            this.div.style.fontSize = "50px";
            this.div.style.position = "absolute";
            this.div.style.color = "white";
            oCanvas.appendChild(this.div);
        }
        
        function emptyDiv (divToClear){
            var i;
            while (i=divToClear.childNodes[0]){
                if (i.nodeType == 1 || i.nodeType == 3){
                    divToClear.removeChild(i);
                }
            }
        }
        
        oQuestion.prototype.generateQuestion = function() {
            this.num1 = Math.floor(Math.random()*(this.maxnum1 - this.minnum1 + 1)) + this.minnum1;
            this.num2 = Math.floor(Math.random()*(this.maxnum2 - this.minnum2 + 1)) + this.minnum2;
            this.ans = this.num1 + this.num2;
            this.question = this.num1 + " + " + this.num2 + " = ?";
            var txt = document.createTextNode(this.question);
            emptyDiv(this.div);
            this.div.appendChild(txt); 
        }
        
        function randOrd(){
            return (Math.round(Math.random())-0.5); 
        } 
        
        oQuestion.prototype.generateAnswers = function() {
            var answers = new Array();
            var middle = this.ans;
            if (Math.floor(Math.random())) {
                middle += Math.floor(Math.random()*2) + 1;
            } else {
                middle -= Math.floor(Math.random()*3);
            }
            if (middle < this.minans + 2) {
                middle = this.minans + 2;
            } else if (middle > this.maxans - 2) {
                middle = this.maxans -2;
            }
            answers[0] = middle - 2;
            answers[1] = middle - 1;
            answers[2] = middle;
            answers[3] = middle + 1;
            answers[4] = middle + 2;
            answers.sort(randOrd);
            
            this.answers = new Array();
            this.answers = answers;
            
            return(answers);
        }
        
        function blit(o) {
            //logDebug ("blitting \n");
            if (!o.alive) return;
            o.visible ? o.div.style.display = "block" : o.div.style.display = "none";
            if (o.type == "DIV") {
                if (o.background != null) {
                    o.div.style.backgroundImage = "url(" + o.background + ")";
                }
            } else {
                o.div.src = o.background.src;
            }
            o.div.style.top = o.y + "px";
            o.div.style.left = o.x + "px";                    
        }
        
        function getSprites() {
            oMartian = new oMartian('oCanvas');
            oMartian.createFrames();
            oQuestion = new oQuestion('oCanvas');
        }
        
        
        function loop()
        {
            clearTimeout(TICKER);
            nTimeStamp = new Date();
            
            switch(nGameMode)
            {
                case 1:
                    oQuestion.generateQuestion();
                    var i;
                    var answers = new Array();
                    answers = oQuestion.generateAnswers();
                    var ansCount = answers.length;
                    for (i=0; i<ansCount; i++) {
                        var txt = document.createTextNode(answers[i]);
                        emptyDiv(oAnswer[i]);
                        oAnswer[i].appendChild(txt);
                    }
                    nGameMode = 2;
                    break;
                case 2:
                    oMartian.update();
                    oMartian.advanceframe();
                    blit(oMartian);
                    break;
                case 3:
                    if (!oMartian.checkans()) {
                        nGameMode = 2;
                    }
                    break;
                case 4:
                    //oMartian.visible = false;
                    if (oMartian.visible == true) {
                        oMartian.visible = false;
                        blit(oMartian);
                    }
                    var y = oSaucer[oMartian.saucerpick].style.top.replace(new RegExp("px$", "g"), "");
                    y -= 25;
                    //alert (y);
                    if (y < -55) {
                        nGameMode = 6;
                    } else {
                        oSaucer[oMartian.saucerpick].style.top = y + "px";
                        blit(oSaucer[oMartian.saucerpick]);
                    }
                    break;                
                case 5:
                    //alert (oMartian.saucerpick);
                    //alert(oSaucer);
                    if (oMartian.visible == true) {
                        oMartian.visible = false;
                        blit(oMartian);
                    }
                    var y = parseInt(oSaucer[oMartian.saucerpick].style.top.replace(new RegExp("px$", "g"), ""));
                    y += 25;
                    if (y > 350) {    
                        nGameMode = 6;
                    } else {
                        oSaucer[oMartian.saucerpick].style.top = y + "px";
                        blit(oSaucer[oMartian.saucerpick]);
                    }
                    break;      
                case 6:
                    oMartian.visible = true;
                    oMartian.direction = 1;
                    oMartian.x = 10;
                    bPause = 1000;
                    nGameMode = 7;
                    break;
                case 7:
                    oSaucer[oMartian.saucerpick].style.top = "270px"
                    nGameMode = 1;
                    break;
            }
            
            manageFrameRate();
            if (bPause) {
                TICKER = setTimeout('loop()', bPause);
                bPause = 0;
            } else if (bCapMode) {
                TICKER = setTimeout('loop()', bCapTicker);
            } else {
                TICKER = setTimeout('loop()',0);
            }
        }
        
        function manageFrameRate()
        {
            var n = new Date() - nTimeStamp;
            // If the game ticks arounds in less than capamount(ms) it's flying along so we need to cap it here.
            if (n < nCapAmount) {
                bCapTicker = nCapAmount;// - n;
            } else {
                bCapTicker = 0;
            }
        }
        
        function logDebug(text) {
            $('#debug').append(text);
        }
            
          
        function init() {
            // BODY
            oBody = document.getElementById("body")
            //oBody = $('#body');

            // CONTAINER
            oContainer = document.createElement("DIV");
            oContainer.setAttribute("id","container");
            oContainer.style.position = "absolute";
            oContainer.style.width = "96%";
            oContainer.style.height = nCanvasHeight + "px";
            oContainer.style.padding = "2%";
            oBody.appendChild(oContainer);

            // GAME CANVAS
            oCanvas = document.createElement("DIV");
            oCanvas.setAttribute("id","canvas");
            oCanvas.style.width = nCanvasWidth + "px";
            oCanvas.style.height = nCanvasHeight + "px";
            oCanvas.style.background = "#0C122C url('images/stars4.gif') repeat-x";
            oCanvas.style.padding = "0";
            oCanvas.style.margin = "0 auto";
            oCanvas.style.overflow = "hidden";
            oCanvas.style.border = "none";
            oCanvas.style.position = "relative";
            oContainer.appendChild(oCanvas);
            
            // SCORE
            oScore = document.createElement("DIV");
            oScore.setAttribute("id", "score");
            oScore.style.width = 50;
            oScore.style.height = 80;
            oScore.style.position = "absolute";
            oScore.style.top = 300;
            oScore.style.left = 0;
            oScore.style.fontSize = "20px";
            oScore.style.background = "white";
            oCanvas.appendChild(oScore);
            
            var txt = document.createTextNode("Score: " + nScore);
            oScore.appendChild(txt); 
            
            getSprites();
            
            // SAUCERS
            function makeSaucers(num) {
                var answers = new Array();
                answers = oQuestion.generateAnswers();
                var i;
                for (i=0; i<num; i++) {
                    
                    oSaucer[i] = document.createElement("IMG");
                    oSaucer[i].setAttribute("id", "saucer" + i);
                    oSaucer[i].style.width = "83px";
                    oSaucer[i].style.height = "36px";
                    oSaucer[i].style.position = "absolute";
                    //oSaucer[0].style.background = "red";
                    oSaucer[i].src = "images/UFO.gif";
                    oSaucer[i].style.display = "block";
                    oSaucer[i].style.top = "270px";
                    oSaucer[i].style.left = 10 + i * 150 + "px";
                    oSaucer[i].style.padding = "0";
                    oSaucer[i].style.margin = "0 auto";
                    oCanvas.appendChild(oSaucer[i]);
                    
                    oAnswer[i] = document.createElement("DIV");
                    oAnswer[i].setAttribute("id", "answer-" + i);
                    oAnswer[i].style.top = "240px";
                    oAnswer[i].style.left = 50 + i * 150 + "px";
                    oAnswer[i].style.position = "absolute";
                    oAnswer[i].style.color = "white";
                    oCanvas.appendChild(oAnswer[i]);
                }
            }
            makeSaucers(5);
                        
            TICKER = setTimeout("loop()", 0);
        }
        
        
    function scaninput(e)
	{
		if (window.event) // IE
		{
			keypress = e.keyCode;
		}
		else if(e.which) // Netscape/Firefox/Opera
		{
			keypress = e.which;
		}

        if (nGameMode == 2) {
            nGameMode = 3;
        }
    }
            
        
    $(document).ready(function(){
        init();
    });



</script>

<body id='body' onkeydown="scaninput(event);">
<div id="data">

<pre id="debug"></pre>
</div>

<div id="legend">
<h1>*** == MATH MARTIAN == ***</h1>
Code based on <a href="http://rebelideas.co.uk:81/proto/empire/">Hoth Strike</a>,
Images from 
<a href="http://s167.photobucket.com/albums/u149/CEREAL_KILLER74/?action=view&current=baby-alien-walking.gif">
CEREAL_KILLER74</a><p>
Press any key when the Martian walks under the saucer with the correct answer.
</div>
</body>
</html>

