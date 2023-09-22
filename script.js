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

var tiros;

var velocidadeMeteoro = 3;

var vidaPlaneta = 100;
var textoVida = document.getElementById("quantVida");
textoVida.textContent = vidaPlaneta;

var pontuacao = 0;
var textoPontuacao = document.getElementById("pontuacao");
textoPontuacao.textContent = pontuacao;

var vidaInimigoPadrao = [];

var teclaPressionada;


setInterval(criacaoMeteoros, 2000);

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Também é necessário recriar as estrelas após redimensionar o canvas
  stars = [];
  for (var i = 0; i < 100; i++) {
      stars.push(createStar());
  }
});


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
  // Garanta que a posição horizontal da nave esteja dentro dos limites da tela
  posicaoHorizontal = Math.max(0, Math.min(100, posicaoHorizontal));
  // Garanta que a posição vertical da nave esteja dentro dos limites da tela
  posicaoVertical = Math.max(0, Math.min(100, posicaoVertical));
    navePrincipal.style.left = posicaoHorizontal+'%';
    navePrincipal.style.top = posicaoVertical+'%';
}
document.addEventListener('keydown', (event) => {
    switch (event.key) {
    case 'ArrowLeft' && ' ':
      posicaoHorizontal -= step;
      atirar();
      break;
    /*case 'ArrowRight' && ' ':  
      posicaoHorizontal += step;
      teclaPressionada=true;
      atirar();
        break;*/
    case 'ArrowLeft':
      posicaoHorizontal -= step;
      break;
    case 'ArrowRight':
      if(navePrincipal.style.left<="96%"){
        posicaoHorizontal += step;
      }
      break;
    case 'ArrowUp':
      posicaoVertical -=step;
      break;
    case 'ArrowDown':
      if(navePrincipal.style.top=="94%"){
      posicaoVertical +=step;
      }
      break;  
      case ' ':
        atirar();
        break;
  }
  atualizarPosicaoAtualNave()
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowRight') {
      // Quando a tecla for liberada, marque que a tecla não está mais pressionada
     teclaPressionada = false;
  }
});

function atirar() {
    const tiro = document.createElement('div');
    tiro.classList.add('tiro');
    tiro.id = 'tiro'; 
    document.body.appendChild(tiro);
    const personagemRect = navePrincipal.getBoundingClientRect();
    tiro.style.left = (personagemRect.left + personagemRect.width / 2) + 'px';
    tiro.style.top = (personagemRect.top + personagemRect.height / 2) + 'px';
    //tiro.style.backgroundImage= 'url(./imagens/lasers/laserPadraov2.png)'
    const tiroInterval = setInterval(() => {
        const tiroRect = tiro.getBoundingClientRect();
        if (tiroRect.top > 0) {
          tiro.style.top = (parseInt(tiro.style.top) || 0) - velocidadeTiro + 'px';
          verificarColisao(tiro);
        } else {
          clearInterval(tiroInterval);
          document.body.removeChild(tiro);
        }
      }, 10);
      
}
function criacaoMeteoros (){
    var x = Math.random()*tamanhoTelaLargura;
    var y=-100;
    var meteoro = document.createElement("div");
    meteoro.classList.add('meteoro');
    meteoro.id = 'meteoro';
    meteoro.style.top=y+"px";
    meteoro.style.left=x+"px";
    meteoro.style.backgroundImage="./imagens/glitch_meteor/meteor0001.png"
    document.body.appendChild(meteoro)
    vidaInimigoPadrao.push(3); //inicializar o inimigo com vida 3
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
        textoVida.textContent = vidaPlaneta;
        meteorosTotais[i].remove();
      }
    }
  }
}

function verificarDerrota(){
  if(vidaPlaneta ==0){
  window.location.href = "menuInicial.html";
}}

function verificarColisao(tiro){
  var tiroRect = tiro.getBoundingClientRect();
  var tam = meteorosTotais.length;
  for (var i = 0; i < tam; i++) {
    if (meteorosTotais[i]) {
      vidaInimigoPadrao[i] = 3;
      var meteoroRect = meteorosTotais[i].getBoundingClientRect();

      // Coordenadas das extremidades do tiro
      var tiroTop = tiroRect.top;
      var tiroBottom = tiroRect.bottom;
      var tiroLeft = tiroRect.left;
      var tiroRight = tiroRect.right;

      // Coordenadas das extremidades do meteoro
      var meteoroTop = meteoroRect.top;
      var meteoroBottom = meteoroRect.bottom;
      var meteoroLeft = meteoroRect.left;
      var meteoroRight = meteoroRect.right;

      // Verifica a colisão
      if (
        tiroBottom >= meteoroTop &&
        tiroTop <= meteoroBottom &&
        tiroRight >= meteoroLeft &&
        tiroLeft <= meteoroRight
      ) {
        // Colisão detectada, remova o tiro e o meteoro
        
        tiro.remove();
        
        meteorosTotais[i].remove();
        pontuacao++;
        textoPontuacao.textContent = pontuacao;
        
      }
    }
  }
}

