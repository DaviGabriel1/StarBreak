let pontuacaoTotal = 0;

        // Função para aumentar a vida quando o botão é clicado
        function aumentarVida() {
            pontuacaoTotal += 10; // Aumenta a pontuação (ajuste conforme necessário)
            document.getElementById('vida').textContent = pontuacaoTotal;
        }