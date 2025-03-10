// Exibe mensagem temporária
setTimeout(() => {
  alert("Clique no botão 'Adicionar Vértice' para começar o jogo!");

  document.getElementById("addVertex").addEventListener("click", function () {
    canvas.addEventListener("click", iniciarJogo, { once: true }); // Aguarda o primeiro clique no canvas
  });
}, 2000);

function voltar() {
  window.location.href = "C:/Users/Greice Lacerda/OneDrive/ASSUNTOS DE KELI/CAP-UERJ/PARA ARTIGOS FUTUROS 2025/Jogo Malhas/pages/Instrucoes.html";
}

function imprimirJogo() {
  window.open("C:/Users/Greice Lacerda/OneDrive/ASSUNTOS DE KELI/CAP-UERJ/PARA ARTIGOS FUTUROS 2025/Jogo Malhas/pages/imprimir.html", "_blank");
}

function sairJogo() {
  window.location.href = "http://www.google.com/"; // Sai do jogo
}

// Configuração do Canvas
let vertices = [];
let arestas = [];
let numVertices = 0;
let selectedVertices = [];

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;
canvas.style.background = "white";
canvas.style.border = "1px solid black";
canvas.style.borderRadius = "10px";
canvas.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
ctx.lineWidth = 3; // Aumenta a espessura da aresta

// Função para iniciar o jogo ao clicar no canvas pela primeira vez
function iniciarJogo(event) {
  numVertices = parseInt(prompt("Escolha o número de vértices (mínimo 3):", 3));

  if (isNaN(numVertices) || numVertices < 3) {
    alert("Número inválido! Tente novamente.");
    return;
  }
  canvas.addEventListener("click", addVertice);
}

// Função para adicionar vértices ao canvas
function addVertice(event) {
  if (vertices.length >= numVertices) {
    canvas.removeEventListener("click", addVertice);
    return;
  }

  let x = event.offsetX;
  let y = event.offsetY;
  vertices.push({ x, y });

  // Desenha o vértice
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();

  if (vertices.length >= numVertices) {
    canvas.removeEventListener("click", addVertice);
  }
}

// Evento para adicionar arestas
document.getElementById("addEdge").addEventListener("click", function () {
  canvas.removeEventListener("click", selectVertices);
  canvas.addEventListener("click", selectVertices);
});

function selectVertices(event) {
  let x = event.offsetX;
  let y = event.offsetY;
  let vertex = vertices.find((v) => Math.hypot(v.x - x, v.y - y) < 5);
  
  if (vertex && selectedVertices.length < 2 && !selectedVertices.includes(vertex)) {
    selectedVertices.push(vertex);

    if (selectedVertices.length === 2) {
      addAresta();
    }
  }
}

function addAresta() {
  let v1 = selectedVertices[0];
  let v2 = selectedVertices[1];

  if (!edgeExists(v1, v2)) {
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.stroke();
    arestas.push({ v1, v2 });
  }
  selectedVertices = [];
}

function edgeExists(v1, v2) {
  return arestas.some(
    (aresta) => (aresta.v1 === v1 && aresta.v2 === v2) || (aresta.v1 === v2 && aresta.v2 === v1)
  );
}

function areAllVerticesConnected() {
  if (vertices.length === 0) return true;

  let visited = new Set();
  let stack = [vertices[0]];

  while (stack.length > 0) {
    let vertex = stack.pop();
    visited.add(vertex);

    arestas.forEach((aresta) => {
      if (aresta.v1 === vertex && !visited.has(aresta.v2)) {
        stack.push(aresta.v2);
      } else if (aresta.v2 === vertex && !visited.has(aresta.v1)) {
        stack.push(aresta.v1);
      }
    });
  }
  return visited.size === vertices.length;
}