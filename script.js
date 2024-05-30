// Obtém o elemento canvas e seu contexto 2D
var canvas = document.getElementById("starfield");
var ctx = canvas.getContext("2d");

// Define o tamanho do canvas para ocupar a tela inteira
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array para armazenar as estrelas
var stars = [];


const navePrincipal = document.getElementById('navePrincipal');// Transportar o CSS
let posicaoHorizontal = 50; //localizacao da nave
let posicaoVertical = 95; //localizacao da nave
let step = 0.7; //passo para cada click
var velocidadeTiro = 5; //velocidade dos tiros (pode variar com power up)

var tamanhoTelaLargura = window.innerWidth;
var tamanhoTelaAltura = window.innerHeight;

var quantMeteoros = 150;
var quantminiBoss = 70;
var meteorosTotais;
var miniBossTotais;

var tiros; // array de tiros

var velocidadeMeteoro = 3; //velocidade da nave

var vidaPlaneta = 100; //vida total do planeta

var pontuacao = 0; //ponntuacao inicial
var textoPontuacao = document.getElementById("pontuacao");
textoPontuacao.textContent = pontuacao;
var precisao = 100;
var textoPrecisao = document.getElementById("precisao");
textoPrecisao.textContent = 100;

var velocidademiniBoss = 1; //velocidade nave vermelha

var teclaPressionada; // var para limitar as teclas pressionadas

const backgroundAudio = new Audio('./trilhasSonoras/efeitosonorotiro.mp3'); //som de fundo

const intervaloDeTiro = 200; // Intervalo de tiro em milissegundos

var quantnaveInimigaPretos; //controlar numero de inimigos na tela
var naveInimigaPretoTotais; //var para iterar os inimigos e controlar as colisoes

var alcancouLadoDireito; //var para delimitar movimentação do inimigo preto
var alcancouLadoEsquerdo;//var para delimitar movimentação do inimigo preto
var vidaInimigoPadrao=3; //vida total do inimigo azul

var vidaInimigoVermelho=60;
var vidaInimigoPreto=9;
var powerupTotais; // iterar os power-ups e controlar as colisoes de cada um
var powerUpVelocidadeAtivado=false; //flag para ativar efeito do power-up apenas quando for true
var powerUpTiroAtivado = false;//flag para ativar efeito do power-up apenas quando for true
var powerUpDanoAtivado = false;//flag para ativar efeito do power-up apenas quando for true
var pontuacaoTotal; //pontuacao ao perder (pode ser feito ranking local no futuro)
var bossTotais;
let vidaBoss = 10000;
var bossCriado=false;
var tempoParaProximoTiro = 0;
var projeteis = [];

var tirosAcertados =0;
var totalDeTiros =0;

var ladoDireitoProjetil=false;
var ladoEsquerdoProjetil=false;
var primeiroTiro=false;

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
    controlaMeteoros(); //permite a movimentação
    verificarDerrota(); //analisa se a vida chega a 0
    controlaMiniBoss();//permite a movimentação
    controlaNaveInimigaPreto();//permite a movimentação
    controlaPowerUpVelocidade();//permite a movimentação
    controlaPowerUpTiro();//permite a movimentação
    controlaPowerUpVida();//permite a movimentação
    controlaPowerUpDano();//permite a movimentação
    verificarColisaoPowerUps(); //analisa a colisao e ativa efeito
    alterarVida(); //aumenta a vida dependendo do power-up de cura
    controlaBoss();
    if(primeiroTiro){
      verificarPrecisao();
    }
    
    /*if (tempoParaProximoTiro <= 0) {
      var bossTotal = document.getElementById('boss');
      if (bossTotal) {
        var x = bossTotal.offsetLeft + bossTotal.clientWidth / 2;
        var y = bossTotal.offsetTop;
        criarProjetil(x, y);
      }
      // Defina um intervalo de tempo para o próximo tiro (em milissegundos)
      tempoParaProximoTiro = 2000; // Por exemplo, um tiro a cada 2 segundos
    }
    for (var i = 0; i < projeteis.length; i++) {
      var projetil = projeteis[i];
      projetil.style.top = parseInt(projetil.style.top) + 5 + "px"; // Mova o tiro para baixo

      
      var horiz= projetil.style.offsetLeft;
      if(horiz ==tamanhoTelaLargura-150){
        ladoDireitoProjetil=true;
        ladoEsquerdoProjetil=false;
      }
      else if(horiz==0){
        ladoDireitoProjetil=false;
        ladoEsquerdoProjetil=true;
      }
      if(ladoEsquerdoProjetil){
        horiz += 3;
      }
      else if(ladoDireitoProjetil){   //TODO: SISTEMA DE TIRO DO BOSS EFICIENTE
        horiz -=3;
      }
      else{
        horiz +=3;
      }
      projetil.style.left = parseInt(projetil.style.left) + horiz + "px";
      // Verifique colisões ou remova o projetil se ele sair da tela
      if (projetil.offsetTop > tamanhoTelaAltura) {
        projetil.parentNode.removeChild(projetil);
        projeteis.splice(i, 1);
        i--; // Decrementa o índice para compensar a remoção do projetil
      }
    }
  
    // Atualize o contador de tempo
    tempoParaProximoTiro -= 16;*/
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
    navePrincipal.style.left = posicaoHorizontal+'%'; //atualiza posição horizontal
    navePrincipal.style.top = posicaoVertical+'%';  //atualiza posição vertical
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


function atualizarMovimento() { //movimenta nave principal
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
    if(!powerUpTiroAtivado){ //se o power-up estiver ativado, sairá 3 tiros, caso contrario apenas 1
    atirar();
    }
    else {
      atirarComPowerUp();
    }
  }
});

// Inicie o loop de atualização
atualizarMovimento();
function atirar() {
    totalDeTiros++;
    primeiroTiro=true;
    const tiro = document.createElement('div'); //cria elemento tiro
    tiro.classList.add('tiro'); //adiciona uma classe (será usado para personalizar no css)
    tiro.id = 'tiro'; //add id
    document.body.appendChild(tiro); //adiciona o elemento no body
    const personagemRect = navePrincipal.getBoundingClientRect(); //const com as caracteristicas da nave principal
    tiro.style.left = (personagemRect.left + personagemRect.width / 2) + 'px'; //localizacao do tiro ao inicializar (no meio da nave)
    tiro.style.top = (personagemRect.top + personagemRect.height / 2) + 'px'; //localizacao do tiro ao inicializar (no meio da nave)
    const tiroInterval = setInterval(() => {
        const tiroRect = tiro.getBoundingClientRect(); //const com as caracteristicas do tiro
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

function atirarComPowerUp(){ //funcao ativada ao efeito do power-up de 3 tiros
  const tiros = [];

  // Cria três tiros
  for (var i = 0; i < 3; i++) {
    const tiro = document.createElement('div');
    tiro.classList.add('tiro');
    tiro.id = 'tiro' + i; // Adicione um ID exclusivo para cada tiro
    document.body.appendChild(tiro);
    const personagemRect = navePrincipal.getBoundingClientRect();

    // Define a posição horizontal para os tiros ao lado um do outro
    const tiroLeft = (personagemRect.left + personagemRect.width / 2 - 10) + i * 20;

    tiro.style.left = tiroLeft + 'px';
    tiro.style.top = (personagemRect.top + personagemRect.height / 2) + 'px';

    // Cria um intervalo de disparo para cada tiro
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

    // Adicione o tiro à lista de tiros
    tiros.push(tiro);
}}

function criacaoMeteoros (){ //cria naves azul
  var x = (Math.random()*tamanhoTelaLargura)-150;
  var y=-100;
  if(x<150){
    x+=150;
  }
    var meteoro = document.createElement("div");
    meteoro.classList.add('meteoro');
    meteoro.id = 'meteoro';
    meteoro.style.top=y+"px";
    meteoro.style.left=x+"px";
    meteoro.style.backgroundImage="./imagens/glitch_meteor/meteor0001.png"
    meteoro.vida = vidaInimigoPadrao;
    document.body.appendChild(meteoro)
   // vidaInimigoPadrao.push(3); //inicializar o inimigo com vida 3
    quantMeteoros--;
}
function controlaMeteoros() { //controla nave azul
  meteorosTotais = document.getElementsByClassName("meteoro");
  var tam = meteorosTotais.length;
  for (var i = 0; i < tam; i++) {
    if (meteorosTotais[i]) {
      var pi = meteorosTotais[i].offsetTop;
      pi += velocidadeMeteoro;
      meteorosTotais[i].style.top = pi + "px";
      if (pi > tamanhoTelaAltura+150) {
        vidaPlaneta -= 10;
      
        meteorosTotais[i].remove();
      }
    }
  }
}
function criacaoNaveInimigaPreto(){ //cria nave preta
var x = (tamanhoTelaLargura/2);
    var y=-100;
    var naveInimigaPreto = document.createElement("div");
    naveInimigaPreto.classList.add('naveInimigaPreto');
    naveInimigaPreto.id = 'naveInimigaPreto';
    naveInimigaPreto.style.top=y+"px";
    naveInimigaPreto.style.left=x+"px";
    naveInimigaPreto.style.backgroundImage="./imagens/naveInimigaPreto.PNG"
    naveInimigaPreto.vida = vidaInimigoPreto;
    document.body.appendChild(naveInimigaPreto)
    //vidaInimigoPadrao.push(3); //inicializar o inimigo com vida 3
    quantnaveInimigaPretos--;
}
function controlaNaveInimigaPreto() { //controla nave preta
  naveInimigaPretoTotais = document.getElementsByClassName("naveInimigaPreto");
  var tam = naveInimigaPretoTotais.length;
  for (var i = 0; i < tam; i++) {
    if (naveInimigaPretoTotais[i]) {
      var pi = naveInimigaPretoTotais[i].offsetTop;
      pi += velocidadeMeteoro-2;
      var horiz= naveInimigaPretoTotais[i].offsetLeft;
      if(horiz >=tamanhoTelaLargura-150){
        alcancouLadoDireito=true;
        alcancouLadoEsquerdo=false;
      }
      else if(horiz<=0){
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
      
        naveInimigaPretoTotais[i].remove();
      }
    }
  }
}

function criacaoMiniBoss (){ //cria nave vermelha
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
  miniBoss.vida = vidaInimigoVermelho;
  document.body.appendChild(miniBoss)
  //vidaInimigoPadrao.push(3); //inicializar o inimigo com vida 3
  quantminiBoss--;
}
function controlaMiniBoss() { //controla nave vermelha
miniBossTotais = document.getElementsByClassName("miniBoss");
var tam = miniBossTotais.length;
for (var i = 0; i < tam; i++) {
  if (miniBossTotais[i]) {
    var pi = miniBossTotais[i].offsetTop;
    pi += velocidademiniBoss;
    miniBossTotais[i].style.top = pi + "px";
    if (pi > tamanhoTelaAltura+279) {
      vidaPlaneta -= 20;
    
      miniBossTotais[i].remove();
    }
  }
}
}

function criarPowerUpVelocidade(){ //cria power-up velocidade
  var x = (Math.random()*tamanhoTelaLargura);
  var y=-33;
  var powerUpVelocidade = document.createElement("div"); //power up velocidade
  powerUpVelocidade.classList.add('power-up-velocidade')
  powerUpVelocidade.id = 'power-up-velocidade';
  powerUpVelocidade.style.top = y+"px";
  powerUpVelocidade.style.left = x+"px";
  powerUpVelocidade.style.backgroundImage = "./imagens/power-ups/power-up-velocidade.png"
  document.body.appendChild(powerUpVelocidade);
  quantPowerUps--;
}

function criarBoss(){
  var x = tamanhoTelaAltura/2;
  var y = -1100;
  var boss = document.createElement("div"); //power up velocidade
  boss.classList.add('boss')
  boss.id = 'boss';
  boss.style.top = y+"px";
  boss.style.left = x+"px";
  boss.vida = vidaBoss; //TODO
  boss.style.backgroundImage = "./imagens/boss.jpg"
  document.body.appendChild(boss);
  bossCriado=true;
  //criarBarraDeVida();
}
function controlaBoss(){
  bossTotais = document.getElementsByClassName("boss");
  var tam = bossTotais.length;
  var top;
  for (var i = 0; i < tam; i++) {
    if (bossTotais[i]) {
      if(bossTotais[i].style.top < 5 + "%"){
      var pi = bossTotais[i].offsetTop;
      pi += 0.5;
      top = pi;
      bossTotais[i].style.top = pi + "px";
      }  
    }

  }
  
}function criarProjetil(x, y) {
  var projetil = document.createElement("div");
  projetil.classList.add('projetil');
  projetil.style.top = y + "px";
  projetil.style.left = x + "px";
  document.body.appendChild(projetil);
  projeteis.push(projetil);
}
/*
function criarBarraDeVida(){
  var x = 50;
  var y = 50;
  var barraDeVida = document.createElement("div"); //power up velocidade
  barraDeVida.classList.add('barraDeVida')
  barraDeVida.id = 'barraDeVida';
  barraDeVida.style.top = y+"%";
  barraDeVida.style.left = x+"%";
  document.body.appendChild(barraDeVida);
}
function atualizarBarraDeVida(){
  const barraDeVida = document.getElementById("barraDeVida");
  barraDeVida.style.width = vidaBoss+"%";
}*/
function criarPowerUpTiro(){ //cria power-up de 3 tiros
  var x = (Math.random()*tamanhoTelaLargura);
  var y=-33;
  var powerUpTiro = document.createElement("div");
  powerUpTiro.classList.add('power-up-maisTiro')
  powerUpTiro.id = 'power-up-maisTiro';
  powerUpTiro.style.top = y+"px";
  powerUpTiro.style.left = x+"px";
  powerUpTiro.style.backgroundImage = "./imagens/power-ups/power-up-maisTiro.png"
  document.body.appendChild(powerUpTiro);
  quantPowerUps--;
}

function controlaPowerUpVelocidade(){  //movimentação power-up velocidade
  powerupTotais = document.getElementsByClassName("power-up-velocidade");
  var tam = powerupTotais.length;
  for (var i = 0; i < tam; i++) {
    if (powerupTotais[i]) {
      var pi = powerupTotais[i].offsetTop;
      pi += 2;
      powerupTotais[i].style.top = pi + "px";
      
      if (pi > tamanhoTelaAltura+279) {
        powerupTotais[i].remove();
      }
    }
  }
}
function controlaPowerUpTiro(){ //movimentação dos tiros
  powerupTotais = document.getElementsByClassName("power-up-maisTiro");
  var tam = powerupTotais.length;
  for (var i = 0; i < tam; i++) {
    if (powerupTotais[i]) {
      var pi = powerupTotais[i].offsetTop;
      pi += 2;
      powerupTotais[i].style.top = pi + "px";
      
      if (pi > tamanhoTelaAltura+45) {
        powerupTotais[i].remove();
      }
    }
  }
}

function criarPowerUpVida(){  //add power up vida 
  var x = (Math.random()*tamanhoTelaLargura);
  var y=-33;
  var powerUpVida = document.createElement("div"); //power up Vida
  powerUpVida.classList.add('power-up-vida');
  powerUpVida.id = 'power-up-vida';
  powerUpVida.style.top = y+"px";
  powerUpVida.style.left = x+"px";
  powerUpVida.style.backgroundImage = "./imagens/power-ups/power-up-vida.png"
  document.body.appendChild(powerUpVida);
}

function controlaPowerUpVida(){ //movimentação power-up vida
  powerupTotais = document.getElementsByClassName("power-up-vida");
  var tam = powerupTotais.length;
  for (var i = 0; i < tam; i++) {
    if (powerupTotais[i]) {
      var pi = powerupTotais[i].offsetTop;
      pi += 2;
      powerupTotais[i].style.top = pi + "px";
      
      if (pi > tamanhoTelaAltura+54) {
        powerupTotais[i].remove();
      }
    }
  }
}
function criacaoPowerUpDano(){ //cria power-up vida 
  var x = (Math.random()*tamanhoTelaLargura);
  var y=-33;
  var powerUpDano = document.createElement("div"); //power up Dano
  powerUpDano.classList.add('power-up-dano');
  powerUpDano.id = 'power-up-dano';
  powerUpDano.style.top = y+"px";
  powerUpDano.style.left = x+"px";
  powerUpDano.style.backgroundImage = "./imagens/power-ups/power-up-dano.png"
  document.body.appendChild(powerUpDano);
}
function controlaPowerUpDano(){ // controla power-up dano
  powerupTotais = document.getElementsByClassName("power-up-dano");
  var tam = powerupTotais.length;
  for (var i = 0; i < tam; i++) {
    if (powerupTotais[i]) {
      var pi = powerupTotais[i].offsetTop;
      pi += 2;
      powerupTotais[i].style.top = pi + "px";
      
      if (pi > tamanhoTelaAltura+45) {
        powerupTotais[i].remove();
      }
    }
  }
}
function verificarPrecisao(){
  precisao = tirosAcertados/totalDeTiros
  if(precisao<10){
    precisao = precisao*100;
  }
  if(precisao<100 && precisao !=0){
  textoPrecisao.textContent = precisao.toFixed(1);
  }else{
    textoPrecisao.textContent = precisao.toFixed(0);
  }
}

function verificarDerrota(){
  if(vidaPlaneta ==0){
    pontuacaoTotal = pontuacao;

  window.location.href = "telaGameOver.html";
}}

function verificarColisao(tiro){ //analisa colisao do parametro tiro para cada tipo de nave inimiga
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
        tirosAcertados++;
        tiro.remove();
        meteorosTotais[i].vida--;
        meteorosTotais[i].style.backgroundImage = "./imagens/naveInimigaPadraoDano.PNG"
        setTimeout(function () {
          meteorosTotais[i].style.backgroundImage = "./imagens/naveInimigaPadrao.PNG"
          }, 200);
        if(powerUpDanoAtivado){
          meteorosTotais[i].vida=0;
        }
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
        tirosAcertados++;
        tiro.remove();
        miniBossTotais[i].vida--;
        if(powerUpDanoAtivado){
          miniBossTotais[i].vida=0;
        }
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
        tirosAcertados++;
        tiro.remove();
        naveInimigaPretoTotais[i].vida--;
        if(powerUpDanoAtivado){
          naveInimigaPretoTotais[i].vida=0;
        }
        if(naveInimigaPretoTotais[i].vida<=0){
        criarExplosao(meteoroTop,meteoroLeft)
        naveInimigaPretoTotais[i].remove();
        pontuacao++;
        textoPontuacao.textContent = pontuacao;
        }
      }
    }
  }
  for (var i = 0; i < tamNavePreta; i++) {
    if (bossTotais[i]) {
      bossTotais[i] = 3;
      var meteoroRect = bossTotais[i].getBoundingClientRect();
      const barraDeVida = document.getElementById("barraDeVida");

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
        tirosAcertados++;
        tiro.remove();
        bossTotais[i].vida--; //TODO
        vidaBoss-=10;
        if(bossTotais[i].vida<=0){
        criarExplosao(meteoroTop,meteoroLeft)
        bossTotais[i].remove();
      //remover barra de vida
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
function aumentarDificuldade() { //aumenta taxa de inimigo de acordo com a pontuacao
  var taxaDeInimigosPadrao;
  var taxaDeInimigosVermelho;
  var taxaDeInimigosPreto;
  /*
  if (pontuacao <= 10) {
    taxaDeInimigosPadrao = 2000;
    taxaDeInimigosVermelho = 10000;
    taxaDeInimigosPreto = 3000;
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
  }*/
  const inimigoAzul1 = setInterval(criacaoMeteoros, 2000);//*MODO DE PROGRESSAO */
  const inimigoPreto1 = setInterval(criacaoNaveInimigaPreto, 50000);
  const inimigoVermelho1 = setInterval(criacaoMiniBoss, 50000);
setTimeout(function() {
  clearInterval(inimigoAzul1,inimigoPreto1,inimigoVermelho1);
  const inimigoAzul2 = setInterval(criacaoMeteoros, 1500);
  const inimigoPreto2 = setInterval(criacaoNaveInimigaPreto, 10000);
  const inimigoVermelho2 = setInterval(criacaoMiniBoss, 30000);
}, 20000);
setTimeout(function() {
  clearInterval(inimigoAzul2,inimigoPreto2,inimigoVermelho2);
  const inimigoAzul3 = setInterval(criacaoMeteoros, 1000);
  const inimigoPreto3 = setInterval(criacaoNaveInimigaPreto, 5000);
  const inimigoVermelho3 = setInterval(criacaoMiniBoss, 10000);
}, 60000);
setTimeout(function() {
  clearInterval(inimigoAzul3,inimigoPreto3,inimigoVermelho3);
  const inimigoAzul4 = setInterval(criacaoMeteoros, 2000);
  const inimigoPreto4 = setInterval(criacaoNaveInimigaPreto, 3000);
  const inimigoVermelho4 = setInterval(criacaoMiniBoss, 10000);
}, 100000);
setTimeout(function() {
  clearInterval(inimigoAzul3,inimigoPreto3,inimigoVermelho3);
  const inimigoAzul4 = setInterval(criacaoMeteoros, 1500);
  const inimigoPreto4 = setInterval(criacaoNaveInimigaPreto, 1800);
  const inimigoVermelho4 = setInterval(criacaoMiniBoss, 5000);
}, 200000);

/*taxaDeInimigosPadrao = 2000;
taxaDeInimigosVermelho = 10000;
taxaDeInimigosPreto = 3000;
setInterval(criacaoMeteoros, taxaDeInimigosPadrao);
setInterval(criacaoMiniBoss, taxaDeInimigosVermelho);
setInterval(criacaoNaveInimigaPreto, taxaDeInimigosPreto);*/ /* MODO DIFICIL */
}


function verificarColisaoPowerUps() {  //verifica a colisao de cada power-up (cada elemento de cada classe)
  var powerUpTotaisVelocidade = document.getElementsByClassName("power-up-velocidade");
  var powerUpTotaisTiro = document.getElementsByClassName("power-up-maisTiro");
  var powerUpTotaisVida = document.getElementsByClassName("power-up-vida");
  var powerUpTotaisDano = document.getElementsByClassName("power-up-dano");
  var navePrincipalRect = navePrincipal.getBoundingClientRect();

  for (var i = 0; i < powerUpTotaisVelocidade.length; i++) { //POWER UP +VELOCIDADE
    var powerUpRect = powerUpTotaisVelocidade[i].getBoundingClientRect();

    // Coordenadas das extremidades do power-up
    var powerUpTop = powerUpRect.top;
    var powerUpBottom = powerUpRect.bottom;
    var powerUpLeft = powerUpRect.left;
    var powerUpRight = powerUpRect.right;

    // Coordenadas das extremidades da nave principal
    var naveTop = navePrincipalRect.top;
    var naveBottom = navePrincipalRect.bottom;
    var naveLeft = navePrincipalRect.left;
    var naveRight = navePrincipalRect.right;

    // Verifica a colisão
    if (
      powerUpBottom >= naveTop &&
      powerUpTop <= naveBottom &&
      powerUpRight >= naveLeft &&
      powerUpLeft <= naveRight
    ) {
      powerUpTotaisVelocidade[i].remove();
      powerUpVelocidadeAtivado = true;

      // Altera a variável 'step' para a nova velocidade
      step = 1.2;
      exibirIcone();
      // Define um temporizador para voltar à velocidade normal após 20 segundos
      setTimeout(function () {
        step = 0.7;
        powerUpVelocidadeAtivado = false; // Desativa o power-up
      }, 20000); // 20 segundos em milissegundos
    }
  }

  
  for (var i = 0; i < powerUpTotaisTiro.length; i++) { // POWER UP +TIRO
    var powerUpRect = powerUpTotaisTiro[i].getBoundingClientRect();

    // Coordenadas das extremidades do power-up
    var powerUpTop = powerUpRect.top;
    var powerUpBottom = powerUpRect.bottom;
    var powerUpLeft = powerUpRect.left;
    var powerUpRight = powerUpRect.right;

    // Coordenadas das extremidades da nave principal
    var naveTop = navePrincipalRect.top;
    var naveBottom = navePrincipalRect.bottom;
    var naveLeft = navePrincipalRect.left;
    var naveRight = navePrincipalRect.right;

    // Verifica a colisão
    if (
      powerUpBottom >= naveTop &&
      powerUpTop <= naveBottom &&
      powerUpRight >= naveLeft &&
      powerUpLeft <= naveRight
    ) {
      powerUpTotaisTiro[i].remove();
      powerUpTiroAtivado = true;
      exibirIcone();
      // Define um temporizador 20 segundos
      setTimeout(function () {
        
        powerUpTiroAtivado = false; // Desativa o power-up
      }, 20000); // 20 segundos em milissegundos
    }
  }

  for (var i = 0; i < powerUpTotaisVida.length; i++) { //POWER UP VIDA
    var powerUpRect = powerUpTotaisVida[i].getBoundingClientRect();

    // Coordenadas das extremidades do power-up
    var powerUpTop = powerUpRect.top;
    var powerUpBottom = powerUpRect.bottom;
    var powerUpLeft = powerUpRect.left;
    var powerUpRight = powerUpRect.right;

    // Coordenadas das extremidades da nave principal
    var naveTop = navePrincipalRect.top;
    var naveBottom = navePrincipalRect.bottom;
    var naveLeft = navePrincipalRect.left;
    var naveRight = navePrincipalRect.right;

    // Verifica a colisão
    if (
      powerUpBottom >= naveTop &&
      powerUpTop <= naveBottom &&
      powerUpRight >= naveLeft &&
      powerUpLeft <= naveRight
    ) {
      powerUpTotaisVida[i].remove();
      if(vidaPlaneta ==100){
        break;
      }
      else if(vidaPlaneta == 90){ //diminui a quantidade de vida da interface
        var vidaInteira = document.getElementById("vida5");
      vidaInteira.src = "./imagens/coracao.png";
      vidaInteira.style.width =30+"px";
      }
      else if(vidaPlaneta == 80){
        var vidaInteira = document.getElementById("vida5");
        vidaInteira.src = "./imagens/meioCoracao.png";
        vidaInteira.style.width =30+"px";
        vidaInteira.style.display="block";
      }
      else if(vidaPlaneta == 70){
        var vidaInteira = document.getElementById("vida4");
      vidaInteira.src = "./imagens/coracao.png";
      vidaInteira.style.width =30+"px";
      }
      else if(vidaPlaneta == 60){
        var vidaInteira = document.getElementById("vida4");
        vidaInteira.src = "./imagens/meioCoracao.png";
      vidaInteira.style.width =30+"px";
      vidaInteira.style.display="block";
      }
      else if(vidaPlaneta == 50){
        var vidaInteira = document.getElementById("vida3");
      vidaInteira.src = "./imagens/coracao.png";
      vidaInteira.style.width =30+"px";
      }
      else if(vidaPlaneta == 40){
        var vidaInteira = document.getElementById("vida3");
        vidaInteira.src = "./imagens/meioCoracao.png";
      vidaInteira.style.width =30+"px";
      vidaInteira.style.display="block";
      }
      else if(vidaPlaneta == 30){
        var vidaInteira = document.getElementById("vida2");
      vidaInteira.src = "./imagens/coracao.png";
      vidaInteira.style.width =30+"px";
      }
      else if(vidaPlaneta == 20){
        var vidaInteira = document.getElementById("vida2");
        vidaInteira.src = "./imagens/meioCoracao.png";
      vidaInteira.style.width =30+"px";
      vidaInteira.style.display="block";
      }
      else if(vidaPlaneta == 10){
        var vidaInteira = document.getElementById("vida1");
      vidaInteira.src = "./imagens/coracao.png";
      vidaInteira.style.width =30+"px";
      }
      vidaPlaneta+=10;
    
    }
  }

  for (var i = 0; i < powerUpTotaisDano.length; i++) { //POWER UP VIDA
    var powerUpRect = powerUpTotaisDano[i].getBoundingClientRect();

    // Coordenadas das extremidades do power-up
    var powerUpTop = powerUpRect.top;
    var powerUpBottom = powerUpRect.bottom;
    var powerUpLeft = powerUpRect.left;
    var powerUpRight = powerUpRect.right;

    // Coordenadas das extremidades da nave principal
    var naveTop = navePrincipalRect.top;
    var naveBottom = navePrincipalRect.bottom;
    var naveLeft = navePrincipalRect.left;
    var naveRight = navePrincipalRect.right;

    // Verifica a colisão
    if (
      powerUpBottom >= naveTop &&
      powerUpTop <= naveBottom &&
      powerUpRight >= naveLeft &&
      powerUpLeft <= naveRight
    ) {
      powerUpTotaisDano[i].remove();
      powerUpDanoAtivado = true;
      exibirIcone();
      // Define um temporizador 20 segundos
      setTimeout(function () {
        powerUpDanoAtivado = false; // Desativa o power-up
      }, 20000); // 20 segundos em milissegundos
    }
  }
}
function exibirIcone(){ //sinaliza o power up que está sendo usado
  if(powerUpTiroAtivado){
  var maisTiroIcone = document.createElement("div");
  maisTiroIcone.classList.add('icone-mais-tiro');
  maisTiroIcone.id = 'maisTiroIcone';
  maisTiroIcone.style.top = 5 + "%";
  maisTiroIcone.style.left = 95 + "%";
  maisTiroIcone.style.backgroundImage = "./imagens/power-ups/power-up-maisTiro.png";
  document.body.appendChild(maisTiroIcone);
  setTimeout(function () {
  maisTiroIcone.remove();
  }, 20000);
} else if(powerUpVelocidadeAtivado){
  var velocidadeIcone = document.createElement("div");
  velocidadeIcone.classList.add('icone-velocidade');
  velocidadeIcone.id = 'velocidadeIcone';
  velocidadeIcone.style.top = 5 + "%";
  velocidadeIcone.style.left = 95 + "%";
  velocidadeIcone.style.backgroundImage = "./imagens/power-ups/power-up-velocidade-Icone.png";
  document.body.appendChild(velocidadeIcone);
  setTimeout(function () {
  velocidadeIcone.remove();
  }, 20000);
} else if(powerUpDanoAtivado){
  var danoIcone = document.createElement("div");
  danoIcone.classList.add('icone-dano');
  danoIcone.id = 'icone-dano';
  danoIcone.style.top = 5 + "%";
  danoIcone.style.left = 95 + "%";
  danoIcone.style.backgroundImage = "./imagens/power-ups/power-up-dano-Icone.png";
  document.body.appendChild(danoIcone);
  setTimeout(function () {
  danoIcone.remove();
  }, 20000);
}
}
function alterarVida(){ //de acordo com o aumento de vida aumentar os corações da interface
  if(vidaPlaneta==90){
  var vidaInteira = document.getElementById("vida5");
  vidaInteira.src = "./imagens/meioCoracao.png";
  vidaInteira.style.width =15+"px";
  }
  else if(vidaPlaneta==80){
    var meiaVida = document.getElementById("vida5");
    meiaVida.style.display="none";
  }
  else if(vidaPlaneta==70){
    var vidaInteira = document.getElementById("vida4");
    vidaInteira.src = "./imagens/meioCoracao.png";
    vidaInteira.style.width =15+"px";
  }
  else if(vidaPlaneta==60){
      var meiaVida = document.getElementById("vida4");
      meiaVida.style.display="none";
  }
  else if(vidaPlaneta==50){
    var vidaInteira = document.getElementById("vida3");
    vidaInteira.src = "./imagens/meioCoracao.png";
    vidaInteira.style.width =15+"px";
  }
  else if(vidaPlaneta==40){
    var meiaVida = document.getElementById("vida3");
    meiaVida.style.display="none";
  }
  else if(vidaPlaneta==30){
    var vidaInteira = document.getElementById("vida2");
    vidaInteira.src = "./imagens/meioCoracao.png";
    vidaInteira.style.width =15+"px";
  }
  else if(vidaPlaneta==20){
    var meiaVida = document.getElementById("vida2");
    meiaVida.style.display="none";
  }
  else if(vidaPlaneta==10){
    var vidaInteira = document.getElementById("vida1");
    vidaInteira.src = "./imagens/meioCoracao.png";
    vidaInteira.style.width =15+"px";
  }
  else if(vidaPlaneta==0){
    verificarDerrota();
  }

}
aumentarDificuldade();
setInterval(criarPowerUpVelocidade, 150000); //power up velocidade a cada 90s/ 1min e 30s
setInterval(criarPowerUpTiro, 100000); //power up Tiro a cada 60s / 1 min
setInterval(criarPowerUpVida, 70000); //power up vida a cada 70s  / 1min e 10s
setInterval(criacaoPowerUpDano, 180000); //power up velocidade a cada 180s
//setInterval(criarBoss,20000);
