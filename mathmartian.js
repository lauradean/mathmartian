
// Load jQuery
//google.load("jquery", "1");
    
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
var nSaucers = 5;

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
var nTime = 0;
var maxScore = 5;
var dtStart = new Date();

var levelSettings = function() {
    
    var xml;
    var level;
    var sublevel;
    var nums = new Array();
    var label;
    var operator;
    var align;
    
    return {
        set_xml : function(newXml) {
            xml = newXml;
        },
        get_xml : function() {
            return xml;
        },
        set_level : function(newLevel) {
            level = newLevel;
        },
        get_level : function() {
            return level;
        },
        set_sublevel : function(newSublevel) {
            sublevel = newSublevel;
        },
        get_sublevel : function() {
            return sublevel;
        },
        set_nums : function(newNums) {
            nums = newNums;
        },
        get_nums : function() {
            return nums;
        },
        set_label : function(newLabel) {
            label = newLabel;
        },
        get_label : function() {
            return label;
        },
        set_operator : function(newOperator) {
            operator = newOperator;
        },
        get_operator : function() {
            return operator;
        },
        set_align : function(newAlign) {
            align = newAlign;
        },
        get_align : function() {
            return align;
        },
		set_increment : function(newIncrement) {
			increment = newIncrement;
		},
		get_increment : function() {
			return increment;
		}
    }
} ();


function loadXMLDoc(xmlFile) {
    var dataRet;
    $.ajax({
        type: "GET",
        url: xmlFile,
        async: false,
        success: function(data) {
            dataRet = data;
        }
    });
    return dataRet;
}

function pickLevel(level, sublevel) {

	levelSettings.set_level(level);
	levelSettings.set_sublevel(sublevel-1);
	incrementLevel();

    oQuestion.setRange(levelSettings.get_nums());

    nScore = 0;
	var txt = document.createTextNode("Score: " + nScore);
	emptyDiv(oScore);
	oScore.appendChild(txt);

    dtStart = new Date();
	
	nGameMode = 1;
	$('#level').text("Current Level: " + levelSettings.get_label());

	oMartian.direction = 1;
	oMartian.x = 10;
}

function completeLevel(duration) {
	var level = levelSettings.get_level();
	var sublevel = levelSettings.get_sublevel();
	var id = 'lvl' + level + '-' + sublevel;

	if ($("#" + id).find("#besttime").length) { 
		var oldBest =  parseInt($("#" + id).find("#besttime").text());
		if (duration < oldBest) {
			$("#" + id).find("#besttime").text(duration);
		}
	}
	else { $("#" + id).append(" (<span id='besttime'>" + duration + "</span>s)"); }

	$("#" + id).css('color', 'yellow');
}

function incrementLevel() {
    var nums = new Array();
    var level = levelSettings.get_level();
    var sublevel = levelSettings.get_sublevel() + 1;
    var xml = levelSettings.get_xml();
    var found = false;
    var label;
    var sublabel;
    $(xml).find('level').each(function() {
        if ($(this).attr('id') == level) {
			increment = $(this).find('increment').text();
            //alert('found level ' + $(this).attr('id'));
            $(this).find('sublevel').each(function() {
                if ($(this).attr('id') == sublevel) {
                    //alert('found sublevel ' + $(this).attr('id'));
                    found = true;
                    sublabel = $(this).find('label').text();
                    $(this).find('num').each(function() {
                        nums[$(this).attr('id')] = new Array();
                        nums[$(this).attr('id')][0] = $(this).find('min').text();
                        nums[$(this).attr('id')][1] = $(this).find('max').text();
                    });
                }
            });
            if (!found) {
                sublevel = 1;
                level++;
            } else {
               levelSettings.set_operator($(this).find('operator').text());
               levelSettings.set_label($(this).find('label').first().text() + ' - ' + sublabel);
               levelSettings.set_align($(this).find('align').text());
            }
        }
    });
    levelSettings.set_level(level);
    levelSettings.set_sublevel(sublevel);
    levelSettings.set_nums(nums);
	levelSettings.set_increment(increment);
}

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
    
	for (i=0; i<5; i++) {
		saucerpos[i] = 50 + i * 150;
		if ((saucerpos[i] - 30 - this.w) < this.x && this.x < (saucerpos[i] + 30)) {
			this.saucerpick = i;
            var txt = document.createTextNode(oQuestion.answer);
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
                    nScore = 0;
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
    var nums = levelSettings.get_nums();
    this.minnum1 = parseInt(nums[1][0]);
    this.maxnum1 = parseInt(nums[1][1]);
	this.minnum2 = parseInt(nums[2][0]);
    this.maxnum2 = parseInt(nums[2][1]);
    this.minans = 0;
    this.maxans = 10000;      // not working!
    
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

oQuestion.prototype.setRange = function(nums) {
    this.minnum1 = parseInt(nums[1][0]);
    this.maxnum1 = parseInt(nums[1][1]);
	this.minnum2 = parseInt(nums[2][0]);
    this.maxnum2 = parseInt(nums[2][1]);
}

oQuestion.prototype.generateQuestion = function() {
	var oldNum1 = this.num1;
	var oldNum2 = this.num2;

	do {
		do {		
			this.num1 = Math.floor(Math.random()*(this.maxnum1 - this.minnum1 + 1)) + this.minnum1;
			this.num2 = Math.floor(Math.random()*(this.maxnum2 - this.minnum2 + 1)) + this.minnum2;
		}
		while (oldNum1 == this.num1 && oldNum2 == this.num2);

		this.operator = levelSettings.get_operator();
	
		switch(this.operator)
		{
		    // generate new question
		    case '+':
				this.ans = this.num1 + this.num2;
				this.question = this.num1 + " + " + this.num2 + " = ?";
				this.answer = this.num1 + " + " + this.num2 + " = " + this.ans;
				break;
			case '-':
				this.ans = this.num1 - this.num2;
				this.question = this.num1 + " - " + this.num2 + " = ?";
				this.answer = this.num1 + " - " + this.num2 + " = " + this.ans;
				break;
			case '*':
				this.ans = this.num1 * this.num2;
				this.question = this.num1 + " x " + this.num2 + " = ?";
				this.answer = this.num1 + " x " + this.num2 + " = " + this.ans;
				break;
			case '/':
				this.ans = this.num1;
				this.num1 = this.ans * this.num2;
//				this.ans = this.num1 / this.num2;
				this.question = this.num1 + " / " + this.num2 + " = ?";
				this.answer = this.num1 + " / " + this.num2 + " = " + this.ans;
				break;
			case '^2':
				this.ans = this.num1 * this.num1;
				this.question = this.num1 + '\u00b2 = ?';
				this.answer = this.num1 + '\u00b2 = ' + this.ans;
		}

	}
	while (this.ans < this.minans);

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
	var increment = levelSettings.get_increment();
	if (increment == 0 || increment > Math.ceil(this.ans/10)) {
		increment = Math.ceil(this.ans/10);
		if (increment == 0) {
			increment = 1;
		}
	}
    if (Math.floor(Math.random())) {
        middle += (Math.floor(Math.random()*2) + 1) * increment;
    } else {
        middle -= (Math.floor(Math.random()*3)) * increment;
    }
    if (middle < this.minans + 2 * increment) {
        middle = this.minans + 2 * increment;
    } else if (middle > this.maxans - 2 * increment) {
        middle = this.maxans - 2 * increment;
    }

    answers[0] = middle - 2 * increment;
    answers[1] = middle - 1 * increment;
    answers[2] = middle;
    answers[3] = middle + 1 * increment;
    answers[4] = middle + 2 * increment;
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


function loop()
{
    clearTimeout(TICKER);
	nTimeStamp = new Date();
	nOldTime = nTime;
	nTime = Math.ceil((nTimeStamp.valueOf() - dtStart.valueOf()) / 1000);

	if (nOldTime != nTime) {
		var txt = document.createTextNode("Time: " + nTime);
		emptyDiv(oTime);
		oTime.appendChild(txt);
	}
    
    switch(nGameMode)
    {
        // generate new question
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
            bPause = 1000;
            break;
        // martian walking
        case 2:
            oMartian.update();
            oMartian.advanceframe();
            blit(oMartian);
            break;
        // check answer
        case 3:
            if (!oMartian.checkans()) {
                nGameMode = 2;
            }
            break;
        // question answered correctly
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
        // question answered incorrectly
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
		// scoring, reset
        case 6:
            oMartian.visible = true;
            oMartian.direction = 1;
            oMartian.x = 10;
            bPause = 800;
            nGameMode = 7;
            if (nScore >= maxScore) {
                var dtEnd = new Date()
                var sDuration = Math.ceil((dtEnd.valueOf() - dtStart.valueOf()) / 1000);
				completeLevel(sDuration);
                var levelUp = confirm(maxScore + ' in a row!  Your time is ' +sDuration+ ' seconds.  Advance to the next level? (Cancel to replay current level.)');
                //alert(levelUp);
                if (levelUp) {
                    incrementLevel();
                    oQuestion.setRange(levelSettings.get_nums());
                    //alert('leveling up');
                }
                nScore = 0;
                dtStart = new Date();
                var txt = document.createTextNode("Score: " + nScore);
                emptyDiv(oScore);
                oScore.appendChild(txt);
                $('#level').text("Current Level: " + levelSettings.get_label());
            }                                   
            break;
        // move the saucer back into place
        case 7:
            var i;
            for (i=0; i<nSaucers; i++) {
                oSaucer[i].style.top = "270px";
            }
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

function loadRtmenu() {
	var xml = levelSettings.get_xml();
	var label;
	var level;
	var sublevel;
	var id;

    $(xml).find('level').each(function() {
		label = $(this).find('label').first().text();
		level = $(this).attr('id');
		$('<h3>&nbsp;&nbsp;<b>Level ' + level + ' - ' + label + '</b></h3>').appendTo('#rtmenu');
		$('<div id="lvl' + level +'"></div>').appendTo('#rtmenu');

		$(this).find('sublevel').each(function() {
			sublevel = $(this).attr('id');
			label = $(this).find('label').text();
			id = 'lvl' + level + '-' + sublevel;
			
			$('#lvl' + level).append('<span class="rtsubmenu" id="' + id + '">' + label + '</span><br>');

			$('#' + id).attr('level', level);
			$('#' + id).attr('sublevel', sublevel);
			$('#' + id).click(function() {
				pickLevel($(this).attr('level'), $(this).attr('sublevel'));
			});
		});
    });

	$('.rtsubmenu').hover(function() {
		$(this).css('cursor','pointer');
	}, function() {
		$(this).css('cursor','auto');
	});

	$('#rtmenu').accordion({
		autoHeight: false
	});
}
  
function init() {

    var xml = loadXMLDoc("levels.xml")
    levelSettings.set_xml(xml);
    levelSettings.set_level(1);
    levelSettings.set_sublevel(0);
    incrementLevel();
	loadRtmenu();
    $('#level').text("Current Level: " + levelSettings.get_label());
    
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
    oScore.style.position = "absolute";
    oScore.style.fontSize = "20px";
    oScore.style.background = "white";
    oCanvas.appendChild(oScore);
    
    var txt = document.createTextNode("Score: " + nScore);
    oScore.appendChild(txt); 

	// TIME
	oTime = document.createElement("DIV");
	oTime.setAttribute("id", "time");
	oTime.style.position = "absolute";
	oTime.style.top = "30px";
	oTime.style.fontSize = "20px";
	oTime.style.background = "white";
	oCanvas.appendChild(oTime);

	var txt = document.createTextNode("Time: " + nTime);
	oTime.appendChild(txt);
    
    getSprites();
    makeSaucers(nSaucers);
                
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

    nGameMode = 3;
}


$(document).ready(function(){
    init();
});


