'use strict';

// Globala variabler

var wordList = void 0; // Lista med spelets alla ord
var selectedWord = void 0; // Ett av orden valt av en slumpgenerator
var letterBoxes = void 0; //Rutorna där bokstäverna ska stå
var hangmanImg = void 0; //Bild som kommer vid fel svar
var hangmanImgNr = void 0; // Vilken av bilderna som kommer upp beroende på hur många fel du gjort
var msgElem = void 0; // Ger meddelande när spelet är över
var message = void 0; // p ellement som apendas till msgElem
var startGameBtn = void 0; // Knappen du startar spelet med
var letterButtons = void 0; // Knapparna för bokstäverna
var startTime = void 0; // Mäter tiden
var guessField = void 0; // knapp som submitar användares gissning
var numberOfCorrectLetters = void 0; //visar hur många korekta bokstäver anvädnaren har gissat
var listOfGuesses = void 0; //lista på de gissade orden/bokstäverna
var gameBoard = void 0; //område som visas när spelet startas
var userInput = void 0; // input fälet där användaren matar in sina gissningar
var selectedWordCopy = void 0; // kopia av selectedword utan whitespace 
var uppercaseCopy = void 0; // kopia av selectedword utan whitespace och med stora bokstäver
var liLetterBoxes = void 0; // array med alla liLetterBoxes
var instructions = void 0; // reglerna för spelet
var activateTimer = void 0; // setInterval som satt för timern
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
var init = function init() {
    startGameBtn = document.querySelector('#startGameBtn');
    letterBoxes = document.querySelector('#letterBoxes');
    wordList = ['Chas Academy', 'Programming', 'School', 'Student', 'Teacher', 'JavaScript', 'HyperText Markup Language', 'Cascading Style Sheets', 'Hypertext Preprocessor', 'Game of Thrones'];
    startGameBtn.addEventListener('click', newGame);
    guessField = document.querySelector("#guessField");
    guessField.addEventListener('submit', letterChecker);
    userInput = document.querySelector('#userGuess');
    hangmanImg = document.querySelector('#hangman');
    hangmanImgNr = 0;
    msgElem = document.querySelector('#message');
    letterButtons = document.querySelectorAll('#letterButtons li button');
    for (var p = 0; p < letterButtons.length; p++) {
        letterButtons[p].addEventListener('click', insertLetter);
    }
    message = document.createElement('p');
    msgElem.appendChild(message);
    gameBoard = document.querySelector('#gameBoard');
    startTime = document.querySelector('#timer');
    selectedWordCopy = "";
    uppercaseCopy = "";
    instructions = document.querySelector('#instructions');
}; // End init

window.onload = init; // Se till att init aktiveras då sidan är inladdad

var newGame = function newGame() {
    var myTimer = void 0; // sparar ny timer
    hangmanImgNr = 0;
    hangmanImg.src = './images/h' + hangmanImgNr + '.png';
    instructions.style.display = "none";
    listOfGuesses = [];
    gameBoard.style.display = 'flex';
    message.innerHTML = "";
    wordSelector();
    numberOfLetterBoxes();
    resetLetterButtons();
    wordProcessing();
    clearInterval(activateTimer);
    startTime.innerHTML = 'Time: 00:00:00';
    myTimer = new Timer(0);
    activateTimer = setInterval(myTimer.increment, 10);
}; // Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner
var resetLetterButtons = function resetLetterButtons() {
    for (var o = 0; o < letterButtons.length; o++) {
        if (letterButtons[o].classList.contains('disabled')) {
            letterButtons[o].classList.remove('disabled');
        }
    }
}; //tar bort classen disabled från letterbuttons som har den klassen
var wordSelector = function wordSelector() {
    selectedWord = wordList[Math.floor(Math.random() * 10)];
    numberOfCorrectLetters = 0;
}; // Funktion som slumpar fram ett ord

var numberOfLetterBoxes = function numberOfLetterBoxes() {
    while (letterBoxes.firstElementChild.firstChild) {
        letterBoxes.firstElementChild.removeChild(letterBoxes.firstElementChild.firstChild);
    }
    var newLi = void 0;
    for (var i = 0; i < selectedWord.length; i++) {
        if (selectedWord.charAt(i) === ' ') {
            letterBoxes.firstElementChild.lastChild.classList.add("margin-right");
        } else newLi = document.createElement('li');
        newLi.classList.add("liLetterBoxes");
        letterBoxes.firstElementChild.appendChild(newLi);
    }
    liLetterBoxes = document.querySelectorAll(".liLetterBoxes");
}; // Funktionen som tar fram bokstävernas rutor, antal beror på vilket längden på ordet
var wordProcessing = function wordProcessing() {
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
}; //sparar det valda ordet till två olika variabler till den första efter att whitespace har tagits bort och sedan till den andra när den gjorts om till uppercase

var insertLetter = function insertLetter() {
    if (this.value === "Delete") {
        var toSave = userInput.value;
        toSave = toSave.substring(0, toSave.length - 1);
        userInput.value = toSave; // tar bort en bokstav från input fältet om knapen man dryckt på har värdet Delete
    } else if (!this.classList.contains("disabled")) {
        userInput.value += this.value; // kollar om knappen har klassen diabled och om inte så sätts värdet i knappen in i inputfältet
    }
}; //funktion som sätter in den bokstav inputfältet (kopplad till letterbuttons eventlysnare)

var guessPreprocessing = function guessPreprocessing() {
    var guess = userInput.value;
    guess = guess.trim();
    guess = guess.toUpperCase();
    userInput.value = "";
    return guess;
}; //funktion som sparar värdet från den in skickade gissningen trimmar bort eventuelt whitespace och gör om inputen till uppercase och tömmer inputfältet  

var guessError = function guessError(userGuess) {
    if (userGuess === "" || userGuess === " ") {
        message.innerHTML = "incorect guess, you have to type atlest one letter ,try a nother guess!";
        return false;
    }
    for (var m = 0; m < listOfGuesses.length; m++) {
        if (listOfGuesses[m] === userGuess) {
            message.innerHTML = "incorect guess, you have alredy guessed this letter or phrase before, try a nother guess!";
            return false;
        }
    }
    return true;
};

var letterChecker = function letterChecker(e) {
    e.preventDefault();
    message.innerHTML = "";
    var userGuess = guessPreprocessing();
    if (!guessError(userGuess)) {
        return;
    }
    var guessIndex = uppercaseCopy.search(userGuess);
    var itsAMatch = false;
    if (userGuess.length === 1) {
        for (var k = 0; k < selectedWordCopy.length; k++) {
            if (uppercaseCopy.charAt(k) === userGuess && !liLetterBoxes[k].classList.contains("corect-letter")) {
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
        if (letterButtons[n].textContent === userGuess) {
            letterButtons[n].classList.add('disabled');
        }
    }
    listOfGuesses.push(userGuess);
    gameStateUpdate(itsAMatch);
}; /// Funktion som körs när du trycker på bokstäverna och gissar bokstav

var gameStateUpdate = function gameStateUpdate(itsAMatch) {
    if (!itsAMatch) {
        hangmanImgNr++;
        if (hangmanImgNr < 6) {
            hangmanImg.src = './images/h' + hangmanImgNr + '.png';
        } else {
            clearInterval(activateTimer);
            hangmanImg.src = './images/h' + hangmanImgNr + '.png';
            message.innerHTML = 'Game Over :\'( <br/> the corect word was: ' + selectedWord;
            gameBoard.style.display = 'none';
        }
    } else if (itsAMatch && numberOfCorrectLetters === selectedWordCopy.length) {
        clearInterval(activateTimer);
        message.innerHTML = 'You won! <br/> You guessed the corect word: <em> ' + selectedWord + ' </em> <br/>Number of guesses: ' + listOfGuesses.length + ' <br/> ' + startTime.textContent + ' <br/> Congratualtions!';
        gameBoard.style.display = 'none';
    }
}; // Funktionen som uppdaterar läget i spelat, gör olika saker beroende på om användares gissning var rätt eller fel

var Timer = function Timer(t) {
    var _this = this;

    this.ms = t;
    this.s = t;
    this.m = t;

    this.increment = function () {
        _this.ms++;

        if (_this.ms == 100) {
            _this.s++;
            _this.ms = 0;
        }
        if (_this.s == 60) {
            _this.m++;
            _this.s = 0;
        }
        startTime.innerHTML = 'Time: ' + _this.m + ':' + _this.s + ':' + _this.ms;
    };
};