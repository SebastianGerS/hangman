'use strict';

// Globala variabler

var wordList = void 0; // Lista med spelets alla ord
var selectedWord = void 0; // Ett av orden valt av en slumpgenerator
var letterBoxes = void 0; //Rutorna där bokstäverna ska stå
var hangmanImg = void 0; //Bild som kommer vid fel svar
var hangmanImgNr = void 0; // Vilken av bilderna som kommer upp beroende på hur många fel du gjort
var msgElem = void 0; // Ger meddelande när spelet är över
var startGameBtn = void 0; // Knappen du startar spelet med
var letterButtons = void 0; // Knapparna för bokstäverna
var startTime = void 0; // Mäter tiden
var submitGuessBtn = void 0; // knapp som submitar användares gissning
var numberOfCorrectLetters = void 0; //visar hur många korekta bokstäver anvädnaren har gissat
var guessField = void 0;
var listOfGuesses = void 0;
var message = void 0;
var gameBoard = void 0;
var userInput = void 0;
var selectedWordCopy = void 0;
var uppercaseCopy = void 0;
var liLetterBoxes = void 0;
var userGuess = void 0;
var activateTimer = void 0;
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
    startGameBtn = document.querySelector('#startGameBtn');
    letterBoxes = document.querySelector('#letterBoxes');
    wordList = ['Chas Academy', 'Programming', 'School', 'Student', 'Teacher', 'JavaScript', 'Hyper Text Markup Language', 'Cascading Style Sheets', 'Hypertext Preprocessor', 'Game of Thrones'];
    startGameBtn.addEventListener('click', newGame);
    submitGuessBtn = document.querySelector("#userGuessBtn");
    submitGuessBtn.addEventListener('click', letterChecker);
    userInput = document.querySelector('#userGuess');
    userInput.addEventListener('change', letterChecker);
    hangmanImg = document.querySelector('#hangman');
    hangmanImgNr = 0;
    msgElem = document.querySelector('#message');
    letterButtons = document.querySelectorAll('#letterButtons li');
    guessField = document.querySelector('#guessField');
    message = document.createElement('p');
    msgElem.appendChild(message);
    gameBoard = document.querySelector('#gameBoard');
    startTime = document.querySelector('#timer');
    selectedWordCopy = "";
    uppercaseCopy = "";
} // End init

window.onload = init; // Se till att init aktiveras då sidan är inladdad

function newGame() {
    var myTimer = void 0;
    listOfGuesses = [];
    gameBoard.style.display = 'flex';
    message.innerHTML = "";
    hangmanImgNr = 0;
    hangmanImg.src = './images/h' + hangmanImgNr + '.png';
    wordSelector();
    numberOfLetterBoxes();
    resetLetterButtons();
    wordProcessing();
    clearInterval(activateTimer);
    startTime.innerHTML = 'Time: 00:00:00';
    myTimer = new Timer(0, 0, 0, 0, 0, 0);
    activateTimer = setInterval(myTimer.increment, 1000);
} // Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner
function resetLetterButtons() {
    for (var o = 0; o < letterButtons.length; o++) {
        letterButtons[o].classList.remove('disabled');
    }
}
function wordSelector() {
    selectedWord = wordList[Math.floor(Math.random() * 10)];
    numberOfCorrectLetters = 0;
} // Funktion som slumpar fram ett ord

function numberOfLetterBoxes() {
    while (letterBoxes.firstElementChild.firstChild) {
        letterBoxes.firstElementChild.removeChild(letterBoxes.firstElementChild.firstChild);
    }
    var newLi = void 0;
    for (var i = 0; i < selectedWord.length; i++) {
        if (selectedWord.charAt(i) == ' ') {
            letterBoxes.firstElementChild.lastChild.classList.add("margin-right");
        } else newLi = document.createElement('li');
        newLi.classList.add("liLetterBoxes");
        letterBoxes.firstElementChild.appendChild(newLi);
    }
    liLetterBoxes = document.querySelectorAll(".liLetterBoxes");
} // Funktionen som tar fram bokstävernas rutor, antal beror på vilket ord
function wordProcessing() {
    var phraseSplit = [];
    if (/ /.test(selectedWord)) {
        phraseSplit = selectedWord.split(" ");
        selectedWordCopy = "";
        for (var j = 0; j < phraseSplit.length; j++) {
            selectedWordCopy += phraseSplit[j];
        }
    } else {
        selectedWordCopy = selectedWord;
    }
    uppercaseCopy = selectedWordCopy.toUpperCase();
}

function guessPreprocessing() {
    userGuess = document.querySelector("#userGuess").value;
    userGuess = userGuess.trim();
    userGuess = userGuess.toUpperCase();
    document.querySelector("#userGuess").value = "";
}

function guessError() {
    if (userGuess === "" || userGuess === " ") {
        message.innerHTML = "incorect guess, you have to type atlest one letter ,try a nother guess!";
        return false;
    }
    for (var m = 0; m < listOfGuesses.length; m++) {
        if (listOfGuesses[m] == userGuess) {
            message.innerHTML = "incorect guess, you have alredy guessed this letter or phrase before, try a nother guess!";
            return false;
        }
    }
    return true;
}

function letterChecker() {
    message.innerHTML = "";
    guessPreprocessing();
    if (!guessError()) {
        guessError();
        return;
    }
    var guessIndex = uppercaseCopy.search(userGuess);
    var itsAMatch = false;
    if (userGuess.length == 1) {
        for (var k = 0; k < selectedWordCopy.length; k++) {
            if (uppercaseCopy.charAt(k) == userGuess && !liLetterBoxes[k].classList.contains("corect-letter")) {
                itsAMatch = true;
                liLetterBoxes[k].innerHTML = selectedWordCopy.charAt(k);
                liLetterBoxes[k].classList.add("corect-letter");
                numberOfCorrectLetters++;
            }
        }
    } else if (userGuess.length > 1 && guessIndex != -1) {
        for (var l = 0; l < liLetterBoxes.length; l++) {
            if (l == guessIndex) {
                itsAMatch = true;
                for (var m = 0; m < userGuess.length; m++) {
                    if (!liLetterBoxes[l].classList.contains("corect-letter")) {
                        liLetterBoxes[l].innerHTML = selectedWordCopy.charAt(l);
                        liLetterBoxes[l].classList.add("corect-letter");
                        numberOfCorrectLetters++;
                    }
                    l++;
                }
            }
        }
    }

    for (var n = 0; n < letterButtons.length; n++) {
        if (letterButtons[n].textContent == userGuess) {
            letterButtons[n].classList.add('disabled');
        }
    }
    listOfGuesses.push(userGuess);
    gameStateUpdate(itsAMatch);
} /// Funktion som körs när du trycker på bokstäverna och gissar bokstav

function gameStateUpdate(itsAMatch) {
    if (!itsAMatch) {
        hangmanImgNr++;
        if (hangmanImgNr <= 6) {
            hangmanImg.src = './images/h' + hangmanImgNr + '.png';
        } else {
            clearInterval(activateTimer);
            message.innerHTML = "Game Over :'(";
            gameBoard.style.display = 'none';
        }
    } else if (itsAMatch && numberOfCorrectLetters == selectedWordCopy.length) {
        clearInterval(activateTimer);
        hangmanImgNr = 0;
        message.innerHTML = "You won! <br/> You guessed the corect word: <em>" + selectedWord + "</em> <br/>Number of guesses: " + listOfGuesses.length + " <br/>" + startTime.textContent + "<br/> Congratualtions!";
        gameBoard.style.display = 'none';
    }
} // Funktionen ropas vid vinst eller förlust, gör olika saker beroende av det

function Timer(s1, s2, m1, m2, h1, h2) {
    var _this = this;

    this.s1 = s1 || 0;
    this.s2 = s2 || 0;
    this.m1 = m1 || 0;
    this.m2 = m2 || 0;
    this.h1 = h1 || 0;
    this.h2 = h2 || 0;

    this.increment = function () {
        _this.s1++;
        if (_this.s1 == 10) {
            _this.s2++;
            _this.s1 = 0;
        }
        if (_this.s2 == 6) {
            _this.m1++;
            _this.s2 = 0;
        }
        if (_this.m1 == 10) {
            _this.m2++;
            _this.m1 = 0;
        }
        if (_this.m2 == 6) {
            _this.h1++;
            _this.m2 = 0;
        }
        if (_this.h1 == 10) {
            _this.h2++;
            _this.h1 = 0;
        }
        startTime.innerHTML = 'Time: ' + _this.h2 + _this.h1 + ':' + _this.m2 + _this.m1 + ':' + _this.s2 + _this.s1;
    };
}