"use strict";

// Globala variabler

var wordList = void 0; // Lista med spelets alla ord
var selectedWord = void 0; // Ett av orden valt av en slumpgenerator
var letterBoxes = void 0; //Rutorna där bokstäverna ska stå
var hangmanImg = void 0; //Bild som kommer vid fel svar
var hangmanImgNr = void 0; // Vilken av bilderna som kommer upp beroende på hur många fel du gjort
var message = void 0; // visar olika meddelanden under spelets gång
var startGameBtn = void 0; // Knappen du startar spelet med
var letterButtons = void 0; // Knapparna för bokstäverna
var gameClock = void 0; // Mäter tiden
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
var overrideCheckbox = void 0; //checkbox som används för att visa att man vill gissa på ett helt ord

var init = function init() {
  wordList = ["Chas Academy", "Programming", "School", "Student", "Teacher", "JavaScript", "HyperText Markup Language", "Cascading Style Sheets", "Hypertext Preprocessor", "SQL"]; // ordlistan initsieras
  startGameBtn = document.querySelector("#startGameBtn"); //knappen med id startGameBtn selectas och komplingen sparas i variabeln
  letterBoxes = document.querySelector("#letterBoxes"); // sectionen där knapparna som ska representera det valda ordet ska visas selectas
  instructions = document.querySelector("#instructions"); // det område där instructionerna till hur man spelar spelet selectas och komplingen sparas i variabeln
  overrideCheckbox = document.querySelector("#overrideCheckbox"); //checkbox som används för att visa att man vill gissa på ett helt ord
  guessField = document.querySelector("#guessField"); // formen med id guessField selectas och komplingen sparas i variabeln
  userInput = document.querySelector("#userGuess"); //inputfältet där användaren skriver sina gissningar selectas och komplingen sparas i variabeln
  hangmanImg = document.querySelector("#hangman"); //img tagen med bilden som ilusterar hur många felaktiga gissningar användaren har gjort selectas och komplingen sparas i variabeln
  hangmanImgNr = 0; //värdet sätts till 0 och kommer senare att incrementeras för att byta bilden i img taggen
  message = document.querySelector("#message p"); //selectar det fällt där olika medelanden kommer att visas under spelets gång
  gameBoard = document.querySelector("#gameBoard"); // det område som visas när spelet är igång selectas och komplingen sparas i variabeln
  gameClock = document.querySelector("#timer"); // det område där timern visas selectas och komplingen sparas i variabeln
  selectedWordCopy = ""; // selectedWordCopy initsieras
  uppercaseCopy = ""; //uppercaseCopy initsieras
  startGameBtn.addEventListener("click", newGame); // skapar en eventlyssnare för startGameBtn som kör funktionen newGame när man trycker på knappen
  letterButtons = document.querySelectorAll("#letterButtons li button"); // selectar alla letterbuttons
  guessField.addEventListener("submit", letterChecker); //ger guessField en eventlyssnare som kör funktionen letterChecker när formen submitas
  for (var p = 0; p < letterButtons.length; p++) {
    letterButtons[p].addEventListener("click", insertLetter);
  } //skapar eventlyssnar på alla letterbuttons som kör funktionen insertLetter när man klickar på dem
  overrideCheckbox.addEventListener("change", overrideDisable); // checkboxen får en eventlysnare som kör functionen overridDisable när dess status förändras
}; // Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.

window.onload = init; // Se till att init aktiveras då sidan är inladdad

var newGame = function newGame() {
  var myTimer = void 0; // timer för den nya omgången
  hangmanImgNr = 0; // nollstäls för att se till att rätt start bild visas
  hangmanImg.src = "./images/h" + hangmanImgNr + ".png"; // sätter sökvägen till hangman bilden
  instructions.style.display = "none"; // döljer instructionerna när spelet startats
  listOfGuesses = []; // initsierar variablen som kommer inehålla de ord och bokstäver som användaren har gissat på
  gameBoard.style.display = "flex"; //sätter propertyn display yill felx för gameBoard för att den ska synnas
  message.innerHTML = ""; // nollställer eventuella medelanden som tidigare vissats här
  wordSelector(); // function som väljer ett slumpmässigt ord från en array
  numberOfLetterBoxes(); // function som skapar upp letterboxes utifrån den valda ordet
  resetLetterButtons(); // function som nollställer alla letterbuttons som blivit disablade från tidigare omgångar
  wordProcessing(); // function som sparar om det valda ordet i två olika variabler
  clearInterval(activateTimer); // ser till att timern nollstäls från föregående omgång
  myTimer = new Timer(gameClock); //skapar en ny instans av typen timer argumentet som skickas in relaterar till vart timern ska visas
  activateTimer = setInterval(myTimer.increment, 10); // sätter ett intervall för hur ofta timerna ska incrementeras
}; // Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner

var resetLetterButtons = function resetLetterButtons() {
  for (var o = 0; o < letterButtons.length; o++) {
    if (letterButtons[o].classList.contains("disabled")) {
      letterButtons[o].classList.remove("disabled");
    }
  }
}; //tar bort classen disabled från letterbuttons som har den klassen

var wordSelector = function wordSelector() {
  selectedWord = wordList[Math.floor(Math.random() * 10)];
  numberOfCorrectLetters = 0; // nollställer antalet correct gissade bokstäver efter att det nya ordet valts
}; // Funktion som slumpar fram ett ord

var numberOfLetterBoxes = function numberOfLetterBoxes() {
  while (letterBoxes.firstElementChild.firstChild) {
    letterBoxes.firstElementChild.removeChild(letterBoxes.firstElementChild.firstChild);
  } // tar bort alla letterboxes från tidigare omgångar om det finns några
  var newLi = void 0; // deklarerar en variabel som kommer innehålla det senaste skapade li elementet
  for (var i = 0; i < selectedWord.length; i++) {
    if (selectedWord.charAt(i) === " ") {
      newLi.classList.add("margin-right");
    } else newLi = document.createElement("li");
    newLi.classList.add("liLetterBoxes");
    letterBoxes.firstElementChild.appendChild(newLi);
  } //lopar igenom hela det valda ordet och skapar upp nya letterboxes för varje bokstav,
  //om ordet/frasen inehåller mellan slag så tilldelas istället det senaste det senaste lielementet en ny klass som ger extra margin till höger
  liLetterBoxes = document.querySelectorAll(".liLetterBoxes"); //sparar alla skapade letterboxes till en array
}; // Funktionen som tar fram bokstävernas rutor, antal beror på vilket längden på ordet

var wordProcessing = function wordProcessing() {
  if (/ /.test(selectedWord)) {
    var phraseSplit = []; // deklarerar och initsierar en array
    phraseSplit = selectedWord.split(" "); //sparar alla del ord av frasen i arrayen på var sin position
    selectedWordCopy = ""; //nollställer selectedwordCopy för att ord från tidigare omgångar inte ska finnas kvar

    for (var j = 0; j < phraseSplit.length; j++) {
      selectedWordCopy += phraseSplit[j];
    } //loopar igenom arayen med ordet och sätter in varje del ord i selected word copy på detta sätt blir vi av med allt whitespace
  } else {
    selectedWordCopy = selectedWord;
  } // om selectedWord inehåller whitespace så tas det bort och sparas sedan i en egen selectedWordCopy annars sparas ordet som det är samma variabel
  uppercaseCopy = selectedWordCopy.toUpperCase(); // sparar en kopia där alla bokstäverna är stora i uppercaseCopy
}; //sparar det valda ordet till två olika variabler till den första efter att whitespace har tagits bort och sedan till den andra när den gjorts om till uppercase

var insertLetter = function insertLetter() {
  if (this.value === "Delete") {
    var toSave = userInput.value; //initsierar en variabel som sparar det som för tillfället står i inputfältet
    toSave = toSave.substring(0, toSave.length - 1); //tar bort sista bokstaven
    userInput.value = toSave; // tar bort en bokstav från input fältet om knapen man dryckt på har värdet Delete
  } else if (!this.classList.contains("disabled") || this.classList.contains("override")) {
    userInput.value += this.value; // kollar om knappen har klassen diabled och om inte så sätts värdet i knappen in i inputfältet
  }
}; //funktion som sätter in den bokstav inputfältet (kopplad till letterbuttons eventlysnare) this. används för att referera tilbaka till just den knappen som tryckts på.

var guessPreprocessing = function guessPreprocessing() {
  var guess = userInput.value; // sparar värdet från inputfältet i en ny variabel
  guess = guess.trim(); //tar bort eventuelt whitespace i början och slutet av ordet
  guess = guess.toUpperCase(); // gör om gissningen till uppercase
  userInput.value = ""; // nollställer inputfältet (tar bort texten som fanns där)
  if (/ /.test(guess)) {
    var phraseSplit = []; // deklarerar och initsierar en array
    phraseSplit = guess.split(" "); //sparar alla bokstäver i arrayen på var sin position
    guess = ""; //nollställer värdet i guess
    for (var p = 0; p < phraseSplit.length; p++) {
      guess += phraseSplit[p];
    } // lopar igenom hela array med bokstäverna från gissningen och lägger till dem i guess igen.
  } //tar bort allt whitespace om gissningen innehåller något whitespace
  return guess;
}; //funktion som sparar värdet från den in skickade gissningen trimmar bort eventuelt whitespace och gör om inputen till uppercase och tömmer inputfältet

var guessError = function guessError(userGuess) {
  if (userGuess === "") {
    message.innerHTML = "incorect guess, you have to type atlest one letter ,try a nother guess!";
    return true;
  } //visar ett error medelande om användaren inte har gissat på något med endå tryckt försökt att submita
  for (var m = 0; m < listOfGuesses.length; m++) {
    if (listOfGuesses[m] === userGuess) {
      message.innerHTML = "incorect guess, you have alredy guessed this letter or phrase before, try a nother guess!";
      return true;
    }
  } //lopar igenom alla tidigare gissningar och visar ett felmedelande om gissningen redan har gjort tidgare
  return false;
}; // funktion som kollar att användaren faktiskt har gissat på något och att hen
// inte har gissat på något som den redan har gissat på samt visar ett error medelande om så är fallet och retunerar en bool för att visa resultatet av sökningen

var letterChecker = function letterChecker(e) {
  e.preventDefault(); // hindrar sidan från att laddas om när formen har subbmitats
  message.innerHTML = ""; //nollställer tidigare medelanden
  var userGuess = guessPreprocessing(); //sätter userGuess till värdet som retuneras från functionen
  if (guessError(userGuess)) {
    return;
  } // kollar om det var något fel på användares gissning och avbryter funktionen om så är fallet
  var guessIndex = uppercaseCopy.search(userGuess); // sparar den positionen som användares gissning koresponderar med i en variabel (bara relevant om gissningen består av flera ord)
  var itsAMatch = false; // deklarerar och inisierar variabeln itsAMatch och sätter värdet till false
  if (userGuess.length === 1) {
    for (var k = 0; k < selectedWordCopy.length; k++) {
      if (uppercaseCopy.charAt(k) === userGuess && !liLetterBoxes[k].classList.contains("box-checked")) {
        itsAMatch = true; // visar att en korekt gissning har gjorts
        liLetterBoxes[k].innerHTML = selectedWordCopy.charAt(k); //sätter in rätt bokstav på rätt plats
        liLetterBoxes[k].classList.add("box-checked"); // lägger till en klass för att göra det vissuelt tyligare att rätt bokstav har hittats
        numberOfCorrectLetters++; // ökar på variablen för varje gång en korekt bokstav har hittats
      } // körs om användares gissning koresponderar med någon av bokstäverna i uppercasecopy och om den boxen som bokstaven ska in i inte redan har en bokstav
    } // loopar igenom hela selectedwWrdCopy och sätter in användares gissning på rätt plats om använders gissning endast är en bokstav
  } else if (userGuess.length > 1 && guessIndex != -1) {
    for (var l = 0; l < liLetterBoxes.length; l++) {
      if (l == guessIndex) {
        itsAMatch = true; // visar att en korekt gissning har gjorts
        for (var m = 0; m < userGuess.length; m++) {
          if (!liLetterBoxes[l].classList.contains("box-checked")) {
            liLetterBoxes[l].innerHTML = selectedWordCopy.charAt(l); // lägger till den korekta bokstaven i rätt box
            liLetterBoxes[l].classList.add("box-checked"); // lägger till en klass på boxen för att visa att den nu har en korekt bokstav
            numberOfCorrectLetters++; // ökar på variablen för varje gång en korekt bokstav har hittats
          } // körs om den korekta bokstaven inte redan är ifylld i boxen
          l++; // incrementerar den ytre variabeln i den inrelopen för att alla korekta bokstäver ska kunna sättas ut
        } // loopar igenom användaren gissning och sätter in rätt bokstav på rätt plats
      } // körs när den letterbox som koresponderar med den plats där användares corekta gissning ska in har hittats
    } // lopar igenom alla letterboxes
  } // körs om användres gissning var längra än en bokstav och om gissningen var korekt

  disableLetterButtons(userGuess); // kör en funktion som markerar och stänger av knapparna som koresponderar med den korekta gissningen
  listOfGuesses.push(userGuess); //lägger till användares gissning i en array för att kunna hålla koll på vilka gissningar som gjorts
  gameStateUpdate(itsAMatch); // kör en funciton som uppdaterar statusen i spelet rent vissuelt
}; /// Funktion som körs när du trycker på bokstäverna och gissar bokstav
var disableLetterButtons = function disableLetterButtons(userGuess) {
  for (var n = 0; n < letterButtons.length; n++) {
    if (letterButtons[n].textContent === userGuess) {
      letterButtons[n].classList.add("disabled");
    } //kollar om användarens gissning koresponderar med någon letterbutton
  } // loopar igenom alla letterbutton
};
var overrideDisable = function overrideDisable() {
  for (var q = 0; q < letterButtons.length; q++) {
    if (!letterButtons[q].classList.contains("override")) {
      letterButtons[q].classList.add("override");
      overrideCheckbox.classList.add("box-checked");
    } else {
      // lägger till en klass på letterbuttons om de inte har den klasssen och lägger även till en klass på checkboxen för att markera att den är aktiv
      letterButtons[q].classList.remove("override");
      overrideCheckbox.classList.remove("box-checked");
    } // tar bort en klass på letterbuttons om har den klasssen och lägger tar även bort en klass på checkboxen för att markera att den inte är aktiv.
  } //loopar igenom alla letterbuttons
};
var gameStateUpdate = function gameStateUpdate(itsAMatch) {
  if (!itsAMatch) {
    hangmanImgNr++; // ökar om gissningen var fel
    if (hangmanImgNr < 6) {
      hangmanImg.src = "./images/h" + hangmanImgNr + ".png"; //visar den nya bilden så länge inte för många felaktiga gissningar gjorts
    } else {
      clearInterval(activateTimer); //stoppar timern
      hangmanImg.src = "./images/h" + hangmanImgNr + ".png"; //ändrar till sista hangman bilden
      message.innerHTML = "You Dead &#128520; <br/> the corect word was: <em> " + selectedWord + "<em>"; // visar ett medelande om att användaren har förlorat
      gameBoard.style.display = "none"; //döljer gameboard
    }
  } else if (itsAMatch && numberOfCorrectLetters === selectedWordCopy.length) {
    clearInterval(activateTimer); //stoppar timern
    message.innerHTML = "You won! <br/> You guessed the corect word: <em> " + selectedWord + " </em> <br/>Number of guesses: " + listOfGuesses.length + " <br/> " + gameClock.textContent + " <br/> Congratualtions!"; //visar ett medelande om att användaren har vunnit samt lite info om antalet gissningar och hur långtid det tog.
    gameBoard.style.display = "none"; //döljer gameboard
  } // om gisningen var korrekt och användaren nu lyckats gissa hela ordet körs winstate annars ändras hanmanbilden och om användaren har gissat fel för många gånger så körs lossestate
}; // Funktionen som uppdaterar läget i spelat, gör olika saker beroende på om användares gissning var rätt eller fel

var Timer = function Timer(timer, ms, s, m) {
  var _this = this;

  this.ms = ms || 0; //sätter this.ms till 0 om inget annat anges när functionen kallas sätter
  this.s = s || 0; //sätter this.s till 0 om inget annat anges när functionen kallas
  this.m = m || 0; //sätter this.m till 0 om inget annat anges när functionen kallas
  this.timer = timer; //sätter this.timer till det argument som mattas in när funktionen kallas på

  this.increment = function () {
    _this.ms++; // ökar millisekunderna med 1

    if (_this.ms === 100) {
      _this.s++; //ökar sekunderna
      _this.ms = 0; // nollställer millisekunderna
      if (_this.s === 60) {
        _this.m++; //ökar på minutrarna
        _this.s = 0; //nollställer sekunderna
      } //körs om sekunderna ökar till 60
    } // körs om millisekunderna ökas till hundra

    _this.timer.innerHTML = "Time: " + _this.getMinutes() + ":" + _this.getSeconds() + ":" + _this.getMilliSeconds(); //visar tiden efter allt föreliggande i funktionen körts
  }; //funktion som incrementerar timern och visar tiden som hitils förflutit

  this.getMilliSeconds = function () {
    return _this.ms < 10 ? "0" + _this.ms : _this.ms;
  }; //hämtar nuvarande värdet på millisekunderna

  this.getSeconds = function () {
    return _this.s < 10 ? "0" + _this.s : _this.s;
  }; //hämtar nuvarande värdet på sekunderna

  this.getMinutes = function () {
    return _this.m < 10 ? "0" + _this.m : _this.m;
  }; //hämtar nuvarande värdet på minutrarna
}; //constructor-function från vilken flera timers kan skapas,
//vilka då genom prototypechain kan hitta sina variablerna och functioner i Timer() functionen.
//Arrow functions har använts för att säkerhets ställa att this. i functionerna refererar till den funktionen där de är konstruerade i stället för där de är kallade