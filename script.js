//listeners -  ovládání hada
document.addEventListener("keydown", keyPush); //posloucám, zda nastala událost keydown, pokud ano, spustí se mnou vytvořená funce keyPush()

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
let snakePosX = 0; //pocatecni pozice hada na ose x
let snakePosY = canvas.height / 2; //pocatecni pozice uprostřed Y

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
    setTimeout(gameLoop, 1000 / fps); //15xza sekundu. Místo requestAnimationFrame dam setTimeout, protoze tomu muzu rict kolik fps (frames per second ), tedy kdy ma spustit funkci - po kolika ms (aby se had posouval po mřížce)
  }
}
resetFood(); //pred spustenim hry se objevi jidlo na random pozici
gameLoop();


function moveStuff() {
  snakePosX += snakeSpeed * velocityX; //posouvaní hada,pozice na ose x se posune o dany pocet pixelu uvedenych v promenne snakeSpeed,  je to stejne jako snakePosX = snakePosX + 1;
  snakePosY += snakeSpeed * velocityY;

  //wall collision
  if (snakePosX > canvas.width - tileSize) {
    // had se vrati po dosaženi praveho okraje zase na zacatek
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

  // //tail
  tail.push({ x: snakePosX, y: snakePosY });

  // forget earliest parts of snake
  tail = tail.slice(-1 * snakeLength);

  //food collision
  if (snakePosX === foodPosX && snakePosY === foodPosY) {
    title.textContent = ++score; //score se zvysi o 1 a pak se ulozi do textu title
    snakeLength++;
    resetFood();
  }
}
// DRAW EVERYTHING
function drawStuff() {
  //background
  rectangle("#ffbf00", 0, 0, canvas.width, canvas.height); //vykreslí bile pozadi canvasu

  //grid
  drawGrid();

  //food
  rectangle("#05a99b", foodPosX, foodPosY, tileSize, tileSize);

  // //tail
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
  //game over if there is nowhere to go
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
    tail.some(
      (snakePart) => snakePart.x === foodPosX && snakePart.y === foodPosY
    )
  ) {
    //pokud existuje v mem poli objektů nejaka cast hada na stejne miste jako food... .some() probehne pole objektu
    resetFood();
  }
}

//game over
//keyboard restarts game
function gameOver() {
  title.innerHTML = `<strong> Score: ${score} <br> GAME OVER! </strong> <br> Press any key to play again.`;
  gameIsRunning = false; //kdyz do sebe narazi, hra se zastavi
}

//you win
function youWon() {
if(score == 15){
    title.innerHTML = `<strong>YOU WON! You fed the snake with ${score} meals! </strong> <br> Press any key to play again. `;
    gameIsRunning = false;
    startConfetti();
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
      //restart game
      if (!gameIsRunning) location.reload(); //kdyz hra nebezi, jakoukoli klavesou ji restartuji
      break;
  }
}

//grid
function drawGrid() {
  //naskladam vedle sebe "kachličky" - grid, o velikosti stnakesize
  for (let i = 0; i < tileCountX; i++) {
    for (let j = 0; j < tileCountY; j++) {
      rectangle("#fff", tileSize * i, tileSize * j, tileSize - 1, tileSize - 1); //tileSize-1 zn. jeden pixel tam nebude, bude prosvitat pozadi - grid
    }
  }
}
