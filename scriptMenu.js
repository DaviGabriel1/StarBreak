var canvas = document.getElementById("starfield");
var ctx = canvas.getContext("2d");
var stars = [];
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

    // Repete a animação
    requestAnimationFrame(animate);
}

// Inicia a animação
animate();
const backgroundAudio = new Audio('./trilhasSonoras/trilhaSonoraMenuSpaceBreak.mp3');
backgroundAudio.play();