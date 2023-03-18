const canvas = document.getElementById("ping");
const ctx = canvas.getContext('2d');

// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}


const user = {
    x : 0, 
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}


const com = {
    x : canvas.width - 10, 
    y : (canvas.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}


const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 3,
    color : "WHITE"
}

// draw rect for paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle for ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// user paddle movement
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// reset the ball, when someone scores
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update score
function update(){
     if( ball.x - ball.radius < 0 ){
        com.score++;
        comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }
    
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // when the ball collides with bottom and top walls,inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }
    
    //check if the paddle hit is of the user or the computer
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // if the ball hits a paddle
    if(collision(ball,player)){
       hit.play()
        //check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
       
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // when ball will hit the top of a paddle ball, will take a -45degees angle, at center ,will take 0 degree and at bottom 45 degree
       
        let angleRad = (Math.PI/4) * collidePoint;// Math.PI/4 = 45degrees
        
        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // speed up, after every hit
        ball.speed += 0.1;
    }
}


function render(){
   
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    drawText(user.score,canvas.width/4,canvas.height/5);
   
    drawText(com.score,3*canvas.width/4,canvas.height/5);
   
    drawNet();
   
    drawRect(user.x, user.y, user.width, user.height, user.color);
   
    drawRect(com.x, com.y, com.width, com.height, com.color);
   
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
}

let framePerSecond = 40;

let loop = setInterval(game,1000/framePerSecond);
