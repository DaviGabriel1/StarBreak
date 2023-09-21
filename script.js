// Obtém o elemento canvas e seu contexto 2D
var canvas = document.getElementById("starfield");
var ctx = canvas.getContext("2d");

// Define o tamanho do canvas para ocupar a tela inteira
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array para armazenar as estrelas
var stars = [];


const navePrincipal = document.getElementById('navePrincipal');// Transportar o CSS
let posicaoHorizontal = 50;
let posicaoVertical = 95;
const step = 1; //passo para cada click

var velocidadeTiro = 5; //velocidade dos tiros (pode variar com power up)

var tamanhoTelaLargura = window.innerWidth;
var tamanhoTelaAltura = window.innerHeight;

var quantMeteoros = 150;
var meteorosTotais;

var velocidadeMeteoro = 3;

var vidaPlaneta = 100;

var textoVida = document.getElementsByClassName("quantVida");
textoVida[0].textContent = vidaPlaneta;

setInterval(criacaoMeteoros, 2000);


// Função para criar uma estrela aleatória
function createStar() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speed: Math.random() * 3
    };
}

// Inicializa o array de estrelas
for (var i = 0; i < 100; i++) {
    stars.push(createStar());
}

// Função para animar as estrelas
function animate() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha as estrelas
    ctx.fillStyle = "white";
    for (var i = 0; i < stars.length; i++) {
        var star = stars[i];
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
        }
    }
    controlaMeteoros();
    verificarDerrota();
    // Repete a animação
    requestAnimationFrame(animate);
}

// Inicia a animação
animate();
function atualizarPosicaoAtualNave() {
    navePrincipal.style.left = posicaoHorizontal+'%';
    navePrincipal.style.top = posicaoVertical+'%';
}
document.addEventListener('keydown', (event) => {
    switch (event.key) {
    case 'ArrowLeft':
      posicaoHorizontal -= step;
      break;
    case 'ArrowRight':
      posicaoHorizontal += step;
      break;
    case 'ArrowUp':
      posicaoVertical -=step;
      break;
    case 'ArrowDown':
      posicaoVertical +=step;
      break;  
      case ' ':
        atirar();
        break;
  }
  atualizarPosicaoAtualNave()
});

function atirar() {
    const tiro = document.createElement('div');
    tiro.classList.add('tiro');
    tiro.id = 'tiro'; 
    document.body.appendChild(tiro);
    const personagemRect = navePrincipal.getBoundingClientRect();
    tiro.style.left = (personagemRect.left + personagemRect.width / 2) + 'px';
    tiro.style.top = (personagemRect.top + personagemRect.height / 2) + 'px';
    tiro.style.backgroundImage= 'url(./imagens/lasers/laserPadraov2.png)'
    const tiroInterval = setInterval(() => {
        const tiroRect = tiro.getBoundingClientRect();
        if (tiroRect.top > 0) {
          tiro.style.top = (parseInt(tiro.style.top) || 0) - velocidadeTiro + 'px';
        } else {
          clearInterval(tiroInterval);
          document.body.removeChild(tiro);
        }
      }, 10);
      
}
function criacaoMeteoros (){
    var x = Math.random()*tamanhoTelaLargura;
    var y=0;
    var meteoro = document.createElement("div");
    meteoro.classList.add('meteoro');
    meteoro.id = 'meteoro';
    meteoro.style.top=y+"px";
    meteoro.style.left=x+"px";
    meteoro.style.backgroundImage="./imagens/glitch_meteor/meteor0001.png"
    document.body.appendChild(meteoro)
    quantMeteoros--;
}
function controlaMeteoros() {
  meteorosTotais = document.getElementsByClassName("meteoro");
  var tam = meteorosTotais.length;
  for (var i = 0; i < tam; i++) {
    if (meteorosTotais[i]) {
      var pi = meteorosTotais[i].offsetTop;
      pi += velocidadeMeteoro;
      meteorosTotais[i].style.top = pi + "px";
      if (pi > tamanhoTelaAltura) {
        vidaPlaneta -= 10;
        textoVida[0].textContent = vidaPlaneta;
        meteorosTotais[i].remove();
      }
    }
  }
}

function verificarDerrota(){
  if(vidaPlaneta ==0){
  window.location.href = "menuInicial.html";
}}


