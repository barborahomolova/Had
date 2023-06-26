//listeners
document.addEventListener("keydown", keyPush); //if event keydown happens, the function keyPush runs

//canvas
const canvas = document.querySelector("canvas");
const title = document.getElementById("starting-score");
const ctx = canvas.getContext("2d");

//game
let gameIsRunning = true;

const fps = 8;
const tileSize = 50;
const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;
let score = 0;

//player
let snakeSpeed = tileSize;
let snakePosX = 0; //starting positon on X axis
let snakePosY = canvas.height / 2; //starting positon in the middle of Y axis 

//velocity - speed in directions of X or Y axis
let velocityX = 1;
let velocityY = 0;

let tail = [];
let snakeLength = 4;

//food
let foodPosX = 0;
let foodPosY = 0;

//loop
function gameLoop() {
  if (gameIsRunning) {
    drawStuff();
    moveStuff();
    youWon();
    setTimeout(gameLoop, 1000 / fps); //fps variable above to set the speed
  }
}

resetFood(); //before start of the game the food shows at random position
gameLoop();


function moveStuff() {
  snakePosX += snakeSpeed * velocityX; 
  snakePosY += snakeSpeed * velocityY;

  //wall collision - if snake hits the wall ...
  if (snakePosX > canvas.width - tileSize) {
    snakePosX = 0;
  } else if (snakePosX < 0) {
    snakePosX = canvas.width;
  } else if (snakePosY > canvas.height - tileSize) {
    snakePosY = 0;
  } else if (snakePosY < 0) {
    snakePosY = canvas.height;
  }

  //GAME OVER (crush into itself)
  tail.forEach((snakePart) => {
    if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
      gameOver();
    }
  });

  //tail
  tail.push({ x: snakePosX, y: snakePosY });

  // forget earliest parts of snake
  tail = tail.slice(-1 * snakeLength);

  //food collision - score increases by 1 and then it saves to the title
  if (snakePosX === foodPosX && snakePosY === foodPosY) {
    title.textContent = ++score; 
    snakeLength++;
    resetFood();
  }
}
// DRAW EVERYTHING
function drawStuff() {
  //background - canvas background created by rectangle function
  rectangle("#ffbf00", 0, 0, canvas.width, canvas.height);

  //grid
  drawGrid();

  //food
  rectangle("#05a99b", foodPosX, foodPosY, tileSize, tileSize);

  //tail
  tail.forEach((snakePart) =>
    rectangle("gray", snakePart.x, snakePart.y, tileSize, tileSize)
  );

  //snakes head
  rectangle("black", snakePosX, snakePosY, tileSize, tileSize); 
}

// DRAW RECTANGLE
function rectangle(color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

//randomize food position
function resetFood() {
  //game is over if there is nowhere to go - snake is too long
  if (snakeLength === tileCountX * tileCountY) {
    gameOver();
  }

  foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
  foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

  //dont spawn food on snakes head
  if (foodPosX === snakePosX && foodPosY === snakePosY) {
    resetFood();
  }

  //dont spawn food on any snakes part
  if (
    //.some() runs through array of objects to see if any part of snake i on the food position
    tail.some(
      (snakePart) => snakePart.x === foodPosX && snakePart.y === foodPosY
    )
  ) {
    
    resetFood();
  }
}

//game over - snake runs into itself
//keyboard restarts game
function gameOver() {
  title.innerHTML = `<strong> Score: ${score} <br> GAME OVER! </strong> <br> Press any key to play again.`;
  gameIsRunning = false; 
}

//you win
function youWon() {
if(score == 15){
    title.innerHTML = `<strong>YOU WON! You fed the snake with ${score} meals! </strong> <br> Press any key to play again. `;
    gameIsRunning = false;
  
}
}

//KEYBOARD
function keyPush(event) {
  switch (event.key) {
    case "ArrowLeft":
      if (velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
      }
      break;
    case "ArrowUp":
      if (velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
      }

      break;
    case "ArrowRight":
      if (velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
      }
      break;
    case "ArrowDown":
      if (velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
      }
      break;
    default:
      //restart game - if game not running - restart by pressing any key 
      if (!gameIsRunning) location.reload(); 
      break;
  }
}

//grid
function drawGrid() {
  //stacking the tiles creates grid with the size of tileSize
  for (let i = 0; i < tileCountX; i++) {
    for (let j = 0; j < tileCountY; j++) {
      rectangle("#fff", tileSize * i, tileSize * j, tileSize - 1, tileSize - 1); //tileSize-1 means that one pixel is missing ---> visible grid
    }
  }
}
