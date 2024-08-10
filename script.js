
const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const startEndBtn = document.querySelector(".start-end-btn");
const pauseResumeBtn = document.querySelector(".pause-resume-btn");
const levels = document.querySelector(".levels");
let icon = document.getElementById('icon');
let highScore = localStorage.getItem('highScore') || 0;
const moleSound = new Audio('audioMole.wav');
document.querySelector('.high-score').textContent = `High Score: ${highScore}`;


let lastHole;
let timeUp = false;
let score = 0;
let isPaused = false;
let isGameRunning = false;
let peepTimeout;
let gameTimeout;
let startTime;
let elapsedTime = 0; 
let count =0;

  icon.addEventListener('click', () => {
      document.body.classList.toggle('active');
      console.log("click")
  });
  
// Function to get the selected radio button value
function difficultyLevel() {
  const ele = document.getElementsByName("level");
  for (let i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      return ele[i].id;
    }
  }
}

// Function to get a random time between min and max
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Function to get a random hole
function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

// Function to make the mole appear and disappear
function peep(show, hide) {
  const time = randomTime(show, hide);
  const hole = randomHole(holes);
  hole.classList.add("up");
  peepTimeout = setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp && !isPaused) {
      peep(show, hide);
    }
  }, time);
}

// Function to start the game
function startGame() {
  let show, hide;
  const difficulty = difficultyLevel();
  if (difficulty === "easy") {
    show = 500;
    hide = 1500;
  } else if (difficulty === "medium") {
    show = 200;
    hide = 1000;
  } else {
    show = 100;
    hide = 800;
  }

  // Reset the game state
  document.querySelector("h1").textContent = "Catch me, If you can";
  scoreBoard.textContent = 0;
  timeUp = false;
  startEndBtn.innerHTML = "End Game";
  startEndBtn.disabled = false;
  pauseResumeBtn.innerHTML = "Pause";
  pauseResumeBtn.disabled = false;
  pauseResumeBtn.style.display = "inline-block"
  levels.style.visibility = "hidden";
  score = 0;
  isGameRunning = true;
  elapsedTime = 0; 
  startTime = Date.now();

  // Starting the game
  peep(show, hide);
  gameTimeout = setTimeout(() => {
    timeUp = true;
    endGame();
  }, 15000);
}

// Function to pause the game
function pauseGame() {
  isPaused = true;
  clearTimeout(peepTimeout);
  clearTimeout(gameTimeout);
  pauseResumeBtn.innerHTML = "Resume";

  // Calculate elapsed time
  elapsedTime += Date.now() - startTime;
}

// Function to resume the game
function resumeGame() {
  isPaused = false;
   let show, hide;
  const difficulty = difficultyLevel();
  if (difficulty === "easy") {
    show = 500;
    hide = 1500;
  } else if (difficulty === "medium") {
    show = 200;
    hide = 1000;
  } else {
    show = 100;
    hide = 800;
  }
  peep(show, hide);

  startTime = Date.now();
   gameTimeout = setTimeout(() => {
    timeUp = true;
    endGame();
  }, 15000 - elapsedTime);

  pauseResumeBtn.innerHTML = "Pause";
}

// Function to toggle between pause and resume
function togglePause() {
  if (isPaused) {
    resumeGame();
  } else {
    pauseGame();
  }
}

// Function to end the game
function endGame() {
  timeUp = true;
   clearTimeout(peepTimeout);
  clearTimeout(gameTimeout);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore); 
}

  
  document.querySelector("h1").textContent = `Game Over!! Your score is ${score}`;
  document.querySelector('.high-score').textContent = `High Score: ${highScore}`;
  console.log(localStorage.getItem('highScore'));
  resetGame();
}

// Function to toggle between start and end game
function toggleGame() {
  if (isGameRunning) {
    endGame();
  } else {
    startGame();
  }
}

// Function to reset the game state
function resetGame() {
  startEndBtn.innerHTML = "Start!";
  startEndBtn.disabled = false;
    pauseResumeBtn.innerHTML = "Pause";
   pauseResumeBtn.disabled = true;
  pauseResumeBtn.style.display = "none";
levels.style.visibility = "visible";
  isGameRunning = false;
  isPaused = false;
  elapsedTime = 0; 

}

// Function to update the score on clicking the mole
function hitTheMole(e) {
  if (!e.isTrusted) {
    return;
  }
  score++;
  
   scoreBoard.textContent = score;
  this.parentNode.classList.remove("up");
}
function playMoleSound() {
  moleSound.play();
}
// Adding the click event listener to all the moles
moles.forEach((mole) => mole.addEventListener("click", hitTheMole));
moles.forEach((mole) => mole.addEventListener('click', playMoleSound));
