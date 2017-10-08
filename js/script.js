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

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
    startGameBtn = document.querySelector('#startGameBtn');
    letterBoxes = document.querySelector('#letterBoxes');
    wordList = ['Chas Academy', 'Programming','School','Student','Teacher','JavaScript','Hyper Text Markup Language','Cascading Style Sheets', 'Hypertext Preprocessor','Game of Thrones'];
    startGameBtn.addEventListener('click',newGame);
} // End init

window.onload = init; // Se till att init aktiveras då sidan är inladdad

function newGame() {
    wordSelector();
    numberOfLetters();

}// Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner

function wordSelector() {
    selectedWord = wordList[Math.floor(Math.random()*10)];
}// Funktion som slumpar fram ett ord
 
function numberOfLetters() {
    while(letterBoxes.firstElementChild.firstChild) {
        letterBoxes.firstElementChild.removeChild(letterBoxes.firstElementChild.firstChild);
    }
    var newLi;
    for (var i = 0 ; i < selectedWord.length; i++) {
        if (selectedWord.charAt(i) == ' ') {
            letterBoxes.firstElementChild.lastChild.classList.add("margin-right");
        } else 
            newLi = document.createElement('li');
            newLi.classList.add("liLetterBoxes");
            letterBoxes.firstElementChild.appendChild(newLi);
    }
}// Funktionen som tar fram bokstävernas rutor, antal beror på vilket ord

// Funktion som körs när du trycker på bokstäverna och gissar bokstav

// Funktionen ropas vid vinst eller förlust, gör olika saker beroende av det

// Funktion som inaktiverar/aktiverar bokstavsknapparna beroende på vilken del av spelet du är på