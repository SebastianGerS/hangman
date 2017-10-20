// Globala variabler

let wordList; // Lista med spelets alla ord
let selectedWord; // Ett av orden valt av en slumpgenerator
let letterBoxes; //Rutorna där bokstäverna ska stå
let hangmanImg; //Bild som kommer vid fel svar
let hangmanImgNr; // Vilken av bilderna som kommer upp beroende på hur många fel du gjort
let msgElem; // Ger meddelande när spelet är över
let message; // p ellement som apendas till msgElem
let startGameBtn; // Knappen du startar spelet med
let letterButtons; // Knapparna för bokstäverna
let gameClock; // Mäter tiden
let guessField; // knapp som submitar användares gissning
let numberOfCorrectLetters; //visar hur många korekta bokstäver anvädnaren har gissat
let listOfGuesses;//lista på de gissade orden/bokstäverna
let gameBoard; //område som visas när spelet startas
let userInput; // input fälet där användaren matar in sina gissningar
let selectedWordCopy; // kopia av selectedword utan whitespace 
let uppercaseCopy; // kopia av selectedword utan whitespace och med stora bokstäver
let liLetterBoxes; // array med alla liLetterBoxes
let instructions; // reglerna för spelet
let activateTimer; // setInterval som satt för timern
let overrideCheckbox;
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
const init = function() {
    startGameBtn = document.querySelector('#startGameBtn');
    letterBoxes = document.querySelector('#letterBoxes');
    wordList = ['Chas Academy', 'Programming','School','Student','Teacher','JavaScript','HyperText Markup Language','Cascading Style Sheets', 'Hypertext Preprocessor','Game of Thrones'];
    startGameBtn.addEventListener('click',newGame);
    guessField = document.querySelector("#guessField");
    guessField.addEventListener('submit', letterChecker);
    userInput = document.querySelector('#userGuess');
    hangmanImg = document.querySelector('#hangman');
    hangmanImgNr = 0; 
    msgElem = document.querySelector('#message');
    letterButtons = document.querySelectorAll('#letterButtons li button');
    for (let p = 0; p < letterButtons.length; p++) {
        letterButtons[p].addEventListener('click',insertLetter);
    } 
    message = document.createElement('p');
    msgElem.appendChild(message);
    gameBoard = document.querySelector('#gameBoard');
    gameClock = document.querySelector('#timer');
    selectedWordCopy = "";
    uppercaseCopy = "";
    instructions = document.querySelector('#instructions');
    overrideCheckbox = document.querySelector('#overrideCheckbox');
    overrideCheckbox.addEventListener('change',overrideDisable);
} // End init

window.onload = init; // Se till att init aktiveras då sidan är inladdad

const newGame = function() {
    let myTimer; // sparar ny timer
    hangmanImgNr = 0;
    hangmanImg.src = `./images/h${hangmanImgNr}.png`; 
    instructions.style.display = "none";
    listOfGuesses = [];
    gameBoard.style.display = 'flex';
    message.innerHTML = "";
    wordSelector();
    numberOfLetterBoxes();
    resetLetterButtons();
    wordProcessing(); 
    clearInterval(activateTimer);
    myTimer = new Timer(gameClock);
    activateTimer = setInterval(myTimer.increment, 10);
}// Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner

const resetLetterButtons = function() {
    for (let o = 0; o < letterButtons.length; o++) {
        if(letterButtons[o].classList.contains('disabled')) {
            letterButtons[o].classList.remove('disabled');
        }
    }
} //tar bort classen disabled från letterbuttons som har den klassen

const wordSelector = function() {
    selectedWord = wordList[Math.floor(Math.random()*10)];
    numberOfCorrectLetters = 0;
}// Funktion som slumpar fram ett ord
 
const numberOfLetterBoxes = function() {
    while(letterBoxes.firstElementChild.firstChild) {
        letterBoxes.firstElementChild.removeChild(letterBoxes.firstElementChild.firstChild);
    }
    let newLi;
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord.charAt(i) === ' ') {
            letterBoxes.firstElementChild.lastChild.classList.add("margin-right");
        } else 
            newLi = document.createElement('li');
            newLi.classList.add("liLetterBoxes");
            letterBoxes.firstElementChild.appendChild(newLi);
    }
    liLetterBoxes = document.querySelectorAll(".liLetterBoxes");
}// Funktionen som tar fram bokstävernas rutor, antal beror på vilket längden på ordet

const wordProcessing = function() {
    if (/ /.test(selectedWord)) {
        let phraseSplit = [];
        phraseSplit = selectedWord.split(" ");
        selectedWordCopy = ""; 
        for (let j = 0; j < phraseSplit.length; j++) {
            selectedWordCopy += phraseSplit[j]; 
        }

    } else {
        selectedWordCopy = selectedWord;
    }
    uppercaseCopy = selectedWordCopy.toUpperCase();

} //sparar det valda ordet till två olika variabler till den första efter att whitespace har tagits bort och sedan till den andra när den gjorts om till uppercase

const insertLetter = function() {
    if (this.value === "Delete") {
        let toSave = userInput.value;
        toSave = toSave.substring(0,toSave.length-1);
        userInput.value = toSave; // tar bort en bokstav från input fältet om knapen man dryckt på har värdet Delete
    } else if (!this.classList.contains("disabled")||this.classList.contains("override")){
        userInput.value += this.value; // kollar om knappen har klassen diabled och om inte så sätts värdet i knappen in i inputfältet
    }
} //funktion som sätter in den bokstav inputfältet (kopplad till letterbuttons eventlysnare)

const guessPreprocessing = function() {
    let guess = userInput.value;
    guess = guess.trim();
    guess = guess.toUpperCase();
    userInput.value = "";
    if (/ /.test(guess)) {
        let phraseSplit = [];
        phraseSplit = guess.split(" ");
        guess = ""; 
        for (let p = 0; p < phraseSplit.length; p++) {
            guess += phraseSplit[p]; 
        }
    } 
    return guess;
} //funktion som sparar värdet från den in skickade gissningen trimmar bort eventuelt whitespace och gör om inputen till uppercase och tömmer inputfältet  

const guessError = function (userGuess) {
    if (userGuess === "" || userGuess === " ") { 
        message.innerHTML = "incorect guess, you have to type atlest one letter ,try a nother guess!";
        return false;
    }
    for (let m = 0; m <listOfGuesses.length; m++) {
        if (listOfGuesses[m] === userGuess) {
            message.innerHTML = "incorect guess, you have alredy guessed this letter or phrase before, try a nother guess!";
            return false;
        }
    }
    return true
}

const letterChecker= function(e) {
    e.preventDefault();
    message.innerHTML = ""; 
    let userGuess = guessPreprocessing(); 
    if (!guessError(userGuess)) {
        return 
    }
    let guessIndex = uppercaseCopy.search(userGuess);
    let itsAMatch = false;
    if (userGuess.length === 1) {
        for (let k = 0; k < selectedWordCopy.length; k++) {  
            if(uppercaseCopy.charAt(k) === userGuess && !liLetterBoxes[k].classList.contains("corect-letter") ) {
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

    disableLetterButtons(userGuess);
    listOfGuesses.push(userGuess);
    gameStateUpdate(itsAMatch);
} /// Funktion som körs när du trycker på bokstäverna och gissar bokstav
const disableLetterButtons = function (userGuess) {
    for (let n = 0; n < letterButtons.length; n++) {
        if(letterButtons[n].textContent === userGuess) {
            letterButtons[n].classList.add('disabled');
        }
    }
}
const overrideDisable = function() {
    for (let q = 0; q < letterButtons.length; q++) {
        if(!letterButtons[q].classList.contains('override'))
            letterButtons[q].classList.add('override');
        else {
            letterButtons[q].classList.remove('override');
        }
    }
}
const gameStateUpdate = function(itsAMatch) {
    if (!itsAMatch) {
        hangmanImgNr++;
        if(hangmanImgNr < 6) {
            hangmanImg.src = `./images/h${hangmanImgNr}.png`; 
        } else {
            clearInterval(activateTimer);
            hangmanImg.src = `./images/h${hangmanImgNr}.png`; 
            message.innerHTML = `You Dead &#128520; <br/> the corect word was: <em> ${selectedWord}<em>`;
            gameBoard.style.display = 'none';
        }
    } else if (itsAMatch && numberOfCorrectLetters === selectedWordCopy.length) {
        clearInterval(activateTimer);
        message.innerHTML = `You won! <br/> You guessed the corect word: <em> ${selectedWord} </em> <br/>Number of guesses: ${listOfGuesses.length} <br/> ${gameClock.textContent} <br/> Congratualtions!`;    
        gameBoard.style.display = 'none';
    }

}// Funktionen som uppdaterar läget i spelat, gör olika saker beroende på om användares gissning var rätt eller fel

const  Timer = function(timer, ms,s,m) {
    this.ms = ms || 0;
    this.s = s || 0;
    this.m = m || 0;
    this.timer = timer;

    this.increment = () => {

        this.ms++;

        if (this.ms ===  100) {
            this.s++;
            this.ms = 0;  
            if (this.s ===  60) {
                this.m++;
                this.s = 0;
            }   
        } 

        this.timer.innerHTML = `Time: ${this.getMinutes()}:${this.getSeconds()}:${this.getMilliSeconds()}`;    
    }
    this.getMilliSeconds = () => {
        return this.ms < 10 ? `0${this.ms}` : this.ms;
    }
    this.getSeconds = () => {
        return this.s < 10 ? `0${this.s}` : this.s;
    }
    this.getMinutes= () => {
        return this.m < 10 ? `0${this.m}` : this.m;
    }
}