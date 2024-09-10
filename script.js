let word;
let guessedLetters;
let wrongGuesses;
const maxWrongGuesses = 10;
const wordDisplay = document.getElementById("wordToGuess");
const messageDisplay = document.getElementById("gameMessage");

document.addEventListener("DOMContentLoaded", function() {
  resetGame(); // Start the game with a new word
});

function getRandomWord() {
  return fetch('https://random-word-api.herokuapp.com/word?number=1')
    .then(response => response.json())
    .then(data => data[0].toUpperCase())
    .catch(error => {
      console.error("Error fetching word:", error);
      return "ERROR"; // Fallback word in case of error
    });
}

function displayWord() {
  wordDisplay.innerText = guessedLetters.join(" ");
  console.log("Current word display:", guessedLetters.join(" "));  // Debugging
}

function createAlphabetButtons() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lettersDiv = document.querySelector(".alphabet .letters");

  lettersDiv.innerHTML = '';  // Clear previous buttons (if game reset)

  alphabet.split("").forEach(letter => {
    const button = document.createElement("button");
    button.innerText = letter;
    button.addEventListener("click", () => guessLetter(letter));
    button.disabled = false;
    lettersDiv.appendChild(button);
  });
}

function guessLetter(letter) {
  let found = false;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      guessedLetters[i] = letter;
      found = true;
    }
  }

  if (!found) {
    wrongGuesses++;
    drawHangmanStep(wrongGuesses);
    console.log("Wrong guess! Number of wrong guesses:", wrongGuesses);  // Debugging
  }

  displayWord();
  checkWinOrLose();
}

function checkWinOrLose() {
  if (guessedLetters.join("") === word) {
    displayMessage("Congratulations! You guessed the word!");
    disableButtons();
  } else if (wrongGuesses === maxWrongGuesses) {
    displayMessage("Game Over! The word was: " + word);
    disableButtons();
  }
}

function resetGame() {
  getRandomWord().then(newWord => {
    word = newWord;
    guessedLetters = Array(word.length).fill("_");
    wrongGuesses = 0;
    clearCanvas();
    displayWord();
    createAlphabetButtons();  // Recreate alphabet buttons for the new game
    messageDisplay.innerText = "";  // Clear previous messages
    console.log("Game Reset. New word to guess:", word);  // Debugging
  });
}

function drawHangmanStep(step) {
  const canvas = document.getElementById("hangmanCanvas");
  const context = canvas.getContext("2d");

  context.strokeStyle = '#00ffcc'; // Set drawing color to neon cyan
  context.lineWidth = 2; // Set line width
  context.beginPath(); // Start a new path

  switch (step) {
    case 1:
      // Draw the base
      context.moveTo(10, 190);
      context.lineTo(150, 190);
      context.stroke();
      break;
    case 2:
      // Draw the pole
      context.moveTo(80, 190);
      context.lineTo(80, 10);
      context.stroke();
      break;
    case 3:
      // Draw the top bar
      context.moveTo(80, 10);
      context.lineTo(140, 10);
      context.stroke();
      break;
    case 4:
      // Draw the rope
      context.moveTo(140, 10);
      context.lineTo(140, 40);
      context.stroke();
      break;
    case 5:
      // Draw the head
      context.beginPath(); // Begin new path for head
      context.arc(140, 50, 10, 0, Math.PI * 2);
      context.stroke();
      break;
    case 6:
      // Draw the body
      context.beginPath(); // Begin new path for body
      context.moveTo(140, 60);
      context.lineTo(140, 100);
      context.stroke();
      break;
    case 7:
      // Draw left arm
      context.beginPath(); // Begin new path for left arm
      context.moveTo(140, 70);
      context.lineTo(120, 90);
      context.stroke();
      break;
    case 8:
      // Draw right arm
      context.beginPath(); // Begin new path for right arm
      context.moveTo(140, 70);
      context.lineTo(160, 90);
      context.stroke();
      break;
    case 9:
      // Draw left leg
      context.beginPath(); // Begin new path for left leg
      context.moveTo(140, 100);
      context.lineTo(120, 130);
      context.stroke();
      break;
    case 10:
      // Draw right leg
      context.beginPath(); // Begin new path for right leg
      context.moveTo(140, 100);
      context.lineTo(160, 130);
      context.stroke();
      break;
  }
}

// Display a message in the HTML instead of an alert
function displayMessage(message) {
  messageDisplay.innerText = message;
  messageDisplay.style.color = 'red'; // Change message color to red
  console.log(message);  // Debugging
}

// Clear the canvas for a new game
function clearCanvas() {
  const canvas = document.getElementById("hangmanCanvas");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Disable the alphabet buttons after game ends
function disableButtons() {
  const buttons = document.querySelectorAll(".alphabet button");
  buttons.forEach(button => {
    button.disabled = true;
  });
}
