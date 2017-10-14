// Globala variabler

var wordList; // Lista med spelets alla ord
var selectedWord; // Ett av orden valt av en slumpgenerator
var letterBoxes; //Rutorna där bokstäverna ska stå
var hangmanImg; //Bild som kommer vid fel svar
var hangmanImgNr; // Vilken av bilderna som kommer upp beroende på hur många fel du gjort
var msgElem; // Ger meddelande när spelet är över
var startGameBtn; // Knappen du startar spelet med
var letterButtons; // Knapparna för bokstäverna
var startTime; // Mäter tiden
var submitGuessBtn; // knapp som submitar användares gissning
var numberOfCorrectLetters; //visar hur många korekta bokstäver anvädnaren har gissat
var guessField;
var listOfGuesses;
var victoryMessage;
var gameOverMessege;
var errorMessage;
var gameBoard;
var userInput;var s1 = 0;
var s2;
var m1;
var m2;
var h1;
var h2;
var myTimer;

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
    startGameBtn = document.querySelector('#startGameBtn');
    letterBoxes = document.querySelector('#letterBoxes');
    wordList = ['Chas Academy', 'Programming','School','Student','Teacher','JavaScript','Hyper Text Markup Language','Cascading Style Sheets', 'Hypertext Preprocessor','Game of Thrones'];
    startGameBtn.addEventListener('click',newGame);
    submitGuessBtn = document.querySelector("#userGuessBtn");
    submitGuessBtn.addEventListener('click', letterChecker);
    userInput = document.querySelector('#userGuess');
    userInput.addEventListener('change',letterChecker);
    hangmanImg = document.querySelector('#hangman');
    hangmanImgNr = 0; 
    msgElem = document.querySelector('#message');
    letterButtons = document.querySelectorAll('#letterButtons li');
    guessField = document.querySelector('#guessField');
    victoryMessage = document.createElement('p');
    gameOverMessege = document.createElement('p');
    errorMessage = document.createElement('p');
    gameBoard = document.querySelector('#gameBoard');
    startTime = document.querySelector('#timer');
    

    
   

} // End init

window.onload = init; // Se till att init aktiveras då sidan är inladdad

function newGame() {
    listOfGuesses = [];
    gameBoard.style.display = 'flex';
    victoryMessage.innerHTML = "";
    gameOverMessege.innerHTML = "";
    errorMessage.innerHTML = ""; 
    hangmanImg.src = './images/h0.png'; 
    wordSelector();
    numberOfLetters();
    for (var o = 0; o < letterButtons.length; o++) {
            letterButtons[o].classList.remove('disabled');
    }
    clearInterval(myTimer);
    s1 = 0;
    s2 = 0;
    m1 = 0;
    m2 = 0;
    h1 = 0;
    h2 = 0;
    startTime.innerHTML ='Timer: '+ h2 + h1 + ':' +m2 + m1 + ':'+ s2 + s1;

    myTimer =setInterval(timer, 1000);
   
    

}// Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner

function wordSelector() {
    selectedWord = wordList[Math.floor(Math.random()*10)];
    numberOfCorrectLetters = 0;

}// Funktion som slumpar fram ett ord
 
function numberOfLetters() {
    while(letterBoxes.firstElementChild.firstChild) {
        letterBoxes.firstElementChild.removeChild(letterBoxes.firstElementChild.firstChild);
    }
    var newLi;
    for (var i = 0; i < selectedWord.length; i++) {
        if (selectedWord.charAt(i) == ' ') {
            letterBoxes.firstElementChild.lastChild.classList.add("margin-right");
        } else 
            newLi = document.createElement('li');
            newLi.classList.add("liLetterBoxes");
            letterBoxes.firstElementChild.appendChild(newLi);
    }
}// Funktionen som tar fram bokstävernas rutor, antal beror på vilket ord

function letterChecker() {
    if (msgElem.firstChild) {
        msgElem.removeChild;
    }
    var phraseSplit;
    var selectedWordCopy = "";
    var uppercaseCopy = "";
    errorMessage.innerHTML = ""; 
    if (/ /.test(selectedWord)) {
        phraseSplit = selectedWord.split(" ");

        for (j= 0; j< phraseSplit.length; j++) {
            selectedWordCopy += phraseSplit[j]; 
        }
    } else {
        selectedWordCopy = selectedWord;
    }
    uppercaseCopy = selectedWordCopy.toUpperCase();
    var userGuess = document.querySelector("#userGuess").value;
    userGuess = userGuess.trim();
    userGuess = userGuess.toUpperCase();
    document.querySelector("#userGuess").value = "";
    for (var m = 0; m < listOfGuesses.length; m++) {
        if (listOfGuesses[m] == userGuess) {
            errorMessage.innerHTML = "incorect guess, you have alredy guessed this letter or phrase before, try a nother guess!";
            msgElem.appendChild(errorMessage);
            return;
        }
    }
    var guessIndex = uppercaseCopy.search(userGuess);
    var itsAMatch = false;
    var liList = document.querySelectorAll(".liLetterBoxes");
    if (userGuess.length == 1) {
        for (var k = 0; k < selectedWordCopy.length; k++) {  
            if(uppercaseCopy.charAt(k) == userGuess && !liList[k].classList.contains("corect-letter") ) {
                itsAMatch = true;
                liList[k].innerHTML = selectedWordCopy.charAt(k);
                liList[k].classList.add("corect-letter");
                numberOfCorrectLetters++;
            }
        }
    } else if (userGuess.length > 1 && guessIndex != -1){
        for (var l = 0; l < liList.length; l++ ) {
            if( l == guessIndex) {
                itsAMatch = true;
                for (var m = 0; m < userGuess.length; m++) {
                    if (!liList[l].classList.contains("corect-letter")) {
                        liList[l].innerHTML= selectedWordCopy.charAt(l);
                        liList[l].classList.add("corect-letter");
                        numberOfCorrectLetters++;
                    }
                    l++;
                }
            }

        }

    }
    listOfGuesses.push(userGuess);
    if (!itsAMatch) {
        hangmanImgNr++;
        if(hangmanImgNr <= 6) {
            hangmanImg.src = './images/h' + hangmanImgNr + '.png'; 
        } else {
            gameOverMessege.innerHTML = "Game Over :'(";
            msgElem.appendChild(gameOverMessege);
            gameBoard.style.display = 'none';
        }
    } else if (itsAMatch && numberOfCorrectLetters >= selectedWordCopy.length) {
        victoryMessage.innerHTML = "You Won!!!!";    
        msgElem.appendChild(victoryMessage);
        gameBoard.style.display = 'none';

    } else if(itsAMatch) {
       
    }
    for (var n = 0; n < letterButtons.length; n++) {
        if(letterButtons[n].textContent == userGuess) {
            letterButtons[n].classList.add('disabled');
        }
    }

} /// Funktion som körs när du trycker på bokstäverna och gissar bokstav

// Funktionen ropas vid vinst eller förlust, gör olika saker beroende av det

// Funktion som inaktiverar/aktiverar bokstavsknapparna beroende på vilken del av spelet du är på

function timer() {
    
    s1++;
    if (s1 ==  10) {
        s2++;
        s1 = 0;    
    } 
    if (s2 == 10) {
        m1++;
        s2 = 0;
    }
    if (m1 == 10) {
        m2++;
        m1 = 0;
    }
    if (m2 == 10) {
        h1++;
        m2 = 0;
    }
    if (h1 == 10) {
        h2++;
        h1 = 0;
    }
    startTime.innerHTML ='Timer: '+ h2 + h1 + ':' +m2 + m1 + ':'+ s2 + s1;
    
}