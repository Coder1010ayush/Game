const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText =document.getElementById('highScore');


let gridSize = 40;
let snake = [{x:10,y:10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 70;
let gameStarted = false;
let highScore = 0;

function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake(){
    snake.forEach((segment)=>{

        const snakeElement = createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);

    });
}

function createGameElement(tag,className){

    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element,position){

    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;

}

function drawFood(){
    if(gameStarted){
        const foodElement = createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }
}

function generateFood(){

    let x = Math.round(Math.random()*(gridSize));
    let y = Math.round(Math.random()*(gridSize));
    if(x == 2 || x == gridSize || y == 2 || y == gridSize){
        x = 10;
        y = 10;
        return {x,y};
    }
    return {x,y};

}


function move(){
    const head = {... snake[0]};
    switch (direction) {
        case 'right':
            head.x++;
            break;
    
        case 'left':
            head.x--;
            break;
        
        case 'up':
            head.y--;
            break;
        
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head);

    if(head.x == food.x && head.y == food.y){
        food = generateFood();
      //  increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();

        },gameSpeedDelay);
    }else{
        snake.pop();
    }

}

function startGame(){
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gameSpeedDelay);
}

function handleKeyPress(event){


    if((!gameStarted && event.code === 'Space' )|| (!gameStarted && event.key === ' ')) {
        startGame();
    }else{
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;

            case 'ArrowDown':
                direction = 'down';
                break;

            case 'ArrowLeft':
                direction = 'left';
                break;

            case 'ArrowRight':
                direction = 'right';
                break;
           
        }
    }
}

document.addEventListener('keydown',handleKeyPress);

function increaseSpeed(){
    if(gameSpeedDelay>350){
        gameSpeedDelay -= 5;
    }
    else if(gameSpeedDelay > 250){
        gameSpeedDelay -= 3;

    }
    else if(gameSpeedDelay> 200){
        gameSpeedDelay -= 2;
    }
    else if(gameSpeedDelay >180){
        gameSpeedDelay -= 1;
    }
}

function checkCollision(){
    const head = snake[0];
    if(head.x < 1  || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }
    for(let i = 1;i<snake.length;i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}



function resetGame(){
    updateHighScore();
    snake = [{x:10,y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 70;
    updateScore();
    stopGame();
}




function updateScore(){
    const currentScore = (snake.length -1)*5;
    let str = 'Score';
    score.textContent = str+" "+currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentHighScore = (snake.length-1)*5;
    if(currentHighScore>highScore){
        highScore = currentHighScore;
        let str = 'HighScore';
        highScoreText.textContent = str +" "+ highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display = 'block';
}


