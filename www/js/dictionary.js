var HEBREW = 0, ENGLISH = 1, FRENCH = 2;

//change the words by the language that select
function setWords(){
    //if no lang was select set to hebrew
    if (localStorage.getItem("language") == null)
        var lang = HEBREW;
    else
        var lang = localStorage.getItem("language");

    for(var i = 0;i< word.length;i++){
        if ($('[data-word="'+i+'"]').length > 0) {
            $('[data-word="'+i+'"]').html(word[i][lang]);
        }
        if($('[data-word-placeholder="'+i+'"]').length > 0){
            $('[data-word-placeholder="'+i+'"]').attr("placeholder", (word[i][lang]));
        }
        if($('[data-word-value="'+i+'"]').length > 0){
            $('[data-word-value="'+i+'"]').val((word[i][lang]));
            $('input[data-word-value="' + i + '"]').button( "refresh" );//refresh the buttons
        }
    }

    //ltr
    if (localStorage.getItem("language") != HEBREW && localStorage.getItem("language") != null ){
         $('link[href="css/lang_rtl.css"]').attr('href','css/lang_ltr.css');
        //$("#sidebar ul li a").css('textAlign', 'left');
        $("#sidebar ul li a").removeClass('ui-btn-icon-left');
        $("#sidebar ul li a").addClass('ui-btn-icon-right');
    } 

    //rtl
    else{
        $('link[href="css/lang_ltr.css"]').attr('href','css/lang_rtl.css');
        //$("#sidebar ul li a").css('textAlign', 'right');
        $("#sidebar ul li a").removeClass('ui-btn-icon-right');
        $("#sidebar ul li a").addClass('ui-btn-icon-left');
    }
    $(".sub-menu li a").css('textAlign', 'left');
    $(".sub-menu li a").removeClass('ui-btn-icon-right');
    $(".sub-menu li a").removeClass('ui-btn-icon-left');
   
    /*
    setTimeout(function(){
        alert($('[data-word="ab"]').length);
        },1000);
        */
}

//ruetunr the words by the id And the language that selected
function putWord(i){
     if (localStorage.getItem("language") == null)
        var lang = HEBREW;
    else
        var lang = localStorage.getItem("language");
    return word[i][lang];
}

//set specific lang
function selectLanguage(lang){
    if (lang == HEBREW){
        localStorage.setItem("language", HEBREW);
    }
    else if (lang == ENGLISH){
        localStorage.setItem("language", ENGLISH);
    }
    else if (lang == FRENCH){
        localStorage.setItem("language", FRENCH);
    }
    setWords();
    $("#languagePopupPass").popup("close");
}


{
var word = [
//הדבקה כאן
new Array("יש לאן ","Way To Go","Way To Go"),//0
new Array("רענון נתונים","Refresh data","Mise à jour"),//1
new Array("איני מצליח לסרוק","I can't scan","Echec du scan"),//2
new Array("נתוני משתמש","User details","Données usager"),//3
new Array("שלח מיקום נוכחי","Send location","Localisez-vous"),//4
new Array("דלג על צילום","Skip picture","Passer la photo"),//5
new Array("מחק ניווט","Restart game","Recommencer"),//6
new Array("השתק צליל","Mute","silencieux"),//7
new Array("תפעול מדריך","Staff options","Activer le guide"),//8
new Array("עבור לגרסה ישנה","Old version","Ancienne version"),//9
new Array("עצה: גע בציור להסבר","Tap icon for explanation","Explications en tapant ici"),//10
new Array("זמן מתחילת המשחק","Elapsed time","Temps écoulé"),//11
new Array("כמות הטעויות","Mistakes","Nombre d'erreurs"),//12
new Array("מספר נקודות הציון שעברתם","Checkpoints completed","Nombre d’étapes passées"),//13
new Array("חזרה","Back","Retour"),//14
new Array("תפריט","Menu","Menu"),//15
new Array("הרשמה","Sign in","Inscription"),//16
new Array("לניווט","to game","Allons-y"),//17
new Array("סריקת ברקוד","Scan","Scanner"),//18
new Array("התחלת ניווט"," QR code","QR code"),//19
new Array("הודעה:","Message:","Message:"),//20
new Array("הרישום נקלט בהצלחה!","Sign in accepted!","L’inscription a été enregistrée avec succès !"),//21
new Array("כעת עליך לסרוק את הברקוד","Scan the QR code","Scanner le code-barres"),//22
new Array("(הברקוד מחכה ככל הנראה בנקודת ההתחלה)","(QR code located at starting point)","(Le code-barre vous attend au point de départ)"),//23
new Array("אישור","OK","ok"),//24
new Array("רישום פרטים","Enter details","Inscription des donées"),//25
new Array("שם פרטי","First Name","Prénom"),//26
new Array("שם משפחה","Last Name","Nom de famille"),//27
new Array("מספר פלאפון","Phone Number","Numéro de téléphone"),//28
new Array("כתובת דוא\"ל","Email","Adresse mail"),//29
new Array("כתובת מגורים","Address","Adresse"),//30
new Array("אני מעוניין/נת לקבל עדכונים בפלאפון או במייל","Send me updates by phone or email","Je suis intéressé/(e) à recevoir des informations par mail/sms"),//31
new Array("שמור","Save","Sauvegarder"),//32
new Array("המשך...","Continue…","Suite…"),//33
new Array("התחל ניווט...","Start game…","Débuter le jeu"),//34
new Array("הקש סיסמא","Enter password","Taper le code"),//35
new Array("מידע כללי","About","Information générale"),//36
new Array("סרוק ברקוד","Scan QR code","Scanne le code"),//37
new Array("שלח","Send","Envoyer"),//38
new Array("סיים ניווט","End game","Finir l'orientation"),//39
new Array("אפשרויות מתקדמות","Advanced Settings","Réglage avancé"),//40
new Array("סיסמת כניסה","Password","Code d'entrée"),//41
new Array("דילוג על משימה","דילוג על משימה","דילוג על משימה"),//42
new Array("המשך ניווט של מכשיר אחר","המשך ניווט של מכשיר אחר","המשך ניווט של מכשיר אחר"),//43
new Array("הצג מסך מתכנת","הצג מסך מתכנת","הצג מסך מתכנת"),//44
new Array("אפליקציית 'יש לאן'","Way to Go app","Application \"Way to go\""),//45
new Array("תודה רבה שהורדתם את האפלקיציה שלנו!","Thank you for downloading our app!","Merci d'avoir télécharger notre application!"),//46
new Array("האפליקציה מיועדת להפעלת משחק הניווט הסלולרי של חברת 'יש לאן'. ","The application is meant for running the 'Way to Go' cellular navigation game.","L'application est destinéee à la course d'orientation cellulaire \"Way to Go\""),//47
new Array("על מנת לתאם פעילות לקבוצות, או לברר מתי והיכן ניתן לבצע את הפעילות עבור יחידים - מומלץ לצור איתנו קשר.","Contact us to schedule a group game, or to check times and locations for individual play.","Pour organiser une Course d'Orientation pour des groupes ou vérifier où et quand il est possible de participer à une course d’orientation pour des individuels, il est conseillé de prendre contact avec nous."),//48
new Array("כל הזכויות שמורות לחברת 'יש לאן' 2016","2016 'Way to Go', all rights reserved","Tous les droits sont réservés à la Société Yesh Lean 2016"),//49
new Array("כמות השחקנים בצוות","How many players in the team","Combien de joueurs dans l'équipe"),//50
null,//51
null,//52
null,//53
null,//54
null,//55
null,//56
null,//57
null,//58
null,//59
null,//60
null,//61
null,//62
null,//63
null,//64
null,//65
null,//66
null,//67
null,//68
null,//69
null,//70
null,//71
null,//72
null,//73
null,//74
null,//75
null,//76
null,//77
null,//78
null,//79
null,//80
null,//81
null,//82
null,//83
null,//84
null,//85
null,//86
null,//87
null,//88
null,//89
null,//90
null,//91
null,//92
null,//93
null,//94
null,//95
null,//96
null,//97
null,//98
new Array("כמות המשתתפים לא תקין או חסר","Number of participants invaild or missing","Nombre de participants non valide ou manquante"),//99
new Array("שם פרטי לא תקין או חסר","First name invalid or missing","Prénom non valide ou manquant"),//100
new Array("שם משפחה לא תקין או חסר","Last name invalid or missing","Nom de famille non valide ou manquant"),//101
new Array("מקום מגורים לא תקין או חסר- ניתן להשאיר שדה זה ריק","Address invaild or missing- you may leave this field empty","Adresse non valide ou manquante"),//102
new Array("כתובת דואר אלקטרוני לא תקינה- ניתן להשאיר שדה זה ריק","Email invalid- you may leave this field emtpy","Email non valide ou manquant"),//103
new Array("מספר פלאפון לא תקין או חסר","Phone number invalid or missing","Numéro de téléphone non valide ou manquant"),//104
new Array("לא ניתן להמשיך","Unable to continue","Il n'est pas possible de continuer"),//105
new Array("אישור","OK","Validation"),//106
new Array("יש לרשום סיסמא","Enter password","Vous devez entrer le code"),//107
new Array("סיסמא שגויה","Incorrect password","Code erroné"),//108
new Array("האם ברצונך לצאת מהמשחק?","Are you sure you want to leave the game?","Souhaitez-vous sortir du jeu?"),//109
new Array("יציאה מהמשחק","Exit game","Sortie du jeu"),//110
new Array("לא ","No","non"),//111
new Array("כן","Yes","oui"),//112
new Array("טוען","Loading","en charge"),//113
new Array("לא זוהה אתר ניווט, ייתכן וסרקתם ברקוד שאינו שייך למשחק הנייוט.","Unable to identify site - it is possible you have scanned a QR code that does not belong to the navigation game.","Le site d'orientation n'a pas été identifié. Il est possible que vous ayez scanné un code-barres qui ne fait pas partie du jeu"),//114
new Array("חפשו את הברקוד המתאים...","Find the relevant QR code…","Chercher le bon code-barres"),//115
new Array("שימו לב!","Attention!","Faites attention!"),//116
new Array("אתר הניווט:","Game site:","Site d'orientation:"),//117
new Array("הרשמה למשחק ניווט סלולרי","Registration for cellular navigation game","Inscription à la course d'orientation cellulaire"),//118
new Array("בחר מספר מסלול","Choose route number","Choisir le numéro de parcours"),//119
new Array("מסלול מספר","Route number","parcours numéro"),//120
new Array("לא פעיל כרגע ולכן לא ניתן להתחיל בנייוט","Currently inactive- cannot begin game","Pas en service actuellement, il n'est pas possible de commencer l'orientation"),//121
new Array("הנתונים שהתקבלו שגויים, לא נמצא אתר מתאים..","The details entered are invalid, game site not found…","Les données reçues sont fausses, il n’existe pas de site correspondant"),//122
new Array("ברקוד נסרק בהצלחה!","QR code scanned successfully!","Le code-barres a été scanné avec succés!"),//123
new Array("לא ניתן לזהת את מיקומכם לפי הברקוד, ייתכן שסרקתם ברקוד שאינו שייך למשחק.","Unable to identify code - it is possible you have scanned a QR code that does not belong to the navigation game.","Il n’est possible d’identifier votre position actuelle selon le code-barres. Il est possible que vous ayez scanné un code-barres qui ne fait pas partie du jeu."),//124
new Array("עליכם להקיש סיסמא","Please enter password","Vous devez taper le code"),//125
new Array("הקשתם סיסמה שגויה","Invalid password","Vous avez tapé un code erroné"),//126
new Array("עליכם לבחור מספר מסלול","Please choose a route number","Vous devez choisir un numéro de parcours"),//127
new Array("יש למלא את כל המידע המבוקש","Please enter all the required information","Vous devez remplir toutes les informations demandées"),//128
new Array("לא ניתן להתחיל ","Cannot start game","Il n'est pas possible de commencer"),//129
new Array("לא ניתן להתחיל פעמיים!","You cannot start again!","Il n'est pas possible de commencer deux fois!"),//130
new Array("מבצע הרשמה, מיד מתחילים...","Completing registration, almost starting…","L'inscription s'effectue, nous allons commencer immédiatement"),//131
new Array("יוצאים לדרך, בהצלחה!","Starting game, good luck!","C'est parti, Bonne chance!"),//132
new Array("רישום משתמש נכשל-נסה שנית!","User registration failed, please try again!","L'inscription a échoué- Recommencer!"),//133
new Array("לקבלת עזרה פנה למדריך","For help, ask a guide","Pour recevoir de l'aide, demander à l’organisateur"),//134
new Array("רענון נתונים עקב איבוד רצף בשלבים","רענון נתונים עקב איבוד רצף בשלבים","רענון נתונים עקב איבוד רצף בשלבים"),//135
new Array("כל הכבוד! עוד רגע וסיימתם! חזרו חזרה לנקודת הזינוק וסרקו את הברקוד לסיום הניווט","Great job! Almost done! Go back to the starting point and scan the QR code to finish the game","Bravo ! Vous avez bientôt fini. Retournez au point de départ et scannez le code-barres de fin !"),//136
new Array("התחלתם את ניווט ","You have started navigation in","Vous avez commencé la course d'orientation"),//137
new Array("פתחו את המפה שברשותכם, לכו לנקודה","Look at your map and go to point","Ouvrir la carte en votre possession et rejoindre le point"),//138
new Array("חפשו שם את הברקוד, לחצו על הכפתור וסרקו אותו","Find the QR code there and scan it","Recherchez le code-barres, appuyez sur le bouton et scannez-le"),//139
new Array("יפה מאוד! המשיכו בניווט אל נקודה","Very good! Continue to point","Bravo! Continuez l'orientation vers le point"),//140
new Array("הגעתם? סרקו את הברקוד שבנקודה..","Have you arrived? Please scan the QR code…","Vous êtes arrivés ? Appuyez sur le bouton pour scanner le code-barres au point"),//141
new Array("צלם תמונה","Take picture","Prendre une photo"),//142
new Array("שלח תמונה והמשך","Send picture and continue","Envoyer la photo et continuer"),//143
new Array("סיום בהגדרה אישית דרך מזהה 10","סיום בהגדרה אישית דרך מזהה 10","סיום בהגדרה אישית דרך מזהה 10"),//144
new Array("המשך...","Continue…","Suite…"),//145
new Array("כל הכבוד! השלמתם את משחק הניווט בהצלחה.","Great job! You have completed the navigation game successfully!!","Bravo! Vous avez fini la course d'orientation avec succés"),//146
new Array("הזנתם ברקוד שגוי- אנא וודאו שסרקתם את הברקוד הנכון","You have entered an invalid QR code- please check you have scanned the correct QR code","Vous avez scanné un code-barres erroné- Vérifiez que vous scannez le bon code-barres"),//147
new Array("עליכם למצוא את ברקוד הסיום","Please find the final QR code","Vous devez trouver lecode-barres de fin"),//148
new Array("יפה מאוד! מצאתם את נקודה","Very good! You have found point","Bravo! Vous avez trouvé le point"),//149
new Array("בהצלחה!","successfully!","Bonne chance!"),//150
new Array("עליכם למצוא את נקודה","Please find point","Vous devez trouver le point"),//151
new Array("יפה מאוד תשובה נכונה!","Very good, correct answer!","Bonne réponse! Bravo"),//152
new Array("לא בחרתם אף תשובה!","You did not select an answer.","Vous n'avez pas choisi de réponse!"),//153
new Array("לחצו על התשובה שלכם עד שהיא תסומן ולאחר מכן שלחו אותה","Tap your answer until it is highlighted and then send it","Appuyez sur votre réponse jusqu'à ce qu’elle soit affichée puis envoyez-la"),//154
new Array("חזור","Back","Retour"),//155
new Array("טעות, התשובה הנכונה היא","Incorrect, the correct answer is","Erreur! La bonne réponse est"),//156
new Array("סרט נצפה","סרט נצפה","סרט נצפה"),//157
new Array("שלחתם תשובה ריקה, חזרו לשאלה ורשמו את תשובתכם בתיבת הטקסט","You sent a blank answer, go back to the question and enter your answer in the text box","Vous avez envoyé une réponse vide, revenez à la question et notez votre réponse dans la boite texte correspondante"),//158
new Array("טעות, התשובה היא לא","Incorrect, the answer is not","Erreur! La réponse est"),//159
new Array("התשובה הנכונה היא:","The correct answer is:","La bonne réponse est"),//160
new Array("כמות הטעויות שנצברו בשאלה זו:","Total mistakes this question:","Le nombre d'erreurs pour cette question est:"),//161
new Array("נסו שנית!","Try again!","Essayez à nouveau"),//162
new Array("נותרו לכם עוד","You have","Il vous reste"),//163
new Array("נסיונות","tries left","Essais"),//164
new Array("תשובה לא מלאה, יש לכם","Incomplete answer, you have","Réponse incomplète, vou avez"),//165
new Array("תשובות נכונות מתוך","correct answers out of","bons mots parmi"),//166
new Array("התשובות הנכונות הן:","The correct answers:","Les bonnes réponses sont:"),//167
new Array("אופס,","Oops,","Oups,"),//168
new Array("נחמד,","Nice,","Sympa,"),//169
new Array("מעולה!","Great!","Génial!"),//170
new Array("יש לכם","You have","Vous avez"),//171
new Array("תשובות נכונות מתוך","correct answers out of","bonnes réponses parmi"),//172
new Array("הזנתם ברקוד שגוי - אנא וודאו שהזנתם את הברקוד הנכון","You entered an invalide QR code - please check you entered the correct QR code","Vous avez envoyé un code-barres erroné - Vérifiez que vous envoyez le bon code-barres"),//173
new Array("סרקתם ברקוד שגוי - אנא וודאו שסרקתם את הברקוד הנכון","You scanned an invalide QR code - please check you scanned the correct QR code","Vous avez scanné un code-barres erroné - Vérifiez que vous scannez le bon code-barres"),//174
new Array("יפה מאוד הצבעה נכונה!","Very good, you aimed in the correct direction!","Bravo! Vous avez indiqué la bonne direction!"),//175
new Array("מינ:","מינ:","מינ:"),//176
new Array("מקס:","מקס:","מקס:"),//177
new Array("הצבעה:","הצבעה:","הצבעה:"),//178
new Array("רצוי:","רצוי:","רצוי:"),//179
new Array("טעות, לא הצבעתם לכיוון הנכון","Incorrect, you did not aim in the correct direction","Erreur, vous n'avez pas indiqué la bonne direction"),//180
new Array("התמונה נשלחה למערכת!","Picture sent successfully!","La photo a été envoyée!"),//181
new Array("לא השלמתם את כל המשימה!","You have not completed the whole task!","Vous n'avez pas fini toute votre mission!"),//182
new Array("עליכם לחבר בין כל הזוגות...","Please match all the pairs…","Vous devez relier entre chaque couple…."),//183
new Array("הזוגות בהם טעיתם והתשובה הנכונה שלהם:","The correct answers to the incorrect matches:","Les bonnes réponses aux correspondances incorrectes:"),//184
new Array("זוגות נכונים מתוך","correct matches out of ","Bonnes correspondances parmi"),//185
new Array("לא השלמתם את המשימה!","You have not sorted all the items!","Vous n'avez pas fini votre mission!"),//186
new Array("עליכם למיין את הרשימה...","Please sort the list…","Vous devez trier cette liste"),//187
new Array("הסדר הנכון הוא:","The correct order is:","Le bon ordre est:"),//188
new Array("תשובתכם התקבלה בהצלחה!","Your answer has been received successfully!","Votre réponse a été reçue avec succés"),//189
new Array("יפה מאוד, הגעתם בדיוק לגימטרייה הנכונה!","Very good, you got the exactly correct gematria!","Bravo! Vous êtes arrivés la bonne Guematria"),//190
new Array("כמעט, יש לכם סטייה של","Almost, you are off","Presque, vous avez une erreur de"),//191
new Array("מהגימטרייה האמיתית","from the right gematria","De la bonne Guematria"),//192
new Array("הגימטרייה הנכונה היא:","The correct gematria is:","La bonne Guematria est:"),//193
new Array("אופס, יש לכם סטייה של","Oops, you are off by","Oups, vous avez une erreur de"),//194
new Array("הברקוד לא שייך לאף נקודה במשחק, עליכם למצוא את נקודה","The QR code does not belong to any point in this game. Please find point","Le code-barres n'appartient à aucun point du jeu, vous devez trouver le point"),//195
new Array("אופס, מצאתם את נקודה","Oops, you found point","Oups, vous avez trouvé le point"),//196
new Array("והיא לא במסלול שלכם","and it is not on your route!","Et il n'est pas dans votre parcours"),//197
new Array("עליכם למצוא את נקודה","Please find point ","Vous devez trouver le point"),//198
new Array("דלג קדימה אל נקודה","Skip forward to point","Avancez vers le point"),//199
new Array("דלג אחורה אל נקודה","Skip back to point","Retournez vers le point"),//200
new Array("האם אתה בטוח שברצונך לדלג על נקודות במשחק? זה יכול להשפיע לרעה על הניקוד שלך..","Are you sure you want to skip a point in the game? It can hurt your final score…","Etes-vous surs de vouloir faire l’impasse sur des étapes ? Cela aura une influence négative sur votre classement"),//201
new Array("דילוג על נקודות","Skip Points","Faire l'impasse sur l'étape"),//202
new Array("ביטול","Cancel","Annulation"),//203
new Array("תודה שניווטתם איתנו, האם תסכימו לפרגן לנו בפייסבוק?","Thank you for playing with us, will you recommend us on Facebook?","Merci d'avoir participé, acceptez-vous de nous faire un \"LIKE\" sur Facebook?"),//204
new Array("שתפו את החברים!","Share with your friends!","Partager avec vos amis!"),//205
new Array("בשמחה!","Of course!","Avec plaisir!"),//206
new Array("לא עכשיו..","Not now…","Pas maintenant…"),//207
new Array("האם אתה בטוח שברצונך למחוק את הנייוט הנוכחי, ולהתחיל את כל הליך ההרשמה מחדש?","Are you sure you want to restart the current game and to restart the registration process?","Etes-vous surs de vouloir effacer la partie actuelle et de recommencer tout le processus d'inscription depuis le début?"),//208
new Array("מחיקת ניווט","Restart game","Annulation du jeu"),//209
new Array("טוען את המשך המשחק...","Loading…","Charge la suite du jeu"),//210
new Array("האם יש חיבור לרשת?","Do you have internet access?","Avez-vous une connexion internet?"),//211
new Array("לעזרה פנה למדריך","For help, see a guide","Pour de l'aide, demandez à l'organisateur"),//212
new Array("רשום את מזהה הניווט:","List Navigation ID:","Inscription de l'identifiant de la course d'orientation"),//213
new Array("שלח","Send","Envoyer"),//214
new Array("רשום את מספר הברקוד:","Enter QR code number:","Entrez le code-barres:"),//215
new Array("הזנת ברקוד ידנית","Enter QR code manually","Inscription manuelle du code-barres"),//216
new Array("מספר הברקוד מופיע בדרך כלל בכיתוב קטן בסמוך לברקוד","The QR code number usually appears in small numbers near the QR code","Le numéro du code-barres se situe en général sur le coté du code-barres"),//217
new Array("מחשב מיקום, אנא וודא שאפשרות המיקום זמינה בהגדרות המכשיר והינך נמצא במקום פתוח","Calculating location- please ensure GPS is enabled in device settings and you are in an open area","Calcul de la localisation- vérifiez que votre géolocalisation est activée et que vous êtes dans une zone ouverte"),//218
new Array("שלב 0 מתוך 3","Part 0 of 3","Etape 0 sur 3"),//219
new Array("שלב ","Part ","Etape"),//220
new Array("מתוך 3","of 3","parmi 3"),//221
new Array("בטל פעולה","Cancel","Annuler l'action"),//222
new Array("המיקום נקלט בהצלחה, שולח נתונים למערכת.","Location recorded successfully, sending...","Votre position a été enregistré avec succés, les données sont envoyées dans le système"),//223
new Array("התבצע רענון נתונים-בקשה מהשרת. תחנה:","התבצע רענון נתונים-בקשה מהשרת. תחנה:","התבצע רענון נתונים-בקשה מהשרת. תחנה:"),//224
new Array("מועבר ל->תחנה:","מועבר ל->תחנה:","מועבר ל->תחנה:"),//225
new Array("התבצע רענון נתונים - בקשה מהמשתמש.  תחנה:","התבצע רענון נתונים - בקשה מהמשתמש.  תחנה:","התבצע רענון נתונים - בקשה מהמשתמש.  תחנה:"),//226
new Array("התבצע רענון נתונים. תחנה:","התבצע רענון נתונים. תחנה:","התבצע רענון נתונים. תחנה:"),//227
new Array("התקבלה פקודה לשליחת מיקום מבקשת שרת","התקבלה פקודה לשליחת מיקום מבקשת שרת","התקבלה פקודה לשליחת מיקום מבקשת שרת"),//228
new Array("מבקשת שרת java התבצעה טעינה מחדש של עדכונים","מבקשת שרת java התבצעה טעינה מחדש של עדכונים","מבקשת שרת java התבצעה טעינה מחדש של עדכונים"),//229
new Array("התקבלה הודעה:","התקבלה הודעה:","התקבלה הודעה:"),//230
new Array("התקבלה פקודה שינוי מסלול ל:","התקבלה פקודה שינוי מסלול ל:","התקבלה פקודה שינוי מסלול ל:"),//231
new Array("התקבלה פקודה שינוי מזהה ניווט ל:","התקבלה פקודה שינוי מזהה ניווט ל:","התקבלה פקודה שינוי מזהה ניווט ל:"),//232
new Array("דילוג על משימה כיוון שסוג השאלה לא קיים בגרסה החדשה בתחנה","דילוג על משימה כיוון שסוג השאלה לא קיים בגרסה החדשה בתחנה","דילוג על משימה כיוון שסוג השאלה לא קיים בגרסה החדשה בתחנה"),//233
new Array("מזהה שאלה","מזהה שאלה","מזהה שאלה"),//234
new Array("[דילוג על משימת צילום] בתחנה:","[דילוג על משימת צילום] בתחנה:","[דילוג על משימת צילום] בתחנה:"),//235
new Array("מדריך ביצע דילוג על שלב בתחנה:","מדריך ביצע דילוג על שלב בתחנה:","מדריך ביצע דילוג על שלב בתחנה:"),//236
new Array("האם אתה בטוח?","Are you sure?","Etes-vous surs?"),//237
new Array("דילוג על משימת צילום","Skipping picture task","Faire l'impasse sur la mission photo"),//238
new Array("סיום משחק","סיום משחק","סיום משחק"),//239
new Array("רשום את קוד הסיום:","Enter the final code:","Inscription du code de fin"),//240
new Array("המשחק עדיין לא התחיל..","The game has not started yet…","Le jeu n'a pas encore commencé"),//241
new Array("סיום על ידי מדריך","סיום על ידי מדריך","סיום על ידי מדריך"),//242
new Array("קוד סיום שגוי - הקוד צריך להיות זהה לקוד הברקוד של סוף המשחק","Wrong final code- the code needs to be identical to the QR code at the final point","Le code de fin est erronné-Le code doit être identique à celui du code-barres de la fin du jeu."),//243
new Array("פעולה לא אושרה","Invalid action","Action invalide"),//244
new Array("מתוך  ","of ","parmi"),//245
new Array("פותח סורק...","Opening scanner…","Ouvrir le scan"),//246
null,//247
null,//248
null,//249
null,//250
null,//251
null,//252
null,//253
null,//254
null,//255
null,//256
null,//257
null,//258
null,//259
null,//260
null,//261
null,//262
null,//263
null,//264
null,//265
null,//266
null,//267
null,//268
null,//269
null,//270
null,//271
null,//272
null,//273
null,//274
null,//275
null,//276
null,//277
null,//278
null,//279
null,//280
null,//281
null,//282
null,//283
null,//284
null,//285
null,//286
null,//287
null,//288
null,//289
null,//290
null,//291
null,//292
null,//293
null,//294
null,//295
null,//296
null,//297
null,//298
null,//299
new Array("לא השלמתם את המשימה","You have not completed the task","Vous n'avez pas fini la mission"),//300
new Array("יש לסמן קווים עבור כל הריבועים","Connect all the squares","Vous devez marquer des lignes pour tous les carrés"),//301
new Array("כיוון החץ במעלות:","Direction:","Pointer la flèche vers l’azimut:"),//302
new Array("יש לוודא שהמספרים משתנים כשמזיזים את החץ","Check the number changes when you move the phone","Il faut vérifier que les nombres changent quand vous bougez la flèche"),//303
new Array("מצפן:","Compass:","Boussole:"),//304
new Array("מסך ראשוני:","First screen:","Premier écran"),//305
new Array("מסך:","Screen:","Ecran"),//306
new Array("אופס, הזמן עבר...","Oops, time up…","Oups, le temps est écoulé…"),//307
new Array("יפה, תשובה נכונה!","Right, correct answer!","Bravo, Bonne réponse!"),//308
new Array("אופס, תשובה לא נכונה!","Oops, incorrect answer","Oups, mauvaise réponse!"),//309
new Array("צלם שוב","Retake","Photographier de nouveau"),//310
new Array("דלג על משימת צילום","Skip picture","Faire l'impasse sur la mission de photo"),//311
new Array("זמן למשימה זו","Time for this task","Lle temps pour cette mission est de:"),//312
new Array("שניות","seconds","secondes"),//313
new Array("המשך...","Continue…","suite…."),//314
new Array("חזור","Back","Retour"),//315
new Array("הפעל צליל","Sound on","Faire fonctionner le son"),//316
new Array("השתק צליל","Mute","Annuler le son"),//317
new Array("הזמן עבר!","TIME UP","Votre temps est écoulé"),//318
null,//319
null,//320
null,//321
null,//322
null,//323
null,//324
null,//325
null,//326
null,//327
null,//328
null,//329
null,//330
null,//331
null,//332
null,//333
null,//334
null,//335
null,//336
null,//337
null,//338
null,//339
null,//340
null,//341
null,//342
null,//343
null,//344
null,//345
null,//346
null,//347
null,//348
null,//349
null,//350
null,//351
null,//352
null,//353
null,//354
null,//355
null,//356
null,//357
null,//358
null,//359
null,//360
null,//361
null,//362
null,//363
null,//364
null,//365
null,//366
null,//367
null,//368
null,//369
null,//370
null,//371
null,//372
null,//373
null,//374
null,//375
null,//376
null,//377
null,//378
null,//379
null,//380
null,//381
null,//382
null,//383
null,//384
null,//385
null,//386
null,//387
null,//388
null,//389
null,//390
null,//391
null,//392
null,//393
null,//394
//הדבקה כאן
];
    }