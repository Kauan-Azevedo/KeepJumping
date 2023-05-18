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




const gameEngine = new GameEngine();
gameEngine.initialize();
