// Data From API
//let word = "asztal";
//let subject = "";

//Created word variable only with "" and wordArray into an empty array
let word = "";
let wordArray = [];
let maxLife = 6;
let wrongCounter = maxLife;
let guessedResult = []; // Array of the index of the successfully guessed letters
let allTheGuessedLetters = []; // Array of all the guessed letters

let guessedWordCounter = document.getElementById("guessed-word-counter");
let notguessedWordCounter = document.getElementById("not-guessed-word-counter");
let coin = document.getElementById("coin");
coin.textContent = 100;
let score = document.getElementById("score");
let scoreValue = 0;
let lifes = document.getElementById("lifes");
lifes.textContent = wrongCounter;

// Coin Reward Values
let guessedLetterReward = 5;
let guessedWordLetterReward = 10;

// Score Reward Values
let guessedWordRewardEasy = 20;
let guessedWordRewardHard = 40;

let wordCard;

// Render engine
function render(wordArray, guessedResult) {
  let cardContainer = document.getElementById("word-card-container");
  cardContainer.textContent = "";

  for (let i = 0; i < wordArray.length; i++) {
    // Create the card div.word-card
    wordCard = document.createElement("div");
    wordCard.classList.add("word-card");

    // Create the letters paragraph
    const letter = document.createElement("p");
    letter.classList.add("letter");

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
// Create Guessed letters and words panel
const guessItemPanelContainer = document.getElementById("guess-panel");

// Checking the guessed number
function hangmanEngine(guessedLetter) {
  //Don't leave the letter in input area
  document.getElementById("user-input-text").value = "";

  // Show the guessed letters and words on the panel to the user
  const guessItemShowToPanel = document.createElement("div");
  guessItemShowToPanel.classList.add("guess-item");
  guessItemShowToPanel.textContent = guessedLetter;
  guessItemPanelContainer.append(guessItemShowToPanel);

  // User guessing the full word and found out all letters which gives the full word
  if (guessedLetter === word /*|| guessedResult.length === wordArray.length*/) {
    scoreValue +=
      Number(guessedLetter.length - guessedResult.length) * Number(guessedWordRewardHard);
    score.textContent = scoreValue;

    coin.textContent =
      Number(coin.textContent) +
      Number(guessedLetter.length - guessedResult.length) * Number(guessedWordLetterReward);

    console.log(score.textContent);
    console.log(score);

    for (let j = 0; j < word.length; j++) {
      guessedResult.push(j);
    }

    render(wordArray, guessedResult);

    //Congratulate and start a New Game
    setTimeout(() => {
      alert(`Congratulations! The word was "${word}" `);
      guessedWordCounter.textContent++;
      generateNextWord();
    }, 100);

    return;
  }

  // User getting out of lifes and start New Game
  if (wrongCounter <= 0) {
    alert(`Sorry, the word was "${word}".Try again `);
    allTheGuessedLetters = [];
    return startNewGame();
  }

  // User guessing a wrong letter
  if (wordArray.indexOf(guessedLetter) === -1) {
    wrongCounter--;
    lifes.textContent = wrongCounter;
    return;
  }

  // User guessing a correct letter
  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i] === guessedLetter) {
      guessedResult.push(i);
      coin.textContent = Number(coin.textContent) + guessedLetterReward;
    }
  }
  render(wordArray, guessedResult);
}
// Function for NewGame
function startNewGame() {
  wordArray = [];
  wrongCounter = maxLife;
  guessedResult = [];
  allTheGuessedLetters = [];

  guessedWordCounter = 0;
  notguessedWordCounter = 0;
  coin = 100;
  score = 0;
  lifes = wrongCounter;
  guessItemPanelContainer.textContent = "";

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

// Submit button
let submitButton = document.getElementById("submit-button");

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  let guessedLetter = document.getElementById("user-input-text").value;

  //if letter has been used already gives an alert
  if (allTheGuessedLetters.includes(guessedLetter)) {
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

// Function for NewGame and eventlistener for the next word
function generateNextWord() {
  guessedResult = [];
  allTheGuessedLetters = [];
  wrongCounter = maxLife;
  lifes.textContent = wrongCounter;
  guessItemPanelContainer.textContent = "";
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

// Next word Button => -50 coin
let nextWord = document.getElementById("next-word");
nextWord.addEventListener("click", () => {
  if (Number(coin.textContent) < 50) {
    alert("You dont have enough coin, for that!");
    return;
  }

  coin.textContent -= 50;
  notguessedWordCounter.textContent++;
  generateNextWord();
});

// Random Button => -10 coin
let randomButton = document.getElementById("random-button");
randomButton.addEventListener("click", () => {
  if (Number(coin.textContent) < 10) {
    alert("You dont have enough coin, for that!");
    return;
  }

  if (wordArray.length - guessedResult.length <= 1) {
    if (Number(coin.textContent) < 50) {
      alert("You dont have enough coin, for that!");
      return;
    }
    if (confirm("This action will cost 50 coins, which is the same price as the next word.")) {
      coin.textContent -= 50;
      generateNextWord();
      return;
    } else {
      return;
    }
  }

  wordArray = word.split("");
  let unguessedLetterArray = [];
  let randomLetter = "";
  let randomLetterCounter = 0;

  for (let i = 0; i < wordArray.length; i++) {
    if (!guessedResult.includes(i)) {
      unguessedLetterArray.push(i);
    }
  }
  randomLetter =
    wordArray[unguessedLetterArray[Math.floor(Math.random() * unguessedLetterArray.length)]];
  coin.textContent -= 10;

  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i] === randomLetter) {
      randomLetterCounter++;
      coin.textContent -= 5; // Alapvető esetben 5 coint kap a user ha kitalál egy betűt. Ezért kell ezt az 5-öt levonni.
    }
  }

  hangmanEngine(randomLetter);
});

// New Game Button

let newGameButton = document.getElementById("new-game");
newGameButton.addEventListener("click", () => location.reload());
