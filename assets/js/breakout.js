
// Gamedev Canvas Workshop - Breakout 2D
// https://developer.mozilla.org/fr/docs/Games/Workflows/2D_Breakout_game_pure_JavaScript

//------------------------------------- Variables --------------------------------------------------------------------------------

// record canvas reference
let canvas = document.getElementById("myCanvas");
// 2D rendering context = real tool to draw on canvas
let ctx = canvas.getContext("2d");

// Starting position of the ball
let ballXPos = canvas.width/2;
let ballYPos = canvas.height-30;
// Defining the ball radius variable to facilitate calculation
let ballRadius = 10;
// Direction of the ball
let ballXDir = 2;
let ballYDir = -2;

// Size of the paddle
let paddleHeight = 10;
let paddleWidth = 75;
// Starting x position of the paddle
let paddleXPos = (canvas.width-paddleWidth)/2;

// Store if the right and left keys are pressed or not
let rightPressed = false;
let leftPressed = false;

// Number of rows and colums of bricks
let brickRowCount = 3;
let brickColumnCount = 5;
// Brick size
let brickWidth = 75;
let brickHeight = 20;
// Brick padding
let brickPadding = 10;
// Bricks offset in canvas (+- = margin)
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// Setting an two-dimensionnal array of bricks who:
// contain columns (c), who themselves contain rows (r), who each contain an object
// each object is defined by x & y positions to display his brick on the canvas
// and a status used to check if the brick must be displayed or not
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Score
let score = 0;

// Declare the interval who's activated in the end of the script
let interval;

//------------------------------------- Key Binding ------------------------------------------------------------------------------
// the "key" property contain information about the pressed key(s)
// the variable "e" represent the event used as parameter of the functions
// most browser use "ArrowRight" and "ArrowLeft" for the right and left arrow keys
// but we have to test "Right" and "Left" too because it's what's used in IE/Edge

// Check if a key is pressed --> launch keyDownHandler function
document.addEventListener("keydown", keyDownHandler, false);
// Check if a key stop to be pressed --> launch keyUpHandler function
document.addEventListener("keyup", keyUpHandler, false);

//------------------------------------- Functions --------------------------------------------------------------------------------

function keyDownHandler(e) {
    // When left or right key is pressed --> corresponding variable = true
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    // When left or right key stop to be pressed --> corresponding variable = false
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    // Iterate throught colums & rows to get each bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // Define b for actual brick
            let b = bricks[c][r];
            // Check if the actual brick is displayed
            if (b.status === 1) {
                // Collision check: if the ball is inside the actual brick --> invert direction
                if (ballXPos > b.x && ballXPos < b.x + brickWidth && ballYPos > b.y && ballYPos < b.y + brickHeight) {
                    ballYDir = -ballYDir;
                    // and set actual brick status to not displayed
                    b.status = 0;
                    // Increment score and "Victory" if all bricks are down
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("Congratulation, you win !");
                        // End game
                        clearInterval(interval);
                        // Reload page
                        document.location.reload();
                        // For next level just load another page ?????
                    }
                }
            }
        }
    }
}

function drawScore() {
    // Define font
    ctx.font = "16px Arial";
    // Define font color
    ctx.fillStyle = "#0095DD";
    // Define and position text(text, xPos, yPos)
    ctx.fillText("Score: "+ score, 8, 20);
}

function drawBall() {
    ctx.beginPath();
    // Define circle(coordX of center, coordY of center, radius, startAngle in rad, endAngle in rad, direction(false = clockwise))
    ctx.arc(ballXPos, ballYPos, ballRadius, 0, Math.PI*2);
    // Define and apply filling color
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    // Define rectangle(pos x from topLeft, pos y from topLeft, width, height)
    ctx.rect(paddleXPos, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "yellow";
    ctx.fill();
    // Define and apply border color
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.closePath();
}

function drawBricks() {
    // Iterate throught colums & rows to get each bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // Check to see if the brick should be drawn or not
            if (bricks[c][r].status === 1) {
                // Initialize x & y positions with preferences
                let brickXPos = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickYPos = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                // Get positions of actual brick from his object in the array "bricks"
                bricks[c][r].x = brickXPos;
                bricks[c][r].y = brickYPos;
                ctx.beginPath();
                // Draw rectangle of size "brickWidth * brickHeight" at position "brickXPos, brickYPos"
                ctx.rect(brickXPos, brickYPos, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            } 
        }
    }
}

function draw() {
    // Erease an area in canvas(coordX of topLeft, coordY of topLeft, coordX bottomRight, coordY bottomRight)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw bricks with actual configuration
    drawBricks();
    // Draw back the ball in actual position
    drawBall();
    // Draw back the paddle in actual position
    drawPaddle();
    // Draw actual score
    drawScore();
    // Detect if collision between actual position of the ball with the bricks actually displayed
    collisionDetection();
    // Set ball actual direction
    ballXPos += ballXDir;
    ballYPos += ballYDir;

    // Collision check: if collision right, left or top --> invert ball direction
    // Check right & left border
    if (ballXPos + ballXDir > canvas.width - ballRadius || ballXPos + ballXDir < ballRadius) {
        ballXDir = -ballXDir;
    }
    // Check top border
    if (ballYPos + ballYDir < ballRadius) {
        ballYDir = -ballYDir;
    }
    // Check bottom border for "Game Over"
    else if (ballYPos + ballYDir > canvas.height - ballRadius) {
        // Check collision with the paddle: if collision --> invert ball direction
        if (ballXPos > paddleXPos && ballXPos < paddleXPos + paddleWidth) {
            ballYDir = -ballYDir;
        }
        else {
            alert("GAME OVER");
            // End game
            clearInterval(interval);
            // Reload page
            document.location.reload();
        }
    }
    // Paddle movement check: if right of left is pressed --> paddle move 7px right or left on x
    if (rightPressed) {
        paddleXPos += 7;
        if (paddleXPos + paddleWidth > canvas.width) {
            paddleXPos = canvas.width - paddleWidth;
        }
    }
    else if (leftPressed) {
        paddleXPos -= 7;
        if (paddleXPos < 0) {
            paddleXPos = 0;
        }
    }
}

//------------------------------------- Execution of the script ------------------------------------------------------------------
interval = setInterval(draw, 10);
// Use draw function every 10ms
