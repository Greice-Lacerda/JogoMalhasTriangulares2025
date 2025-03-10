document.getElementById("resetButton").addEventListener("click", function () {
  if (confirm("Tem certeza de que deseja resetar o jogo?")) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    vertices = [];
    arestas = [];

    // Solicitar nova escolha de número de vértices
    numVertices = parseInt(
      prompt("Escolha o número de vértices (mínimo 3):", 3)
    );
    if (isNaN(numVertices) || numVertices < 3) {
      window.location.href = window.location.href =
        "C:/Users/Greice Lacerda/OneDrive/ASSUNTOS DE KELI/CAP-UERJ/PARA ARTIGOS FUTUROS 2025/Jogo Malhas/index.html";
    } else {
      
      vertices = [];
      arestas = [];
      corSelecionada = "#f0ff00"; // Cor padrão
      pinturaConcluida = false;
      selectedVerticesForTriangle = [];
      triangles = [];

      // Reiniciar o jogo
      document.getElementById("addVertex").addEventListener("click", function () {
        if (vertices.length < numVertices) {
          canvas.addEventListener("click", addVertice);
        }
      });
    }
  }
});

function repintar() {
      // Reiniciar a função pintar
      document.getElementById("pintarElementos").addEventListener("click", () => {
        exibirMensagemComSeletor("selecione a cor da figura");
      });
}    

