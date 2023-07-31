// Data From API
//let word = "asztal";
//let subject = "";

//Created word variable only with "" and wordArray into an empty array
let word = "";
let category = "";
let wordArray = [];
let maxLife = 5;
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
let guessItemShowToPanel = document.createElement("div");
guessItemShowToPanel.style["background-color"] = "rgba(255,115,119,255)";

let categoryP = document.getElementById("category");
let cardContainer = document.getElementById("word-card-container");
let imageSection = document.getElementById("image");
imageSection.insertAdjacentHTML(
  "afterbegin",
  `<img src="./images/Hangman_rajz_0${1}.svg" alt="" />`
);

// Render engine
function render(wordArray, guessedResult) {
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
      guessItemShowToPanel.style["background-color"] = "rgba(195,250,204,255)";
    } else {
      letter.textContent = "_";
    }
  }
}

render(wordArray, "");
// Create Guessed letters and words panel
const guessItemPanelContainer = document.getElementById("guess-panel");

// Checking the user input the guessed number or word
function hangmanEngine(guessedLetter) {
  //Don't leave the letter in input area
  document.getElementById("user-input-text").value = "";

  // Show the guessed letters and words on the panel to the user
  guessItemShowToPanel = document.createElement("div");
  guessItemShowToPanel.classList.add("guess-item");
  guessItemShowToPanel.textContent = guessedLetter;
  guessItemShowToPanel.style["background-color"] = "rgba(255,115,119,255)";
  guessItemPanelContainer.append(guessItemShowToPanel);

  // User guessing a wrong letter
  if (wordArray.indexOf(guessedLetter) === -1 && guessedLetter.length === 1) {
    wrongCounter--;
    lifes.textContent = wrongCounter;

    let firstChild = imageSection.firstElementChild;
    imageSection.removeChild(firstChild);

    //let picture = `<img src="/images/Hangman_rajz_0${wrongCounter}.svg" alt="" />`;
    imageSection.insertAdjacentHTML(
      "afterbegin",
      `<img src="./images/Hangman_rajz_0${maxLife - wrongCounter + 1}.svg" alt="" />`
    );

    if (wrongCounter === 0) {
      let endGame = confirm(`Out of lives. You are dead. Really. Your Score: ${scoreValue}`);

      if (endGame) {
        location.reload();
      } else {
        render(wordArray, guessedResult);
        let userInputSection = document.getElementById("user-input");
        let helpButtonPanel = document.getElementById("help_button_panel");
        cardContainer.innerHTML = "";
        userInputSection.innerHTML = "";
        helpButtonPanel.innerHTML = "";
        categoryP.textContent = "See ya!";
      }
    }

    return;
  }

  // User getting out of lifes and start New Game
  if (wrongCounter <= 0) {
    alert(`Sorry, the word was "${word}".Try again `);
    allTheGuessedLetters = [];
    return startNewGame();
  }

  // User guessing a correct letter
  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i] === guessedLetter) {
      guessedResult.push(i);
      coin.textContent = Number(coin.textContent) + guessedLetterReward;
    }
  }

  // User guessing the full word and found out all letters which gives the full word
  if (guessedLetter === word || guessedResult.length === wordArray.length) {
    scoreValue += Number(wordArray.length - guessedResult.length) * Number(guessedWordRewardHard);
    score.textContent = scoreValue;
    guessItemShowToPanel.style["background-color"] = "rgba(195,250,204,255)";
    coin.textContent =
      Number(coin.textContent) +
      Number(wordArray.length - guessedResult.length) * Number(guessedWordLetterReward);

    console.log(score.textContent);
    console.log(score);

    for (let j = 0; j < word.length; j++) {
      guessedResult.push(j);
    }

    render(wordArray, guessedResult);

    //Congratulate and start a New Game
    setTimeout(() => {
      alert(`Congratulations! The word was "${word}" `);
      scoreValue += 20;
      score.textContent = scoreValue;
      guessedWordCounter.textContent++;
      generateNextWord();
    }, 100);
    // return;
  }
  if (guessedLetter !== word && guessedLetter.length > 1) {
    wrongCounter--;
    lifes.textContent = wrongCounter;
    guessItemShowToPanel.style["background-color"] = "rgba(255,115,119,255)";
    let firstChild = imageSection.firstElementChild;
    imageSection.removeChild(firstChild);
    imageSection.insertAdjacentHTML(
      "afterbegin",
      `<img src="./images/Hangman_rajz_0${maxLife - wrongCounter + 1}.svg" alt="" />`
    );
    if (wrongCounter === 0) {
      let endGame = confirm(`Out of lives. You are dead. Really. Your Score: ${scoreValue}`);

      if (endGame) {
        location.reload();
      } else {
        render(wordArray, guessedResult);
        let userInputSection = document.getElementById("user-input");
        let helpButtonPanel = document.getElementById("help_button_panel");
        cardContainer.innerHTML = "";
        userInputSection.innerHTML = "";
        helpButtonPanel.innerHTML = "";
        categoryP.textContent = "See ya!";
      }
    }

    console.log("hali");
    return;
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
  let guessedLetterInput = document.getElementById("user-input-text").value;
  let guessedLetter = guessedLetterInput.toLowerCase();

  //if letter has been used already gives an alert
  if (guessedLetter === "" || guessedLetter === " ") {
    alert("Dont leave it blank!");
    return;
  }

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
const apiUrl2 = " https://www.wordgamedb.com/api/v1/words/random";

fetch(apiUrl2)
  .then((response) => response.json())
  .then((data) => {
    word = data.word; //data[0]
    categoryP.textContent = data.category;
    wordArray = word.split(""); // Word array create
    console.log("Random word:", word);
    render(wordArray, guessedResult);
  })
  .catch((error) => {
    console.error("Error on request:", error);
    // Handle the error if it is necessary
  });

// Function for NewGame and eventlistener for the next word
function generateNextWord(param) {
  guessedResult = [];
  allTheGuessedLetters = [];
  wrongCounter = maxLife;
  lifes.textContent = wrongCounter;
  guessItemPanelContainer.textContent = "";
  fetch(apiUrl2)
    .then((response) => response.json())
    .then((data) => {
      word = data.word; //data[0]
      categoryP.textContent = data.category;
      wordArray = word.split(""); // Word array create
      console.log("Random word:", word);
      render(wordArray, guessedResult);
    })
    .catch((error) => {
      console.error("Error on request:", error);
      // Handle the error if it is necessary
    });

  let firstChild = imageSection.firstElementChild;
  imageSection.removeChild(firstChild);
  imageSection.insertAdjacentHTML(
    "afterbegin",
    `<img src="./images/Hangman_rajz_0${maxLife - wrongCounter + 1}.svg" alt="" />`
  );
  if (param) return alert(`The word was " ${word} " `);
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

  generateNextWord(true);
});

// Next word Button => -50 coin hard
let nextWordHard = document.getElementById("next-word-hard");
nextWordHard.addEventListener("click", () => {
  if (Number(coin.textContent) < 25) {
    alert("You dont have enough coin, for that!");
    return;
  }

  coin.textContent -= 25;
  notguessedWordCounter.textContent++;

  guessedResult = [];
  allTheGuessedLetters = [];
  wrongCounter = maxLife;
  lifes.textContent = wrongCounter;
  guessItemPanelContainer.textContent = "";
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      word = data[0]; //data[0]
      categoryP.textContent = "No help for hard mode.";
      wordArray = word.split(""); // Word array create
      console.log("Random word:", word);
      render(wordArray, guessedResult);
    })
    .catch((error) => {
      console.error("Error on request:", error);
      // Handle the error if it is necessary
    });

  let firstChild = imageSection.firstElementChild;
  imageSection.removeChild(firstChild);
  imageSection.insertAdjacentHTML(
    "afterbegin",
    `<img src="./images/Hangman_rajz_0${maxLife - wrongCounter + 1}.svg" alt="" />`
  );
  if (true) return alert(`The word was " ${word} " `);
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
      alert("You dont have enough coin, for that! It counts az a next word for 50!");
      return;
    }
    if (confirm("This action will cost 50 coins, which is the same price as the next word.")) {
      coin.textContent -= 50;
      generateNextWord(true);
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
    if (
      randomLetterCounter >= 2 &&
      wordArray.length === guessedResult.length + randomLetterCounter
    ) {
      if (Number(coin.textContent) < 50) {
        alert("You dont have enough coin, for that! It counts az a next word for 50!");
        return;
      }
      if (confirm("This action will cost 50 coins, which is the same price as the next word.")) {
        coin.textContent -= 50;
        generateNextWord(true);
        return;
      } else {
        return;
      }
    }
  }

  hangmanEngine(randomLetter);
});

// New Game Button

let newGameButton = document.getElementById("new-game");
newGameButton.addEventListener("click", () => location.reload());
