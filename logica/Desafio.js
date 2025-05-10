// ../logica/desafio1.js

window.onload = function() {
    const canvasDesafio = document.getElementById("desafioCanvas"); // Certifique-se de ter um canvas com este ID no desafio1.html
    if (canvasDesafio) {
        const ctxDesafio = canvasDesafio.getContext("2d");
        const poligonoDataString = sessionStorage.getItem('poligonoData');

        if (poligonoDataString) {
            const poligonoData = JSON.parse(poligonoDataString);
            const verticesGuardados = poligonoData.vertices;
            const arestasGuardadas = poligonoData.arestas;

            // Limpa o canvas
            ctxDesafio.clearRect(0, 0, canvasDesafio.width, canvasDesafio.height);

            // Define a cor e a largura das linhas
            ctxDesafio.lineWidth = 3;
            ctxDesafio.strokeStyle = "black";
            ctxDesafio.fillStyle = "black";

            // Desenha as arestas
            arestasGuardadas.forEach(aresta => {
                ctxDesafio.beginPath();
                ctxDesafio.moveTo(aresta.v1.x, aresta.v1.y);
                ctxDesafio.lineTo(aresta.v2.x, aresta.v2.y);
                ctxDesafio.stroke();
            });

            // Desenha os vértices
            verticesGuardados.forEach(vertice => {
                ctxDesafio.beginPath();
                ctxDesafio.arc(vertice.x, vertice.y, 5, 0, Math.PI * 2);
                ctxDesafio.fill();
            });

            console.log("Polígono desenhado no canvas de Desafio 1.");
            console.log("Vértices recebidos:", verticesGuardados);
            console.log("Arestas recebidas:", arestasGuardadas);

        } else {
            console.log("Nenhum dado de polígono encontrado no sessionStorage para desenhar.");
            // Adicione aqui qualquer tratamento de erro ou mensagem para o usuário
        }
    } else {
        console.error("Elemento canvas com ID 'desafioCanvas' não encontrado no desafio1.html.");
    }
}; ]1112