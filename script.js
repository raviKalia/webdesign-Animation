// main elements
let road = document.getElementById("road");
let playerCar = document.getElementById("playerCar");
let enemyCar = document.getElementById("enemyCar");
let startBtn = document.getElementById("startBtn");
let pauseBtn = document.getElementById("pauseBtn");
let scoreText = document.getElementById("score");
let roadLines = document.querySelectorAll(".roadLine");

// game values
let gameOn = false;
let gamePaused = false;
let score = 0;
let gameLoop = null;
let enemyTop = -120;
let currentLane = 1;
let lanePositions = [];
//pop-up elements to intialize the game over screen
let popup = document.getElementById("gameOverPopup");
let finalScoreText = document.getElementById("finalScore");
let restartBtn = document.getElementById("restartBtn");


// set game area height exactly to screen height
function setGameHeight() {
  let realHeight = window.innerHeight;
  document.getElementById("gameWrap").style.height = realHeight + "px";
}

// calculate lane positions according to road width
function setLanePositions() {
  let roadWidth = road.clientWidth;
  let carWidth = playerCar.offsetWidth;

  lanePositions = [
    roadWidth * 0.18 - carWidth / 2,
    roadWidth * 0.50 - carWidth / 2,
    roadWidth * 0.82 - carWidth / 2
  ];

  playerCar.style.left = lanePositions[currentLane] + "px";
}

// key movement one lane at a time
document.addEventListener("keydown", function (e) {
  if (!gameOn || gamePaused) return;

  if (e.key === "ArrowLeft") {
    if (currentLane > 0) {
      currentLane = currentLane - 1;
      playerCar.style.left = lanePositions[currentLane] + "px";
    }
  }

  if (e.key === "ArrowRight") {
    if (currentLane < 2) {
      currentLane = currentLane + 1;
      playerCar.style.left = lanePositions[currentLane] + "px";
    }
  }
});

// road line animation
function moveRoadLines() {
  roadLines.forEach(function (line) {
    let lineTop = parseInt(line.style.top || getComputedStyle(line).top);
    lineTop = lineTop + 8;

    if (lineTop > road.clientHeight) {
      lineTop = -90;
    }

    line.style.top = lineTop + "px";
  });
}

// set enemy car in random lane
function setEnemyLane() {
  let randomLane = Math.floor(Math.random() * 3);
  enemyCar.style.left = lanePositions[randomLane] + "px";
}

// move enemy car down
function moveEnemy() {
  enemyTop = enemyTop + 7;
  enemyCar.style.top = enemyTop + "px";

  if (enemyTop > road.clientHeight) {
    enemyTop = -120;
    setEnemyLane();

    score = score + 1;
    scoreText.textContent = score;
  }
}

// check collision
function checkHit() {
  let playerBox = playerCar.getBoundingClientRect();
  let enemyBox = enemyCar.getBoundingClientRect();

  if (
    playerBox.left < enemyBox.right &&
    playerBox.right > enemyBox.left &&
    playerBox.top < enemyBox.bottom &&
    playerBox.bottom > enemyBox.top
  ) {
    endGame();
  }
}

// start game loop
function runGame() {
  gameLoop = setInterval(function () {
    moveRoadLines();
    moveEnemy();
    checkHit();
  }, 20);
}

// start game
function startGame() {
  gameOn = true;
  gamePaused = false;
  score = 0;
  enemyTop = -120;
  currentLane = 1;

  scoreText.textContent = score;
  startBtn.disabled = true;
  pauseBtn.textContent = "Pause";

  setGameHeight();
  setLanePositions();
  setEnemyLane();
  enemyCar.style.top = enemyTop + "px";

  clearInterval(gameLoop);
  runGame();
}

// pause and resume
function togglePause() {
  if (!gameOn) return;

  if (!gamePaused) {
    clearInterval(gameLoop);
    gamePaused = true;
    pauseBtn.textContent = "Resume";
  } else {
    gamePaused = false;
    pauseBtn.textContent = "Pause";
    runGame();
  }
}

// end game shows score in a popup instead of alert and allows restart
function endGame() {
  clearInterval(gameLoop);
  gameOn = false;
  gamePaused = false;
  startBtn.disabled = false;
  pauseBtn.textContent = "Pause";

  // SHOW POPUP INSTEAD OF ALERT
  finalScoreText.textContent = score;
  popup.classList.add("show");
}

// button events
startBtn.addEventListener("click", function () {
  startGame();
});

pauseBtn.addEventListener("click", function () {
  togglePause();
});

// access the restart button in the popup and restarts the game when clicked
restartBtn.addEventListener("click", function () {
  popup.classList.remove("show");
  startGame();
});

// resize handling
window.addEventListener("resize", function () {
  setGameHeight();
  setLanePositions();
});

// run once when page loads
setGameHeight();
setLanePositions();