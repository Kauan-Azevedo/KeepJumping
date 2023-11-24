// variáveis do jogo
var canvas,
  ctx,
  ALTURA,
  LARGURA,
  velocidade = 10,
  maxpulos = 2,
  recorde,
  img,
  estadoAtual;

// SPRITES
function Sprite(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;

  this.desenha = function (xCanvas, yCanvas) {
    ctx.drawImage(
      img,
      this.x,
      this.y,
      this.largura,
      this.altura,
      xCanvas,
      yCanvas,
      this.largura,
      this.altura
    );
  };
}

var bg = new Sprite(0, 0, 800, 552),
  spriteChao = new Sprite(0, 552, 800, 56),
  spritePersonagem = new Sprite(800, 0, 39, 66);

//objetos
var estados = {
    jogar: 0,
    jogando: 1,
    gameover: 2,
  },
  chao = {
    x: 0,
    y: 545,
    altura: 50,

    atualiza: function () {
      this.x -= velocidade;
      if (this.x <= -155) {
        this.x = 0;
      }
    },

    desenha: function () {
      spriteChao.desenha(this.x, this.y);
      spriteChao.desenha(this.x + spriteChao.largura, this.y);
    },
  },
  bloco = {
    x: 100,
    y: 0,
    altura: spritePersonagem.altura,
    largura: spritePersonagem.largura,
    // gravidade: 1.5,
    gravidade: 1.7,
    velocidade: 0,
    forcaPulo: 22,
    pulos: 0,
    score: 0,

    atualiza: function () {
      this.velocidade += this.gravidade;
      this.y += this.velocidade;

      if (this.y > chao.y - this.altura) {
        this.y = chao.y - this.altura;
        this.pulos = 0;
        this.velocidade = 0;
      }
    },
    pula: function () {
      if (this.pulos < maxpulos) {
        this.velocidade = -this.forcaPulo;
        this.pulos++;
      }
    },
    reset: function () {
      this.velocidade = 0;
      this.y = 0;

      if (this.score > recorde) {
        localStorage.setItem("recorde", this.score);
        recorde = this.score;
      }

      this.score = 0;
    },

    desenha: function () {
      spritePersonagem.desenha(this.x, this.y);
    },
  },
  inimigo = {
    _ini: [],
    cores: ["#FF2511", "#790000", "#890000", "#aa0000", "#ec0000"],
    tempoInsere: 0,

    gerar: function () {
      this._ini.push({
        x: LARGURA,
        largura: 50, // + Math.floor(20 * Math.random()),
        altura: 35 + Math.floor(85 * Math.random()),
        cor: this.cores[Math.floor(5 * Math.random())],
      });
      this.tempoInsere = 20 + Math.floor(40 * Math.random());
    },
    atualiza: function () {
      if (this.tempoInsere == 0) {
        this.gerar();
      } else {
        this.tempoInsere--;
        for (var i = 0, tam = this._ini.length; i < tam; i++) {
          var ini = this._ini[i];
          ini.x -= velocidade;
          //colisao
          if (
            bloco.x < ini.x + ini.largura &&
            bloco.x + bloco.largura >= ini.x &&
            bloco.y + bloco.altura >= chao.y - ini.altura
          ) {
            estadoAtual = estados.gameover;
          } else if (ini.x == 0) {
            bloco.score++;
          } else if (ini.x <= -ini.largura) {
            this._ini.splice(i, 1);
            tam--;
            i--;
          }
        }
      }
    },

    limpa: function () {
      this._ini = [];
    },
    desenha: function () {
      for (var i = 0, tamanho = this._ini.length; i < tamanho; i++) {
        var ini = this._ini[i];

        ctx.fillStyle = ini.cor;
        ctx.fillRect(ini.x, chao.y - ini.altura, ini.largura, ini.altura);
      }
    },
  };

function clique(event) {
  if (estadoAtual == estados.jogando) {
    bloco.pula();
  } else if (estadoAtual == estados.jogar) {
    estadoAtual = estados.jogando;
  } else if (estadoAtual == estados.gameover) {
    estadoAtual = estados.jogar;
    bloco.y = 0;
    inimigo.limpa();
    bloco.reset();
  }
}

function main() {
  ALTURA = window.innerHeight;
  LARGURA = window.innerWidth;

  if (LARGURA >= 600) {
    LARGURA = 800;
    ALTURA = 600;
  }

  canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  canvas.style.border = "5px solid cyan";

  ctx = canvas.getContext("2d");

  document.body.appendChild(canvas);

  document.addEventListener("keydown", teclado);

  function teclado(event) {
    var x = event.keyCode;

    if (x == 32) {
      clique();
    }
  }
  document.addEventListener("mousedown", clique);
  estadoAtual = estados.jogar;
  recorde = localStorage.getItem("recorde");

  if (recorde == null) {
    recorde = 0;
  }

  img = new Image();
  img.src = "../images/Sheet.png";

  rodar();
} // main
function rodar() {
  atualizar();
  desenhar();

  window.requestAnimationFrame(rodar);
}

function atualizar() {
  if (estadoAtual == estados.jogando) {
    bloco.atualiza();
    inimigo.atualiza();

    chao.atualiza();
  }
}

function desenhar() {
  //colocar sprite**

  //   ctx.fillStyle = "#41729F";
  //   ctx.fillRect(0, 0, LARGURA, ALTURA);
  bg.desenha(0, 0);

  ctx.fillStyle = "white";
  ctx.font = "50px Roboto";
  ctx.fillText(bloco.score, 38, 68);

  if (estadoAtual == estados.jogar) {
    ctx.fillStyle = "limegreen";
    ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);
  } else if (estadoAtual == estados.gameover) {
    ctx.fillStyle = "red";
    ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);

    ctx.save();
    ctx.translate(LARGURA / 2, ALTURA / 2);
    ctx.fillStyle = "white";

    if (bloco.score > recorde) {
      ctx.fillText("Novo Recorde!", -150, -65);
    } else if (recorde < 10) {
      ctx.fillText("Recorde: " + recorde, -99, -65);
    } else if (recorde > 10 && recorde < 100) {
      ctx.fillText("Recorde: " + recorde, -112, -65);
    } else {
      ctx.fillText("Recorde: " + recorde, -125, -65);
    }

    if (bloco.score < 10) {
      ctx.fillText(bloco.score, -14, 19);
    } else if (bloco.score > 10 && bloco.score < 100) {
      ctx.fillText(bloco.score, -28, 19);
    } else {
      ctx.fillText(bloco.score, -45, 19);
    }
    ctx.restore();
  } else if (estadoAtual == estados.jogando) {
    bloco.desenha();
    inimigo.desenha();
    chao.desenha();
  }
  chao.desenha();
  bloco.desenha();
}

// inicializar o jogo
main();
