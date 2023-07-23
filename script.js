// Data From API
//let word = "asztal";
//let subject = "";

//
let wordArray = word.split("");
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
  // User guessing the full word
  if (guessedLetter === word) {
    for (let j = 0; j < word.length; j++) {
      guessedResult.push(j);
    }
    render(wordArray, guessedResult);
    return;
  }

  // User getting out of lifes
  if (wrongCounter <= 0) {
    alert(`A helyes megfejtés ${word} lett volna. `);
    return;
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

// Eventlisteners

let submitButton = document.getElementById("submit");

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  let guessedLetter = document.getElementById("user-input-text").value;

  hangmanEngine(guessedLetter);
  allTheGuessedLetters.push(guessedLetter);

  console.log(word);
  console.log(allTheGuessedLetters);
  console.log(guessedLetter);
  console.log(wrongCounter);
});
