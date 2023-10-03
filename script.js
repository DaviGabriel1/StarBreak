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
const step = 0.7; //passo para cada click

var velocidadeTiro = 5; //velocidade dos tiros (pode variar com power up)

var tamanhoTelaLargura = window.innerWidth;
var tamanhoTelaAltura = window.innerHeight;

var quantMeteoros = 150;
var quantminiBoss = 70;
var meteorosTotais;
var miniBossTotais;

var tiros;

var velocidadeMeteoro = 3;

var vidaPlaneta = 100;
var textoVida = document.getElementById("quantVida");
textoVida.textContent = vidaPlaneta;

var pontuacao = 0;
var textoPontuacao = document.getElementById("pontuacao");
textoPontuacao.textContent = pontuacao;
var vidaInimigoPadrao = [];
var velocidademiniBoss = 1;

var teclaPressionada;

const backgroundAudio = new Audio('./trilhasSonoras/efeitosonorotiro.mp3'); // Substitua com o caminho do seu arquivo de som

const intervaloDeTiro = 200; // Intervalo de tiro em milissegundos

var vidaInimigoatt =1;
var intervaloGeracaoInimigo = 2000;

var quantnaveInimigaPretos;
var naveInimigaPretoTotais;

var alcancouLadoDireito;
var alcancouLadoEsquerdo;

window.addEventListener('resize', function () {
  canvas.width = window.screen.width;
  canvas.height = window.screen.height;
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
    controlaMiniBoss();
    controlaNaveInimigaPreto();
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

let teclasPressionadas = {}; // Objeto para rastrear teclas pressionadas

function atualizarPosicaoAtualNave() {
  navePrincipal.style.left = posicaoHorizontal + '%';
  navePrincipal.style.top = posicaoVertical + '%';
}

document.addEventListener('keydown', (event) => {
  teclasPressionadas[event.key] = true; // Marcar a tecla como pressionada
});

document.addEventListener('keyup', (event) => {
  delete teclasPressionadas[event.key]; // Marcar a tecla como liberada
});

function atualizarMovimento() {
  if ('ArrowLeft' in teclasPressionadas) {
    posicaoHorizontal -= step;
  }
  if ('ArrowRight' in teclasPressionadas && posicaoHorizontal <= 96) {
    posicaoHorizontal += step;
  }
  if ('ArrowUp' in teclasPressionadas) {
    posicaoVertical -= step;
  }
  if ('ArrowDown' in teclasPressionadas && posicaoVertical <= 94) {
    posicaoVertical += step;
  }
  
  atualizarPosicaoAtualNave();
  requestAnimationFrame(atualizarMovimento); // Chama a função novamente no próximo quadro de animação
}

// Adicione um evento de tiro (por exemplo, pressionando a barra de espaço)
document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    atirar();
  }
});

// Inicie o loop de atualização
atualizarMovimento();
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
          backgroundAudio.play();
          tiro.style.top = (parseInt(tiro.style.top) || 0) - velocidadeTiro + 'px';
          verificarColisao(tiro);
        } else {
          clearInterval(tiroInterval);
          document.body.removeChild(tiro);
        }
      }, 10);
      
}
function criacaoMeteoros (){
    var x = (Math.random()*tamanhoTelaLargura)-150;
    var y=-100;
    var meteoro = document.createElement("div");
    meteoro.classList.add('meteoro');
    meteoro.id = 'meteoro';
    meteoro.style.top=y+"px";
    meteoro.style.left=x+"px";
    meteoro.style.backgroundImage="./imagens/glitch_meteor/meteor0001.png"
    meteoro.vida = 3;
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
      if (pi > tamanhoTelaAltura+150) {
        vidaPlaneta -= 10;
        textoVida.textContent = vidaPlaneta;
        meteorosTotais[i].remove();
      }
    }
  }
}
function criacaoNaveInimigaPreto(){
var x = (tamanhoTelaLargura/2);
    var y=-100;
    var naveInimigaPreto = document.createElement("div");
    naveInimigaPreto.classList.add('naveInimigaPreto');
    naveInimigaPreto.id = 'naveInimigaPreto';
    naveInimigaPreto.style.top=y+"px";
    naveInimigaPreto.style.left=x+"px";
    naveInimigaPreto.style.backgroundImage="./imagens/naveInimigaPreto.PNG"
    naveInimigaPreto.vida = 3;
    document.body.appendChild(naveInimigaPreto)
    vidaInimigoPadrao.push(3); //inicializar o inimigo com vida 3
    quantnaveInimigaPretos--;
}
function controlaNaveInimigaPreto() {
  naveInimigaPretoTotais = document.getElementsByClassName("naveInimigaPreto");
  var tam = naveInimigaPretoTotais.length;
  for (var i = 0; i < tam; i++) {
    if (naveInimigaPretoTotais[i]) {
      var pi = naveInimigaPretoTotais[i].offsetTop;
      pi += velocidadeMeteoro-2;
      var horiz= naveInimigaPretoTotais[i].offsetLeft;
      if(horiz ==tamanhoTelaLargura-150){
        alcancouLadoDireito=true;
        alcancouLadoEsquerdo=false;
      }
      else if(horiz==0){
        alcancouLadoDireito=false;
        alcancouLadoEsquerdo=true;
      }
      if(alcancouLadoEsquerdo){
        horiz += 3;
      }
      else if(alcancouLadoDireito){
        horiz -=3;
      }
      else{
        horiz +=3;
      }
      naveInimigaPretoTotais[i].style.top = pi + "px";
      naveInimigaPretoTotais[i].style.left =horiz+"px";
      if (pi > tamanhoTelaAltura+150) {
        vidaPlaneta -= 10;
        textoVida.textContent = vidaPlaneta;
        naveInimigaPretoTotais[i].remove();
      }
    }
  }
}

function criacaoMiniBoss (){
  var x = (Math.random()*tamanhoTelaLargura)-348;
  var y=-280;
  if(x<348){
    x+=348;
  }
  var miniBoss = document.createElement("div");
  miniBoss.classList.add('miniBoss');
  miniBoss.id = 'miniBoss';
  miniBoss.style.top=y+"px";
  miniBoss.style.left=x+"px";
  miniBoss.style.backgroundImage="./imagens/naveInimigaVermelhaGrande.PNG"
  miniBoss.vida = 50;
  document.body.appendChild(miniBoss)
  vidaInimigoPadrao.push(3); //inicializar o inimigo com vida 3
  quantminiBoss--;
}
function controlaMiniBoss() {
miniBossTotais = document.getElementsByClassName("miniBoss");
var tam = miniBossTotais.length;
for (var i = 0; i < tam; i++) {
  if (miniBossTotais[i]) {
    var pi = miniBossTotais[i].offsetTop;
    pi += velocidademiniBoss;
    miniBossTotais[i].style.top = pi + "px";
    if (pi > tamanhoTelaAltura+279) {
      vidaPlaneta -= 20;
      textoVida.textContent = vidaPlaneta;
      miniBossTotais[i].remove();
    }
  }
}
}






function verificarDerrota(){
  if(vidaPlaneta ==0){
  window.location.href = "telaGameOver.html";
}}

function verificarColisao(tiro){
  var tiroRect = tiro.getBoundingClientRect();
  var tam = meteorosTotais.length;
  var tamMB = miniBossTotais.length;
  var tamNavePreta = naveInimigaPretoTotais.length;
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
        meteorosTotais[i].vida--;
        if(meteorosTotais[i].vida<=0){
        criarExplosao(meteoroTop,meteoroLeft)
        meteorosTotais[i].remove();
        pontuacao++;
        textoPontuacao.textContent = pontuacao;
        }
      }
    }
  }

  for (var i = 0; i < tam; i++) {
    if (miniBossTotais[i]) {
      vidaInimigoPadrao[i] = 3;
      var miniBossRect = miniBossTotais[i].getBoundingClientRect();

      // Coordenadas das extremidades do tiro
      var tiroTop = tiroRect.top;
      var tiroBottom = tiroRect.bottom;
      var tiroLeft = tiroRect.left;
      var tiroRight = tiroRect.right;

      // Coordenadas das extremidades do meteoro
      var meteoroTop = miniBossRect.top;
      var meteoroBottom = miniBossRect.bottom;
      var meteoroLeft = miniBossRect.left;
      var meteoroRight = miniBossRect.right;

      // Verifica a colisão
      if (
        tiroBottom >= meteoroTop &&
        tiroTop <= meteoroBottom &&
        tiroRight >= meteoroLeft &&
        tiroLeft <= meteoroRight
      ) {
        // Colisão detectada, remova o tiro e o meteoro
        
        tiro.remove();
        miniBossTotais[i].vida--;
        if(miniBossTotais[i].vida<=0){
        criarExplosao(meteoroTop,meteoroLeft)
        miniBossTotais[i].remove();
        pontuacao++;
        textoPontuacao.textContent = pontuacao;
        }
      }
    }
  }

  for (var i = 0; i < tamNavePreta; i++) {
    if (naveInimigaPretoTotais[i]) {
      naveInimigaPretoTotais[i] = 3;
      var meteoroRect = naveInimigaPretoTotais[i].getBoundingClientRect();

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
        naveInimigaPretoTotais[i].vida--;
        if(naveInimigaPretoTotais[i].vida<=0){
        criarExplosao(meteoroTop,meteoroLeft)
        naveInimigaPretoTotais[i].remove();
        pontuacao++;
        textoPontuacao.textContent = pontuacao;
        }
      }
    }
  }
}
function criarExplosao(top, left) {
  var explosao = document.createElement("div");
  explosao.classList.add('esplosao');
  explosao.id = 'explosao';
  explosao.style.top = top + "px";
  explosao.style.left = left + "px";
  explosao.style.backgroundImage = "./imagens/explosao.gif";
  document.body.appendChild(explosao);
  setTimeout(function () {
    explosao.remove();
  }, 800);
}

function colisaoNave(top,left){
  /*var inimigo
  if(

    if(

    
  ))*/
}
function aumentarDificuldade() {
  var taxaDeInimigosPadrao;
  var taxaDeInimigosVermelho;
  var taxaDeInimigosPreto;

  if (pontuacao <= 10) {
    taxaDeInimigosPadrao = 2000;
    taxaDeInimigosVermelho = 10000;
    taxaDeInimigosPreto = 10000;
    setInterval(criacaoMeteoros, taxaDeInimigosPadrao);
  setInterval(criacaoMiniBoss, taxaDeInimigosVermelho);
  setInterval(criacaoNaveInimigaPreto, taxaDeInimigosPreto);
  } else if (pontuacao <= 20) {
    taxaDeInimigosPadrao = 2000; 
    taxaDeInimigosVermelho = 1000;
    taxaDeInimigosPreto = 1000;
    setInterval(criacaoMeteoros, taxaDeInimigosPadrao);
  setInterval(criacaoMiniBoss, taxaDeInimigosVermelho);
  setInterval(criacaoNaveInimigaPreto, taxaDeInimigosPreto);
  } else if (pontuacao <= 30) {
    taxaDeInimigosPadrao = 1000; 
    taxaDeInimigosVermelho = 9000;
    taxaDeInimigosPreto = 5000;
    setInterval(criacaoMeteoros, taxaDeInimigosPadrao);
  setInterval(criacaoMiniBoss, taxaDeInimigosVermelho);
  setInterval(criacaoNaveInimigaPreto, taxaDeInimigosPreto);
  }
  else if(pontuacao <= 40){
    taxaDeInimigosPadrao = 900; 
    taxaDeInimigosVermelho = 7000;
    taxaDeInimigosPreto = 4000;
    setInterval(criacaoMeteoros, taxaDeInimigosPadrao);
  setInterval(criacaoMiniBoss, taxaDeInimigosVermelho);
  setInterval(criacaoNaveInimigaPreto, taxaDeInimigosPreto);
  }
  else {
    taxaDeInimigosPadrao = 1000; 
    taxaDeInimigosVermelho = 1000;
    taxaDeInimigosPreto = 1000;
    setInterval(criacaoMeteoros, taxaDeInimigosPadrao);
  setInterval(criacaoMiniBoss, taxaDeInimigosVermelho);
  setInterval(criacaoNaveInimigaPreto, taxaDeInimigosPreto);
  }
  
}

aumentarDificuldade();
