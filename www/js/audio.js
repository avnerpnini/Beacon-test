//audio array
var audio = [
    new Audio('audio/clock.mp3'),          //0 - clock
    new Audio('audio/buzzer.mp3'),         //1 - buzzer
    new Audio('audio/attention.mp3'),      //2 - attention
    new Audio('audio/gong.mp3'),           //3 - gong
    new Audio('audio/correct.mp3'),        //4 - correct
    new Audio('audio/finishGame.mp3'),     //5 - finishGame
    new Audio('audio/startGame.mp3'),      //6 - startGame
    new Audio('audio/wrong.mp3'),           //7 - wrong
    new Audio('audio/select.mp3')           //8 - select

];

//audio numbers
var 
CLOCK       = 0,
BUZZER      = 1,
ATTENTION   = 2,
GONG        = 3,
CORRECT     = 4,
FINISHGAME  = 5,
STARTGAME    = 6,
WRONG       = 7,
SELECT       = 8;

function muteSound(){
    for (var i=0;audio.length > i;i++){
        audio[i].muted = true;
        $("#muteBut").html(putWord(316));
    }
}

function cancelMuteSound(){
    for (var i=0;audio.length > i;i++){
        audio[i].muted = false;
        $("#muteBut").html(putWord(317));
    }
}

function toogleMute(){
    if (audio[0].muted)
        cancelMuteSound();
    else
        muteSound(); 
}

/*
clockAudio = new Audio('audio/clock.mp3');
clockAudio.loop = true;
buzzerAudio = new Audio('audio/buzzer.mp3');
attentionAudio = new Audio('audio/attention.mp3');
gongAudio = new Audio('audio/gong.mp3');
correctAudio = new Audio('audio/correct.mp3');
finishGameAudio = new Audio('audio/finishGame.mp3');
startGameAudio = new Audio('audio/startGame.mp3');
wrongAudio = new Audio('audio/wrong.mp3');
*/