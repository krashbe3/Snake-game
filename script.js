const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;  // Taille de chaque carré
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;
let speed = 100; // Temps entre chaque mouvement du serpent

let eatSound = document.getElementById('eatSound');
let deathSound = document.getElementById('deathSound');

window.onload = function() {
    initGame();
}

function initGame() {
    snake = new Snake();
    food = new Food();
    score = 0;
    speed = 100;
    document.addEventListener('keydown', changeDirection);
    gameLoop();
}

function gameLoop() {
    setTimeout(function() {
        clearCanvas();
        snake.update();
        snake.draw();
        food.draw();
        drawScore();
        if (gameOver()) {
            deathSound.play();
            alert("Game Over! Score: " + score);
            initGame();
        } else {
            gameLoop();
        }
    }, speed);
}

function clearCanvas() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, canvas.width - 100, 30);
}

function changeDirection(e) {
    if (e.key === "q" && snake.dx === 0) {
        snake.changeDirection(-scale, 0);
    } else if (e.key === "z" && snake.dy === 0) {
        snake.changeDirection(0, -scale);
    } else if (e.key === "d" && snake.dx === 0) {
        snake.changeDirection(scale, 0);
    } else if (e.key === "s" && snake.dy === 0) {
        snake.changeDirection(0, scale);
    }
}

function gameOver() {
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        return true;
    }
    for (let i = 0; i < snake.tail.length; i++) {
        if (snake.tail[i].x === snake.x && snake.tail[i].y === snake.y) {
            return true;
        }
    }
    return false;
}

class Snake {
    constructor() {
        this.x = 100;
        this.y = 100;
        this.dx = scale;
        this.dy = 0;
        this.tail = [];
        this.total = 0;
        this.color = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00']; // Couleurs du serpent
    }

    update() {
        let head = { x: this.x, y: this.y };

        this.tail.push(head);

        if (this.tail.length > this.total) {
            this.tail.shift();
        }

        this.x += this.dx;
        this.y += this.dy;

        if (this.x === food.x && this.y === food.y) {
            eatSound.play();
            food = new Food();
            this.total++;
            score += food.points;
            if (score % 5 === 0) {
                speed -= 10; // Augmente la vitesse tous les 5 points
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color[this.total % this.color.length]; // Changement de couleur
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    }

    changeDirection(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
}

class Food {
    constructor() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
        this.points = Math.random() < 0.5 ? 1 : 2; // Pommes ou bananes
        this.color = this.points === 1 ? 'red' : 'yellow';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}
