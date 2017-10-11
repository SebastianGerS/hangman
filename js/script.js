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
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
    startGameBtn = document.querySelector('#startGameBtn');
    letterBoxes = document.querySelector('#letterBoxes');
    wordList = ['Chas Academy', 'Programming','School','Student','Teacher','JavaScript','Hyper Text Markup Language','Cascading Style Sheets', 'Hypertext Preprocessor','Game of Thrones'];
    startGameBtn.addEventListener('click',newGame);
    submitGuessBtn = document.querySelector("#userGuessBtn");
    submitGuessBtn.addEventListener('click', letterChecker);
    hangmanImg = document.querySelector('#hangman');
    hangmanImgNr = 0; 
    msgElem = document.querySelector('#message');
    letterButtons = document.querySelector('#letterButtons');
    guessField = document.querySelector('#guessField');
    victoryMessage = document.createElement('p');
    gameOverMessege = document.createElement('p');
    
   

} // End init

window.onload = init; // Se till att init aktiveras då sidan är inladdad

function newGame() {
    listOfGuesses = [];
    letterButtons.style.display = 'inline-flex';
    guessField.style.display = 'inline-flex';
    victoryMessage.innerHTML = "";
    gameOverMessege.innerHTML = "";
    hangmanImg.src = './images/h0.png'; 
    wordSelector();
    numberOfLetters();
    

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
    var phraseSplit;
    var selectedWordCopy = "";
    var uppercaseCopy = "";
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
    for (var m = 0; m < listOfGuesses.length; m++) {
        if (listOfGuesses[m] == userGuess) {
            console.log('incorect guess, you have alredy guessed this letter or phrase before');
            return;
        }
    }
    var guessIndex = uppercaseCopy.search(userGuess);
    var itsAMatch = false;
    var liList = document.querySelectorAll(".liLetterBoxes");
    if (userGuess.length == 1) {
        for (var k = 0; k < selectedWordCopy.length; k++) {  
            if(uppercaseCopy.charAt(k) == userGuess) {
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
                    liList[l].innerHTML= selectedWordCopy.charAt(l);
                    liList[l].classList.add("corect-letter");
                    l++;
                    numberOfCorrectLetters++;
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
        }
    } else if (itsAMatch && numberOfCorrectLetters >= selectedWordCopy.length) {
        victoryMessage.innerHTML = "You Won!!!!";    
        msgElem.appendChild(victoryMessage);

    } else if(itsAMatch) {
       
    }

} /// Funktion som körs när du trycker på bokstäverna och gissar bokstav

// Funktionen ropas vid vinst eller förlust, gör olika saker beroende av det

// Funktion som inaktiverar/aktiverar bokstavsknapparna beroende på vilken del av spelet du är på