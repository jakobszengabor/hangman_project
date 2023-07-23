// Data From API
//let word = "asztal";
//let subject = "";

//Created word variable only with "" and wordArray into an empty array
let word = "";
let wordArray = [];
let wrongCounter = 6;
let guessedResult = []; // Array of the index of the successfully guessed letters
let allTheGuessedLetters = []; // Array of all the guessed letters

// Render engine
function render(wordArray, guessedResult) {
  let cardContainer = document.getElementById("word-card-container");
  cardContainer.textContent = "";

  for (let i = 0; i < wordArray.length; i++) {
    // Create the card div.word-card
    const wordCard = document.createElement("div");
    wordCard.classList.add("word-card");

    // Create the letters paragraph
    const letter = document.createElement("p");

    // Insert the html elements
    wordCard.append(letter);
    cardContainer.append(wordCard);

    if (guessedResult.includes(i)) {
      letter.textContent = wordArray[i];
    } else {
      letter.textContent = "_";
    }
  }
}

render(wordArray, "");

// Checking the guessed number
function hangmanEngine(guessedLetter) {
  //Don't leave the letter in input area
  document.getElementById("user-input-text").value = "";

  // User guessing the full word and found out all letters which gives the full word
  if (guessedLetter === word || guessedResult.length === wordArray.length) {
    for (let j = 0; j < word.length; j++) {
      guessedResult.push(j);
    }
    render(wordArray, guessedResult);

    //Congratulate and start a New Game
    setTimeout(() => {
      alert(`Congratulations! The word was "${word}" `);
      startNewGame();
    }, 100);

    return;
  }

  // User getting out of lifes and start New Game
  if (wrongCounter <= 0) {
    alert(`Sorry, the word was "${word}".Try again `);
    return startNewGame();
  }

  // User guessing a wrong letter
  if (wordArray.indexOf(guessedLetter) === -1) {
    wrongCounter--;
    return;
  }

  // User guessing a correct letter
  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i] === guessedLetter) {
      guessedResult.push(i);
    }
  }
  render(wordArray, guessedResult);
}
// Function for NewGame
function startNewGame() {
  wordArray = [];
  wrongCounter = 6;
  guessedResult = [];
  allTheGuessedLetters = [];
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      word = data[0];
      wordArray = word.split(""); // Word array create
      console.log("Random word:", word);
      render(wordArray, guessedResult);
    })
    .catch((error) => {
      console.error("Error on request:", error);
      // Handle the error if it is necessary
    });
}
// Eventlisteners

// Submit gomb
let submitButton = document.getElementById("submit");

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  let guessedLetter = document.getElementById("user-input-text").value;
  //if letter has been used already gives an alert
  if (
    guessedResult.includes(guessedLetter) ||
    allTheGuessedLetters.includes(guessedLetter)
  ) {
    alert("This letter has been used before! Try another one!");
    return;
  }
  hangmanEngine(guessedLetter);
  allTheGuessedLetters.push(guessedLetter);

  console.log(allTheGuessedLetters);
  console.log(guessedLetter);
  console.log(wrongCounter);
});

//Press Enter to make work as well like submit
let userInput = document.getElementById("user-input-text");

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitButton.click();
  }
});

//Api Created
const apiUrl = "https://random-word-api.herokuapp.com/word?";

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    word = data[0];
    wordArray = word.split(""); // Word array create
    console.log("Random word:", word);
    render(wordArray, guessedResult);
  })
  .catch((error) => {
    console.error("Error on request:", error);
    // Handle the error if it is necessary
  });
