var myScroll;
var navID;
var userID;
var navName;
var firstN;
var lastN;
var phoneN;
var city;
var mail;
var agree = true;
var msg;
var values;
var requireRoute;
var requirePassword;
var Dname;
var Dcordova;
var Dplatform;
var Duuid;
var Dversion;
var Dmodel;
var password;
var routeNum;
var d;
var theTime;
var answer;
var saveAction;
var countConenctionTry=0;
var timeToRetry;
var timeLeft;
var timeLeftInterval;
var retryTimer;
var questionID;
var cameraImageURI;
var watchID = null;
var firstOrientation;

function loaded() {
	myScroll = new iScroll('mainDiv');
}
function onDeviceReady() {
    checkForFixes();
    if (typeof(device) !=  "undefined" ){
        Dname = device.name;
        Dcordova = device.cordova;
        Dplatform = device.platform;
        Duuid =  device.uuid;
        Dversion = device.version;
        Dmodel = device.model;
    }
    document.addEventListener("backbutton", onBackKeyDown, false);
    $('#messageDiv').css('min-height', $(window).height()-100-39+'px');
    $(window).on('resize', function(){
            $('#messageDiv').css('min-height', $(window).height()+'px');
        }
    )
    isStoargeUserID();
    tabletCompatibility();
    //document.addEventListener("online", onOnline, false);
    //document.addEventListener("offline", onOffline, false);
   
}
function qr(type) {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");
    scanner.scan(
        function (result) {
            var str = result.text;
                if (type == "navID"){
                    if (str.search("default=1") >= 0){
                        loadXMLDoc("getDefualtNavID");
                        $("#messageDiv").fadeIn("fast");
                        $("#inMessageDiv").html("<img src='img/ajax-loader.gif'/ alt='טוען'>");
                    }
                    else{
                        if ((str.search("navID=") >= 0)) {
                            var from = (str.search("navID="));
                            navID = str.substring(from + 6, 1000);
                            if (navID.search("&") >= 0)
                                var att = (navID.search("&"));
                            else
                                var att = 1000;
                            navID = sClean(navID.substring(0, att));
                        }
                        else {
                            navID = null;
            
                        }
                        if (navID != null){
                            checkNavID();
                        }
                        else if(!result.cancelled)
                            doAlert("לא זוהה אתר ניווט, ייתכן וסרקתם ברקוד שאינו שייך למשחק הניווט.\n חפשו את הברקוד המתאים...", "שימו לב!")
                    }
                }
                else if (type == "code"){
                        str = str.replace("p2=","code=");//התאמה לברקוד ישנים של נקודות ציון
                        str = str.replace("9-301-1.php","code=301&");
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
                        if (code != null){
                            checkAnswer(code);
                        }
                        else if(!result.cancelled)
                            doAlert("לא ניתן לזהות את מיקומכם לפי הברקוד, ייתכן וסרקתם ברקוד שאינו שייך למשחק.\nחפשו את הברקוד המתאים...", "שימו לב!")
                    }
                else if (type == "site"){
                    if(!result.cancelled)
                        setTimeout("window.open('"+str+"', '_system', 'location=yes');",1000);
                        
                }
        },
        function (error) {
            doAlert("error",  "Scanning failed!")
        })
}

function checkNavID(){
    $("#messageDiv").fadeIn("fast");
    $("#inMessageDiv").html("<img src='img/ajax-loader.gif'/ alt='טוען'>");
    loadXMLDoc('getNavName');
}

function loadXMLDoc(action) {
    window.scrollTo(0,0);
    saveAction = action;
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            if (countConenctionTry>0){
                 $("#connectionStatus").css("color","rgb(9, 194, 9)");
                $("#connectionStatus").html("יופי! החיבור לרשת חודש בהצלחה..." );
                connectionTimer = setTimeout('$("#connectionStatus").slideUp("fast");',10000);
            }
            else
                connectionTimer = setTimeout('$("#connectionStatus").slideUp("fast");',10000);
            countConenctionTry = 0;
            clearTimeout(retryTimer);
            clearInterval(timeLeftInterval);
                
            }

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && action == "getQuestion") {
            countConenctionTry = 0;
            var getQuestionAnswer = eval("(" + (xmlhttp.responseText) + ")");
            questionStatus = getQuestionAnswer;
            questionID = getQuestionAnswer.questionID;
            $('#mainDiv').html(questionStatus.question);
            answer ="";
            
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status == 200  && action == "checkAnswer"){
            $("#inMessageDiv").html(xmlhttp.responseText);
            //var height2 = ($(document).height())-100-39;
            //$("#messageDiv").css("height",height2+"px");
            }
        else if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && action == "getDefualtNavID") {
            navID = xmlhttp.responseText;
            checkNavID();
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && action == "getNavName") {
            var navNameArr = eval("(" + (xmlhttp.responseText) + ")");
            navName = navNameArr.navName;
            requirePassword = navNameArr.requirePassword;
            requireRoute = navNameArr.requireRoute;
            if (navNameArr.contin == true){
                $("#inMessageDiv").html("<img src='img/ajax-loader.gif'/ alt='טוען'><br>"+"אתר הניווט: "+navName);
                location.assign("index.html#reg2");
                setTimeout('$("#messageDiv").fadeOut("fast")',3000);    
            }
            else if(navNameArr.navName != null){
                $("#inMessageDiv").html("אתר הניווט: "+navName+" אינו פעיל כרגע ולכן לא ניתן להתחיל בניווט...");
                setTimeout('$("#messageDiv").fadeOut("fast")',3000);    
            }
            else{
                $("#inMessageDiv").html("הנתונים שהתקבלו שגויים, לא נמצא אתר ניווט מתאים...");
                setTimeout('$("#messageDiv").fadeOut("fast")',3000);    
            }
            
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && action == "addUser"){
            if (isNaN(xmlhttp.responseText)){
                $("#reg3butt").removeAttr('disabled');
                if(xmlhttp.responseText=="wrong password")                
                    doAlert("הסיסמא שהקשתם שגויה נסו שנית","סיסמא שגויה")
                else
                    doAlert("שגיאה ברישום המשתמש","לא ניתן להמשיך")
            }
            else{
                userID = xmlhttp.responseText;
                $("#liUserId").html("מספר משתמש: "+userID);
                stoargeUserID();
                location.assign("index.html#nav");
            }
        }
        else if(xmlhttp.readyState == 4 && xmlhttp.status != 200){//קריאה לשרת נכשלה...
            countConenctionTry++;
            if(countConenctionTry==1 || countConenctionTry==2)
                timeToRetry = 5000;
            else if(countConenctionTry>2 && countConenctionTry<13)
                timeToRetry = (countConenctionTry*5000) - 5000;
            else
                timeToRetry = 60000;
            retryTimer = setTimeout('loadXMLDoc(saveAction)',timeToRetry);
            connectionFailed(timeToRetry);
        }
        tabletCompatibility();
    }
    if (action == "checkAnswer") {
        xmlhttp.open("POST", "http://www.nivutsms.net/A_import_files/questionAction.php?function=" + action + "&p1=" + userID + "&p2=" + answer + "&p3=" + questionID +"&random="+Math.random(), true);
    }
    else if (action == "getNavName"){
        xmlhttp.open("POST", "http://www.nivutsms.net/A_import_files/questionAction.php?function=" + action + "&p1=" + navID +"&random="+Math.random(), true);
    }
    else if (action == "getQuestion"){
        $('#mainDiv').html(nav);
        xmlhttp.open("POST", "http://www.nivutsms.net/A_import_files/questionAction.php?function=" + action + "&p1=" + userID + "&p2=" + Duuid +"&random="+Math.random(), true);
    }
    else
        xmlhttp.open("POST", "http://www.nivutsms.net/A_import_files/questionAction.php?function=" + action +"&random="+Math.random(), true);
    
    if (action=="addUser"){
        if(userID>0){
                doAlert("הנך מופנה חזרה לניווט...","לא ניתן לבצע רישום כפול")
                location.assign("index.html#nav");
        }
        else {
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("navID="+navID+"&routeNum="+routeNum+"&phoneN="+phoneN+"&firstN="+firstN+"&lastN="+lastN+"&city="+city+"&mail="+mail+"&agree="+agree+"&phoneT=name:"+Dname+" model:"+Dmodel+"&browser="+Dcordova+"&version="+Dversion+"&OS="+Dplatform+"&IP="+Duuid+"&password="+password);
        }
    }
    else
        xmlhttp.send();
}   
function cantScanHtml(type){
    window.scrollTo(0,0);
    //var height = ($(document).height())-100-39;
    //$("#messageDiv").css("height",height+"px");
    $("#messageDiv").fadeIn("fast");
    $("#inMessageDiv").css("direction","rtl");
    if (type=="navID")
     $('#inMessageDiv').html('\
            רשום את מזהה הניווט: <br><br>\
            <input id="navID" maxlength="" value="" style="width:40px" class="rounded" type="tel"/><br><br>\
            <button style="width:80px;background-color: rgb(218, 166, 33);" class=\"button\" onclick="$('+"'#messageDiv'"+').fadeOut(\'fast\');">חזרה</button>\
            <button style="width:80px" class=\"button\" onclick="navID = sClean($('+"'#navID'"+').val());checkNavID();">שלח</button>\
         ');
    if (type=="code")
     $('#inMessageDiv').html('\
            רשום את קוד הנקודה ולחץ המשך: <br><br>\
            <input id="code" maxlength="" value="" style="width:40px" class="rounded" type="tel"/><br><br>\
            <div onclick="$('+"'#help'"+').slideToggle(\'fast\')" style="color:rgb(114, 236, 217)";>(?)</div>\
            <div id="help" style="font-size:0.7em;display:none;color:rgb(114, 236, 217)">קוד הנקודה בדרך כלל מופיע בסוגריים<br> מתחת לברקוד ומכיל שלושה מספרים לדוגמא:212</div><br>\
            <button style="width:80px;background-color: rgb(218, 166, 33);" class=\"button\" onclick="$('+"'#messageDiv'"+').fadeOut(\'fast\');">חזרה</button>\
            <button style="width:80px" class=\"button\" onclick="var code = sClean($('+"'#code'"+').val());checkAnswer(code);">שלח</button>\
         ');

}
var reg1='<ul id="mainUl">\
            <li> לחץ על הכפתור על מנת לסרוק את הברקוד לתחילת המשחק</li>\
            <li><br><img src="img/scanQR.png" alt="scan barcode" id="scanQR" onclick="qr('+"'navID'"+')"></img></li>\
            <li><li/>\
        </ul>\
        <div id="cantScan" onclick="$('+"'#inMessageDiv'"+').css('+"'direction'"+','+"'rtl'"+');cantScanHtml('+"'navID'"+');$('+"'#messageDiv'"+').fadeIn(\'fast\');\">\
            אם אינכם מצליחים לסרוק את הברקוד לחצו כאן...</div>\
        <br><div id="downLogo"><img src="img/logo_opacity.png" alt="logo" style="height: 100px;"/></div>\
        ';
var reg2=' <ul id="mainUl">\
                <li style="text-align: right">רישום למשחק הניווט באתר: "{אתר הניווט}":</li>\
                <li><input placeholder="שם פרטי" class="rounded details" /></li>\
                <li><input placeholder="שם משפחה" class="rounded details"/></li>\
                <li><input maxlength="20" placeholder="מספר פלאפון" class="rounded details" type="tel"/></li>\
                <li><input placeholder="כתובת דואר אלקטרוני" class="rounded details"/></li>\
                <li><input placeholder="מקום מגורים" class="rounded details"/></li>\
                <li style="font-size: 13px;text-align: center;text-shadow: none;"><input onclick="agree = this.checked" type="checkbox" value="1" checked style="margin-left: 11px; ">אני מעוניין לקבל עדכונים בפלאפון או במייל</input></li>\
                <li><button class="button" onclick="checkValues()">{טקסט כפתור}</button></li>\
            </ul>\
            <br><div id="downLogo"><img src="img/logo_opacity.png" alt="logo" style="height: 100px;"/></div>\
            ';  
function reg3(){
    var output='<ul id="mainUl">';
    if(requireRoute){
        output +='<li style="text-align: right">רישום למשחק הניווט באתר: "{אתר הניווט}":</li>\
                <li></li>\
                <li><select id="selectRoute" class="rounded" style="-webkit-appearance: menulist; width:264px">\
                    <option selected value="0">בחר את מספר המסלול</option>';
        
        for (var j=0; j< requireRoute.length ;j++)   
            output += '<option value="'+requireRoute[j]+'">מסלול מספר '+requireRoute[j]+'</option>';

        output += '</select></li>'
    }
    if (requirePassword){
        output +=   '<li style=" padding-bottom: 4px; margin-bottom: -8px; text-shadow: none; margin-right: 26px;text-align: right; ">הקש סיסמא:</li>\
                    <li><input id="password" value="" class="rounded" type="password" style="direction:ltr"/></li>\
                    <li></li>'
    }
    if(!requirePassword && !requireRoute){
        checkValuesReg3()
        output +=' <img id="laod" alt="laoding" src="img/ajax-loader-blue.gif"/>\
                    </ul>\
                    <br><div id="downLogo"><img src="img/logo_opacity.png" alt="logo" style="height: 100px;"/></div>';
    }
    if(requirePassword || requireRoute)
        output +='<li><button class="button" id="reg3butt" onclick="checkValuesReg3()">{טקסט כפתור}</button></li>\
            </ul>\
            <br><div id="downLogo"><img src="img/logo_opacity.png" alt="logo" style="height: 100px;"/></div>'
    return output;
}
var nav =' <ul id="mainUl">\
        <img id="laod" alt="laoding" src="img/ajax-loader-blue.gif"/>\
    </ul>\
    <div id="downLogo"><img src="img/logo_opacity.png" alt="logo" style="height: 100px;"/></div>\
    ';  
function input() {
    values = document.getElementsByClassName("details");
    var firstInputColor = values[0].style.color;
    var firstInputBorderColor = values[0].style.borderColor;
    var firstInputBorderWidth = values[0].style.borderWidth;
    /*for (var j = 0; values.length > j; j++)
        values[j].firstValue = values[j].value;*/
    ifVarSet(firstN, values, 0);//משאיר את הנתונים בתיבות במידה והם נרשמו כבר
    ifVarSet(lastN, values, 1);
    ifVarSet(phoneN, values, 2);
    ifVarSet(mail, values, 3);
    ifVarSet(city, values, 4);
    /*
    $(".details").focusin(function () {
        if (this.firstValue == this.value)
            $(this).val("");
        if (this == values[2] || this == values[3])
            $(this).css("direction","ltr");
    })*/
    $(".details").focusout(function () {
        /*if (this.value == "") {
            $(this).css("color", firstInputColor)
            $(this).val(this.firstValue);
            
        }*/
        /*if (this.value != this.firstValue)
            $(this).css("color", "#000")*/
        firstN = sClean(values[0].value);
        lastN = sClean(values[1].value);
        phoneN = sClean(values[2].value).replace(/[^0-9]/g,"");
        mail = sClean(values[3].value);
        city = sClean(values[4].value);
        //צובע באדום ערכים לא נכונים
        msg ="";
        if (firstN.length < 2){
            values[0].style.borderColor = "red";
            values[0].style.borderWidth = "2px"; 
            msg += "שם פרטי לא תקין או חסר\n";
            }
        else{
            values[0].style.borderColor = firstInputBorderColor;
            values[0].style.borderWidth = firstInputBorderWidth; 
        }
        if (lastN.length < 2){
            values[1].style.borderColor = "red";
            values[1].style.borderWidth = "2px"; 
            msg += "שם משפחה לא תקין או חסר\n";
        }
        else{
            values[1].style.borderColor = firstInputBorderColor;
            values[1].style.borderWidth = firstInputBorderWidth; 
        }
        var patt = /\d{10}/g;
        if ((phoneN.length != 10 || phoneN.substring(0,1)!=0 || phoneN.substring(1,2)!=5 || !patt.test(phoneN))){
            values[2].style.borderColor = "red";
            values[2].style.borderWidth = "2px"; 
            msg += "מספר פלאפון לא תקין או חסר\n";
        }
        else{
            /*if (values[2].value == values[2].firstValue)
                values[2].style.direction = "rtl";*/
            values[2].style.borderColor = firstInputBorderColor;
            values[2].style.borderWidth = firstInputBorderWidth; 
        }
        if (city.length == 1){
            values[4].style.borderColor = "red";
            values[4].style.borderWidth = "2px"; 
            msg += "מקום מגורים לא תקין או חסר\n";
        }
        else{
            values[4].style.borderColor = firstInputBorderColor;
            values[4].style.borderWidth = firstInputBorderWidth; 
        }
        var atpos = mail.indexOf("@");
        var dotpos = mail.lastIndexOf(".");
        if ((mail.length != 0 && (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= mail.length))){
            values[3].style.borderColor = "red";
            values[3].style.borderWidth = "2px"; 
            msg += "כתובת דואר אלקטרוני לא תקינה\n";
        }
        else{
           /* if (values[3].value == values[3].firstValue)
                values[3].style.direction = "rtl";*/
            values[3].style.borderColor = firstInputBorderColor;
            values[3].style.borderWidth = firstInputBorderWidth; 
        }
    })
}

function sClean(str){
    str = str.replace(/[~`;%^&$*+=()?#:{}/]/gi, "");
    return str;
}

function ifVarSet(varName, values, i){
    if (varName != "" && varName){
        values[i].value = varName;
        values[i].style.color = "#000";
    }
}

function checkValues(){
    /*if(city == values[4].firstValue){
        city ="";
        }
    if(mail == values[3].firstValue){
        mail ="";
        }*/

    if (values[0].value == "" || values[1].value == ""|| values[2].value == "" )
        doAlert("חובה להזין שם פרטי, שם משפחה ומספר פלאפון.", "לא ניתן להמשיך");
    else if (msg.length>0){
        doAlert(msg, "לא ניתן להמשיך");
    }
    else{
       location.assign("index.html#reg3");
    }
}
function checkValuesReg3(){
    var msg="";
    if (requirePassword){
        password = sClean($("#password").val());
        if (password == "")
           msg += "יש להקיש סיסמא\n";
    }
    if (requireRoute){
        routeNum = sClean($("#selectRoute").val());
        if (routeNum == 0)
           msg += "יש לבחור מספר מסלול\n";
    }
        
    if (msg.length>0){
        doAlert(msg, "לא ניתן להמשיך");
    }
    else{
        $("#reg3butt").attr('disabled','disabled');
        loadXMLDoc("addUser");
    }
}
function doAlert(msg,title){
    if(navigator.notification)
        navigator.notification.alert(msg, function(){}, title);
    else
        alert(title+"\n"+msg);
}
var connectionTimer;
//function onOnline(){
  //  $("#connectionStatus").css("color","rgb(9, 194, 9)");
   //$("#connectionStatus").html("יופי! החיבור לאינטרנט חודש בהצלחה..." );
   // connectionTimer = setTimeout('$("#connectionStatus").slideUp("fast");',10000);
//}
//function onOffline(){
    //clearTimeout(connectionTimer);
    //$("#connectionStatus").css("color","rgb(226, 17, 17)");
    //$("#connectionStatus").html("אין חיבור לרשת. מנסה להתחבר מחדש..." );
    //$("#connectionStatus").slideDown("fast");
//}

function stoargeUserID(){
    alert("in stoargeUserID");
   // var db = window.openDatabase("userDataWTG", "1.0", "user Data", 200000);
    //db.transaction(populateDB, errorCB, successCB);
    //d = new Date();
    //theTime = d.getTime();
}

function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS userData');
    tx.executeSql('CREATE TABLE IF NOT EXISTS userData (id unique, userID, level, LM, theTime)');
    tx.executeSql('INSERT INTO userData (id, userID, level, LM, theTime) VALUES (1, ' +userID+ ', 0, 0, '+theTime+')');
}
function errorCB(err) {
    alert("Error processing SQL: " + err.message);
}
function successCB() {
    //alert("success!");
}

function isStoargeUserID(){
    alert("in isStoargeUserID");
    //var db = window.openDatabase("userDataWTG", "1.0", "user Data", 200000);
    //db.transaction(queryDB, errorCB, successCB);
}

function queryDB(tx) {
            tx.executeSql('SELECT * FROM userData', [], querySuccess, function(){});
}

function querySuccess(tx, results) {
    d = new Date();
    theTime = d.getTime();
    if ((results.rows.item(0).theTime+43200000) > theTime && results.rows.item(0).LM != 999 ){
        userID = results.rows.item(0).userID;
        location.assign("index.html#nav");
        $("#liUserId").html("מספר משתמש: "+userID);
    }
}
function onBackKeyDown(){
      var hash = window.location.hash;
        if (!hash || hash == "#reg1" || hash == "#nav") {
            navigator.notification.confirm(
                'האם ברצונך לצאת מהמשחק?',  // message
                onConfirm,              // callback to invoke with index of button pressed
                'יציאה מהמשחק',            // title
                'לא, כן (!)'          // buttonLabels
                );
        }
    else{
        window.history.back();
        }
            
}

function onConfirm(i){
    if (i==2)
        navigator.app.exitApp();
}

function onDelateNav(){
        navigator.notification.confirm(
                'האם אתה בטוח שברצונך למחוק את הניווט הנוכחי ולהתחיל את כל הליך ההרשמה מחדש?',  // message
                onConfirm2,              // callback to invoke with index of button pressed
                'מחיקת ניווט',            // title
                'ביטול, אישור'          // buttonLabels
                );
}

function onConfirm2(i){
    if (i==2)
        restart();
}
function checkAnswer(ans){
        //var height = ($(document).height())-100-39;
        //$("#messageDiv").css("height",height+"px");
        window.scrollTo(0,0);
        $("#messageDiv").fadeIn("fast");
        $("#inMessageDiv").html("<img src='img/ajax-loader.gif' alt='טוען'>");
    if (ans != null)
        answer = ans;
    else{
        answer="";
        var inputs = document.getElementsByTagName('input');
        for(var j = 0; j < inputs.length; j++){
            inputs[j].value = sClean(inputs[j].value);
            answer += inputs[j].value+";";
            }
    }
    loadXMLDoc('checkAnswer');
}

function selectedBG(id) { //מסמן את התושבה שנבחר בשאלות אמריקאיות
    id.style.backgroundImage = "url('img/listbgS.png')";
    var x = document.getElementsByClassName('answer');
    id.style.textShadow = "0px 0px 7px #ff6a00";
    id.style.border="1px solid rgb(253, 170, 111)";
    id.style.borderRadius = "10px";
    //answer = id.innerHTML;
    for (var i = 0; i < x.length; i++) {
        if (x[i] != id) {
            x[i].style.backgroundImage = "url('img/listbg.png')";
            x[i].style.textShadow = "0px 0px 0px #ff6a00";
            x[i].style.border="";
        }
    }
}
 function restart(){
    userID=0;
    $("#liUserId").html("מספר משתמש: (לא הוגדר)");
    var db = window.openDatabase("userDataWTG", "1.0", "user Data", 200000);
    db.transaction(dropDB, errorCB, successCB);
    var hash = window.location.hash;
    if (hash == "#reg1")
        location.assign("index.html#");
    location.assign("index.html#reg1");
    
    
}
function dropDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS userData');
}
//פונקציות מצפן
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
        element.innerHTML = 'כיוון החץ במעלות: ' + theArrowOrientation + '<br>(יש לוודא שהמספרים משתנים כאשר מזזים את החץ)';
        //element.innerHTML = 'מצפן: ' + Math.round(heading.magneticHeading) + '<br>מסך ראשוני:' + firstOrientation +'<br>מסך:' + window.orientation+"<br>real:" + theArrowOrientation;
    }
    else{
        var theArrowOrientation = (Math.round(heading.magneticHeading)+window.orientation);
        if (theArrowOrientation<0){
            theArrowOrientation += 360;
            element.innerHTML = 'כיוון החץ במעלות: ' + theArrowOrientation + '<br>(יש לוודא שהמספרים משתנים כאשר מזזים את החץ)';
        }
        else if(theArrowOrientation>360){
            theArrowOrientation -= 360;
        }
        element.innerHTML = 'כיוון החץ במעלות: ' + theArrowOrientation + '<br>(יש לוודא שהמספרים משתנים כאשר מזזים את החץ)';
        //element.innerHTML = 'מצפן: ' + Math.round(heading.magneticHeading) + '<br>מסך ראשוני:' + firstOrientation +'<br>מסך:' + window.orientation+"<br>real:" + theArrowOrientation;
    }
    

    $('#theAnswer').val(theArrowOrientation);
}
function onError(compassError) {
   $('#theAnswer').val('Compass error: ' + compassError.code);
}

function placeYoytubeButton(){
    $("#youtube").load(function() {
            $("#youtubePlayIcoDiv").show();
            var x = $("#youtubeDiv").width();
            var y = (x/2)-30;
            $("#youtubePlayIcoDiv").css("margin-right",y);
            x = $("#youtubeDiv").height();
            y = (x/2)-23;
            $("#youtubePlayIcoDiv").css("margin-top",y);
  
    });

    setTimeout('$("#youtubePlayIcoDiv").show();\
            var x = $("#youtubeDiv").width();\
            var y = (x/2)-30;\
            $("#youtubePlayIcoDiv").css("margin-right",y);\
            x = $("#youtubeDiv").height();\
            y = (x/2)-23;\
            $("#youtubePlayIcoDiv").css("margin-top",y);\
            ',2000);
}
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { 
        quality: 50,
        correctOrientation: true,
        targetWidth:1200,
        targetHeight:1200,
        destinationType: Camera.DestinationType.FILE_URI
        //destinationType: 1//1 = file_URI
    });
}
function onPhotoURISuccess(imageURI) {
        $("#capture").css("display","none");
        $("#type2pic").css("display","none");
        $("#type2pic").attr("src","../../../A_images/ajax-loader-blue.gif");
        $("#but1").css("display","");
        $("#but2").css("display","");
        cameraImageURI = imageURI;
        setTimeout('$("#type2pic").attr("src",cameraImageURI);$("#type2pic").css("display","");',3000);
}
function onFail(message) {
    $("#theAnswer").val($("#theAnswer").val() + "<!--Failed because: " + message +"-->" );
}
function uploadPhoto(imageURI) {
    $("#skipPhoto").css("display","none");
    $("#theAnswer").val($("#theAnswer").val() + "[צילום תמונה]");
    checkAnswer();
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://www.nivutsms.net/A_import_files/upload.php?userID="+userID+"&uuid="+Duuid +"&questionID="+questionID), win, fail, options);
}

function win(r) {
    //alert("code = " + r.responseCode + " Response = " + r.response + " Sent = " + r.bytesSent);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
}
 function onSkipPhoto(){
    navigator.notification.confirm(
                'האם אתה בטוח שברצונך לדלג על משימת צילום?',  // message
                onConfirmSkipPhoto,              // callback to invoke with index of button pressed
                'דילוג על משימת צילום',            // title
                'אישור, ביטול'          // buttonLabels
                );
}

function onConfirmSkipPhoto(i){
    if (i==1){
            $("#theAnswer").val($("#theAnswer").val() + "[דילוג על צילום תמונה]");
            $("#skipPhoto").css("display","none");
            checkAnswer();
        }
}                                     
function connectionFailed(i){
    if(i>5000){
        $("#connectionStatus").css("color","rgb(226, 17, 17)");
        $("#connectionStatus").html('\
                    בעיית חיבור לרשת, מנסה שוב <a id="seconds"></a>\
                    (<a onclick="loadXMLDoc(saveAction);countConenctionTry=1;clearTimeout(retryTimer);clearInterval(timeLeftInterval);timeLeftIntervalAction(0);" style="color: rgb(218, 166, 33);">נסה עכשיו</a>)');
        $("#connectionStatus").slideDown("fast");
    }
    clearTimeout(connectionTimer);
    timeLeft = (i/1000)-1;
    clearInterval(timeLeftInterval);
    timeLeftIntervalAction(timeLeft);
    timeLeftInterval = setInterval("timeLeftIntervalAction(timeLeft)",1000);
}

function timeLeftIntervalAction(i){
    if (i>=1){
        $('#seconds').html('בעוד ' + timeLeft + ' שניות');
        timeLeft--;
        }
    else{
       $('#seconds').html(' כעת');
       timeLeft--;  
       clearInterval(timeLeftInterval);  
    }
    
    

}
function connect(div1, div2, color, thickness) {//פונקציה זו יוצרת קו בין שני דיבים
    //div1 is left
    //div2 is right
    var off1 = getOffset(div1);
    var off2 = getOffset(div2);
    // bottom right
    var x1 = off1.left + off1.width-5;
    var y1 = off1.top + (off1.height / 2);
    // top right
    var x2 = off2.left+5;
    var y2 = off2.top + (off2.height / 2);
    // distance
    var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
    // make hr
    var htmlLine = "<div id='line' data-right='" + $(div2).attr("id").substring(1, 2) + "' data-left='" + $(div1).attr("id").substring(1, 2) + "' style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);z-index:0;display:none' />";
    //
    $("#lineHere").append(htmlLine);
    $("#line[data-right='" + $(div2).attr("id").substring(1, 2) + "']").fadeIn("fast");
}
function getOffset(el) {//פונקציית עזר לפונקציה שמעל
    var _x = 0;
    var _y = 0;
    var _w = el.offsetWidth | 0;
    var _h = el.offsetHeight | 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft;
        _y += el.offsetTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x, width: _w, height: _h };
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
        doAlert('יש לסמן קווים עבור כל הריבועים','לא השלמתם את המשימה');
}

function isBigScreen(){
    if (Dplatform == "iOS" && Dmodel.search("Pad")>=0) 
        return true;
    return false;
}
function tabletCompatibility(){
    if(isBigScreen()){
        $('.scroll ul').css('fontSize','25px');
        $('#menu').css('maxWidth', '250px');
        $('#downLogo img').css('height', '140px')
        $('.ui-header .ui-title').css('fontSize','20px'); 
        $('.ui-header>.ui-btn-icon-notext').css('top','16px');
        $('#cantScan').css('fontSize', '15px');
        $('#cantScan').css('top', '-32px');
        $('#cantScan').css('width', '331px');
        $('#messageDiv').css('top','55px');
        $('body').css('fontSize', '25px');
        $('#scanQR').css('marginTop','30px');
        $('.button').css('fontSize', '25px');
        $('#inMainDiv').css('fontSize', '25px');
        $('input.rounded').css('fontSize', '25px');
        $('input.rounded').css('width', '400px');
    }
}

/*
פונקציה לדיווח על בקשה לרמז מהמשתמש
-לא גמורה צריך לקשר אותה לשליחת נתונים לבסיס נתונים והוספת מספר הטעויות המתאים!!
@param numOfMis - the number of mistakes to set if clue was used, defualt = 1;
*/
function reportClue(numOfMis) {
    numOfMis = typeof numOfMis !== 'undefined' ? numOfMis : 1;//קביעת ערך ברירית מחדל במקרה שמספר טעויות נשאר ריק     
    /*מחכה להמשך*/
}

/*-___________________________-new!! for old version in new version--_______________________________________-*/
var timoetForCheckForFixes = null;
function checkForFixes() {
     if (!timoetForCheckForFixes)
        timoetForCheckForFixes = new connectAgainTimoet("checkForFixes()");
    var jqxhr = $.post("http://www.nivut.net/A__V2/check_fixesForOldVersion.php");
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
        console.log("jqxhr error because: " + textStatus + ", " + errorThrown);
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
        delete timoetForJavaScriptFix;
    });

    jqxhrScript.fail(function (jqXHR, textStatus, errorThrown) {
        timoetForJavaScriptFix.add();
        console.log("jqxhrScript error because: " + textStatus + ", " + errorThrown);
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