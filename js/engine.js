class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.HEIGHT = null;
        this.WIDTH = null;
        this.speed = 10;
        this.gameState = null;
        this.record = null;
        this.img = null;
    }

    initialize() {
        this.HEIGHT = window.innerHeight;
        this.WIDTH = window.innerWidth;

        if (this.WIDTH >= 600) {
            this.WIDTH = 800;
            this.HEIGHT = 600;
        }

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.canvas.style.border = "5px solid cyan";

        this.ctx = this.canvas.getContext("2d");

        document.body.appendChild(this.canvas);

        document.addEventListener("keydown", this.keyboard.bind(this));
        document.addEventListener("mousedown", this.click.bind(this));

        this.gameState = new GameState();
        this.record = localStorage.getItem("record");

        if (this.record === null) {
            this.record = 0;
        }

        this.img = new Image();
        this.img.src = "../imagens/Sheet.png";

        this.run();
    }

    keyboard(e) {
        let x = e.keyCode;

        if (x === 32) {
            this.click();
        }
    }

    click() {
        if (this.gameState.isPlaying()) {
            this.gameState.getPlayer().jump();
        } else if (this.gameState.isPlay()) {
            this.gameState.setPlaying();
        } else if (this.gameState.isGameOver()) {
            this.gameState.setPlay();
            this.gameState.reset();
        }
    }

    run() {
        this.update();
        this.draw();

        window.requestAnimationFrame(this.run.bind(this));
    }

    update() {
        if (this.gameState.isPlaying()) {
            this.gameState.getPlayer().update();
            this.gameState.getEnemy().update();
            this.gameState.getFloor().update();
        }
    }

    draw() {
        this.gameState.getBackground().draw(0, 0);

        this.ctx.fillStyle = "white";
        this.ctx.font = "50px Roboto";
        this.ctx.fillText(this.gameState.getPlayer().getScore(), 38, 68);

        if (this.gameState.isPlay()) {
            this.ctx.fillStyle = "limegreen";
            this.ctx.fillRect(
                this.WIDTH / 2 - 50,
                this.HEIGHT / 2 - 50,
                100,
                100
            );
        } else if (this.gameState.isGameOver()) {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(
                this.WIDTH / 2 - 50,
                this.HEIGHT / 2 - 50,
                100,
                100
            );

            this.ctx.save();
            this.ctx.translate(this.WIDTH / 2, this.HEIGHT / 2);
            this.ctx.fillStyle = "white";

            if (this.gameState.getPlayer().getScore() > this.record) {
                this.ctx.fillText("Novo Recorde!", -150, -65);
            } else if (this.record < 10) {
                this.ctx.fillText("Recorde: " + this.record, -99, -65);
            } else if (this.record > 10 && this.record < 100) {
                this.ctx.fillText("Recorde: " + this.record, -112, -65);
            } else {
                this.ctx.fillText("Recorde: " + this.record, -125, -65);
            }

            if (this.gameState.getPlayer().getScore() < 10) {
                this.ctx.fillText(
                    this.gameState.getPlayer().getScore(),
                    -14,
                    19
                );
            } else if (
                this.gameState.getPlayer().getScore() > 10 &&
                this.gameState.getPlayer().getScore() < 100
            ) {
                this.ctx.fillText(
                    this.gameState.getPlayer().getScore(),
                    -28,
                    19
                );
            } else {
                this.ctx.fillText(
                    this.gameState.getPlayer().getScore(),
                    -45,
                    19
                );
            }
            this.ctx.restore();
        } else if (this.gameState.isPlaying()) {
            this.gameState.getPlayer().draw();
            this.gameState.getEnemy().draw();
            this.gameState.getFloor().draw();
        }
        this.gameState.getFloor().draw();
        this.gameState.getPlayer().draw();
    }
}

class GameState {
    constructor() {
        this.states = {
            play: 0,
            playing: 1,
            gameover: 2,
        };

        this.floor = null;
        this.player = null;
        this.enemy = null;
        this.background = null;
        this.state = this.states.play;
        this.record = 0;
    }

    isPlay() {
        return this.state === this.states.play;
    }

    isPlaying() {
        return this.state === this.states.playing;
    }

    isGameOver() {
        return this.state === this.states.gameover;
    }

    setPlay() {
        this.state = this.states.play;
    }

    setPlaying() {
        this.state = this.states.playing;
    }

    setGameOver() {
        this.state = this.states.gameover;
    }

    getFloor() {
        return this.floor;
    }

    getPlayer() {
        return this.player;
    }

    getEnemy() {
        return this.enemy;
    }

    getBackground() {
        return this.background;
    }

    reset() {
        this.player.reset();

        if (this.player.getScore() > this.record) {
            localStorage.setItem("record", this.player.getScore());
            this.record = this.player.getScore();
        }

        this.player.setScore(0);
        this.enemy.clear();
    }

    initialize() {
        this.floor = new Floor();
        this.player = new Player();
        this.enemy = new Enemy();
        this.background = new Sprite(0, 0, 800, 552);
        this.record = localStorage.getItem("record") || 0;
    }
}



const gameEngine = new GameEngine();
gameEngine.initialize();
