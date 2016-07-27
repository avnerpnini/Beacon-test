
    //----------------------queue can be in other file in the fueter----------------------
    //make queue to mange a queue of ajax request
    function makeQueue(numOfPriorities) {

        if (localStorage.prior) {//if is data in loacl storage before get saved data from localstorage
            this.prioArr = JSON.parse(localStorage.prior);
            $(".queueStatus").html(localStorage.prior)//update the developerDiv
            //var isEmpty = true;
            for (var i = ((this.prioArr).length - 1); i >= 0; i--) {
                if ((this.prioArr[i]).length > 0) {
                    //      isEmpty = false;
                    break;
                }
            }
        }
        else {//first time make no prioArr
            this.prioArr = []; //array of arrays
            //var isEmpty = true;
            for (var i = 0; i < numOfPriorities; i++) {//build priorities arrays each index represnt his priority
                this.prioArr[i] = [];
            }
            localStorage.prior = JSON.stringify(this.prioArr); //save dada in local storage
            $(".queueStatus").html(localStorage.prior)//update the developerDiv
        }

        //emty the queue
        this.emptyQueue = function (){
            this.prioArr = []; //array of arrays
            //var isEmpty = true;
            for (var i = 0; i < numOfPriorities; i++) {//build priorities arrays each index represnt his priority
                this.prioArr[i] = [];
            }
            localStorage.prior = JSON.stringify(this.prioArr); //save dada in local storage
            $(".queueStatus").html(localStorage.prior)//update the developerDiv
        }

        //untilPrior check if the queue is emty until specific priorty
        this.isEmpty = function (untilPrior) {
            if (typeof (untilPrior) == "undefined" || isNaN(untilPrior) ) {
                for (var i = ((this.prioArr).length - 1); i >= 0; i--) {
                    if ((this.prioArr[i]).length > 0) {
                        return false;
                    }
                }
                return true;
            }
            else{
                 for (var i = 0; i < (this.prioArr).length && i <= untilPrior; i++) {
                    if ((this.prioArr[i]).length > 0) {
                        return false;
                    }
                }
                return true;
            }
        };


        //add command to the queueu with specific priority
        this.addToQueue = function (priority, com) {
            //alert(12);
            //this.isEmpty = false;
            this.prioArr[priority].push(com);
            localStorage.prior = JSON.stringify(this.prioArr); //save dada in local storage
            $(".queueStatus").html(localStorage.prior)//update the developerDiv
            runCom(this);

        };

        //pop the com with the highest priority
        this.popQueue = function () {
            for (var i = 0; i < numOfPriorities; i++) {
                if (this.prioArr[i].length > 0) {
                    var popedQueue = this.prioArr[i].shift();
                    localStorage.prior = JSON.stringify(this.prioArr); //save dada in local storage
                    $(".queueStatus").html(localStorage.prior)//update the developerDiv
                    return [i, popedQueue];
                }
            }
            //this.isEmpty = true;
            localStorage.prior = JSON.stringify(this.prioArr); //save dada in local storage
            $(".queueStatus").html(localStorage.prior)//update the developerDiv
            return null;
        };

        //remove specific com from the queue return the emoved com
        this.removeFromQueue = function (com) {
            for (var i = 0; i < numOfPriorities; i++) {
                for (var g = 0; g < this.prioArr[i].length; g++)
                    if (this.prioArr[i][g] == com[1]) {
                        this.prioArr[i].splice(g, 1); ;
                        localStorage.prior = JSON.stringify(this.prioArr); //save dada in local storage
                        $(".queueStatus").html(localStorage.prior)//update the developerDiv
                        return com;
                    }
            }
            return false;
        };

        //Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty.
        this.peekQueue = function () {
            for (var i = 0; i < numOfPriorities; i++) {
                if (this.prioArr[i].length > 0) {
                    var peekQueue = this.prioArr[i][0];
                    localStorage.prior = JSON.stringify(this.prioArr); //save dada in local storage
                    $(".queueStatus").html(localStorage.prior)//update the developerDiv
                    return [i, peekQueue];
                }
            }
            //this.isEmpty = true;
            localStorage.prior = JSON.stringify(this.prioArr); //save dada in local storage
            $(".queueStatus").html(localStorage.prior)//update the developerDiv
            return null;
        };


        //if ajax not sucseed return the com to him original place. get an array the[0] is the prio and the[1] is the com
        this.backToQueue = function (backMy) {
            var i = backMy[0];
            //this.isEmpty = false;
            this.prioArr[i].unshift(backMy[1]);
            localStorage.prior = JSON.stringify(this.prioArr); //save dada in local storage
            $(".queueStatus").html(localStorage.prior)//update the developerDiv
        };
    };

    var queueIsruning = false;
    var runComTimer = null;
    //this is a Recursive function that send the command with ajax & make downloads of picture, if the function called again (from out source not Recursive ) whan pervirous function is runing dont do tha ajax again
    //self parmaeter is true whan we have Recursive calling
     function runCom(queue, self) {
        var empty = queue.isEmpty();
        //alert(empty + ", " + queueIsruning + ", " + self);
        if (!(empty) && (!queueIsruning || self == true)) {
            clearTimeout(runComTimer);
            var peek = queue.peekQueue();
            queueIsruning = true;
            if (peek && peek[1].action != "downloadPic" && peek[1].action != "uploadPic") {
                var jqxhr = $.post(baseUrl + "/A_import_files/questionActionV2.php", { action: peek[1].action, priority: peek[0], command: peek[1] });
                //if ajax sucseed
                jqxhr.done(function (data, status) {
                    //הוספת התקשרות
                    if (peek[1].action == "addConnection") {
                        //במקרה שההתקשרות נכשלה מאיזה שהיא סיבה...
                        if (data != 1) {
                            queueIsruning = false;
                            runComTimer = setTimeout("runCom(myQueue, true);", 10000);
                            console.log("addConnection failed: " + data + " try again in 10 seconds");
                        }
                        else {
                            queue.removeFromQueue(peek);
                            connectionReceived(peek[1].connectionNum);
                            runCom(myQueue, true);
                        }
                    }
                    //שאיבת שאלה מהשרת
                    else if (peek[1].action == "getQuestion" || peek[1].action == "getQuestionForTest") {
                        //במקרה של הצלחה
                        if (IsJsonString(data)) {
                            var dataArr = JSON.parse(data);
                        }
                        else {
                            var dataArr = {};
                            dataArr['success'] = 0;
                        }
                        if (dataArr['success'] == 1) {
                            if (dataArr.LM == 999)
                                addQuestion("LM" + dataArr.LM + "l" + dataArr.level, 999);
                            else
                                addQuestion("LM" + dataArr.LM + "l" + dataArr.level, data);
                            queue.removeFromQueue(peek);
                            downloadPicToStoargeFromQuestionObj(dataArr.row);
                            runCom(myQueue, true);

                        }
                        //במקרה של כשלון
                        else {
                            queueIsruning = false;
                            runComTimer = setTimeout("runCom(myQueue, true);", 10000);
                            console.log("getQuestion נכשל: " + data + " מנסה שוב עוד 10 שניות");
                        }

                    }
                    //חזרה מגרסה ישנה לגרסה חדש
                    else if (peek[1].action == "getNextLevel") {
                        if (IsJsonString(data)) {
                            var dataArr = JSON.parse(data);
                        }
                        else {
                            var dataArr = {};
                            dataArr['success'] = 0;
                        }
                        
                        if (dataArr['success'] == 1) {
                            localStorage.removeItem("backToNewVersion");
                            dataRefresh(true, dataArr['LM'], dataArr['level']);
                            runCom(myQueue, true);

                        }
                        //במקרה של כשלון
                        else {
                            queueIsruning = false;
                            runComTimer = setTimeout("runCom(myQueue, true);", 10000);
                            console.log("getNextLevel נכשל: " + data + " מנסה שוב עוד 10 שניות");
                        }
                    }

                    //$("#div").append("The status is " + status + "\n tha data is " + data + "<br>");

                });

                //if ajax failed
                jqxhr.fail(function (error, textStatus, errorThrown) {
                    console.log("action: " + peek[1].action + " error because: " + textStatus + ", " + errorThrown + ".trying again<br>");
                    queueIsruning = false;
                    runComTimer = setTimeout("runCom(myQueue, true);", 10000);
                });
            }
            //this for command to download picture from net to the local memory
            else if (peek && peek[1].action == "downloadPic") {
                //caecking ig ImgCache lodaed (this function was copied from "imgcache.js") 

                if (!ImgCache.attributes.filesystem || !ImgCache.attributes.dirEntry) {
                    ImgCache.overridables.log('ImgCache not loaded yet! - Have you called ImgCache.init() first?', LOG_LEVEL_WARNING);
                    var pop = queue.removeFromQueue(peek);
                    queue.addToQueue(NUMOFPRIORITYS - 1, pop[1]); //put back at the end of the queue
                    queueIsruning = false;
                    runComTimer = setTimeout("runCom(myQueue, true);", 10000);
                }
                else {
                    ImgCache.cacheFile(
                        peek[1].url, //image
                        function () {//success_callback
                            queue.removeFromQueue(peek);
                            runCom(myQueue, true);
                        },
                         function (error) {//error_callback
                             /* error codes
                             1 = FileTransferError.FILE_NOT_FOUND_ERR
                             2 = FileTransferError.INVALID_URL_ERR
                             3 = FileTransferError.CONNECTION_ERR
                             4 = FileTransferError.ABORT_ERR
                             5 = FileTransferError.NOT_MODIFIED_ERR
                             */
                             if (error.code == 1 || error.code == 2) {//if we have problem with the url dont try againg and remove from the queue
                                 queue.removeFromQueue(peek);
                                 console.log("bad url - we remove request from queue");
                                 queueIsruning = false;
                                 runComTimer = setTimeout("runCom(myQueue, true);", 10000);
                             }
                             else {
                                 var pop = queue.removeFromQueue(peek);
                                 queue.addToQueue(NUMOFPRIORITYS - 1, pop[1]); //put back at the end of the queue
                                 queueIsruning = false;
                                 runComTimer = setTimeout("runCom(myQueue, true);", 10000);
                             }
                         }
                    );
                }
            }
            else if (peek && peek[1].action == "uploadPic"){
                var uploadFailCounter = 0;
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = peek[1].url.substr(peek[1].url.lastIndexOf("/") + 1);
                options.mimeType = "image/jpeg";
                /*var params = {};
                params.value1 = "test";
                params.value2 = "param";
                options.params = params;*/
                if (typeof peek[1].counter == "undefined")
                    peek[1].counter = 0;
                ft = new FileTransfer();
                /*
                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        $("#changeContentInMainDiv").append(progressEvent.loaded +"/"+ progressEvent.total);
                    } else {
                        $("#changeContentInMainDiv").append("הסתיים?");
                    }
                };
                */
                ft.upload(peek[1].url, encodeURI(baseUrl + "/A_import_files/upload.php?userID="+ localStorage.userID+"&Duuid="+Duuid +"&questionID="+peek[1].quesID), uploadSuccess, uploadFail, options);
                peek[1].ftAbortTimeout = setTimeout("ft.abort();", 30000);

                function uploadSuccess(r) {
                    clearTimeout(peek[1].ftAbortTimeout);
                    queue.removeFromQueue(peek);
                    console.log("uploadSuccess code = " + r.responseCode + " Response = " + r.response + " Sent = " + r.bytesSent + " Counter =" + peek[1].counter);
                    runCom(myQueue, true);
                }

                function uploadFail(error) {
                    if (peek[1].counter > 3){
                        console.log("uploadFail because: "+error.code+". removeFromQueue. counter: "+peek[1].counter);
                        queue.removeFromQueue(peek);
                        runComTimer = setTimeout("runCom(myQueue, true);", 10000);
                    }
                    else{
                        peek[1].counter++;
                        console.log("uploadFail because: "+error.code+". try again in 10 sec. counter: "+peek[1].counter);
                        runComTimer = setTimeout("runCom(myQueue, true);", 10000);
                    }
                }
            }
        }
        else if (empty || self == true) {
            //alert("innerstop");
            queueIsruning = false;
        }

    };
    //----------------------------end of queue---------------------------