// variáveis do jogo
let canvas,
    ctx,
    HEIGHT,
    WIDTH,
    speed = 10,
    maxjumps = 2,
    record,
    img,
    gameState;

// SPRITES
function Sprite(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = (xCanvas, yCanvas) => {
        ctx.drawImage(
            img,
            this.x,
            this.y,
            this.width,
            this.height,
            xCanvas,
            yCanvas,
            this.width,
            this.height
        );
    };
}

const bg = new Sprite(0, 0, 800, 552),
    spriteFloor = new Sprite(0, 552, 800, 56),
    spriteCharacter = new Sprite(800, 0, 39, 66);

//objetos
let states = {
    play: 0,
    playing: 1,
    gameover: 2,
};

let floor = {
    x: 0,
    y: 545,
    height: 50,

    update: () => {
        this.x -= speed;
        if (this.x <= -155) {
            this.x = 0;
        }
    },

    draw: () => {
        spriteFloor.draw(this.x, this.y);
        spriteFloor.draw(this.x + spriteFloor.width, this.y);
    },
};

let player = {
    x: 100,
    y: 0,
    height: spriteCharacter.height,
    width: spriteCharacter.width,
    gravity: 1.5,
    speed: 0,
    jumpHeight: 22,
    jumps: 0,
    score: 0,

    update: () => {
        this.speed += this.gravity;
        this.y += this.speed;

        if (this.y > floor.y - this.height) {
            this.y = floor.y - this.height;
            this.jumps = 0;
            this.speed = 0;
        }
    },
    jump: () => {
        if (this.jumps < maxjumps) {
            this.speed = -this.jumpHeight;
            this.jumps++;
        }
    },
    reset: () => {
        this.speed = 0;
        this.y = 0;

        if (this.score > record) {
            localStorage.setItem("record", this.score);
            record = this.score;
        }

        this.score = 0;
    },

    draw: () => {
        spriteCharacter.draw(this.x, this.y);
    },
};

let enemy = {
    enemies: [],
    colors: ["#FF2511", "#790000", "#890000", "#aa0000", "#ec0000"],
    delay: 0,

    create: () => {
        this.enemies.push({
            x: WIDTH,
            width: 50, // + Math.floor(20 * Math.random()),
            height: 35 + Math.floor(85 * Math.random()),
            color: this.colors[Math.floor(5 * Math.random())],
        });
        this.delay = 20 + Math.floor(40 * Math.random());
    },
    update: () => {
        if (this.delay === 0) {
            this.create();
        } else {
            this.delay--;
            for (let i = 0, size = this.enemies.length; i < size; i++) {
                let enemy = this.enemies[i];
                enemy.x -= speed;
                //colisao
                if (
                    player.x < enemy.x + enemy.width &&
                    player.x + player.width >= enemy.x &&
                    player.y + player.height >= floor.y - enemy.height
                ) {
                    gameState = states.gameover;
                } else if (enemy.x === 0) {
                    player.score++;
                } else if (enemy.x <= -enemy.width) {
                    this.enemies.splice(i, 1);
                    size--;
                    i--;
                }
            }
        }
    },

    clear: () => {
        this.enemies = [];
    },
    draw: () => {
        for (let i = 0, size = this.enemies.length; i < size; i++) {
            let enemy = this.enemies[i];

            ctx.fillStyle = enemy.color;
            ctx.fillRect(
                enemy.x,
                floor.y - enemy.height,
                enemy.width,
                enemy.height
            );
        }
    },
};

function click(e) {
    if (gameState === states.playing) {
        player.jump();
    } else if (gameState === states.play) {
        gameState = states.playing;
    } else if (gameState === states.gameover) {
        gameState = states.play;
        player.y = 0;
        enemy.clear();
        player.reset();
    }
}

function main() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    if (WIDTH >= 600) {
        WIDTH = 800;
        HEIGHT = 600;
    }

    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.border = "5px solid cyan";

    ctx = canvas.getContext("2d");

    document.body.appendChild(canvas);

    document.addEventListener("keydown", keyboard);

    function keyboard(e) {
        let x = e.keyCode;

        if (x === 32) {
            click();
        }
    }
    document.addEventListener("mousedown", click);
    gameState = states.play;
    record = localStorage.getItem("record");

    if (record === null) {
        record = 0;
    }

    img = new Image();
    img.src = "../imagens/Sheet.png";

    run();
}

function run() {
    update();
    draw();

    window.requestAnimationFrame(run);
}

function update() {
    if (gameState === states.playing) {
        player.update();
        enemy.update();

        floor.update();
    }
}

function draw() {
    bg.draw(0, 0);

    ctx.fillStyle = "white";
    ctx.font = "50px Roboto";
    ctx.fillText(player.score, 38, 68);

    if (gameState === states.play) {
        ctx.fillStyle = "limegreen";
        ctx.fillRect(WIDTH / 2 - 50, HEIGHT / 2 - 50, 100, 100);
    } else if (gameState === states.gameover) {
        ctx.fillStyle = "red";
        ctx.fillRect(WIDTH / 2 - 50, HEIGHT / 2 - 50, 100, 100);

        ctx.save();
        ctx.translate(WIDTH / 2, HEIGHT / 2);
        ctx.fillStyle = "white";

        if (player.score > record) {
            ctx.fillText("Novo Recorde!", -150, -65);
        } else if (record < 10) {
            ctx.fillText("Recorde: " + record, -99, -65);
        } else if (record > 10 && record < 100) {
            ctx.fillText("Recorde: " + record, -112, -65);
        } else {
            ctx.fillText("Recorde: " + record, -125, -65);
        }

        if (player.score < 10) {
            ctx.fillText(player.score, -14, 19);
        } else if (player.score > 10 && player.score < 100) {
            ctx.fillText(player.score, -28, 19);
        } else {
            ctx.fillText(player.score, -45, 19);
        }
        ctx.restore();
    } else if (gameState === states.playing) {
        player.draw();
        enemy.draw();
        floor.draw();
    }
    floor.draw();
    player.draw();
}

// inicializar o jogo
main();
