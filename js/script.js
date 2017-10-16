// Globala variabler

let wordList; // Lista med spelets alla ord
let selectedWord; // Ett av orden valt av en slumpgenerator
let letterBoxes; //Rutorna där bokstäverna ska stå
let hangmanImg; //Bild som kommer vid fel svar
let hangmanImgNr; // Vilken av bilderna som kommer upp beroende på hur många fel du gjort
let msgElem; // Ger meddelande när spelet är över
let startGameBtn; // Knappen du startar spelet med
let letterButtons; // Knapparna för bokstäverna
let startTime; // Mäter tiden
let submitGuessBtn; // knapp som submitar användares gissning
let numberOfCorrectLetters; //visar hur många korekta bokstäver anvädnaren har gissat
let guessField;
let listOfGuesses;
let message;
let gameBoard;
let userInput;
let selectedWordCopy;
let uppercaseCopy;
let liLetterBoxes;
let userGuess;
let activateTimer;
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
    userInput.addEventListener('keypress', function (event) {if (event.key === "Enter") {letterChecker()}});
    hangmanImg = document.querySelector('#hangman');
    hangmanImgNr = 0; 
    msgElem = document.querySelector('#message');
    letterButtons = document.querySelectorAll('#letterButtons li button');
    for (let p = 0; p < letterButtons.length; p++) {
        letterButtons[p].addEventListener('click',insertLetter);
    } 
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
    let myTimer;
    listOfGuesses = [];
    gameBoard.style.display = 'flex';
    message.innerHTML = "";
    hangmanImgNr = 0;
    hangmanImg.src = './images/h' +hangmanImgNr + '.png'; 
    wordSelector();
    numberOfLetterBoxes();
    resetLetterButtons();
    wordProcessing(); 
    clearInterval(activateTimer);
    startTime.innerHTML ='Time: 00:00:00';
    myTimer = new Timer(0,0,0,0,0,0);
    activateTimer = setInterval(myTimer.increment, 1000);
}// Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner
function resetLetterButtons() {
    for (let o = 0; o < letterButtons.length; o++) {
        letterButtons[o].classList.remove('disabled');
    }
}
function wordSelector() {
    selectedWord = wordList[Math.floor(Math.random()*10)];
    numberOfCorrectLetters = 0;
    

}// Funktion som slumpar fram ett ord
 
function numberOfLetterBoxes() {
    while(letterBoxes.firstElementChild.firstChild) {
        letterBoxes.firstElementChild.removeChild(letterBoxes.firstElementChild.firstChild);
    }
    let newLi;
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord.charAt(i) == ' ') {
            letterBoxes.firstElementChild.lastChild.classList.add("margin-right");
        } else 
            newLi = document.createElement('li');
            newLi.classList.add("liLetterBoxes");
            letterBoxes.firstElementChild.appendChild(newLi);
    }
    liLetterBoxes = document.querySelectorAll(".liLetterBoxes");
}// Funktionen som tar fram bokstävernas rutor, antal beror på vilket ord
function wordProcessing() {
    let phraseSplit = [];
    if (/ /.test(selectedWord)) {
        phraseSplit = selectedWord.split(" ");
        selectedWordCopy = ""; 
        for (let j = 0; j < phraseSplit.length; j++) {
            selectedWordCopy += phraseSplit[j]; 
        }

    } else {
        selectedWordCopy = selectedWord;
    }
    uppercaseCopy = selectedWordCopy.toUpperCase();

}

function insertLetter() {
    if (this.value == "Delete") {
    let toSave = document.querySelector("#userGuess").value;
    toSave = toSave.substring(0,toSave.length-1);
    document.querySelector("#userGuess").value = toSave;
    } else {
    document.querySelector("#userGuess").value += this.value;
    }
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
    for (let m = 0; m <listOfGuesses.length; m++) {
        if (listOfGuesses[m] == userGuess) {
            message.innerHTML = "incorect guess, you have alredy guessed this letter or phrase before, try a nother guess!";
            return false;
        }
    }
    return true
}

function letterChecker() {
    message.innerHTML = ""; 
    guessPreprocessing(); 
    if (!guessError()) {
        guessError();
        return 
    }
    let guessIndex = uppercaseCopy.search(userGuess);
    let itsAMatch = false;
    if (userGuess.length == 1) {
        for (let k = 0; k < selectedWordCopy.length; k++) {  
            if(uppercaseCopy.charAt(k) == userGuess && !liLetterBoxes[k].classList.contains("corect-letter") ) {
                itsAMatch = true;
                liLetterBoxes[k].innerHTML = selectedWordCopy.charAt(k);
                liLetterBoxes[k].classList.add("corect-letter");
                numberOfCorrectLetters++;
            }
        }
    } else if (userGuess.length > 1 && guessIndex != -1){
        for (let l = 0; l < liLetterBoxes.length; l++ ) {
            if( l == guessIndex) {
                itsAMatch = true;
                for (let m = 0; m < userGuess.length; m++) {
                    if (!liLetterBoxes[l].classList.contains("corect-letter")) {
                        liLetterBoxes[l].innerHTML= selectedWordCopy.charAt(l);
                        liLetterBoxes[l].classList.add("corect-letter");
                        numberOfCorrectLetters++;
                    }
                    l++;
                }
            }

        }

    }
    
    for (let n = 0; n < letterButtons.length; n++) {
        if(letterButtons[n].textContent == userGuess) {
            letterButtons[n].classList.add('disabled');
        }
    }
    listOfGuesses.push(userGuess);
    gameStateUpdate(itsAMatch);
} /// Funktion som körs när du trycker på bokstäverna och gissar bokstav

function gameStateUpdate(itsAMatch) {
    if (!itsAMatch) {
        hangmanImgNr++;
        if(hangmanImgNr <= 6) {
            hangmanImg.src = './images/h' + hangmanImgNr + '.png'; 
        } else {
            clearInterval(activateTimer);
            message.innerHTML = "Game Over :'(";
            gameBoard.style.display = 'none';
        }
    } else if (itsAMatch && numberOfCorrectLetters == selectedWordCopy.length) {
        clearInterval(activateTimer);
        hangmanImgNr = 0;
        message.innerHTML = "You won! <br/> You guessed the corect word: <em>" + selectedWord + "</em> <br/>Number of guesses: " + listOfGuesses.length + " <br/>" + startTime.textContent +"<br/> Congratualtions!";    
        gameBoard.style.display = 'none';
    }
    

}// Funktionen ropas vid vinst eller förlust, gör olika saker beroende av det

function Timer(s1,s2,m1,m2,h1,h2) {
    this.s1 = s1 || 0;
    this.s2 = s2 || 0;
    this.m1 = m1 || 0;
    this.m2 = m2 || 0;
    this.h1 = h1 || 0;
    this.h2 = h2 || 0;

    this.increment = () => {
            this.s1++;
        if (this.s1 ==  10) {
            this.s2++;
            this.s1 = 0;    
        } 
        if (this.s2 == 6) {
            this.m1++;
            this.s2 = 0;
        }
        if (this.m1 == 10) {
            this.m2++;
            this.m1 = 0;
        }
        if (this.m2 == 6) {
            this.h1++;
            this.m2 = 0;
        }
        if (this.h1 == 10) {
            this.h2++;
            this.h1 = 0;
        }
        startTime.innerHTML ='Time: '+ this.h2 + this.h1 + ':' +this.m2 + this.m1 + ':'+ this.s2 + this.s1;
    }
    
}