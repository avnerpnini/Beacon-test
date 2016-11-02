var navID = null,appVersion, isSlidebarOpen, timerLeftPanelTimeout,timerForQuestionsTimeout, hash, interval, requireRoute, requirePassword, password, pageInView = 1, url = window.location.href, isOpenScanner = false, agreeToUpdates = true,
routeNum, Dcordova, Dplatform, Duuid, Dversion, Dmodel, requireAdditionalData, qrSource, levelsArr, connection_table = [], cameraImageURI, ft, firstOrientation, watchID, baseUrl = "http://www.nivut.net";
//localStorage.endOfLoadQuestion = false;

var NUMOFPRIORITYS = 4, HOURSFORGAME = 24;SECONDS_FOR_CHECK_COMMAND = 30;
var myQueue = new makeQueue(NUMOFPRIORITYS);//propryty queue withe 4 levels
var navIDkey = "";//אשפרות להעביר יום אחד פרמטר נוסף לסריקת ברקוד התחלה כרגע לא ממומש
"use strict";

//test on computer
if (url.indexOf("localhost") >= 0 || url.indexOf("A_appPreview") >= 0 ) {
    $(document).ready(onDeviceReady);
}
//real smartphone
else {
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("menubutton", menuKey, false);
    
}

//called function whan device is ready 
function onDeviceReady(){
    if(localStorage.needToRefresh == 1){//refresh when changeing page - to fix dealay bug
        localStorage.removeItem("needToRefresh");
        location.reload();
    }
    $("#backHeaderButton").show();

    if (localStorage.gameFinished == 'true') {
        $("#backHeaderButton").removeClass("ui-icon-info");
        $("#backHeaderButton").addClass("ui-icon-user");
    }

    $(".only_on_nav_runing").hide();
    setWords();//set lenguage
    saveRegisterValues("fName");
    saveRegisterValues("lName");
    saveRegisterValues("phone");
    saveRegisterValues("email");
    saveRegisterValues("address");
   
    /*
    if (typeof(device) !=  "undefined" && device.platform == "iOS") //do vibration on ios only on qr button
        $(".qrScannerButton").click(function () { navigator.vibrate(1);}); 
    else   //do vibration on android buttons
        $("a").click(function () { navigator.vibrate(1);});*/
    if (typeof(device) !=  "undefined" ){
        Dcordova = device.cordova;
        Dplatform = device.platform;
        Duuid =  device.uuid;
        Dversion = device.version;
        Dmodel = device.model;
        cordova.getAppVersion.getVersionNumber(function (version) {
            $(".appVersion").html(version);
            appVersion = version;
            checkForFixes();
        });
        
    }
    startCach();
    if (Dplatform == 'Android') {
        StatusBar.backgroundColorByHexString("#6f9ac0");
    }
    else{
        setTimeout("if(typeof(device) ==  'undefined'){ checkForFixes();}", 3000);//fix bug of checkForFixes twice
    }
    //save data that use to android back button if slide opne back buttton close him
    isSlidebarOpen = false;
    $( "#sidebar" ).on( "panelopen", function() {isSlidebarOpen = true;} );
    $( "#sidebar" ).on( "panelclose", function() {isSlidebarOpen = false;} );
    $( "#panel-left" ).on( "panelopen", function() {isSlidebarOpen = true;} );
    $( "#panel-left" ).on( "panelclose", function() {isSlidebarOpen = false;} );
    //-----------------------------------------------------------------------------
    $("[data-role='page']").css("z-index", 1); //for the background image put the page in 1
    $("[data-role='page']").css("background-color", "white"); //for the background image 
    $(".ui-panel-wrapper").css("background-color", "transparent"); //for the background image
    resize();
    /*
    if (typeof StatusBar !== 'undefined') {//מונע באג בהרצה על המחשב
        $("input.text").off("blur");
        $("input.text").off("focus");
        var statusBarTimout;
        $("input.text").focus(function () {
                clearTimeout(statusBarTimout);
                setTimeout("StatusBar.show()",200);
                });
        $("input.text").blur(function () {
                clearTimeout(statusBarTimout);
                setTimeout("StatusBar.show()",500);
                statusBarTimout = setTimeout("StatusBar.hide()",1000);
                });
        StatusBar.hide(); 
    }
    */

    //define levelsArr var - after chaecking if we hava somthing in the memory
    if (localStorage.levelsArr == null) {
        levelsArr = [];
        $(".inStuck").html(levelsArr.length + "<br>" + localStorage.levelsArr);
    }
    else {
        levelsArr = JSON.parse(localStorage.levelsArr);
        $(".inStuck").html(levelsArr.length + "<br>" + localStorage.levelsArr);
    }

    $("#userAnswer").parent().hide();//hide the user answer input until we hav a question

    //connection_table save all user connections
    if (localStorage.getItem("connection_table")){//if we have somthing in the memoey
        connection_table = JSON.parse(localStorage.connection_table);
    }

    //panel left events
    $("#panel-left").panel({
        beforeopen: function (event, ui) {leftPanelOpen();},
        beforeclose: function( event, ui ) { clearTimeout(timerLeftPanelTimeout) }
    });

    //prevent duoble click on buttons - because it make bug
    $("#mainDiv > .ui-btn, #continueButton").click(
        function (e) {
            var a = $(this);
            $(a).addClass('ui-state-disabled');
            setTimeout(function () {
                $(a).removeClass('ui-state-disabled');
            }, 3000);

        }
    );
    //ui-state-disabled

    startSlider();
    isDuringeGame();
    //for preview in site - dont have use in the application
    if (QueryString["istest"]) {
        testQuestion(QueryString["quesID"]);
    }

 };

//for Open panel on swipe
 $(document).on("pagecreate", "#mainPage", function () {
     $(document).on("swipeleft swiperight", "#pageHeader", function (e) {
         // We check if there is no open panel on the page because otherwise
         // a swipe to close the left panel would also open the right panel (and v.v.).
         // We do this by checking the data that the framework stores on the page element (panel: open).
         if ($(".ui-page-active").jqmData("panel") !== "open") {
             if (e.type === "swipeleft") {
                 $("#sidebar").panel("open");
             } else if (e.type === "swiperight") {
                 if (pageInView == 4)
                     $("#panel-left").panel("open");
             }
         }
     });
 });

function resize(){
    chosePicToBG();
    if(window.innerHeight > window.innerWidth){
        $(".owl-pic_p").show();
        $(".owl-pic_l").hide();
    }
    else{
        $(".owl-pic_l").show();
        $(".owl-pic_p").hide();
    }
    //$("#mainPage").css("height", "100%");//fix screen cut bug

    //fix the page height
    setTimeout('$.mobile.resetActivePageHeight();',500);
    setTimeout('$.mobile.resetActivePageHeight();',1000);
    setTimeout('$.mobile.resetActivePageHeight();',2000);
    
}

var timoetForCheckForFixes = null;
//this function check withe ajax if we have to upload fix files to the app on ready
function checkForFixes() {
     if (!timoetForCheckForFixes)
        timoetForCheckForFixes = new connectAgainTimoet("checkForFixes()");
    var jqxhr = $.post(baseUrl + "/A__V2/check_fixes.php?appVersion="+appVersion);
    //if ajax sucseed
    jqxhr.done(function (data, status) {
        var dataArr = JSON.parse(data);
        if (dataArr[0] == 1) {
            console.log("checkForFixes success - there is fixes");
            //work noe on consol getScript and לטפל במקרה שלא מצליח
            if (dataArr["js"]) {//fix to js
                javaScriptFix(dataArr["js"]);
            }
        }
        else {
            console.log("checkForFixes success - no fixes");
        }
        delete timoetForCheckForFixes; 
    });

    //if ajax failed
    jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
        timoetForCheckForFixes.add();
        console.log("checkForFixes jqxhr error because: " + textStatus + ", " + errorThrown);
    });
}
var timoetForJavaScriptFix = null;
//if we hava script fix this app uplaod the new script code
function javaScriptFix(javaURL){
    if (!timoetForJavaScriptFix)
        timoetForJavaScriptFix = new connectAgainTimoet("javaScriptFix('"+ javaURL +"')");
    var jqxhrScript = $.getScript(javaURL);
    jqxhrScript.done(function (jqXHR, textStatus, errorThrown) {
        $('#javaFix').show();
        console.log("fix success - java execute");
        var currentdate = new Date();
        //var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        $(".lastAjax").html(currentdate.toLocaleTimeString());
        delete timoetForJavaScriptFix;
    });

    jqxhrScript.fail(function (jqXHR, textStatus, errorThrown) {
        timoetForJavaScriptFix.add();
        javaScriptFix
    });
}

//this object craete a timer that try to connect to the internet in changing times 
function connectAgainTimoet(expression){
    this.counter = 0;
    this.miliSeconds;
    this.add = function () {
        this.counter++;
        if (this.counter == 1 || this.counter == 2)
            this.miliSeconds = 5000;
        else if (this.counter > 2 && this.counter < 13)
            this.miliSeconds = (this.counter * 5000) - 5000;
        else
            this.miliSeconds = 60000;
        var timeout = setTimeout(expression, this.miliSeconds);
        console.log("try again: " + expression + "in: " + (this.miliSeconds / 1000) + " seconds");
    };
    
}

//this function save aotmatic the inputs in the registers while the user write theme, in the local storage
function saveRegisterValues(id){
    if (localStorage.getItem(id)){
        $("#" + id).val(localStorage.getItem(id));
        //alert(id + " set");
    }
    $("#" + id).change(function () {
        localStorage.setItem(id, sClean($("#" + id).val()));
        checkRegisterValues(false);
    });
}

//this function check if the user values in the register is ok if the register is ok return true else return false
function checkRegisterValues(showMsg){
    //color the border in red
    function redBorder(id){
        $("#"+id).css("border", "2px");$("#"+id).css("border-style", "solid");$("#" + id).css("border-color", "red");
    }
    //remove the border in red
    function RemoveRedBorder(id){
        $("#"+id).css("border", "0px");
    }

    var msg = "";
    if (localStorage.getItem("fName") == null || (localStorage.getItem("fName")).length < 2){
        redBorder("fName");
        msg +=putWord(100) + "\n";
    }
    else
        RemoveRedBorder("fName");

    if (localStorage.getItem("lName") == null || (localStorage.getItem("lName")).length < 2){
        redBorder("lName");
        msg += putWord(101) + "/n";
    }
    else
        RemoveRedBorder("lName");

    if ((localStorage.getItem("address") < 1) || (localStorage.getItem("address") > 30)){//adrees changed to num of players
        redBorder("address");
        msg += putWord(99) + "\n";
    }
    else
        RemoveRedBorder("address");

    var pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    if( !(localStorage.getItem("email") == null) && localStorage.getItem("email").length > 0 && !pattern.test(localStorage.getItem("email")) ){    
        redBorder("email");
        msg += putWord(103) + "\n";     
    }
    else
        RemoveRedBorder("email");

    var pattern = /\d{10}/g;
    var phone = localStorage.getItem("phone");
    var isHebrew = (localStorage.getItem("language") == HEBREW || localStorage.getItem("language") == null);
    if ( ((isHebrew) && ((localStorage.getItem("phone") == null) || phone.length != 10 || phone.substring(0,1)!=0 || phone.substring(1,2)!=5 || !pattern.test(phone)))
          || (!isHebrew && (localStorage.getItem("phone") == null || phone.length < 10) ) ){
        redBorder("phone");
        msg += putWord(104) + "\n";
    }
    else
        RemoveRedBorder("phone");


    if (msg != "" ) {
        if (  showMsg == true)
            navigator.notification.alert(msg, function(){},putWord(105),putWord(106));
        return false;
    }
    else{
     if (showMsg == true && navID == null){
        changePage(1);
        $('#lnkpopupRegisterReceived').click();
        $('#registerBut').hide();
        $('#scanQRBut').css("display", "");
        
        /*$("#gate").fadeOut(400,function(){$("#registerDiv").fadeIn();});
        $("#earlierRegister").appendTo("#register");*/
        return true;
    }
    else
        return true;
    }
}

//check the guide password in guide screen
function checkGuidePass() {
    if ($('#guidePopupPassInput').val() == 0)
        alert(putWord(107));
    else if ($('#guidePopupPassInput').val() == "wtg212") {
        $("#guidePopupPass").popup("close");
        $("#guidePopupPass").on("popupafterclose", function () { $("#lnkGuidePopup").click(); });
        $('#guidePopupPassInput').val('');
        setTimeout('$( "#guidePopupPass" ).off("popupafterclose");', 3000); //cancel event after 3 second
    }
    else {
        alert(putWord(108));
        $('#guidePopupPassInput').val('');
        $("#guidePopupPass").popup("close");
    }
}

//clean bad tags drom strings 
// and to \" to Quotes if escapQuotes = true
function sClean(str, escapQuotes){
    if (typeof str != 'string')
        return str;
    else{
        str = str.replace(/[~`;%^&$*+=()?#:{}\/]/gi, "");
        str = str.replace(/[\\]/gi, "");
        str = str.replace(/<[^>]*>/gi, " ");//remove html tags
        if (escapQuotes){
            str = str.replace(/["]/gi, "\\\"");
            }
        return str;
    }
}

//close app
function closeApp(i){
    if (i==2)
        navigator.app.exitApp();
}

//define the menu key on android
function menuKey() {
    //navigator.vibrate(1);
    $("#sidebar").panel("toggle");//open aidebar whan android menu vutton click
}

//define the back button. in ios the button is in the haeder in android he also the back android button
function onBackKeyDown(){
    /*
    if (typeof(device) !=  "undefined" && device.platform != "iOS") //do vibration on android only
        $("a").click(function () { navigator.vibrate(1);});*/

    window.scrollTo(0, 0);
    hash = window.location.hash;
    if (isOpenScanner){}
    else if (hash.indexOf("ui-state=dialog") != -1 || hash.indexOf("scanNvaID") != -1) {//scan - back from scaning, ui-state=dialog - back from dialog
        location.assign("#");
    }
    else if (isSlidebarOpen){
        $("#sidebar").panel("close");
        $("#panel-left").panel("close");
    }
    else if(pageInView == 2){
    changePage(1);
    }
    else if(pageInView == 3){
    changePage(2);
    }
    else {
        navigator.notification.confirm(
            putWord(109) + "\n",  // message
            closeApp,              // callback to invoke with index of button pressed
            putWord(110),            // title
            [putWord(111),putWord(112)]          // buttonLabels
        );
    }
}

//this function call to start the register at the begining of the app its called from scan()
function startsNavRegister(text, source) {
    qrSource = source;
    var str = text;
    //navIDkey במידה וימומש יום אחד צריך להתגלת כאן איפה שהוא
    if (str.search("default=") >= 0) {   //defualt nav id
        var defaultPos = str.indexOf("default=")+8;
        var endOfDefualtVal = str.indexOf("&",defaultPos) > 0 ? str.indexOf("&",defaultPos): str.length ;
        var defaultID = str.substring(defaultPos , endOfDefualtVal);
        console.log("default id "+defaultID+" source:" + source);
        $('#inFeedbackPopup').html("<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\""+putWord(113)+"\"/>");
        doQuestionAction('{ "action" : "getDefualtNavID", "defaultID": '+defaultID+' }');
        console.log("checkNavID");
    }
    else {
        if ((str.search("navID=") >= 0)) {
            var from = (str.search("navID="));
            navID = str.substring(from + 6, 1000);
            if (navID.search("&") >= 0)
                var att = (navID.search("&"));
            else
                var att = 1000;
            navID = sClean(navID.substring(0, att));
            console.log("spesific nav id: " + navID + ", source: " + source);
        }
        else {
            navID = null;
        }

        //if we have passord in the barcode
        if ((str.search("password=") >= 0)) {
            var from = (str.search("password="));
            var password = str.substring(from + 9, 1000);
            if (password.search("&") >= 0)
                var att = (password.search("&"));
            else
                var att = 1000;
            password = sClean(password.substring(0, att));
            console.log("We have a password in the qr: " + password);
        }
        else {
            var password = null;
        }

        if (navID != null) {
            $('#inFeedbackPopup').html("<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\""+putWord(113)+"\"/>");
            console.log("checkNavID");
            //doQuestionAction('{ "action" : "getNavName" , "p1" : " '+ navID + ' " , "key" : " ' + navIDkey + ' ", " }');
            doQuestionAction('{ "action" : "getNavName" , "p1" : " ' + navID + ' " , "key" : " ' + navIDkey + ' ", "password" : "' + password + '"}');
            //checkNavID(navID);
        }
        else {
            location.assign("#");
            navigator.notification.alert(putWord(114)+"\n"+putWord(115),  // message
            function () { },         // callback
            putWord(116),            // title
            putWord(106)                 // buttonName
            );
        }
    }
}

    //function to make ajarequest throw QuestionActionV2.php in import_files
    var timoetFordoQuestionAction = {};
    function doQuestionAction(parm) {
        var parmParse = JSON.parse(parm);
        if (!(timoetFordoQuestionAction[parmParse['action']]))
            timoetFordoQuestionAction[parmParse['action']] = new connectAgainTimoet(function () {
                doQuestionAction(parm);
            });

        var jqxhr = $.post(baseUrl + "/A_import_files/questionActionV2.php", parmParse);

        jqxhr.done(function (data, status) {
            if (parmParse['action'] == "getDefualtNavID") {
                navID = data;
                doQuestionAction('{ "action" : "getNavName" , "p1" : " ' + navID + ' " , "key" : " ' + navIDkey + ' " }');
                //checkNavID(navID);
            }
            else if (parmParse['action'] == "getNavName") {
                storeNavID(data);
            }
            else if (parmParse['action'] == "addUser") {
                startGame(data);
            }
            else if (parmParse['action'] == "updateUserStatus") {
                doUpdateUserStatus(data);
            }
            console.log("doQuestionAction success action: " + parmParse['action']);
            delete timoetFordoQuestionAction[parmParse['action']];
        });


        jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
            timoetFordoQuestionAction[parmParse['action']].add();
            console.log("doQuestionAction error because: " + textStatus + ", " + errorThrown);
        });

    }

    //function that called after navid find and atoring the new data - its called from doQuestionAction()
    function storeNavID(data) {
        var dataArr = JSON.parse(data);
        localStorage.setItem("navID", navID);
        localStorage.setItem("memory", dataArr["memory"]);
        if (dataArr['isOldVersion'] == 1)
            localStorage.setItem("oldVersion", "true");
        else
            localStorage.setItem("oldVersion", "false");
        localStorage.setItem("memory", dataArr["memory"]);
        localStorage.setItem("navName", dataArr.navName);
        $(".navID").html(navID);
        $(".memory").html(dataArr["memory"]);
        $(".navName").html(localStorage.navName +" ("+localStorage.navID+")");

        requirePassword = dataArr.requirePassword;
        if (requirePassword) {
            password = dataArr.password;
            $("#passInputDiv").show();
        }
        requireRoute = dataArr.requireRoute;
        if (dataArr.contin == true) {
            $('#inFeedbackPopup').html('<img alt="pic1" src="images/logo_opacity.png" style="width: 200px;   margin: auto;display: block;margin-bottom: 20px"/>' + "<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\""+putWord(113)+"\"/><h4>"+putWord(117)+" " + localStorage.navName + "</h4>");
            setTimeout(function () {
                $("#feedbackPopup").popup("close");
                isOpenScanner = false;
                changePage(2);
                $('#registerBut').hide();
                $('#scanQRBut').css("display", "");
            }, 3000);
            $('#h3ForRegister').html(putWord(118)+"<h3 style='color:rgb(97, 153, 49)'>" + localStorage.navName + "</h3>");

            if (requireRoute) {
                $("#routeInputDiv").show();
                var inputText = '<option data-placeholder="true" value="0">'+putWord(119)+'</option>';
                for (var j = 0; j < requireRoute.length; j++) {
                    inputText += '<option value="' + requireRoute[j] + '">'+putWord(120)+' ' + requireRoute[j] + '</option>';
                }
                $("#selectRoute").html(inputText);
                $("#selectRoute").selectmenu("refresh");
            }

        }
        else if (dataArr.navName != null) {
            $('#inFeedbackPopup').html("<h4>"+putWord(117)+": " + localStorage.navName + "  "+putWord(121)+"</h4>");
            setTimeout(function () {
                $("#feedbackPopup").popup("close");
                isOpenScanner = false;
            }, 6000);
        }
        else {
            $('#inFeedbackPopup').html("<h4>"+putWord(122)+"</h4>");
            setTimeout(function () {
                $("#feedbackPopup").popup("close");
                isOpenScanner = false;
            }, 6000);
        }
    }

    //this function hekp to switch between diffrent pages. 1 is gate, 2 is first rfister screen, 3 is second register screen, 4 is the game core.
    function changePage(pageNum) {
        window.scrollTo(0, 0);
        switch (pageNum) {
            case (1):
                $("#registerDiv").fadeOut(400, function () { $("#gate").fadeIn(); });
                $("#backHeaderButton").show();
                $("#backHeaderButton").removeClass("ui-icon-carat-l");
                if (localStorage.gameFinished == 'true')
                    $("#backHeaderButton").addClass("ui-icon-user");
                else
                    $("#backHeaderButton").addClass("ui-icon-info");
                //$( "#backHeaderButton" ).button( "option", "icon", "star" );
                $("#resisterSave").show(); $("#resisterContinue").hide(); $("#resisterStart").hide();
                $("#routeInputDiv").hide(); $("#passInputDiv").hide(); $("#cantScanQr").show();
                $(".only_on_nav_runing").hide();
                break;
            case (2):
                var elmntid;
                (pageInView == 3) ? elmntid = "#passwordDiv" : elmntid = "#gate";
                $(elmntid).fadeOut(400, function () { $("#registerDiv").fadeIn(); });
                $("#backHeaderButton").show();
                $("#backHeaderButton").removeClass("ui-icon-info");
                $("#backHeaderButton").removeClass("ui-icon-user");
                $("#backHeaderButton").addClass("ui-icon-carat-l");
                $("#cantScanQr").hide();
                $(".only_on_nav_runing").hide();
                if (navID == null) {
                    setEnterEvent(".register","#resisterSave");
                }
                else if (requirePassword || requireRoute || requireAdditionalData) {
                    $("#resisterSave").hide(); $("#resisterContinue").show(); $("#resisterStart").hide();
                    setEnterEvent(".register","#resisterContinue");
                }
                else {
                    $("#resisterSave").hide(); $("#resisterContinue").hide(); $("#resisterStart").show();
                    setEnterEvent(".register","#resisterStart");
                }
                break;
            case (3):
                $("#registerDiv").fadeOut(400, function () { $("#passwordDiv").fadeIn(); });
                $("#cantScanQr").hide();
                $(".only_on_nav_runing").hide();
                setEnterEvent(".register","#passwordDivStart");
                break;
            case (4):
                if (pageInView == 2)
                    $("#registerDiv").fadeOut(400, function () { $("#mainDiv").fadeIn(); });
                else
                    $("#passwordDiv").fadeOut(400, function () { $("#mainDiv").fadeIn(); });
                $("#backHeaderButton").show();
                $("#backHeaderButton").removeClass("ui-icon-info");
                $("#backHeaderButton").removeClass("ui-icon-carat-l");
                $("#backHeaderButton").addClass("ui-icon-user");
                $(".only_on_nav_runing").show();
                setEnterEvent("#userAnswer","#sendAnswer");
                //כל פונקציה שאני שם כאן לחשוב אם לשים אותה גם ב isduringgame
                break;
        }
        pageInView = pageNum;
        //fix the page height
        setTimeout('$.mobile.resetActivePageHeight();', 1000);
    }

    //this function define whice button is clicked when user puse enter
    function setEnterEvent(where, button) {
        $(where).keyup(function (event) {
            if (event.keyCode == 13) {
                $(where).blur();
                $(button).click();
            }
        });
    }

    //this fnction opens the qr scanner
    function scan(mytype) {
        isOpenScanner = true;
        $("#feedbackPopup").popup({
            afteropen: function () {
                setTimeout(navIDScan(mytype), 2000);
                $("#feedbackPopup").popup({
                    afteropen: function () { }
                }); //מבטל את עצמו
            }
        });
        $('#lnkfeedbackPopup').click();
        $('#inFeedbackPopup').html("<h4>"+putWord(246)+"<h4>");}

        function navIDScan(type) {
            cordova.plugins.barcodeScanner.scan(
            function success(result) {
                $('#inFeedbackPopup').html("");
                if (result.cancelled) {
                    $("#feedbackPopup").popup("close");
                    setTimeout("isOpenScanner = false;", 1000)
                }
                else {
                    if (type == "navID") {
                        startsNavRegister(result.text, "qr");
                        console.log("type is navID");
                    }
                    else if (type == "code") {
                        var str = result.text;
                        str = str.replace("p2=", "code="); //התאמה לברקוד ישנים של נקודות ציון
                        str = str.replace("9-301-1.php", "code=301&");
                        if ((str.search("code=") >= 0)) {
                            var from = (str.search("code="));
                            var code = str.substring(from + 5, 1000);
                            if (code.search("&") >= 0)
                                var att = (code.search("&"));
                            else
                                var att = 1000;
                            code = sClean(code.substring(0, att));
                        }
                        else {
                            code = null;

                        }
                        if (code != null) {
                            //$('#inFeedbackPopup').html("<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\"putWord(113)\"/><h4>putWord(123)</h4>" + code);
                            // setTimeout(function () {
                            $("#feedbackPopup").popup("close");
                            isOpenScanner = false;
                            $('#registerBut').hide();
                            $('#scanQRBut').css("display", "");
                            //  }, 3000);
                            $('#userAnswer').val(code);
                            checkAnswer();
                        }
                        else if (!result.cancelled) {
                            navigator.notification.alert(putWord(124) + "\n" + putWord(115)),  // message
                                                    function () { },         // callback
                                                    putWord(116),            // title
                                                    putWord(106)                 // buttonName
                        };
                        isOpenScanner = false;
                        $("#feedbackPopup").popup("close");

                    }
                    console.log("type is code");
                }
            }

           )
        }
            function fail(error) {
                alert("Scanning failed: " + error);
                setTimeout("isOpenScanner = false;", 1000);
            }
        
        

    //this function Initializes the slider
    function startSlider() {
        $("#slider").owlCarousel({
            slideSpeed: 700,
            paginationSpeed: 700,
            rewindSpeed: 500,
            singleItem: true,
            pagination: true,
            lazyLoad: true,
            autoPlay: 3000,
            navigation: false
        });
        jQuery(".sub-menu").hide();

        //chlidren on sidebar
        if ("ontouchstart" in document.documentElement) {
            jQuery(".menu-item-has-children").bind('touchstart touchon', function (event) {
                event.preventDefault();
                jQuery(this).children(".sub-menu").toggleClass("active").toggle(350);
                return false;
            }).children(".sub-menu").children("li").bind('touchstart touchon', function (event) {
                window.location.href = jQuery(this).children("a").attr("href");
            });
            $('#a-search').bind('touchstart touchon', function (event) {
                if (aSearchClicked) {
                    $('#searchform').removeClass('moved');
                    aSearchClicked = false;
                }
                else {
                    $('#searchform').addClass('moved');
                    aSearchClicked = true;
                }
            });
        }
        else {

            jQuery(".menu-item-has-children").bind('click', function (event) {
                event.preventDefault();
                jQuery(this).children(".sub-menu").toggleClass("active").toggle(350);
                return false;
            }).children(".sub-menu").children("li").bind('click', function (event) {
                window.location.href = jQuery(this).children("a").attr("href");
            });
            $('#a-search').bind('click', function (event) {
                if (aSearchClicked) {
                    $('#searchform').removeClass('moved');
                    aSearchClicked = false;
                }
                else {
                    $('#searchform').addClass('moved');
                    aSearchClicked = true;
                }
            });

        }
    }

    //this function check if the user values in the PasswordDiv is ok if the register is ok return true else return false
    function checkPasswordDivValues() {
        var msg = "";
        var additionalData = sClean($("#additionalData").val());
        if (requirePassword) {
            if ($("#password").val() != password) {
                if ($("#password").val() == "")
                    msg += putWord(125)+"\n";
                else
                    msg += putWord(126)+"\n";
            }
        }
        if (requireRoute) {
            routeNum = $('#selectRoute').val();
            if (routeNum == 0) {
                msg += putWord(127)+"\n";
            }
        }
        //requireAdditionalData = true;//debug
        if (requireAdditionalData) {
            if ($('#additionalData').val().length == 0) {
                msg += PutWord(128)+" \n";
            }
        }
        if (msg != "") {
            //alert(msg);
            navigator.notification.alert(msg,  // message
        function () { },         // callback
        putWord(129),            // title
        putWord(106)                  // buttonName
        );
            return false;
        }
        var d = new Date();
        var time = d.getTime() / 1000;
        $("#passwordDivStart").attr("onclick", "alert('"+putWord(130)+"')");
        $('#inFeedbackPopup').html("<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\""+putWord(113)+"\"/><h4> "+putWord(131)+"<h4>");
        $('#lnkfeedbackPopup').click();
        $("#passwordDivStart").attr("onclick", "alert('"+putWord(130)+"')");
        doQuestionAction('{ "action" : "addUser",\
                        "navID" : " ' + sClean(navID, true) + ' " ,\
                        "routeNum" : " ' + sClean(routeNum, true) + ' " ,\
                        "phoneN" : " ' + sClean(localStorage.getItem("phone"), true) + ' " ,\
                        "firstN" : " ' + sClean(localStorage.getItem("fName"), true) + ' " ,\
                        "lastN" : " ' + sClean(localStorage.getItem("lName"), true) + ' " ,\
                        "city" : " ' + sClean(localStorage.getItem("address"), true) + ' " ,\
                        "mail" : " ' + sClean(localStorage.getItem("email"), true) + ' " ,\
                        "agree" : " ' + sClean(agreeToUpdates, true) + ' " ,\
                        "phoneT" : " ' + "model:" + sClean(Dmodel, true) + " additionalData:" + sClean(additionalData, true) +  " device version:"  + sClean(Dversion, true) + " navIDSource:" + qrSource + '" ,\
                        "browser" : " ' + sClean(Dcordova, true) + ' " ,\
                        "version" : " ' + sClean(appVersion, true) + ' " ,\
                        "OS" : " ' + sClean(Dplatform, true) + ' " ,\
                        "IP" : " ' + sClean(Duuid, true) + ' " ,\
                        "date" : " ' + time + ' " }');

        return true;

    }

    //Handles information resulting from the addUser action
    function startGame(data) {
        var dataArr = JSON.parse(data);
        if (dataArr["success"] == 1) {
            //reset old data
            localStorage.setItem("levelsArr", "[]");
            levelsArr = [];
            myQueue.emptyQueue();
            localStorage.setItem("connection_table", "[]");
            connection_table = [];
            //reset old data
            changePage(4);
            localStorage.setItem("userID", dataArr["userID"]);
            localStorage.setItem("routeNum", dataArr["routeNum"]);
            localStorage.setItem("startTime", dataArr["date"]);
            localStorage.setItem("numOfPoints", dataArr["numOfPoints"]);
            localStorage.setItem("totalMistakeCounter", 0);
            localStorage.removeItem("LM");
            localStorage.removeItem("level");
            localStorage.removeItem("quesID");
            localStorage.removeItem("endOfLoadQuestion");
            localStorage.removeItem("gameFinished");
            localStorage.removeItem("finishTime");
            var checkForCommandsInterval = setInterval("checkForCommands()", SECONDS_FOR_CHECK_COMMAND * 1000); //check for commend from the server evrey SECONDS_FOR_CHECK_COMMAND seconds

            //addConnection(localStorage.startTime,dataArr["get"],dataArr["send"],0,0,0,0);
            $(".userID").html(localStorage.userID);
            $(".routeNum").html(localStorage.routeNum);
            var d = new Date(parseInt(localStorage.startTime) * 1000);
            $(".startTime").html(d.toLocaleString());
            $(".userName").html(localStorage.fName + " " + localStorage.lName);

            if (localStorage.getItem("oldVersion") == "true")
                goToOldVersion();
            else {
                localStorage.setItem("levelName", "LM0l0");
                audio[STARTGAME].play();
                $('#inFeedbackPopup').html("<h2>"+putWord(132)+"</h2>");
                setTimeout(function(){
                    showNextQuestion();
                    for (var i = 1; i <= parseInt(localStorage.memory) + 1; i++) {
                        askForQuestion(i);
                    }
                },6000)
            }
            //alert(data);
            //play sound
           
        }
        else {
            //alert(data);
            navigator.notification.alert(putWord(133)+"\n"+ putWord(134)+"\n"+dataArr["ERROR"], function () { },  putWord(105), putWord(106));
            $("#feedbackPopup").popup("close");
            $("#passwordDivStart").attr("onclick", "checkPasswordDivValues()");//fixing bug "can't start 2 times"
        }
    }

    //this function add to the ajax queue get question action
    function askForQuestion(n) {
        myQueue.addToQueue(0, { action: "getQuestion", navID: navID, route: localStorage.routeNum, LM: localStorage.LM, level: localStorage.level, askThe: n });
    }


    //this function add question to the local storge after the data gets from ajax

    function addQuestion(name, data) {
        localStorage.setItem(name, data);
        if (!(levelsArr.indexOf(name) >= 0)) {
            if (levelsArr.length != 0){//בדיקה לאי רציפות בחידות
                var lastLevelArr = levelsArr[levelsArr.length-1];
                var lastLM = lastLevelArr.substring(2, lastLevelArr.search("l"));
                var lastLevel = lastLevelArr.substring(lastLevelArr.search("l")+1, lastLevelArr.length);
                
                var newLevelArr = name;
                var newLM = newLevelArr.substring(2, newLevelArr.search("l"));
                var newLevel = newLevelArr.substring(newLevelArr.search("l")+1, newLevelArr.length);

                if (!( (parseInt(newLM) == parseInt(lastLM) && parseInt(newLevel) == parseInt(lastLevel) + 1) || (parseInt(newLevel) == 1 && parseInt(newLM) == parseInt(lastLM)+1 ) || parseInt(newLevel) == 999)) {
                     var d = new Date();
                    var time = d.getTime() / 1000;
                    addConnection(time,  putWord(135) + " lastLM: " + lastLM + ", lastLevel: "+lastLevel + ", newLM: "+newLM + ", newLevel: "+newLevel ,  "", -3, 0, 0, 0);
                    //levelsArr = [];
                    //localStorage.setItem("levelsArr", JSON.stringify(levelsArr));
                    setTimeout('dataRefresh(true, "", "");', 2000);
                    return;
                }
                else
                    levelsArr.push(name);
            }
            else
                levelsArr.push(name);
        }
        else {
            console.log("Question of " + name + " recieve more than one time!");
        }
        localStorage.setItem("levelsArr", JSON.stringify(levelsArr));
        $(".inStuck").html(levelsArr.length + "<br>" + localStorage.levelsArr);

        if (waitingForShow)
            showNextQuestion();
        if (data == 999)
            localStorage.endOfLoadQuestion = true;
    }


    //this function find all img elemnts and save pictures on the local memory of the device
    function downloadPicToStoargeFromQuestionObj(obj) {
        //אני נמצא כאן צריך לסנן את התמונה להוריגד אותה ואז להגדיר מחדש את המיקום האמיתי שלה...
        var result = "", downloadFrom = [], i = 0; //var putIn = []; למחוק
        for (var key in obj) {
            if (key == "p1" && obj["type"] == 2 && obj[key] != "") {//match to picture in type 2
                obj[key] = '<img id="type2pic" src="' +baseUrl + '/A_images/' + obj[key] + '">';
            }
            var allMatches = null;
            if (obj[key] != null)
                var allMatches = obj[key].match(/src=(\'|\")([^'"]+)/ig);
            //var allMatches = data.match(/src='(?:[^'\/]*\/)*([^']+)'/g);
            if (allMatches) {
                downloadFrom = downloadFrom.concat(allMatches);
                for (; i < downloadFrom.length; i++) {
                    downloadFrom[i] = downloadFrom[i].slice(5);
                    //allMatches[i] = replace("http://","");
                    result += downloadFrom[i];
                    result += "\n";
                }

            }
        }
        for (var key in downloadFrom) {
            //putIn[key] = downloadFrom[key].replace("http://","");
            //result += putIn[key];
            //result += "\n";
            myQueue.addToQueue(1, { action: "downloadPic", url: downloadFrom[key] });
            //var filename = cordova.file.dataDirectory + poped[1].filename;
            //var getUrl = encodeURI(poped[1].url);
        }
    }


    //this function show next question on the screen if there is no new question waiting for new and than show it
    var waitingForShow = false;
    var theQuestion;
    function showNextQuestion(isRefresh) {
        if (levelsArr.length == 0 && !isRefresh) {
            waitingForShow = true;
        }
        else {
            //enabled the continue button to prevent double click
            //$("#continueButton").attr('onclick', 'console.log("double click on continue button");');
            //
            waitingForShow = false;
            $("#userAnswer").val('');

            if (isRefresh == true) {//back to last question and dont move forwerd
                if (localStorage.getItem("LM" + localStorage.LM + "l" + localStorage.level))
                    theQuestion = JSON.parse(localStorage.getItem("LM" + localStorage.LM + "l" + localStorage.level));
                else {
                    waitingForShow = true;
                    return;
                }
            }
            else { //go forwerd to next question
                var levelName = localStorage.levelName;
                var preLevelName = levelName;
                levelName = levelsArr.shift();
                localStorage.setItem("preLevelName", preLevelName);
                localStorage.setItem("levelName", levelName);
                localStorage.setItem("levelsArr", JSON.stringify(levelsArr));
                $(".inStuck").html(levelsArr.length + "<br>" + localStorage.levelsArr);
                theQuestion = JSON.parse(localStorage.getItem(levelName));
                $("#feedbackPopup").popup("close");
                if (levelName != preLevelName)
                    localStorage.mistakeCounter = 0; //mistake counter to zero
                //if (localStorage.level != "null")
                //  toggleAnswer();
            }

            var text = "";
            //----------------------הודעת סיום-------------------------------
            if (theQuestion == 999) {
                localStorage.point = 999;
                localStorage.LM = 999;
                localStorage.level = 999;
                localStorage.quesID = 0;
                $("#userAnswer").parent().hide();
                $("#sendAnswer").hide();
                $("#scanQRBut2").show();
                $("#cantScanQr").show();
                text += putWord(136);
                text += ""
                $("#changeContentInMainDiv").html(text);
            }

            else {
                localStorage.point = theQuestion.point;
                localStorage.LM = theQuestion.LM;
                localStorage.level = theQuestion.level;
                localStorage.quesID = theQuestion.row.ID;
                var questionType = parseInt(theQuestion.row.type);
                if((questionType != 9) )
                    $("#askSkipPhotoTaskLi").hide();


                $(".userStatus").html(theQuestion.point + "|" + localStorage.LM + "|" + localStorage.level + "|" + localStorage.quesID + "</h5>");
                $(".LM").html(localStorage.LM);
                $(".level").html(localStorage.level);
                $(".quesID").html(localStorage.quesID);
                $(".point").html(theQuestion.point);
                $("#userAnswer").attr("type", "");
                
                //add timer for questions with timer define
                if (parseInt(theQuestion.row.p3) > 0) {
                    var intervalForQuesTimer = setInterval(function () {
                        if ($('#answerDiv').is(':hidden')) {
                            var d = new Date();
                            if (!isRefresh ||  !localStorage.getItem("questionShowTime"))
                                localStorage.setItem("questionShowTime", (d.getTime() / 1000));
                            stopAndClearQuestionsTimer();
                            /*clearTimeout(timerForQuestionsTimeout);
                            $("#questionsTimerDiv").remove();//removr old timers if exsists*/
                            clearInterval(intervalForQuesTimer);
                            setQuestionsTimer(theQuestion.row.p3);
                        }
                    }, 500);
                }
                    

                //----------------------סריקת ברקוד-------------------------------
                if(theQuestion.row.ID  == 1){
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").hide();
                    $("#scanQRBut2").show();
                    $("#cantScanQr").show();
                    if (localStorage.LM == 1) {
                           $("#changeContentInMainDiv").html(putWord(137)+" \"" + localStorage.navName +"\"!<br><br>"+putWord(138)+" " + theQuestion.point + 
                           ".<br>"+putWord(139)+"<br><br> ");
                    }
                    else {
                        $("#changeContentInMainDiv").html(putWord(140)+" " + theQuestion.point + "<br><br>"+putWord(141)+"<br><br> ");
                    }
                }
                //------------------סוג 1 שאלה אמריקאית - וסוג 5 אמרקאית עם סרטון------------------------------
                else if (questionType == 1 || questionType == 5) {
                    //$("#userAnswer").hide();
                    $("#userAnswer").parent().hide();$("#sendAnswer").show();$("#scanQRBut2").hide();
                    var arr = (theQuestion.row.p1).split(";");
                    if (theQuestion.row.right_answer == 0)
                        var rightAns = getRandomInt(1, (arr.length) - 1);
                    else if (theQuestion.row.right_answer == -1)//יצירת מקרה בו כל התשובות נכונות
                        var rightAns = 1;
                    else
                        var rightAns = theQuestion.row.right_answer;
                    var temp = arr[0];
                    arr[0] = arr[rightAns - 1];
                    arr[rightAns - 1] = temp;
                    text += theQuestion.row.main_text;

                    if (questionType == 5) {//תוספת סרטון
                        text += '<br><br><div style="text-align: center;"><iframe id="youTube" width="280" height="190" src="http://www.youtube.com/embed/' +
                        theQuestion.row.p2
                        + '?autoplay=1&showsearch=0&rel=0' + theQuestion.row.p3 + '" frameborder="0" allowfullscreen></iframe></div>';
                    }
                    
                    //add enter only if the end of the main_text is clen from br
                    var n = text.lastIndexOf("<br><br>");
                    if(n<0 || n <= (text.length-11))
                        text += '<br><br>';
                    //--
                    //text += '<ul id="mulAns" data-role="listview" data-inset="true" data-theme="a">';
                    text += theQuestion.row.after_text;
                    var n = theQuestion.row.after_text.lastIndexOf("<br><br>");
                    if ((n < 0 || n <= (text.length - 11)) && theQuestion.row.after_text.length >1)
                        text += '<br><br>';
                    //--

                    for (var j = 0; j < arr.length - 1; j++) {
                        if (arr[j] != "") {
                            if (arr[rightAns - 1] == arr[j])//שמירה על מספר התשובה כפי שנכתבה בבסיס הנתונים
                                var ansNum = 1;
                            else if (j == 0)
                                var ansNum = rightAns;
                            else
                                var ansNum = j + 1;
                            text += '<ul id="mulAns'+j+'" class="mulAns ui-alt-icon" data-role="listview" data-inset="true" data-theme="a" style="margin-top:10px;">';
                            text += '<li id="li' + j + '" data-icon="false"  class="ui-btn ui-shadow ui-corner-all "><a onclick="markAnswer(' + ansNum + ','+j+'); " href="#" style="white-space:normal" ><div class="mulAnsDiv" style="font-weight:bold;font-size:18px;padding:5px">' + arr[j] + '</div></a></li>'; //.= '<li class="answer" id="li'.$j.'" onclick="selectedBG(this);$(\'#theAnswer\').val('.$ansNum.')">'.$option[$j].'</li>';
                           // $( "li' + j + '" ).listview({theme: "b"});

                            text += '</ul><div style="height:10px"></div>';
                        }
                    }
                   
                    $("#changeContentInMainDiv").html(text);
                    $(".mulAns").listview();

                    if (questionType == 5) {//רק במקרה של סרטון
                        $(window).on("resize", YTresize);
                        YTresize();
                    }
                }
                //---------------סוג 2 שאלה פתוחה----------------------------------------
                else if (questionType == 2) {
                    //$("#userAnswer").show();
                    $("#userAnswer").parent().show();
                    $("#sendAnswer").show();
                    $("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    text = text.replace("[point]", theQuestion.point);
                    if (theQuestion.row.p1 != "")
                        text += '<br><img class="type2pic" src="'+baseUrl + '/A_images/' + theQuestion.row.p1 + '"><br>';
                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br>';
                    //--
                    text += theQuestion.row.after_text;

                    $("#changeContentInMainDiv").html(text);

                    //checkif we need a number keyboard
                    var patt1 = /[^0-9 |]/g;
                    if(patt1.test(theQuestion.row.right_answer)==false){
                        $("#userAnswer").attr("type", "tel");
                    }
                }
                //---------------סוג 3 שאלה פתוחה עם ספירת מילים----------------------------------------
                else if (questionType == 3) {
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").show();
                    $("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    text = text.replace("[point]", theQuestion.point);
                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br><br>';
                    //--
                    text += theQuestion.row.after_text;
                    text += '<textarea data-theme="a" id="type3TextArea" onchange=" $(\'#userAnswer\').val($(\'#type3TextArea\').val())" ></textarea>';
                    $("#changeContentInMainDiv").html(text);
                    $( "#type3TextArea" ).textinput();
                   
                }
                //---------------סוג 4 סרטון עם שאלה פתוחה----------------------------------------
                else if((questionType == 4) ){
                    if (theQuestion.row.p2 == -1){//סרטון ללא שאלה
                        $("#userAnswer").parent().hide();
                        $("#sendAnswer").hide();
                        var conBut = '<br><a id="continue" style=""  onclick="checkAnswer()" class="ui-btn ui-corner-all ui-shadow ui-btn-b">המשך...</a>';
                    }
                    else{
                        $("#userAnswer").parent().show();
                        $("#sendAnswer").show();
                        var conBut = '';
                    }

                    $("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    text = text.replace("[point]", theQuestion.point);
                    text += '<br><br><div style="text-align: center;"><iframe id="youTube" width="280" height="190" src="http://www.youtube.com/embed/'+ 
                        theQuestion.row.p1
                        + '?autoplay=1&showsearch=0&rel=0' + theQuestion.row.p3 + '" frameborder="0" allowfullscreen></iframe></div>';
                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br>';
                    //--
                    text += theQuestion.row.after_text;
                    text += conBut;
                    $("#changeContentInMainDiv").html(text);
                    $(window).on("resize", YTresize);
                    YTresize();
                    //checkif we need a number keyboard
                    var patt1 = /[^0-9 |]/g;
                    if(patt1.test(theQuestion.row.right_answer)==false){
                        $("#userAnswer").attr("type", "tel");
                    }
                }
                //---------------סוג 6 שאלות כן / לא----------------------------------------
                else if((questionType == 6) ){
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").hide();
                    $("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    if (parseInt(theQuestion.row.p2) > 0) {//טיימר
                        text += '<div id="yesNoQuesTimer"><img alt="timer" style="width: 30px;box-shadow: none;margin-bottom:0px;margin-bottom: -7px;margin-top: 5px;" src="images/timer_icon.png" /><br><a style="color:white" id="inYesNoQuesTimer">'+theQuestion.row.p2+'</a></div>';
                        
                        if ($("#answerDiv").is(":visible")) {// מריץ שעון רק לאחר לחיצה על המשך
                            $("#continueButton").click(function () {
                                runYesNoQuesTimer(0);
                                $("#continueButton").off("click");
                            });
                        }
                        else { //מקרה שאין לחיצה על המשך כמו רענון נתונים לדוגמא
                            runYesNoQuesTimer(0);
                        }
                    }
                    var arr = (theQuestion.row.p1).split(";");
                    var rightAnssrr = (theQuestion.row.right_answer).split(";")
                    for (var j = 0; j < arr.length - 1; j++) {
                        if (arr[j] != "") {
                            if (j==0)
                                text += '<div id="YesNoQues' + j + '" class="YesNoQues" data-role="listview">' + arr[j];
                            else 
                                text += '<div style="display:none" id="YesNoQues' + j + '" class="YesNoQues" data-role="listview">' + arr[j];
                            if (rightAnssrr[j] == 1)
                                text += '<br><br><div id="inYesNoQues' + j + '" class="inYesNoQues" dir="auto"><img onclick="yesNoQuesClick('+j+',false)" style="width:50px;box-shadow: none;" alt="no" src="images/X.png"/><div style="display:inline-block;width:100px"></div><img onclick="yesNoQuesClick('+j+',true)" style="width:50px;box-shadow: none;" alt="yes" src="images/V.png"/></div></div>';
                            else
                                text += '<br><br><div id="inYesNoQues' + j + '" class="inYesNoQues" dir="auto"><img onclick="yesNoQuesClick('+j+',true)" style="width:50px;box-shadow: none;" alt="no" src="images/X.png"/><div style="display:inline-block;width:100px"></div><img onclick="yesNoQuesClick('+j+',false)" style="width:50px;box-shadow: none;" alt="yes" src="images/V.png"/></div></div>';
                        }
                    }
                    
                    
                    text = text.replace("[point]", theQuestion.point);
                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br>';
                    //--
                    text += theQuestion.row.after_text;
                    $("#changeContentInMainDiv").html(text);
                }
                //---------------סוג 7 ברקוד גמיש לא דרך מזהה 1 ----------------------------------------
                else if(questionType  == 7){
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").hide();
                    $("#scanQRBut2").show();
                    $("#cantScanQr").show();
                    text += theQuestion.row.main_text;
                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br>';
                    //--
                    text += theQuestion.row.after_text;
                    text = text.replace("[point]", theQuestion.point);
                    $("#changeContentInMainDiv").html(text);
                }
                //---------------סוג 8 הצבעה עם מצפן ----------------------------------------
                else if(questionType  == 8){
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").hide();
                    $("#scanQRBut2").hide();
                    $("#cantScanQr").hide();
                    text += theQuestion.row.main_text;
                    text += '<br><br><div id="compasArrowDiv" onclick="checkAnswer();"></div>';
                    text += '<div id="heading" style=" font-size: 0.6em; text-shadow: none; color: rgb(77, 77, 77); position: relative; top: -5px;text-align:center ">Pending...</div>';
                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br>';
                    //--
                    text += theQuestion.row.after_text;
                    text = text.replace("[point]", theQuestion.point);
                    $("#changeContentInMainDiv").html(text);
                    startWatch();
                }
                //---------------סוג 9 צילום תמונה----------------------------------------
                else if((questionType == 9) ){
                    $("#askSkipPhotoTaskLi").show();
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").hide();
                    $("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    //text += '<br><br><a id="takePhoto" onclick="takePicture()" style="text-decoration: none" href="#"><input id="123" style="" type="button" data-icon="camera" data-theme="b" data-iconpos="left" value="putWord(142)"></a>';
                    text += '<div id="takePhotoDiv" style="padding-top: 30px;text-align:center"><div class="warpertakePhoto"  onclick="takePicture()" ><input id="takePhoto" type="button" data-icon="camera" data-theme="e" data-iconpos="left" value="'+putWord(142)+'">';
                    text += '</div><div class="warpertakePhoto"  onclick="takePictureFromGalery()"><input id="takePhotoFromGalery" type="button" data-icon="grid" data-theme="e" data-iconpos="left" value="'+putWord(247)+'"></div></div>';
                    text += '<div id="cameraPhotoDiv" style="display:none;text-align:center;padding-top: 30px;" ><img id="cameraPhoto" class="type2pic" src="css/images/ajax-loader.gif" style="height: 30px;width:30px;-webkit-box-shadow: none;" alt="'+putWord(113)+'"/></div>';
                    text += '<div class="didYouKnow" dir="auto" style="font-size:0.7em;">'+putWord(248)+'</div>';
                    text += '<div id="sendPic" style="display:none;padding-top: 15px;" ><a id="sendPicButton" onclick="sendPhoto()" class="ui-btn ui-corner-all ui-shadow ui-btn-b">'+putWord(143)+'</a></div>';
                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br>';
                    //--
                    text += theQuestion.row.after_text;
                    text = text.replace("[point]", theQuestion.point);
                    $("#changeContentInMainDiv").html(text);
                    $("#takePhoto").button();
                    $("#takePhotoFromGalery").button();
                    $("#takePhoto").button("refresh");
                    $("#takePhotoFromGalery").button("refresh");
                }
                //---------------סוג 10 מידע בלבד----------------------------------------
                else if((questionType == 10) ){
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").hide();
                    $("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br>';
                    //--
                    text += theQuestion.row.after_text;
                    if (theQuestion.row.p1 == 999) {
                        var myInterval = setInterval(function () {
                            if ($("#mainDiv").is(':visible')) {
                                finishGame(text ,putWord(144));
                                clearInterval(myInterval);
                            }
                        }, 1000);
                                    
                    }
                    else if(theQuestion.row.p1 != -1){
                        text += '<br><a id="continue" style=""  onclick="checkAnswer()" class="ui-btn ui-corner-all ui-shadow ui-btn-b">'+putWord(145)+'</a>';
                    }
                    text = text.replace("[point]", theQuestion.point);
                    $("#changeContentInMainDiv").html(text);

                }
                //---------------סוג 11 חיבור בין זוגות----------------------------------------
                else if (questionType == 11) {
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").show();$("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    var arr1 = (theQuestion.row.p1).split(";");
                    var arr2 = (theQuestion.row.p2).split(";");
                    var userAnswerVal = "";
                    
                    //add enter only if the end of the main_text is clen from br
                    var n = text.lastIndexOf("<br><br>");
                    if(n<0 || n <= (text.length-11))
                        text += '<br><br>';
                    

                    text += "<table style='margin:auto'><tr><td>";
                    for (var j = 1; j < Math.min(arr1.length,arr2.length) ; j++) {
                        text += '<ul id="couplesR'+j+'" class="mulAns ui-alt-icon" data-role="listview" data-inset="true" data-theme="a" style="margin-top:10px;border: rgba(0,0,0,0) solid 2px;">';
                        text += '<li id="liCouplesR' + j + '"  data-icon="false" style="z-index:1" class="ui-btn ui-shadow ui-corner-all "><a onclick="markAnswerFortype11('+j+',\'right\'); " href="#" style="white-space:normal;text-align:center" >' + arr1[j-1] + '</a></li>';
                        text += '</ul><div style="height:4px"></div>';
                        userAnswerVal += "-1;";
                    }
                    $("#userAnswer").val(userAnswerVal);
                    text += "</td><td style='width:20%'></td><td>";
                    //alert(Math.min(arr1.length,arr2.length));
                    for (var j = 1; j < Math.min(arr1.length,arr2.length) ; j++) {
                        text += '<ul id="couplesL'+j+'" class="mulAns ui-alt-icon" data-role="listview" data-inset="true" data-theme="a" style="margin-top:10px;border: rgba(0,0,0,0) solid 2px;">';
                        text += '<li id="liCouplesL' + j + '"  data-icon="false" style="z-index:1"  class="ui-btn ui-shadow ui-corner-all "><a onclick="markAnswerFortype11('+j+',\'left\'); " href="#" style="white-space:normal;text-align:center" >' + arr2[j-1] + '</a></li>';
                        text += '</ul><div style="height:4px"></div>';
                    }
                    text += "</td></tr></table>";

                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br>';
                    //--
                    text += theQuestion.row.after_text;
                   
                    $("#changeContentInMainDiv").html(text);
                    $(".mulAns").listview();

                    $( window ).on("resize", paintLineResize);//fix the lines whan window size changed

                }
                //---------------סוג 14 מיון של רשימה----------------------------------------
                else if (questionType == 14) {
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").show();$("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    var arr1 = (theQuestion.row.p1).split(";");
                    //add enter only if the end of the main_text is clen from br
                    var n = text.lastIndexOf("<br><br>");
                    if(n<0 || n <= (text.length-11))
                        text += '<br><br>';

                    text += '<ul id="sortable" style="position: relative;margin: auto">';
                    for (var j = 1; j < arr1.length ; j++) {
                        text += '<li value="'+j+'" class="ui-state-default">'+arr1[j-1]+'</li>';
                    }
                    text += '</ul>';

                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br>';
                    //--
                    text += theQuestion.row.after_text;
                   
                    $("#changeContentInMainDiv").html(text);
                    doSortable();

                }

                //--------חריג 101 - גימטרייה חלק א-------------------------------------------------------
                else if (questionType == 101) {
                    $("#userAnswer").parent().hide();
                    $("#sendAnswer").show();
                    $("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    text = text.replace("[point]", theQuestion.point);
                    var n = theQuestion.row.after_text.search("<br>");
                    if(n<0 || n <= 6)
                        text += '<br><br>';
                    //--
                    text += theQuestion.row.after_text;
                    text += '<textarea data-theme="a" id="type3TextArea" onchange=" $(\'#userAnswer\').val($(\'#type3TextArea\').val())" ></textarea>';
                    $("#changeContentInMainDiv").html(text);
                    $( "#type3TextArea" ).textinput();
                }
                //--------חריג 102 - גימטרייה חלק ב-------------------------------------------------------
                else if (questionType == 102) {
                if (localStorage.getItem("gematria") == null) {
                    jumpLevel(false, true); //קופץ במידה ואין גמטריה
                }
                else {
                    $("#userAnswer").parent().show();
                    $("#sendAnswer").show();
                    $("#scanQRBut2").hide();
                    text += theQuestion.row.main_text;
                    text = text.replace("[point]", theQuestion.point);
                    var n = theQuestion.row.after_text.search("<br>");
                    if (n < 0 || n <= 6)
                        text += '<br><br>';

                    text += theQuestion.row.after_text;
                    $("#changeContentInMainDiv").html(text);
                    $("#userAnswer").attr("type", "tel");
                }
                }
                //---------------------סוג שאלה שלא קיים-----------------------------------------
                else{
                    jumpLevel(false, true);
                }

                //remove previus level from local stoarge
                if (preLevelName && levelName != preLevelName)
                    localStorage.removeItem(preLevelName);

                refreshFromCache();

                 //show the questiob in the right context rtl or ltr
                if( theQuestion.row.direction == "ltr" || (theQuestion.row.ID == 1 && localStorage.getItem("language") != HEBREW && localStorage.getItem("language") != null )){ //ltr
                    $("#changeContentInMainDiv").css( "direction", "ltr");
                    $(".mulAnsDiv").css( "text-align", "left");
                }
                else{ //rtl
                    $("#changeContentInMainDiv").css( "direction", "rtl");
                    $(".mulAnsDiv").css( "text-align", "right");
                }
                    
                //prevent double click on buttons - because it make bug
                if ($("#continue, #sendPicButton").length > 0) {
                    $("#continue, #sendPicButton").click(
                    function (e) {
                        var a = $(this);
                        $(a).addClass('ui-state-disabled');
                        setTimeout(function () {
                            $(a).removeClass('ui-state-disabled');
                        }, 3000);

                    });
                }


            }
          
            //{"success":1,"LM":1,"level":2,"row":{"ID":"210","type":"1","category":"","sub_category":"","main_text":"","after_text":"","right_answer":"0","after_answer_text":"","p1":"","p2":"","p3":""}}
        }
    }

    function checkAnswer() {
        var d = new Date();
        var time = d.getTime() / 1000;
        if(theQuestion == 999 || !((theQuestion.row.type == 10) || ( (theQuestion.row.type == 4) && (theQuestion.row.p2 == -1) ) ) )
            toggleAnswer();
        if(theQuestion != 999)
            var questionType = parseInt(theQuestion.row.type);

        //$("#feedbackPopup-screen").removeClass("ui-screen-hidden");//מציג מסך שחור ללר חלון קופץ
        //$("#feedbackPopup-screen").css("opacity",0.5);//אפשר לעבוד על זה שיהיה יותר חלק
        //setTimeout("$('#lnkfeedbackPopup').click();",1000)//חלון קופץ רק לאחרי 1 שניות
        if (theQuestion == 999) {
            var arr = ($("#userAnswer").val()).split(";");
            if (arr[0] == 999) {
                $("#cantScanQr").hide();
                var get = sClean($("#userAnswer").val());
                var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(146);
                $('#inAnswerDiv').html("<h4>" + send + "<h4>");
                $('#continueButton').hide();
                addConnection(time, get, send, 999, 999, 0, 0);
                localStorage.gameFinished = true;
            }
            else{
                var get = sClean($("#userAnswer").val());
                if(arr.length > 1)
                    var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(147)+".<br><br><div style='display:inline;'>"+putWord(148)+"</div>" ;
                else
                    var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(147)+".<br><br><div style='display:inline;'>"+putWord(148)+"</div>" ;
                inAnswerDivSet(theQuestion, false, send);
                addConnection(time, get, send, -1, 0, 0, 0);
            }

        }
        //-------------------------------------barcode--------------------------
        else if (theQuestion.row.ID == 1){
            var arr = ($("#userAnswer").val()).split(";");
            if (arr[0] == theQuestion.code){
                 $("#cantScanQr").hide();
                var get = sClean($("#userAnswer").val());
                var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(149)+" "+theQuestion.point +" "+putWord(150);
                inAnswerDivSet(theQuestion, true, send);
                 addConnection(time, get, send, theQuestion.LM, theQuestion.level, 0, theQuestion.row.ID);
            }
            else{
                var get = sClean($("#userAnswer").val());
                if(arr.length > 1)
                    var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(147)+".<br><br><div id='"+arr[0]+"instead"+theQuestion.code+"' style='display:inline;'>("+putWord(151)+" "+theQuestion.point+")</div>" ;
                else
                    var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(147)+".<br><br><div id='"+arr[0]+"instead"+theQuestion.code+"' style='display:inline;'>("+putWord(151)+" "+theQuestion.point+")</div>" ;
                inAnswerDivSet(theQuestion, false, send);
                addConnection(time, get, send, -1, 0, 0, theQuestion.row.ID);
                //קריאה לשרת לבדוק מה השגיאה
                worngQRDetails(arr[0], theQuestion.code, theQuestion.LM, theQuestion.point );
            }
            
        }
        //-------------------------------------------------------------------------
        else if (questionType == 1 || questionType == 5) {
            var arr = (theQuestion.row.p1).split(";");
            if ($("#userAnswer").val() == 1 || theQuestion.row.right_answer == -1) {
                var get = sClean($("#userAnswer").val());
                var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(152);
                addConnection(time, arr[get - 1], send, theQuestion.LM, theQuestion.level, 0, theQuestion.row.ID);
                inAnswerDivSet(theQuestion, true, send);
                //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(145)</a>');
            }
            else if ($("#userAnswer").val() == "") {
                var send = "<br>"+putWord(153)+" <br>"+putWord(154);
                inAnswerDivSet(theQuestion, false, send);
                //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(155)</a>');
            }
            else {
                var get = sClean($("#userAnswer").val());
                var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(156)+" \"" + arr[0]+ "\".<br><br>";
                addMistake();
                addConnection(time, arr[get - 1], send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
                inAnswerDivSet(theQuestion, true, send);
                //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(145)</a>');
            }
        }
        //-----------------------------------------------------------------------
        else if (questionType == 2 || questionType == 4) {
            if (questionType == 4 && theQuestion.row.p2 == -1) {//סרט ללא שאלה
                $('#mainDiv').fadeToggle(500, function () { setTimeout("$('#mainDiv').fadeToggle(500);", 500) });
                var get = sClean("["+putWord(157)+"]");
                var send = "";
                addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
            }
            else {
                var pattern = new RegExp(theQuestion.row.right_answer, "ig");
                var found = pattern.test($("#userAnswer").val());
                if (found) {
                    var get = sClean($("#userAnswer").val());
                    var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(152);
                    addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
                    inAnswerDivSet(theQuestion, true, send);
                    //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(145)</a>');
                }
                else if ($("#userAnswer").val() == "") {
                    var send = putWord(158);
                    inAnswerDivSet(theQuestion, false, send);
                    //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(155)</a>');

                }
                else {
                    addMistake();
                    var get = sClean($("#userAnswer").val());
                    var arr = theQuestion.row.right_answer.split("|");
                    if (theQuestion.row.p2 > 0 && theQuestion.row.p2 < 100 && localStorage.mistakeCounter >= theQuestion.row.p2) {//to mach mistakes
                        var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(159)+": \"" + get + "\"<br><br>"+putWord(160)+" \"" + arr[0] + "\"";
                        send += "<h5>("+putWord(161)+" " + localStorage.mistakeCounter + ")</h5>";
                        inAnswerDivSet(theQuestion, true, send);
                        addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
                    }
                    else {//count mistakes
                        var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(159)+": \"" + get + "\"<br><br>"+putWord(162)+" ";
                        if (theQuestion.row.p2 > 0 && theQuestion.row.p2 < 100 && localStorage.mistakeCounter < theQuestion.row.p2) {
                            send += putWord(163)+" " + (parseInt(theQuestion.row.p2) - parseInt(localStorage.mistakeCounter)) + " "+putWord(164);
                        }
                        send += "<h5>("+putWord(161)+" " + localStorage.mistakeCounter + ")</h5>";
                        inAnswerDivSet(theQuestion, false, send);
                        //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(155)</a>');
                        addConnection(time, get, send, -2, 0, 0, theQuestion.row.ID);
                    }
                }
            }
        }
        //-----------------------------------------------------------------------
        else if (questionType == 3) {
            var rightAnsArr = (theQuestion.row.right_answer).split(";")
            var rightAnsCount= 0;
            for (var i = 0; i < rightAnsArr.length-1; i++) {
                var pattern = new RegExp(rightAnsArr[i], "ig");
                var found = pattern.test($("#userAnswer").val());
                if (found)
                    rightAnsCount++;
            }

            
            if (rightAnsCount >= parseInt(theQuestion.row.p1)) {
                var get = sClean($("#userAnswer").val());
                var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(152);
                addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
                inAnswerDivSet(theQuestion, true, send);
                //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(145)</a>');
            }
            else if ($("#userAnswer").val() == "") {
                var send = putWord(158);
                inAnswerDivSet(theQuestion, false, send);
                //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(155)</a>');

            }
            else {
                addMistake();
                var get = sClean($("#userAnswer").val());
                var theRightAns = "";
                for (var i = 0; i < rightAnsArr.length - 1; i++) {
                    var arr = rightAnsArr[i].split("|");
                    if (i==0)
                        theRightAns += arr[0];
                    else
                        theRightAns +=  ", " +arr[0] ;
                }
                if (theQuestion.row.p2 > 0 && theQuestion.row.p2 < 100 && localStorage.mistakeCounter >= theQuestion.row.p2) {//to mach mistakes
                    var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(165)+" " + rightAnsCount +" "+ putWord(166)+" "+theQuestion.row.p1 +"<br><br>"+putWord(167)+" \"" + theRightAns + "\"";
                    send += "<h5>("+putWord(161)+" " + localStorage.mistakeCounter + ")</h5>";
                    inAnswerDivSet(theQuestion, true, send);
                    addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
                }
                else {//count mistakes
                    var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(165)+" " + rightAnsCount +" " + putWord(166)+" "+theQuestion.row.p1 +"<br><br>"+putWord(162)+" ";
                    if (theQuestion.row.p2 > 0 && theQuestion.row.p2 < 100 && localStorage.mistakeCounter < theQuestion.row.p2) {
                        send += " " +putWord(163)+" " + (parseInt(theQuestion.row.p2) - parseInt(localStorage.mistakeCounter)) +" " + putWord(164);
                    }
                    send += "<h5>("+putWord(161)+" " + localStorage.mistakeCounter + ")</h5>";
                    inAnswerDivSet(theQuestion, false, send);
                    //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(155)</a>');
                    addConnection(time, get, send, -2, 0, 0, theQuestion.row.ID);
                }
            }
        }
        //-----------------------------------------------------------------------
        else if (questionType == 6){
            var rightAnssrr = (theQuestion.row.right_answer).split(";")
            var rightAnsCount =  (rightAnssrr.length-1) - parseInt(localStorage.mistakeCounter)
            if (rightAnsCount / (rightAnssrr.length - 1) <= 0.333) {
                var send = "<img src='images/X.png' id='VXimg'/><br><br>"
                send += putWord(168);
            }
            else if (rightAnsCount / (rightAnssrr.length - 1) <= 0.666) {
                var send = "<img src='images/V.png' id='VXimg'/><br><br>"
                send += putWord(169);
            }
            else {
                var send = "<img src='images/V.png' id='VXimg'/><br><br>"
                send += putWord(170);
            }

            send += " "+putWord(171)+" "+ rightAnsCount +" "+putWord(172)+" "+(rightAnssrr.length-1)+".";
            var get = $("#userAnswer").val();
            addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
            inAnswerDivSet(theQuestion, true, send);
            clearInterval(yesNoQuesTimerInterval);
            
        }
        //-----------------------------------------------------------------------
        else if (questionType == 7){
            var arr = ($("#userAnswer").val()).split(";");
            if (arr[0] == theQuestion.row.right_answer && theQuestion.row.right_answer != 999 ){
                 $("#cantScanQr").hide();
                var get = sClean($("#userAnswer").val());
                var send = "<img src='images/V.png' id='VXimg'/>";
                inAnswerDivSet(theQuestion, true, send);
                addConnection(time, get, send, theQuestion.LM, theQuestion.level, 0, theQuestion.row.ID);
            }
            else if (arr[0] == theQuestion.row.right_answer && theQuestion.row.right_answer == 999 ){//ברקוד סוף דינמי
                $("#cantScanQr").hide();
                var get = sClean($("#userAnswer").val());
                var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(146);
                $('#inAnswerDiv').html("<h4>" + send + "<h4>");
                $('#continueButton').hide();
                addConnection(time, get, send, 999, 999, 0, 0);
                localStorage.gameFinished = true;
                }
            
            else{
                var get = sClean($("#userAnswer").val());
                if(arr.length > 1)
                    var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(173)+"<br><br>";
                else
                    var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(174)+"<br><br>";
                inAnswerDivSet(theQuestion, false, send);
                addConnection(time, get, send, -1, 0, 0, theQuestion.row.ID);
            }
            
        }
        //-----------------------------------------------------------------------
        else if (questionType == 8){
            var arr = ($("#userAnswer").val()).split(";");
            var get = sClean($("#userAnswer").val());
            var min = parseInt(theQuestion.row.right_answer) - parseInt(theQuestion.row.p1);
            var max = parseInt(theQuestion.row.right_answer) + parseInt(theQuestion.row.p1);
            if (min<0)
                min = (min) + 360;
            if (max>360)
               max = (max) - 360;
            if((min>max && (arr[0] >= min || arr[0]<=max)) || (min<max && arr[0]>=min && arr[0]<=max)  ){
                var send = "<img src='images/V.png' id='VXimg'/>";
                send += "<br>"+putWord(175)+"<br><br><div style='display:none'> ("+putWord(176)+": "+min+" "+putWord(177)+": "+max+" "+putWord(178)+" "+ arr[0] + " "+putWord(179)+": "+theQuestion.row.right_answer+") </div> ";
                inAnswerDivSet(theQuestion, true, send);
                addConnection(time, get, send, theQuestion.LM, theQuestion.level, 0, theQuestion.row.ID);

            }
            else{
                var send = "<img src='images/X.png' id='VXimg'/>";
                send += "<br>"+putWord(180)+"<br><br><div style='display:none'> ("+putWord(176)+" "+min+" "+putWord(177)+" "+ max +" "+putWord(178)+" "+ arr[0] + " "+putWord(179)+": "+theQuestion.row.right_answer+") </div>";
                addMistake();
                inAnswerDivSet(theQuestion, true, send);
                addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
            }
            stopWatch();
        }
        //-----------------------------------------------------------------------
        else if (questionType == 9) {
            var d = new Date();var Y = d.getFullYear(); ;var n =  d.getMonth() + 1;var j = d.getDate();var picDate = Y + "-" + n + "-" + j;
            var picPath = baseUrl + "/A_usersUploads/" + picDate + "-nav" + localStorage.navID + "-ques" + theQuestion.row.ID + "-user" + localStorage.userID + ".jpg";
            var get = "<a href='" + picPath +"' target='_blank'><img src='" + picPath + "' style='height:75px'></a>";
            var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(181);
            addConnection(time, get, send, theQuestion.LM, theQuestion.level, 0, theQuestion.row.ID, questionType);
            inAnswerDivSet(theQuestion, true, send);
        }
        //-----------------------------------------------------------------------
        else if((questionType == 10) ){
                $('#mainDiv').fadeToggle(500, function () {setTimeout("$('#mainDiv').fadeToggle(500);",500) });
                if ($("#userAnswer").val() == "[TIME_OVER]") {
                    var get = "[TIME_OVER]";
                }
                else {
                    var get = "[DATE_READ]";
                }
                var send = "";
                addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
        }
        //-----------------------------------------------------------------------
        else if (questionType == 11){
            var rightAnsArr = (theQuestion.row.right_answer).split(";")
            var userAnsArr =  ($("#userAnswer").val())      .split(";");
            var rightAnsCount = 0;
            var showRightAns = "";
            if (userAnsArr.indexOf("-1") >= 0){
                var send = "<br>"+putWord(182)+" <br><br>"+putWord(183);
                inAnswerDivSet(theQuestion, false, send);
            }

            else{
                var arr1 = (theQuestion.row.p1).split(";");
                var arr2 = (theQuestion.row.p2).split(";");
                for (var i = 0; i < Math.min(rightAnsArr.length-1, userAnsArr.length-1); i++){
                    if (rightAnsArr[i] == userAnsArr[i])
                        rightAnsCount++;
                    else {
                        showRightAns += '<tr><td><ul class="mulAns ui-alt-icon" data-role="listview" data-disabled="true" data-inset="true" data-theme="c" style="margin-top:10px;">';
                        showRightAns += '<li data-icon="false" style="z-index:1" class="ui-btn ui-shadow ui-corner-all "><a href="#" style="white-space:normal" >' + arr1[i] + '</a></li>';
                        showRightAns += "</ul><div style='height:4px'></div></td>";//<td>"
                        showRightAns += '<td>+</td><td><ul class="mulAns ui-alt-icon" data-role="listview" data-disabled="true". data-inset="true" data-theme="c" style="margin-top:10px;">';
                        showRightAns += '<li data-icon="false" style="z-index:1" class="ui-btn ui-shadow ui-corner-all "><a href="#" style="white-space:normal" >' + arr2[rightAnsArr[i]-1] + '</a></li>';
                        showRightAns += '</ul><div style="height:4px"></div></td></tr>';
                           
                    }
                }
                    if (showRightAns != ""){
                        showRightAns = putWord(184)+"<br><br><table style='margin:auto'>" + showRightAns + "</table>";
                    }
                if (rightAnsCount / (rightAnsArr.length-1) <= 0.333)
                   var send = "<img src='images/X.png' id='VXimg'/><br>"+putWord(168)+" ";
                else if (rightAnsCount / (rightAnsArr.length-1) <= 0.666)
                   var send = "<img src='images/V.png' id='VXimg'/><br>"+putWord(169)+" ";
                else
                   var send = "<img src='images/V.png' id='VXimg'/><br>"+putWord(170)+" ";

               localStorage.mistakeCounter = Math.floor((rightAnsArr.length - 1 - rightAnsCount) / 2);

                send += putWord(171)+" "+ rightAnsCount +" "+putWord(185)+" "+(rightAnsArr.length-1)+".<br><br>"+showRightAns;


                var get = $("#userAnswer").val();
                addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
                inAnswerDivSet(theQuestion, true, send);
                $(".mulAns").listview();
                $( window ).off("resize", paintLineResize);//off the fix the lines whan window size changed
            }
        }
        //-----------------------------------------------------------------------
        else if (questionType == 14){
            var rightAnsArr = (theQuestion.row.right_answer).split(";")
            var userAnsArr =  ($("#userAnswer").val()).split(";");
            var rightAnsCount = 0;
            var showRightAns = "";
            if ($("#userAnswer").val() == ""){
                var send = "<br>"+putWord(186)+"<br><br>"+putWord(187);
                inAnswerDivSet(theQuestion, false, send);
            }

            else{
                var arr1 = (theQuestion.row.p1).split(";");
                showRightAns += '<ul id="sortable" style="position: relative;margin: auto">';

                for (var i = 0; i < rightAnsArr.length-1; i++){
                    if (rightAnsArr[i] == userAnsArr[i])
                        rightAnsCount++;
                    showRightAns += '<li value="'+i+'" class="ui-state-default">'+arr1[rightAnsArr[i]-1]+'</li>';
                }

                showRightAns += '</ul>';
                showRightAns = putWord(188)+"<br><br><table style='margin:auto'>" + showRightAns + "</table>";
                
                if (rightAnsCount / (rightAnsArr.length - 1) <= 0.333)
                    var send = "<img src='images/X.png' id='VXimg'/><br>"+putWord(168);
                else if (rightAnsCount / (rightAnsArr.length - 1) <= 0.666)
                    var send = "<img src='images/V.png' id='VXimg'/><br>"+putWord(169);
                else {
                    var send = "<img src='images/V.png' id='VXimg'/><br>"+putWord(170);
                    showRightAns = "";
                }

               localStorage.mistakeCounter = Math.floor((rightAnsArr.length - 1 - rightAnsCount) / 2);

                send += " "+putWord(171)+" "+ rightAnsCount +" "+putWord(172)+" "+(rightAnsArr.length-1)+".<br><br>"+showRightAns;


                var get = $("#userAnswer").val();
                addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
                inAnswerDivSet(theQuestion, true, send);
           
            }
        }
        //-----------------------------------------------------------------------
        else if (questionType == 101){
            if ($("#userAnswer").val() == "") {
                var send = putWord(158);
                inAnswerDivSet(theQuestion, false, send);
                //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(15</a>');

            }
            else {
                var get = sClean($("#userAnswer").val());
                var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(189);
                localStorage.setItem("gematria", doGematria(get));
                addConnection(time, get, send, theQuestion.LM, theQuestion.level, 0, theQuestion.row.ID);
                inAnswerDivSet(theQuestion, true, send);
            }
        }
        //-----------------------------------------------------------------------
        else if (questionType == 102){
            if ($("#userAnswer").val() == "") {
                var send =putWord(158);
                inAnswerDivSet(theQuestion, false, send);
                //$('#inAnswerDiv').html("<h4>" + send + "<h4>" + '<a id="continueButton" onclick="toggleAnswer();" class="ui-btn ui-corner-all ui-shadow ui-btn-b">putWord(155)</a>');

            }
            else {
                var get = sClean($("#userAnswer").val());
                var rightAns = parseInt(localStorage.getItem("gematria"));
                var userAns = parseInt(get);
                localStorage.removeItem("gematria");
                var diff = Math.abs(rightAns - userAns);
                if (diff == 0) {
                    var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(190);
                    addConnection(time, get, send, theQuestion.LM, theQuestion.level, 0, theQuestion.row.ID);
                }
                else if(diff <= 100){
                    var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(191)+" " + diff + " "+putWord(192);
                    send += "<h5>("+putWord(193)+" " + rightAns + ")</h5>";
                    addMistake();
                    addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
                }
                else{
                    var send = "<img src='images/X.png' id='VXimg'/><br><br>"+putWord(194)+" " + diff + " "+putWord(192);
                    send += "<h5>("+putWord(193)+" " + rightAns + ")</h5>";
                    addMistake(2);
                    addConnection(time, get, send, theQuestion.LM, theQuestion.level, localStorage.mistakeCounter, theQuestion.row.ID);
                }
                inAnswerDivSet(theQuestion, true, send);
            }
        }
        
        refreshFromCache();
    }

  
    //this function aend ajax request that checked what is the mistake of the wrong barcode, if the barcode in the route of the user or not, if the barcode belong to the game
    //the deaties will be showen in "inAnswerDiv" at specific div
    function  worngQRDetails(wrongQR, rightQR, LM, point){
        
        var jqxhr = $.post(baseUrl + "/A_import_files/questionActionV2.php", { action: "worngQRDetails", navID: localStorage.navID, route: localStorage.routeNum, worngQR: wrongQR});

        jqxhr.done(function (data, status) {
            
            var dataArr = JSON.parse(data);
            if (dataArr["success"] == 1) {
                if (dataArr['QRBelongsTo'] == -1)
                    $("#" + wrongQR + "instead" + rightQR).html("("+putWord(195)+" " + point + ")");
                else if (dataArr['QRBelongsTo'] != -1 && dataArr['wrongQRLM'] == -1)
                    $("#" + wrongQR + "instead" + rightQR).html("("+putWord(196)+" " + dataArr['QRBelongsTo'] + " "+putWord(197)+" <br>"+ putWord(198)+" " + point + "!)");
                else {
                    var distance = (dataArr['wrongQRLM'] - LM);
                    $("#" + wrongQR + "instead" + rightQR).html("("+putWord(196)+" " + dataArr['QRBelongsTo'] + ". <br>"+ putWord(198)+" " + point + "!)");
                    //alert(distance);
                    if (distance > 0)
                        setTimeout(function () { $("#" + wrongQR + "instead" + rightQR).append('<br><a id="jumpLM" onclick="askIfDataRefresh(true,' + dataArr['wrongQRLM'] + ', 2);" class="ui-btn ui-corner-all ui-shadow ui-btn-a">'+putWord(199)+' ' + dataArr['QRBelongsTo'] + '</a>'); }, 30000);
                    else
                        setTimeout(function () { $("#" + wrongQR + "instead" + rightQR).append('<br><a id="jumpLM" onclick="askIfDataRefresh(true,' + dataArr['wrongQRLM'] + ', 2);" class="ui-btn ui-corner-all ui-shadow ui-btn-a">'+putWord(200)+' ' + dataArr['QRBelongsTo'] + '</a>'); }, 30000);
                }
            }
        });
        jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
            console.log("worngQRDetails error because: " + textStatus + ", " + errorThrown);
        });

        
    }


    function askIfDataRefresh(isFromServer, LM, level) {
        if (navigator.notification) {
            navigator.notification.confirm(
            putWord(201),  // message
                function (i) {
                    if (i == 2) {
                        dataRefresh(isFromServer, LM, level);
                        toggleAnswer();
                    };
                },  // callback to invoke with index of button pressed
                putWord(202),            // title
                [putWord(203),putWord(106)]          // buttonLabels
                );
        }
        else {
            dataRefresh(isFromServer, LM, level);
            toggleAnswer();
        }
    }

   function endOfGmaeAlert() {
        if (navigator.notification) {
            navigator.notification.confirm(
               putWord(204),  // message
                function (i) {
                    if (i == 2) {
                        var ref1 = window.open('http://facebook.com/NivutSms', '_system', 'location=yes');
                        var ref2 = window.open('fb://page/180296165326371', '_system', 'location=yes');
                    };
                },  // callback to invoke with index of button pressed
                putWord(205),            // title
                [putWord(207), putWord(206)]          // buttonLabels
                );
        }
    }


    //remov navgition from the phone - this function removes all tha localStorage and refresh the page
    function removNav() {
        if (navigator.notification) {
            navigator.notification.confirm(
               putWord(208),  // message
                function (i) {
                    if (i == 2) {
                        localStorage.clear();
                        window.location.reload();
                    };
                },  // callback to invoke with index of button pressed
               putWord(209),            // title
                [putWord(203), putWord(106)]          // buttonLabels
                );
        }
        else {
            var n1 = localStorage.fName;
            var n2 = localStorage.lName;
            var n3 = localStorage.phone;
            localStorage.clear();
            localStorage.fName = n1;
            localStorage.lName = n2;
            localStorage.phone = n3;
            location.reload();
        }
    }
    //----------------------ConnectionS can be in other file in the fueter----------------------

    //object to connection table
    function Connection(date, get, send, LM, level, mistakes, quesID) {
        this.date = date;
        this.get = get;
        this.send = send;
        this.LM = LM;
        this.level = level;
        this.mistakes = mistakes;
        this.quesID = quesID;
        this.received = 0;
    }

    //checked received to 1 - if connection received at server
    function connectionReceived(connectionNum) {
        connection_table[connectionNum].received = 1;
        localStorage.setItem("connection_table", JSON.stringify(connection_table));
        //alert(connectionNum + " - "+    connection_table[connectionNum].received);
    }

    function sendNotReceivedConnection() {
        var l = connection_table.length;
        for (i = 0; i < l; i++) {
            if (connection_table[i].received == 0)
                myQueue.addToQueue(2, { action: "addConnection", userID: localStorage.userID, connection: connection_table[i], connectionNum: (i) });
        }
    }

    //add object to connection table. date need to be in second NOT in miliseconds
    function addConnection(date, get, send, LM, level, mistakes, quesID, type) {
        //cancel on test mode
        if(QueryString["istest"])
            return 0;

        if (LM != -4 && type != 9) {//special for location to send json array
            get = sClean(get, true);
        }
        send = sClean(send, true);

        var a = new Connection(date, get, send, LM, level, mistakes, quesID);
        var l = connection_table.push(a);
        localStorage.setItem("connection_table", JSON.stringify(connection_table));
        //count the totale mistakes in the game
        localStorage.totalMistakeCounter =  parseInt(localStorage.totalMistakeCounter) + parseInt(mistakes);
        
        if (LM > 0 && LM !=999) {
            if (!localStorage.endOfLoadQuestion)
                askForQuestion((parseInt(localStorage.memory) + 1));
            setTimeout(function () {
                var text = '<img alt="pic1" src="images/logo_opacity.png" style="width: 200px;-webkit-box-shadow:none;margin: auto;display: block;margin-bottom: 20px"/>' + "<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;width: 30px;-webkit-box-shadow:none;\" alt=\""+putWord(113)+"\"/> <br>"+putWord(210)+"<br>"+putWord(211)+"<br><br>"+putWord(212);
                $("#sendAnswer").hide();
                $("#userAnswer").parent().hide();
                $("#changeContentInMainDiv").html(text);
                showNextQuestion();
            }, 1000)//go forwerd after the animation
        }
        if (LM != 0) {
            myQueue.addToQueue(2, { action: "addConnection", userID: localStorage.userID, connection: connection_table[l - 1], connectionNum: (l - 1) });
        }
        if (LM == 999){
            $('#backInFeedbackPopup').hide();
            $('#lnkfeedbackPopup').click();
            $('#inFeedbackPopup').html("<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\""+'מעדכן נתונים'+"\"/><br><h4>"+putWord(249)+"</h4>");    
            setTimeout(function (){
                $('#lnkfeedbackPopup').click();
                }, 1000);
            
            var finishInterval = setInterval(function () {
                if (myQueue.isEmpty(2)) {
                    $("#feedbackPopup").popup("close");
                    setTimeout('audio[FINISHGAME].play()', 500)//play sound;
                    setTimeout("endOfGmaeAlert()", 10000);
                    localStorage.finishTime = date;
                    clearInterval(finishInterval);
                }
            }, 1000)
            
        }
    }


    //function to change the app to the old version
    function goToOldVersion() {
        /*
        if (typeof (StatusBar) != "undefined" && Dplatform != "iOS")
            StatusBar.show();*/
        localStorage.needToRefresh = 1;
        location.href = "oldVersion/way-to-go-14.4/index.html";
    }

    //this function check if we are during a game if we are go to the game (In addition checking uf the game in the new/old version)
    function isDuringeGame() {
        var d = new Date(); var nowTime = Math.round(d.getTime() / 1000); var startTime = parseInt(localStorage.getItem("startTime"));
        if (localStorage.getItem("oldVersion") == "true" && localStorage.getItem("userID") > 0 && startTime > 0) {
            var ff = (startTime + (3600 * HOURSFORGAME));
            if (startTime + (3600 * HOURSFORGAME) > nowTime) {
                goToOldVersion();
            }
        }

        else if (localStorage.getItem("userID") > 0 && startTime > 0 && !localStorage.gameFinished) {
            if (startTime + (3600 * HOURSFORGAME) > nowTime) {
                //alert("resume game in new version"); //debug nedd to be function the go back to the game in the new version

                /*move screen from start to game runing*/
                $("#gate").hide(); $("#backHeaderButton").removeClass("ui-icon-info");$("#backHeaderButton").addClass("ui-icon-user"); $("#cantScanQr").hide(); $("#registerDiv").hide(); $("#resisterSave").hide(); $("#resisterContinue").hide();
                $("#resisterStart").hide(); $("#routeInputDiv").hide(); $("#passInputDiv").hide(); $("#cantScanQr").hide(); $("#passwordDiv").hide(); $("#mainDiv").fadeIn();
                /*-------------*/
                pageInView = 4;
                /*view update*/
                $(".userID").html(localStorage.userID); $(".navID").html(localStorage.navID); $(".memory").html(localStorage.memory); $(".routeNum").html(localStorage.routeNum);
                var d = new Date(parseInt(localStorage.startTime) * 1000); $(".startTime").html(d.toLocaleString());
                $(".userName").html(localStorage.fName + " " + localStorage.lName); $(".LM").html(localStorage.LM); $(".level").html(localStorage.level); $(".quesID").html(localStorage.quesID); $(".point").html(localStorage.point); $(".navName").html(localStorage.navName +" ("+localStorage.navID+")");
                $(".userStatus").html(localStorage.point + "|" + localStorage.LM + "|" + localStorage.level + "|" + localStorage.quesID + "</h5>");
                setEnterEvent("#userAnswer","#sendAnswer");

                /*var update*/
                navID = localStorage.navID;
                routeNum = localStorage.routeNum;
                levelsArr = JSON.parse(localStorage.levelsArr);
                $(".only_on_nav_runing").show();
                var checkForCommandsInterval = setInterval("checkForCommands()", SECONDS_FOR_CHECK_COMMAND * 1000); //check for commend from the server evrey SECONDS_FOR_CHECK_COMMAND seconds
                showNextQuestion(true);
                runCom(myQueue);
                if(localStorage.backToNewVersion == 1){
                    myQueue.addToQueue(0, { action: "getNextLevel", userID: localStorage.userID });
                }
                //show in all img the cach file

                refreshFromCache();
                setTimeout('refreshFromCache()',2000);
                setTimeout('$.mobile.resetActivePageHeight();', 2500);
                setTimeout('refreshFromCache()',4000);
                setTimeout('$.mobile.resetActivePageHeight();', 4500);
            }
        }
        else
        {
            runCom(myQueue);//למקרה שנשארו נתונים לאחר סיום משחק
        }
    };



    //---- this finctions are build for preview in the builder system--------------------------
    //functionn to test question via the builder
    function testQuestion(quesID) {
        /*move screen from start to game runing*/
        localStorage.clear();
        $("#gate").hide(); $("#backHeaderButton").removeClass("ui-icon-info");$("#backHeaderButton").addClass("ui-icon-user");; $("#cantScanQr").hide(); $("#registerDiv").hide(); $("#resisterSave").hide(); $("#resisterContinue").hide();
        $("#resisterStart").hide(); $("#routeInputDiv").hide(); $("#passInputDiv").hide(); $("#cantScanQr").hide(); $("#passwordDiv").hide(); $("#mainDiv").fadeIn();
        /*-------------*/
        pageInView = 4;
        askForQuestionForTest(quesID);
        showNextQuestion(true);
        localStorage.clear();
    }

    function askForQuestionForTest(n) {
        var point = getUrlParameter('point');
        if (point)
            myQueue.addToQueue(0, { action: "getQuestionForTest", quesID: n, pass: QueryString["pass"], point: point});
        else
            myQueue.addToQueue(0, { action: "getQuestionForTest", quesID: n, pass: QueryString["pass"]});
    }

    var QueryString = function () {
      // This function is anonymous, is executed immediately and 
      // the return value is assigned to QueryString!
      var query_string = {};
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
            // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
          query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
          query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
      } 
        return query_string;
    }();
    //---- EF this finctions are buikd for preview in the builder system--------------------------
    
    function chosePicToBG() {
        if (window.innerHeight > window.innerWidth) {
            $("#backgroundImage").attr("src", "images/bg_p.png");
        }
        else {
            $("#backgroundImage").attr("src", "images/bg_l.png");
        }
    }

    //function to skip scanner with keyboard
    function cantScanQr() {
        if (pageInView != 4) {//barcode on the open screen - nav id
            $('#inFeedbackPopup').html('<br><h3>'+putWord(213)+'</h3><br><input class="register text" style="height: 35px;border-radius: 5px;width: 65px;" id="navIDInput" type="tel" name="navIDInput" value="" placeholder="" data-theme="b"><br><br><a id="sendNavID" onclick="manualNavID()" class="ui-btn ui-corner-all ui-shadow ui-btn-b">'+putWord(214)+'</a><br>');
            $('#backInFeedbackPopup').show();
            $('#lnkfeedbackPopup').click();
            setEnterEvent("#navIDInput","#sendNavID");
        }
        else {
            $('#inFeedbackPopup').html('<br><h3>'+putWord(215)+'</h3><br><input onchange="$(\'#userAnswer\').val($(this).val()+\';[manual barcode input];\')" class="register text" style="height: 35px;border-radius: 5px;width: 65px;" id="codeInput" type="tel" name="codeInput" value="" placeholder="" data-theme="b"><br><br><a id="sendCode" onclick="checkAnswer(); $(\'#feedbackPopup\').popup(\'close\');" class="ui-btn ui-corner-all ui-shadow ui-btn-b">'+putWord(214)+'</a>('+putWord(217)+')');
            setEnterEvent("#codeInput","#sendCode");
            $('#backInFeedbackPopup').show();
            $('#lnkfeedbackPopup').click();
        }


        //חידוש של האוונט כיוון שיש אינפוטים חדשים
        /*
        if (typeof StatusBar !== 'undefined') {//מונע באג בהרצה על המחשב
        $("input.text").off("blur");
        $("input.text").off("focus");
        var statusBarTimout;
        $("input.text").focus(function () {
                clearTimeout(statusBarTimout);
                setTimeout("StatusBar.show()",200);
                });
        $("input.text").blur(function () {
                clearTimeout(statusBarTimout);
                setTimeout("StatusBar.show()",500);
                statusBarTimout = setTimeout("StatusBar.hide()",1000);
                });
        StatusBar.hide();
        }*/

    }

    //helper function to skip scanner with keyboard
    function manualNavID() {
        $('#backInFeedbackPopup').hide();
        startsNavRegister('navID=' + sClean($('#navIDInput').val()), 'manual');
    }

    function toggleAnswer() {
        if ($('#answerDiv').is(':hidden')) {
            $('#mainDiv').fadeToggle(200, function () { $('#answerDiv').fadeToggle(200); });
        }
        else {
            $('#answerDiv').fadeToggle(200, function () { $('#mainDiv').fadeToggle(200); });
        }
        
        $("html, body").animate({ scrollTop: 0 }, 400);//scrool to top
        //fix the page height
        setTimeout('$.mobile.resetActivePageHeight();', 1000);
    }

    //---this function add a copy of a console on the developerDiv...--//
    var originalConsole = console;
    var console = new expandConsole();
    function expandConsole() {
        this.log = function (x) {
            //time
            var currentdate = new Date();
            var datetime = currentdate.toLocaleTimeString();
            //time

            if (localStorage.consoleText == null || localStorage.consoleText == 'null')
                localStorage.consoleText = "[" + datetime + "] " + x + "\n";
            else
                localStorage.consoleText = "[" + datetime + "] " + x + "\n" + localStorage.consoleText;
            originalConsole.log(x);
        };

    }

    //this function showes consol text on developerDiv
    function showConsoleText(){
        if (localStorage.consoleText == null || localStorage.consoleText == 'null') {
            $('#console').html('');
        }
        else
            $('#console').html(localStorage.consoleText.replace(/\n/g, "<br>"));
    }

    //send 3 last location of the user, need accuracy of 25 meters At least for each location, param isFromServer meens if the command arivved from server request
    var watchID;
    var locationArr = [];
    var locationInterval;
    var locationTimout;
    function sendLocation(isFromServer) {
        var timeBetweenLocation = 10; //in seconds
        var inHtml = '<img alt="pic1" src="images/logo_opacity.png" style="width: 200px;   margin: auto;display: block;margin-bottom: 20px"/>' + "<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\""+putWord(113)+"\"/><h4>"+putWord(218)+"<br><br>"+putWord(219)+"</h4><br><div id='acc'></div><br>" +
                '<a id="sendAnswer" onclick="cancelSendLocation()" class="ui-btn ui-corner-all ui-shadow ui-btn-b">'+putWord(222)+'</a>';
        setTimeout('$("#feedbackPopup").popup("open");', 1000);
        //$("#feedbackPopup").popup("open");
        $('#inFeedbackPopup').html(inHtml);
        var d = new Date();
        var time = d.getTime() / 1000;
        locationArr = [];
        locationTimout = setTimeout("cancelSendLocation();console.log('canceled after 2 minutes - to mach time for location')", 120000)
        var onGeolocationSuccess = function (position) {
            $('#acc').html("accuracy: " + position.coords.accuracy);
            var d2 = new Date();
            var time2 = d2.getTime() / 1000;
            if (position.coords.accuracy <= 25) {
                var myPosition = {
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
                //var loc = JSON.stringify(myPosition);
                if (locationArr.length == 0 || ((locationArr[locationArr.length - 1]["time"]) + timeBetweenLocation) < time2) {
                    var i = locationArr.push(myPosition);
                    console.log("we have " + i + " location");
                    var inHtml = '<img alt="pic1" src="images/logo_opacity.png" style="width: 200px;   margin: auto;display: block;margin-bottom: 20px"/>' + "<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;\" alt=\""+putWord(113)+"\"/><h4>"+putWord(218)+".<br><br>"+putWord(220)+" " + i + " "+putWord(221)+"</h4><br><div id='acc'></div><br>" +
                '<a id="sendAnswer" onclick="cancelSendLocation()" class="ui-btn ui-corner-all ui-shadow ui-btn-b">'+putWord(222)+'</a>';
                    $('#inFeedbackPopup').html(inHtml);
                }
                else {
                }

                if (i == 3) {
                    clearInterval(locationInterval);
                    clearTimeout(locationTimout);
                    navigator.geolocation.clearWatch(watchID);
                    console.log("watch location stoped");
                    var send = JSON.stringify(locationArr);
                    if (isFromServer == true)
                        addConnection(time, send, " [Success - from server]", -4, 0, 0, 0);
                    else
                        addConnection(time, send, "[Success - from user]", -4, 0, 0, 0);
                    console.log("Send location success");
                    var inHtml = '<img alt="pic1" src="images/logo_opacity.png" style="width: 200px;   margin: auto;display: block;margin-bottom: 20px"/>' + "<h4>"+putWord(223)+"</h4><br>";
                    setTimeout('$("#feedbackPopup").popup("close");', 5000);
                    $('#inFeedbackPopup').html(inHtml);
                }
            }

        }
        var onGeolocationError = function (error) {
            var send = JSON.stringify(error);
            if (isFromServer == true)
                addConnection(time, 'code: ' + error.code + 'message: ' + error.message, " [Error - from server]", -3, 0, 0, 0);
            else
                addConnection(time, 'code: ' + error.code + 'message: ' + error.message, " [Error - from user]", -3, 0, 0, 0);
            console.log("Send location failed");
        }
        locationInterval = setInterval(function () {
            navigator.geolocation.clearWatch(watchID);
            watchID = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, { maximumAge: timeBetweenLocation * 1000, enableHighAccuracy: true });
        }, 5000);

    }

    //helper function to cancel the SendLocation()
    function cancelSendLocation() {
        clearInterval(locationInterval);
        clearTimeout(locationTimout);
        navigator.geolocation.clearWatch(watchID);
        console.log("watch location stoped");
        $("#feedbackPopup").popup("close");
    }

    //function to refresh data on the user phone. reload all the question again from the server
    function dataRefresh(isFromServer, LM, level, refreshTrackingView) {
        //cancel on test mode
        if(QueryString["istest"])
            return 0;
        var d = new Date();
        var time = d.getTime() / 1000;
        
        //send refresh command to the trackingTable
        var putRefreshTrackingView = "";
        if (refreshTrackingView == true)
            putRefreshTrackingView = "[doRefresh]";
        //

        if (isFromServer) {
            if (LM == "")
                LM = localStorage.LM;

            if (level == "")
                level = localStorage.level;

            var a = new Connection(time, "[התבצע רענון נתונים - בקשה מהשרת. תחנה:" +" "+ localStorage.LM + ", " + "שלב"+": " + localStorage.level +" "+ ". מועבר ל-> תחנה"+": " + LM +", "+"שלב"+": " + level +"]", putRefreshTrackingView, -1, 0, 0, 0);
            console.log("data refresed from server. LM: " + localStorage.LM + ", level: " + localStorage.level + " becom to -> LM: " + LM + ", level: " + level);
            //alert("lm:" + LM + " lev: " + level);
            if (LM >= 0)
                localStorage.setItem("LM", LM);
            if (level >= 0)
                localStorage.setItem("level", level);
        }
        else {
            var a = new Connection(time, "[התבצע רענון נתונים - בקשה מהמשתמש.  תחנה:" +" "+ localStorage.LM + ", "+ "שלב" +" "+ localStorage.level +"]", putRefreshTrackingView, -1, 0, 0, 0);
            console.log("data refresed from user. LM: " + localStorage.LM + ", level: " + localStorage.level);
            if(localStorage.LM == 999 && localStorage.level == 999){
                return;
            }
        }
        
        //claer question timer
        stopAndClearQuestionsTimer();
        /*clearTimeout(timerForQuestionsTimeout);
        audio[CLOCK].pause();*/

        var l = connection_table.push(a);
        localStorage.setItem("connection_table", JSON.stringify(connection_table));
        //addConnection(time, putWord(227)  + localStorage.LM + ","+putWord(220)+":"+localStorage.level  , "", -3,0,0,0);
        localStorage.removeItem("prior");
        myQueue = new makeQueue(NUMOFPRIORITYS); //propryty queue withe 4 levels
        var text = '<img alt="pic1" src="images/logo_opacity.png" style="width: 200px;-webkit-box-shadow:none;margin: auto;display: block;margin-bottom: 20px"/>' + "<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;width: 30px;-webkit-box-shadow:none;\" alt=\""+putWord(113)+"\"/> <br>"+putWord(210)+"<br>"+putWord(211)+"<br><br>"+putWord(212);
        $("#sendAnswer").hide();
        $("#userAnswer").parent().hide();
        $("#scanQRBut2").hide();
        $("#cantScanQr").hide();
        $('#answerDiv').hide();
        $('#mainDiv').show();
        $("#changeContentInMainDiv").html(text);
        localStorage.removeItem('endOfLoadQuestion');//remove 'endOfLoadQuestion' if exsist to enable continue
        removQuestions();
        //abort ajax process if exist an not  DONE-4
        if(jqxhr && jqxhr.readyState != 4){
            jqxhr.abort();
        }
        showNextQuestion(true);


        sendNotReceivedConnection();


        for (var i = 0; i <= parseInt(localStorage.memory); i++) {
            askForQuestion(i);
        }

    }

    function removQuestions() {
        localStorage.removeItem("LM" + localStorage.LM + "l" + localStorage.level);
        var levelName = levelsArr.shift();
        while (levelName && typeof (levelName) != "undefined") {
            localStorage.removeItem(levelName);
            levelName = levelsArr.shift()
        }
        localStorage.setItem("levelsArr", JSON.stringify(levelsArr));
    }

    //this function check for commands from the server 
   function checkForCommands() {
        var jqxhr = $.post(baseUrl + "/A_import_files/questionActionV2.php", { action: "checkForCommands", userID: localStorage.userID });

        jqxhr.done(function (data, status) {
            var dataArr = JSON.parse(data);
            if (dataArr["success"] == 1) {
                if (dataArr["isCommand"] == 1) {
                    //var comArr = JSON.parse(dataArr['command']);
                    for (var i = 0; i < dataArr['command'].length; i++) {
                        if (dataArr['command'][i]["c"] == "DR") {//data refresh
                            if (dataArr['command'][i]["p1"] == 999) {
                                $('#backInFeedbackPopup').hide();
                                $('#mainDiv').hide();
                                $('#answerDiv').show();
                                var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(146);
                                $('#inAnswerDiv').html("<h4>" + send + "<h4>");
                                $('#continueButton').hide();
                                finishGame("[סיום משחק - עקב בקשה מהשרת]", "[סיום משחק - עקב בקשה מהשרת]");
                            }
                            else {
                                dataRefresh(true, dataArr['command'][i]["p1"], dataArr['command'][i]["p2"]);
                            }
                        }
                        else if (dataArr['command'][i]["c"] == "SL") {//send location
                            sendLocation(true);
                            var d = new Date();
                            var time = d.getTime() / 1000;
                            addConnection(time, putWord(228), "", -3, 0, 0, 0);
                        }
                        else if (dataArr['command'][i]["c"] == "JU") {//עדכוו java
                            checkForFixes();
                            var d = new Date();
                            var time = d.getTime() / 1000;
                            addConnection(time, putWord(229), "", -3, 0, 0, 0);
                        }
                        else if (dataArr['command'][i]["c"] == "SM") {//שליחת הודעה
                            var d = new Date();
                            var time = d.getTime() / 1000;
                            $("#inMassagePopup").html("<h3>" + dataArr['command'][i]["p1"] + "</h3>");
                            $("#massagePopup").popup("open");
                            addConnection(time, putWord(230) + "/" + dataArr['command'][i]["p1"] + "\"", "", -3, 0, 0, 0);
                        }
                        else if (dataArr['command'][i]["c"] == "CRO") {//עדכון מספר מסלול
                            localStorage.routeNum = dataArr['command'][i]["p1"];
                            routeNum = dataArr['command'][i]["p1"];
                            var d = new Date();
                            var time = d.getTime() / 1000;
                            addConnection(time, putWord(231) + " \"" + dataArr['command'][i]["p1"] + "\"", "", -3, 0, 0, 0);
                            dataRefresh(true, "", "", true);
                        }
                        else if (dataArr['command'][i]["c"] == "CNID") {//עדכון מזהה ניווט
                            localStorage.navID = dataArr['command'][i]["p1"];
                            navID = dataArr['command'][i]["p1"];
                            var d = new Date();
                            var time = d.getTime() / 1000;
                            addConnection(time, putWord(232) + "\"" + dataArr['command'][i]["p1"] + "\"", "", -3, 0, 0, 0);
                            dataRefresh(true, "", "", true);
                        }
                        else if (dataArr['command'][i]["c"] == "SBR") {//שליחת דוח שגיאה
                            sendBugReport();
                        }
                    }
                }
            }
        });
        jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
            console.log("checkForCommands error because: " + textStatus + ", " + errorThrown);
        });


    }

    //this function jumping one level in the game - only through guide screen
    function jumpLevel(isPhoto, isNoMission){
            //cancel on test mode
            if(QueryString["istest"])
                return 0;
            $("#guidePopup").popup("close");
            if (!localStorage.endOfLoadQuestion)
                askForQuestion((parseInt(localStorage.memory) + 1));
            if (localStorage.LM == 999 && localStorage.level == 999)
                return;
            var d = new Date();
            var time = d.getTime() / 1000;
            if (isNoMission != null || isNoMission == true ) {
                addConnection(time, putWord(233) +" "+ localStorage.LM + ", " + putWord(220)+": " + localStorage.level + ", " + putWord(234) +" "+ localStorage.quesID, "", -3, 0, 0, 0);
            }
            else if (isPhoto != null || isPhoto == true ) {
                addConnection(time, putWord(235) +" "+ localStorage.LM + ", " + putWord(220)+": " + localStorage.level + ", " + putWord(234) +" "+ localStorage.quesID, "", -3, 0, 0, 0);
                $('#mainDiv').show();
                $('#answerDiv').hide();
            }
            else {
                addConnection(time, putWord(236) +" "+ localStorage.LM + ", " + putWord(220)+": " + localStorage.level + ", " + putWord(234) +" "+ localStorage.quesID, "", -3, 0, 0, 0);
                $('#mainDiv').show();
                $('#answerDiv').hide();
            }
            var text = '<img alt="pic1" src="images/logo_opacity.png" style="width: 200px;-webkit-box-shadow:none;margin: auto;display: block;margin-bottom: 20px"/>' + "<img id =\"feedbackPopupAjaxLoader\" src=\"css/images/ajax-loader.gif\" style=\"height: 30px;width: 30px;-webkit-box-shadow:none;\" alt=\""+putWord(113)+"\"/> <br>"+putWord(210)+"<br>"+putWord(211)+"<br><br>"+putWord(212);
            $("#sendAnswer").hide();
            $("#userAnswer").parent().hide();
            $("#changeContentInMainDiv").html(text);
            showNextQuestion();
    }

    function askSkipPhotoTask(){
        if (navigator.notification) {
            navigator.notification.confirm(
                putWord(237)+"\n",  // message
                skipPhotoTask,              // callback to invoke with index of button pressed
                putWord(238),            // title
                [putWord(111),putWord(112)]          // buttonLabels
            );
        }
        else
            skipPhotoTask(2);
    }

    function skipPhotoTask(i){
        if (i == 2) {
            jumpLevel(true);
        }
    }


    //finish the game
    function finishGame(send, note){
        var d = new Date();
        var time = d.getTime() / 1000;
        var get = sClean($("#userAnswer").val());
        //var send = "<img src='images/V.png' id='VXimg'/><br><br>putWord(146)";
        addConnection(time, "["+putWord(239)+"-"+note+"]", send, 999, 999, 0, 0);
        localStorage.gameFinished = true;
        //claer quesyion time out
        stopAndClearQuestionsTimer();
        /*
        clearTimeout(timerForQuestionsTimeout);
        audio[CLOCK].pause();*/
        //למחוק נתונים כדי שיטען משחק חדש להבא
    }


    function guideFinishGame(){
    if (localStorage.userID > 0 && !localStorage.gameFinished) {
        $('#inFeedbackPopup').html('<br><h3>'+putWord(240)+'</h3><br><input class="register text" style="height: 35px;border-radius: 5px;width: 65px;" id="finishGameInput" type="tel" name="finishGameInput" value="" placeholder="" data-theme="b"><br><br><a id="sendFinishGame" onclick="manualFinishGame()" class="ui-btn ui-corner-all ui-shadow ui-btn-b">'+putWord(214)+'</a><br>');
        $('#backInFeedbackPopup').show();
        $("#guidePopupPass").popup("close");
        $("#guidePopupPass").on("popupafterclose", function () {  $('#lnkfeedbackPopup').click(); });
        setEnterEvent("#finishGameInput", "#sendFinishGame");
    }
    else {
        navigator.notification.alert(putWord(241), function () { }, putWord(168), putWord(106));
        
    }
}

    function manualFinishGame() {
        if (sClean($('#finishGameInput').val()) == 999){
            $('#backInFeedbackPopup').hide();
            $('#mainDiv').hide();
            $('#answerDiv').show();
            var send = "<img src='images/V.png' id='VXimg'/><br><br>"+putWord(146);
            $('#inAnswerDiv').html("<h4>" + send + "<h4>");
            $('#continueButton').hide();
            finishGame(send, putWord(242));
        }
        else{
            navigator.notification.alert(putWord(243), function () { }, putWord(244), putWord(106));
        }
        $("#feedbackPopup").popup("close");
    }
    
    //what to do wjan opening the left panel
    function leftPanelOpen(){
        setTimer();
        $("#totalMistakes").html("&nbsp;&nbsp;&nbsp;"+localStorage.totalMistakeCounter);
        if (localStorage.level == 1)
            var LM = parseInt(localStorage.LM) - 1;
        else if (localStorage.level == 999)
            var LM = localStorage.numOfPoints;
        else
            var LM = parseInt(localStorage.LM);
        $("#lm").html("&nbsp;&nbsp;&nbsp;"+LM+" "+putWord(245) + " "+localStorage.numOfPoints);
        $(".progress-bar").css("right", (LM / parseInt(localStorage.numOfPoints)) * 100 + "%");
    }

    //helper function that checkin if string is a json string
    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }



    //----------------image cach--------------------------------------------
    var startCach = function () {
        // see console output for debug info
        ImgCache.options.debug = true;
        ImgCache.options.usePersistentCache = true;
        ImgCache.init(function () { }, function () {});
    };
    //----------------end of image cach-------------------------------------------