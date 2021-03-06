 //helper function to type 1 - mark answer
 function markAnswer(i, j){
    audio[SELECT].play();
    $('#userAnswer').val(i);
    var g = 0;
    while($('#mulAns'+g).length > 0){
        $('#mulAns' + g).removeClass("ui-group-theme-c");//fix bug cant change theme
        $('#mulAns' + g).removeClass("ui-group-theme-a");//fix bug cant change theme
        if (g == j) {
            $('#mulAns' + g).listview("option", "theme", "c");
        }
        else {
            $('#mulAns' + g).listview("option", "theme", "a");
        }
        g++;
    }
    $('.mulAns').listview( "refresh" );
}

//helper function to type 11 - mark answer and ad line
var rightClicked = null;
var leftClicked = null;
function markAnswerFortype11(j,side){
    audio[SELECT].play();
    var g = 1;
    if (side == "right") {
        var list = "#couplesR";
        rightClicked = j;
    }
    else {
        var list = "#couplesL";
        leftClicked = j;
    }

    while($(list+g).length > 0){
        $(list + g).removeClass("ui-group-theme-c");//fix bug cant change theme
        $(list + g).removeClass("ui-group-theme-a");//fix bug cant change theme
        if (g == j) {
            $(list + g).listview("option", "theme", "c");
        }
        else {
            $(list + g).listview("option", "theme", "a");
        }
        g++;
    }
    $('.mulAns').listview( "refresh" );

    // if we have 2 clicked elemts make line
    if(rightClicked != null && leftClicked != null){
        connect(rightClicked, leftClicked, 2);
        rightClicked = leftClicked = null;
        setTimeout(function () {
            $('.mulAns').removeClass("ui-group-theme-c"); //fix bug cant change theme
            $('.mulAns').removeClass("ui-group-theme-a"); //fix bug cant change theme
            $('.mulAns').listview("option", "theme", "a");
            $('.mulAns').listview("refresh");
        }, 500);
    }
}

function connect(r, l, thickness) {//פונקציה זו יוצרת קו בין שני דיבים
    colors = ["yellow", "blue","pink" , "green", "black", "aqua", "blueviolet", "deeppink", "burlywood", "chartreuse","coral", "orange", "green", "forestgreen", "fuchsia"];
    //a random number between 0 and  to array length.
    if (r < colors.length)
        var x = r;
    else
        var x = r%colors.length;
    color = colors[x];
    
    //div1 is left
    //div2 is right
    var off2 = $("#couplesR"+r).offset();
    var off1 = $("#couplesL"+l).offset();
    // bottom right
    var x1 = off1.left + (($("#couplesL"+l).width()));
    var y1 = off1.top + (($("#couplesL"+l).height()) / 2);
    // top right
    var x2 = off2.left+1;
    var y2 = off2.top + (($("#couplesR"+r).height()) / 2);
    // distance
    var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
    // make hr
    var htmlLine = "<div id='lineFrom"+r+"' class='lineTo"+l+" liners' style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);z-index:0;display:none' />";
    //
    if ($("#lineFrom"+r).length > 0)
       $("#lineFrom"+r).remove();
    if ($(".lineTo"+l).length > 0)
       $(".lineTo"+l).remove();
    $("#changeContentInMainDiv").append(htmlLine);
    //$("#couplesR"+r).css("border-color", color);
    //$("#couplesL"+l).css("border-color", color);
    $("#lineFrom"+r).fadeIn(2000);

    var userAnswerArr = ($("#userAnswer").val()).split(";");
    if (l >= 0) { //remove old val if exsists on left side
        var a = userAnswerArr.indexOf(l.toString());
        if (a >= 0)
            userAnswerArr[a] = -1;
    }
    userAnswerArr[r-1] = l;//set the value on user ans
    $("#userAnswer").val("");
    for (var i = 0; i < userAnswerArr.length-1; i++){
        $("#userAnswer").val($("#userAnswer").val() + userAnswerArr[i] + ';');
    }
       
}

function paintLineResize(){
    var userAnswerArr = ($("#userAnswer").val()).split(";");
    for (var i = 0; i < userAnswerArr.length-1; i++){
        if (userAnswerArr[i] != "-1")
            connect(i+1, userAnswerArr[i], 2);
    }
}

var clickedBefor;
var clicked;
function divClicked(div) {//יוצר קו במקרה של לחיצה על 2 אלמנטים בשאלה מסוג 11
    //border-color: rgb(142, 221, 42);
    $('.makeLineRight').css('border-color', 'rgba(0,0,0,0)');
    $('.makeLineLeft').css('border-color', 'rgba(0,0,0,0)');
    $(div).css('border-color', 'rgb(142,221,42)');
    clickedBefor = clicked;
    clicked = div;
    var clickedId = $(clicked).attr("id");
    var clickedBeforId = $(clickedBefor).attr("id");
    if (clickedBefor) {//בודק אם יש אלמנט שהוקלק קודם
        if ((clickedId.indexOf("r") >= 0 && clickedBeforId.indexOf("r") >= 0) || (clickedId.indexOf("l") >= 0 && clickedBeforId.indexOf("l") >= 0)) {//בודק אם נוצר כבר כבר קו ואם כם מוחק אותו
        }
        else if ((clickedId.indexOf("r") >= 0 && clickedBeforId.indexOf("l") >= 0) || (clickedId.indexOf("l") >= 0 && clickedBeforId.indexOf("r") >= 0)) {//אם אותו סוג אלמנט הוקלק פעמיים לא מבצע כלום
            setTimeout("$('.makeLineRight').css('border-color', 'rgba(0,0,0,0)');$('.makeLineLeft').css('border-color', 'rgba(0,0,0,0)');", 100);
            
            if (clickedId.indexOf("r") >= 0) {//אם השמאלי הוקלק ראשון
                //מוחק קו מאלמנט שנלחץ פעמיים
                var rightCl = $(clicked).attr('id').substring(1, 2);
                var leftCl = $(clickedBefor).attr('id').substring(1, 2);
                //alert("right:" + rightCl + ", left:" + leftCl);
                if ($("#line[data-left='" + leftCl + "']").is('*')) {
                    $("#line[data-left='" + leftCl + "']").remove();
                }
                if ($("#line[data-right='" + rightCl + "']").is('*')) {
                    $("#line[data-right='" + rightCl + "']").remove();
                }
                var color;
                switch(rightCl%2){
                    case 0: color="yellow";break;
                    case 1: color="greenyellow";break;
                }
                connect(clickedBefor, clicked, color, 5);
                var inputId = $(clicked).attr('id');
                inputId = "input" + inputId;
                var newValue = $(clickedBefor).attr('id').substring(1, 2);
                $("#" + inputId).attr('value', newValue);

            }
            else {//אם הימיני הוקלק ראשון
                //מוחק קו מאלמנט שנלחץ פעמיים
                var leftCl = $(clicked).attr('id').substring(1, 2);
                var rightCl = $(clickedBefor).attr('id').substring(1, 2);
                //alert("right:" + rightCl + ", left:" + leftCl);
                if ($("#line[data-left='" + leftCl + "']").is('*')) {
                    $("#line[data-left='" + leftCl + "']").remove();
                }
                if ($("#line[data-right='" + rightCl + "']").is('*')) {
                    $("#line[data-right='" + rightCl + "']").remove();
                }
                switch(rightCl%2){
                    case 0: color="yellow";break;
                    case 1: color="greenyellow";break;
                }

                connect(clicked, clickedBefor, color, 5);
                var inputId = $(clickedBefor).attr('id');
                inputId = "input" + inputId;
                var newValue = $(clicked).attr('id').substring(1, 2);
                $("#" + inputId).attr('value', newValue);
            }
            clickedBefor = false;
            clicked = false;
        }
    }
}

function checkType11Answer(){
    var count1 = 0; //סופר כמה קווים צרין
    var count2 = 0; //סופר כמה יש בפועל
    for (var i = 1; $("#r" + i).is('*'); i++) {
        count1++;
        if ($("#line[data-right='" + i + "']").is('*'))
            count2++;
    }
    if (count1 == count2)
        checkAnswer();
    else
        doAlert(putWord(301),putWord(300));
}

//compass function
function startWatch() {
        firstOrientation = window.orientation;
        var options = { frequency: 500 };
        watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    }

function stopWatch() {
        if (watchID) {
            navigator.compass.clearWatch(watchID);
            watchID = null;
        }
    }

function onSuccess(heading) {
        var element = document.getElementById('heading');
        if (Dplatform == "iOS"){
            var theArrowOrientation = (Math.round(heading.magneticHeading)+window.orientation-firstOrientation);
            if (theArrowOrientation<0){
                theArrowOrientation += 360;
            }
            else if (theArrowOrientation>360){
                theArrowOrientation -= 360;
            }
            element.innerHTML = putWord(302) + theArrowOrientation + " "+putWord(303);
            //element.innerHTML = putWord(304) + Math.round(heading.magneticHeading) +" "+putWord(305) + firstOrientation +" "+putWord(306) + window.orientation+"<br>real:" + theArrowOrientation;
        }
        else{
            var theArrowOrientation = (Math.round(heading.magneticHeading)+window.orientation);
            if (theArrowOrientation<0){
                theArrowOrientation += 360;
                element.innerHTML = putWord(302) + theArrowOrientation + " " + putWord(303);
            }
            else if(theArrowOrientation>360){
                theArrowOrientation -= 360;
            }
            element.innerHTML = putWord(302) + theArrowOrientation + " "+putWord(303);
            //element.innerHTML = putWord(304) + Math.round(heading.magneticHeading) + " "+putWord(305) + firstOrientation +" "+putWord(306) + window.orientation+"<br>real:" + theArrowOrientation;
        }
    

        $('#userAnswer').val(theArrowOrientation);
    }

function onError(compassError) {
        $('#userAnswer').val('Compass error: ' + compassError.code);
    }
//end of compass function

//פונקציה לשאלות ממזה 6
function yesNoQuesClick(n,isRight){
        clearInterval(yesNoQuesTimerInterval);
        if (isRight == "OVERTIME"){
            //alert("no");
            $("#inYesNoQues" + n).slideUp(100, "swing", function () {
                $("#inYesNoQues" + n).html('<img style="height: 50px;width: auto;margin: 0;position: relative;top: 10px;box-shadow: none;" src="images/unlike.png"/>'+putWord(307))
                $("#inYesNoQues" + n).slideDown(100);
            });
            $("#userAnswer").val($("#userAnswer").val()+"-1;")
            addMistake();
            
        }
        else if (isRight) {
            //alert("yes");
            $("#inYesNoQues" + n).slideUp(100, "swing", function () {
                $("#inYesNoQues" + n).html('<img style="height: 50px;width: auto;margin: 0;position: relative;top: 10px;box-shadow: none;" src="images/like.png"/>' + putWord(308))
                $("#inYesNoQues" + n).slideDown(100);
            });
            $("#userAnswer").val($("#userAnswer").val()+"1;")
        }
        else {
            //alert("no");
            $("#inYesNoQues" + n).slideUp(100, "swing", function () {
                $("#inYesNoQues" + n).html('<img style="height: 50px;width: auto;margin: 0;position: relative;top: 10px;box-shadow: none;" src="images/unlike.png"/>' +putWord(309))
                $("#inYesNoQues" + n).slideDown(100);
            });
            $("#userAnswer").val($("#userAnswer").val()+"0;")
            addMistake();
        }

        setTimeout(function () {
            if ($("#YesNoQues" + (n + 1)).length) {//if next is exsist
                if ($("#yesNoQuesTimer").length) {//if yesNoQuesTimer is exsist
                    $("#yesNoQuesTimer").fadeOut(2000);
                }
                $("#YesNoQues" + n).fadeOut(2000, "swing", function () {
                    $("#YesNoQues" + (n + 1)).slideDown(100);
                    if ($("#yesNoQuesTimer").length) {//if yesNoQuesTimer is exsist
                        $("#yesNoQuesTimer").fadeIn(100);
                        $("#inYesNoQuesTimer").html(theQuestion.row.p2);
                        runYesNoQuesTimer(n+1);
                    }
                })
            }
            else {
                checkAnswer();
            }
        }, 1000)
        
    }

//run the timer
var yesNoQuesTimerInterval;
function runYesNoQuesTimer(n){
        clearInterval(yesNoQuesTimerInterval);
        if (theQuestion.row.type != 6)//מקרה נדיר שנכנס לפונקציה בטעות בחידה אחרת
            return 0;
        yesNoQuesTimerInterval = setInterval(function () {
            if (parseInt($("#inYesNoQuesTimer").html()) > 0)
                $("#inYesNoQuesTimer").html(parseInt($("#inYesNoQuesTimer").html()) - 1);
            else {
                yesNoQuesClick(n,"OVERTIME");
                clearInterval(yesNoQuesTimerInterval);
            }
        }, 1000);
        
    }

//resize the yputube frame to match him to screen
function YTresize(){
        var g = Math.min($(window).width(), $("#mainDiv").width() )
        $("#youTube").height(g*0.85*0.75);
        $("#youTube").width(g*0.85);  

    }

function takePicture() {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(takePictureSuccess, takePictureFail, {
            destinationType: Camera.DestinationType.FILE_URI,
            quality: 50,
            correctOrientation: true,
            targetWidth: 1200,
            targetHeight: 1200,
            allowEdit: false,
            saveToPhotoAlbum: false
            
            //destinationType: 1//1 = file_URI
        });
    }

function takePictureFromGalery() {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(takePictureSuccess, takePictureFail, {
            destinationType: Camera.DestinationType.FILE_URI,
            quality: 50,
            correctOrientation: true,
            targetWidth: 1200,
            targetHeight: 1200,
            sourceType : 0,//from PHOTOLIBRARY
            allowEdit: true
        });
    }



//user send photo
function sendPhoto(){
    myQueue.addToQueue(3, { action: 'uploadPic', url: cameraImageURI, 'quesID': localStorage.quesID});
    checkAnswer(); 
}

function takePictureSuccess(imageURI){
        $("#cameraPhoto").css("height","30");
        $("#cameraPhoto").css("width","30");
        $("#cameraPhoto").attr("src","css/images/ajax-loader.gif");
        $("#cameraPhotoDiv").show();
        $("#takePhotoDiv").hide();
        $("#sendPic").hide();
        cameraImageURI = imageURI;
        setTimeout(function(){
            $("#cameraPhotoDiv").hide();
            $("#cameraPhoto").attr("src",cameraImageURI);
            $("#cameraPhoto").css("height","");
            $("#cameraPhoto").css("width","");
            $("#cameraPhotoDiv").show();
            $("#sendPic").show();
            $("#takePhotoDiv").show();
            $("#takePhoto").val(putWord(310));
            $("#takePhoto").button("refresh");
            $("#takePhotoFromGalery").button("refresh");
        }, 2000);
      
    }

function takePictureFail(message){
        console.log("Take Picture Fail because "+ message);
        var text = '<div id="askSkipPhotoTaskDiv" style=""><input id="askSkipPhotoTask" onclick="askSkipPhotoTask()" type="button" data-icon="forward" data-theme="a" data-iconpos="left" value="'+putWord(311)+'"></div>';
        if ($("#askSkipPhotoTaskDiv").length <1)
            $("#sendPic").after(text);
        $("#askSkipPhotoTask").button();
    }

   
//set the inAnswerDiv
function inAnswerDivSet(theQuestion, isContinue, send){
        //play sound
    if (send.indexOf("V.png") > 0) {
        setTimeout('audio[CORRECT].play();', 500);
    }
    else if (send.indexOf("X.png") > 0) {
        setTimeout('audio[WRONG].play();', 500);
    }

        if (isContinue){
            if (theQuestion.row.after_answer_text != '') {
                var n = theQuestion.row.after_answer_text.search("<br><br>");
                if(n<0 || n > 6)
                    send += '<br><br>';
                //--
                send += theQuestion.row.after_answer_text;
                if(send.indexOf("[הידעת]") >=0 || send.indexOf("[/הידעת]") >=0 ){
                    send = send.replace("[הידעת]", '<div id="didYouKnow"><div style="height: 1px"><img alt="Did you know" src="images/know.png" style="width: initial;position: relative;top: -45px"/></div>')
                    send = send.replace("[/הידעת]", '</div>')
                }
            }
            $('#inAnswerDiv').html("<h4>" + send + "<h4>");
            $('#continueButton').html(putWord(314));
            stopAndClearQuestionsTimer();
            localStorage.removeItem("questionShowTime");
        }
        else{
            $('#inAnswerDiv').html("<h4>" + send + "<h4>");
            $('#continueButton').html(putWord(315));
        }

        $("html, body").animate({ scrollTop: 0 }, 400);//scrool to top
    }

//add mistke to counter if n is omitted adding 1 mistke otherwish add n mistakes
function addMistake(n) {
        if (n > 1) {
            localStorage.mistakeCounter = parseInt(localStorage.mistakeCounter) + n; //add n mistake to counter
            //count the totale mistakes in the game
            //localStorage.totalMistakeCounter =  parseInt(localStorage.totalMistakeCounter) + n;
        }
        else {
            localStorage.mistakeCounter = parseInt(localStorage.mistakeCounter) + 1; //add one mistake to counter
            //count the totale mistakes in the game
            //localStorage.totalMistakeCounter = parseInt(localStorage.totalMistakeCounter) + 1;
        }
    }


//helper function
/**
* Returns a random integer between min (inclusive) and max (inclusive)
* Using Math.round() will give you a non-uniform distribution!
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//function to "gematria mission" - return the "gematria" value of string
function doGematria(text, val){
    if (typeof(val) == "undefined")
        val = 0;
    if (text.length<=0)
            return val;
        else{
            var l = text.substr(0, 1);
            if(l == 'א') val += 1;
            else if(l == 'ב') val += 2;
            else if(l == 'ג') val += 3;
            else if(l == 'ד') val += 4;
            else if(l == 'ה') val += 5;
            else if(l == 'ו') val += 6;
            else if(l == 'ז') val += 7;
            else if(l == 'ח') val += 8;
            else if(l == 'ט') val += 9;
            else if(l == 'י') val += 10;
            else if(l == 'כ' || l == 'ך') val += 20;
            else if(l == 'ל') val += 30;
            else if(l == 'מ'|| l == 'ם') val += 40;
            else if(l == 'נ'|| l == 'ן') val += 50;
            else if(l == 'ס') val += 60;
            else if(l == 'ע') val += 70;
            else if(l == 'פ' || l == 'ף') val += 80;
            else if(l == 'צ' || l == 'ץ') val += 90;
            else if(l == 'ק') val += 100;
            else if(l == 'ר') val += 200;
            else if(l == 'ש') val += 300;
            else if(l == 'ת') val += 400;
                
                    
            newText = text.substr(1, text.length);
            return doGematria(newText,val);
        }            
}

//function to sortable list in mission type 14
function doSortable(){
    $(function() {
        $( "#sortable" ).sortable({
            placeholder: "ui-state-highlight"
        });
        $( "#sortable" ).disableSelection();
                          
    });

    $("#sortable").sortable({
        stop: function (event, ui) {
            $("#userAnswer").val("");
            $("#sortable>li").each(function (index) {
                $("#userAnswer").val($("#userAnswer").val() + $(this).val() + ";");
                //alert(index + ": " + $(this).val());
            });
        }
    });
}

 //set timer in the left panel widget
function setTimer() {
    if (localStorage.gameFinished == "true") {
        if (typeof localStorage.finishTime == 'undefined')
            var d1 = new Date();
        else
            var d1 = new Date((localStorage.finishTime) * 1000);
        var d2 = new Date((localStorage.startTime)  * 1000)
    }
    else {
        timerLeftPanelTimeout = setTimeout(setTimer, 1000);
        var d1 = new Date();
        var d2 = new Date((localStorage.startTime) * 1000)
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

        var d3 = new Date(d1 - d2);
        //var x = document.getElementById("demo");
        var h = addZero(d3.getUTCHours());
        var m = addZero(d3.getUTCMinutes());
        var s = addZero(d3.getUTCSeconds());
        $(".timer").html(h + ":" + m + ":" + s);



    //var d3 = new Date(d1 - d2);
    //$("#timer").html("&nbsp;&nbsp;&nbsp;"+ d3.toUTCTimeString());
    //$("#header-title").html(d3.toLocaleTimeString());//debug
}

//set timer for questions


function setQuestionsTimer(sec) {
    //playAudio("audio/clock.mp3");
    var d1 = new Date();
    var d2 = new Date((localStorage.questionShowTime) * 1000 + ((sec) * 1000) + 4000)
    var d3 = new Date(d2 - d1);
    //build questions Timer Div if we dont have one
    if (!$("#questionsTimerDiv").length > 0 && d3.getTime() > (sec * 1000)+2500) {
        $("#content").append('<!--questions timer-->'
                                + '<div id="questionsTimerDiv" style="box-shadow: 0 0 20px rgba(0,0,0,.4);margin-left: 10% ; width:70%; margin-top: 200px;position: fixed;top: 5px;left: 5px;z-index: 1000;background-color: red;padding: 20px;border-radius: 6px;text-align: center;color: white;font-weight: bold">'
                                + '<a style="color:white;font-size:2em;" id="questionsTimer">'+putWord(312)+':<br> ' + sec + " "+  putWord(313)+'</a> '
                                + '<img id="questionsTimerImg" alt="timer" style="width: 30px;box-shadow: none;margin-bottom:0px;margin-bottom: -3px;margin-top: 5px;" src="images/timer_icon.png" />'
                            + '</div>');
        audio[ATTENTION].play();
        //animation after 3 seconds        
        setTimeout(function () {
            $("#questionsTimerDiv").animate({ marginLeft: "4px", width: "100px", marginTop: "4px", padding: "8px", fontSize: "1.2em" }, 500);
            $("#questionsTimer").animate({ fontSize: "1em" }, 500);
            $("#questionsTimerImg").animate({ width: "20px" }, 500);
        }, 3000);
        //+'<div id="questionsTimerDiv" style="position: fixed;top: 5px;left: 5px;z-index: 1000;background-color: red;padding: 8px;border-radius: 6px;display: none;text-align: center;color: white;font-weight: bold">'
        timerForQuestionsTimeout = setTimeout(function () { setQuestionsTimer(sec);audio[CLOCK].play();}, 3000);
        
    }
    else if (!$("#questionsTimerDiv").length > 0) {//for refresh
        $("#content").append('<!--questions timer-->'
                                + '<div id="questionsTimerDiv" style="box-shadow: 0 0 20px rgba(0,0,0,.4);margin-left: 4px ; width:100px; margin-top: 4;position: fixed;top: 5px;left: 5px;z-index: 1000;background-color: red;padding: 8px;border-radius: 6px;text-align: center;color: white;font-weight: bold">'
                                + '<a style="color:white;font-size:1em;" id="questionsTimer"></a> '
                                + '<img id="questionsTimerImg" alt="timer" style="width: 20px;box-shadow: none;margin-bottom:0px;margin-bottom: -3px;margin-top: 5px;" src="images/timer_icon.png" />'
                            + '</div>');
        setQuestionsTimer(sec);
        audio[CLOCK].play();
    }
    else {
        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        if (d2.getTime() > (d1.getTime() + 1000)) {//run timer
            timerForQuestionsTimeout = setTimeout(function () { setQuestionsTimer(sec); }, 1000);
            var h = addZero(d3.getUTCHours());
            var m = addZero(d3.getUTCMinutes());
            var s = addZero(d3.getUTCSeconds());
            var time = h + ":" + m + ":" + s;
            time = time.replace(/00:/g, "");
            $("#questionsTimer").html(time);
        }
        else {//stop time and send over time
          
            $("#questionsTimer").html(0);
            $("#questionsTimerDiv").animate({ marginLeft: "10%", width: "70%", marginTop: "200px", padding: "20px", fontSize: "2.5em" }, 500);
            $("#userAnswer").val("[TIME_OVER]");
            setTimeout('$("#questionsTimerDiv").html("'+putWord(318)+'");$("#questionsTimerImg").hide();audio[CLOCK].pause();audio[GONG].play();', 200);
            setTimeout(
                function () {
                    $("#questionsTimerDiv").animate({ marginLeft: "initial", marginTop: "-10px", marginLeft: "-10px", padding: "8px", width: "1%", fontSize: "0.1em" },
                                                500,
                                                'swing',
                                                function () { $("#questionsTimerDiv").remove(); checkAnswer(); }
                                            );
                }, 4000);
        }
    }
}


function stopAndClearQuestionsTimer(){
    clearTimeout(timerForQuestionsTimeout);
    $("#questionsTimerDiv").remove();//removr old timers if exsists
    audio[CLOCK].pause();
}

//ask to make user status update. like change navID, change route etc
function updateUserStatus(navID, LM, level, routeNum) {
    $('#inFeedbackPopup').html("<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\"טוען\"/><h4>מעדכן...<h4>");
    $('#lnkfeedbackPopup').click();
    doQuestionAction('{ "action" : "updateUserStatus" , "userID" : " ' + localStorage.userID + ' " , "navID" : "' + navID + '" , "LM" : " ' + LM + ' ", "level" : "' + level + ' ", "routeNum" : "' + routeNum  + '"}');
}


//make user status update after the deatiles get from the server.
function doUpdateUserStatus(data){
    var dataArr = JSON.parse(data);
     if (dataArr["success"] == 1) {
        localStorage.navID = dataArr['navID'];
        localStorage.LM = dataArr['LM'];
        localStorage.level = dataArr['level'];
        localStorage.routeNum = dataArr['routeNum'];
        routeNum = localStorage.routeNum;
        navID = localStorage.navID;
        localStorage.removeItem('endOfLoadQuestion');//remove 'endOfLoadQuestion' if exsist to enable continue
        dataRefresh(true, "", "", true);
        $("#feedbackPopup").popup("close");
     }
     else {
        navigator.notification.alert("עדכון נתוני משתמש נכשל - נסה שנית\n לעזרה פנה למדריך\n"+dataArr["ERROR"], function () { }, 'לא ניתן להמשיך', 'אישור');
    }
}

function sendBugReport(){
    $("#guidePopupPass").popup("close");
    var d = new Date();
    var time = d.getTime() / 1000;
    send = "<!--" + $('#dataToBugRepoet').html() + '\n log:\n' + localStorage.consoleText + "-->";
    addConnection(time, send , "[bugReport]", -5, 0, 0, 0);
}

//this function ask to replace game from other user for this user 
//for example whan battary is finished
function switchFromAnotherUser(replaceUserID, requestNum){
        if (requestNum == 2){
            $("#inSwitchDivStep1").hide();
            $("#inSwitchDivStep2").hide();
            $("#inSwitchDivStep3").show();
        }
        var jqxhr = $.post(baseUrl + "/A_import_files/questionActionV2.php", { action: "switchFromAnotherUser", userID: localStorage.userID, replaceWith: replaceUserID, requestNum: requestNum} );
        jqxhr.done(function (data, status) {
            var dataArr = JSON.parse(data);
            if (dataArr["success"] == 1) {
                if (dataArr['requestNum'] == 1) {
                    $("#inSwitchDivStep1").hide();
                    $("#inSwitchDivStep2").show();
                    $("#inSwitchDivStep3").hide();
                    var text = "האם אתה בטוח שאתה רוצה להעביר את משתשמש " + dataArr['replaceWith'] + " (" + dataArr['replaceWithName'] + ") למכשיר זה?";
                    $("#H3InSwitchDivStep2").html(text);
                    $("#switcContinueButton2").attr("onclick", "switchFromAnotherUser(" + dataArr['replaceWith'] + ", 2);");
                }
                else if (dataArr['requestNum'] == 2) {
                    /*$answer['LM'] = $LM;
                    $answer['level'] = $level;
                    $answer['mistakes'] = $mistakes;
                    $answer['startTime'] = $startTime;*/

                    localStorage.LM = dataArr['LM'];
                    localStorage.level = dataArr['level'];
                    localStorage.totalMistakeCounter = dataArr['mistakes'];
                    localStorage.startTime = dataArr['startTime'];
                    localStorage.routeNum = dataArr['routeNum'];
                    routeNum = localStorage.routeNum;
                    localStorage.removeItem('endOfLoadQuestion');//remove 'endOfLoadQuestion' if exsist to enable continue
                    $(".LM").html(localStorage.LM); $(".level").html(localStorage.level); $(".quesID").html(localStorage.quesID); $(".point").html(localStorage.point); 
                    $(".routeNum").html(localStorage.routeNum);$(".userStatus").html(localStorage.point + "|" + localStorage.LM + "|" + localStorage.level + "|" + localStorage.quesID + "</h5>");

                    dataRefresh(true, "", "", true);

                    setTimeout('$("#switchPopup").popup("close");', 1000)
                    alert("שינוי משתמש הצליח!");
                }
                else {
                    alert("שגיאה חסר מספר בקשה מהשרת");
                    $("#switchPopup").popup("close");
                }
            }
            else {
                alert("לא התקבל אישור מהשרת להחלפת משתמש\n סיבת הסרוב: " + dataArr['ERROR']);
                $("#switchPopup").popup("close");
            }
        });
        jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
            console.log("switchFromAnotherUser error because: " + textStatus + ", " + errorThrown);
            alert("switchFromAnotherUser error because: " + textStatus + ", " + errorThrown);
        });
}

function openSwitchFromAnotherUserPopup() { 
    $("#inSwitchDivStep1").show();
    $("#inSwitchDivStep2").hide();
    $("#inSwitchDivStep3").hide();
    $("#guidePopup").popup("close");
    $("#guidePopup").on("popupafterclose", function () { $("#lnkSwitchPopup").click(); });
    setTimeout('$( "#guidePopup" ).off("popupafterclose");', 3000); //cancel event after 3 second
}

function askForSwitchFromAnotherUser(){
    if ($("#switchPopupInput1").val() != $("#switchPopupInput2").val()){
       alert("שים לב! יש לרשום את אותו מזהה המשתמש אותו אתנה מעוניין להחליף ולודא שאתם רושם את המזהה הנכון");        
    }
    else if(isNaN($("#switchPopupInput1").val()) ){
        alert("שים לב! יש לרשום מספר חוקי - מספר המשתמש מופיע בטבלת מעקב ובתפריט האפליקציה");        
    }
    else if($("#switchPopupInput1").val() == localStorage.userID){
        alert("שים לב! רשמת את מזהה המשתמש של מכשיר זה! יש לרשום את מזהה המכשיר אותו אתה רוצה להחליף");        
    }
    else if($("#switchPopupInput1").val() == ""){
        alert("שים לב! השארת שדה ריק");        
    }
    else{
         switchFromAnotherUser($("#switchPopupInput1").val(), 1);
        
    }
}

//show in all img the cach file
function refreshFromCache(){
    $('img').each(function () {
        if (($(this).attr('src')).search("http://") >= 0 || ($(this).attr('src')).search("https://") >= 0)
            ImgCache.useCachedFile($(this));
    });

    $('source').each(function () {
        if (($(this).attr('src')).search("http://") >= 0 || ($(this).attr('src')).search("https://") >= 0) {
            var obj = $(this);
            ImgCache.useCachedFile(obj,
                function () {
                    $(obj).parent().load(); 
                }
            );
        }

    });
}

function onBackHeaderButtonClicked(){
    if (pageInView == 1 && localStorage.gameFinished != 'true'){
            $('#lnkInfoPopup').click();
    }
    else if  (pageInView == 4  || (pageInView == 1 && localStorage.gameFinished == 'true')){
        $('#panel-left').panel('open');
    }
    else
        onBackKeyDown();
}

//get url get parametrs
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

//call to guide from the rught menu - help tool for the user
function callToGuide(){
    window.open('tel:'+localStorage.guidePhone, '_system')
}

///////////////////////////////////////////
////////location calculate functions///////
//////////////////////////////////////////
{
//this script [in Javascript] calculates great-circle distances between the two points – that is, 
//the shortest distance over the earth’s surface – using the ‘Haversine’ formula.
//from http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula?noredirect=1&lq=1
function getDistanceFromLatLonInMeters(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d*1000;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

//this function return the azimut between latlong1 to latlong2
function getAzimuth(lat1,lon1,lat2,lon2) {
    return Math.atan2(lon2 - lon1, lat2 - lat1) * 180 / Math.PI;
}


}

//this functions for get postion for question type 12
{//start
var watchIDForType12= null;
var locationTimoutForType12 = null;
var positionForType12 = null;
var intervalForType12 = null;
var type12IsRun = false;//preventDoubleClick
function getLocationForType12(){
 
    if (!type12IsRun){
        type12IsRun = true;
        intervalForType12 = setInterval(function(){
            navigator.geolocation.clearWatch(watchIDForType12);
            watchIDForType12 = navigator.geolocation.watchPosition(
                onType12GeolocationSuccess,
                onType12GeolocationError,
                {maximumAge: 10000, enableHighAccuracy: true, timeout: 5000 }
            );
        },5000);
       
        locationTimoutForType12 = setTimeout("cancelGetLocationForType12();", 30* 1000);
    }
    
    //set the popup
     var inHtml = '<img alt="pic1" src="images/logo_opacity.png" style="width: 200px;   margin: auto;display: block;margin-bottom: 20px"/>' + "<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\""+putWord(113)+"\"/><h4>"+putWord(218)+"</h4><br><div id='acc'></div><br>";

    //                '<a id="sendAnswer" onclick="cancelSendLocation()" class="ui-btn ui-corner-all ui-shadow ui-btn-b">'+putWord(222)+'</a>';
    $('#inFeedbackPopup').html(inHtml);
    $("#feedbackPopup").popup("open");
    
}    

 //on success
function onType12GeolocationSuccess(position){
    //save the potision in a normal object
    var d2 = new Date();
    var time2 = d2.getTime() / 1000;
    positionForType12 = {
        time: time2,
        timestamp: position.timestamp,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed
    };

    if (position.coords.accuracy <= 25){
        $("#userAnswer").val(JSON.stringify(positionForType12));
        navigator.geolocation.clearWatch(watchIDForType12);
        clearTimeout(locationTimoutForType12);
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;
        $("#feedbackPopup").popup("close");
        if (type12IsRun)
            checkAnswer();
        type12IsRun = false;
        
    }
}
 
function onType12GeolocationError(error){
    console.error('GPS ERROR on type 12 - code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
 }
 
function cancelGetLocationForType12(){
    var d = new Date();
    var time = d.getTime() / 1000;
    alert("המערכת לא הצליחה לקבל מיקום - אנא וודאו שיש גישה לשירותי מיקום ושאתם מתחת לכיפת השמים ונסו שנית");
    clearInterval(intervalForType12);
    navigator.geolocation.clearWatch(watchIDForType12);
    addConnection(time, 'last position detieals: ' + JSON.stringify(positionForType12), " [get location for type 12 failed]", -3, 0, 0, 0);
    $("#feedbackPopup").popup("close");
    type12IsRun = false;
} 
}//end

