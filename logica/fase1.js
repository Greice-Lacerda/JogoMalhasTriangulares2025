let numVertices = 0;
let vertices = [];
let arestas = [];
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;
canvas.style.background = "white";
canvas.style.border = "1px solid black";
canvas.style.borderRadius = "10px";
canvas.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
canvas.style.backgroundColor = "white";

// Elemento HTML para exibir a contagem de arestas
const contadorArestasElement = document.createElement("span");
contadorArestasElement.id = "contadorArestas";
document.body.appendChild(contadorArestasElement);
contadorArestasElement.style.position = "absolute";
contadorArestasElement.style.top = "10px";
contadorArestasElement.style.left = "10px";
contadorArestasElement.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
contadorArestasElement.style.padding = "5px";
contadorArestasElement.style.borderRadius = "5px";
contadorArestasElement.style.zIndex = "10";

// Função para atualizar o contador de arestas
function atualizarContadorArestas() {
    const contador = document.getElementById("contadorArestas");
    if (contador) {
        contador.textContent = `Arestas: ${arestas.length}`;
    }
}

// Inicializa a contagem de arestas
atualizarContadorArestas();

// Função para calcular o número total de arestas de um polígono de n lados com triangulações internas
function calcularArestasPoligonoTriangulado(n) {
    if (n < 3) {
        return 0; // Não é um polígono
    }
    return 2 * n - 3;
}

// Função para desenhar a malha no canvas
function desenharMalha() {
    ctx.save();
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    ctx.restore();
}

// Chama a função para desenhar a malha
desenharMalha();

// Array de cores para as mensagens temporárias
const mensagemCores = [ "#f0ff00", "#ff0000", "#00ff00",
    "#ff8000", "#80ff00",
    "#ff0080", "#ff8080", "#80f010",
    "#9fff80"];

// Função para exibir a mensagem temporária
function exibirMensagemTemporaria(mensagem, classe = "") {
    const mensagensDiv1 = document.getElementById("mensagens");
    if (!mensagensDiv1) return;
    mensagensDiv1.innerHTML = "";
    const mensagemTexto = document.createElement("p");
    mensagemTexto.innerHTML = mensagem;
    mensagemTexto.style.display = "flex";
    mensagemTexto.style.justifyContent = "center";
    mensagemTexto.style.alignItems = "center";
    mensagemTexto.style.height = "200%";
    const corAleatoria = mensagemCores[Math.floor(Math.random() * mensagemCores.length)];
    mensagemTexto.style.background = corAleatoria; // Define a cor de fundo aleatória
    mensagemTexto.style.boxShadow = "outset 2px 15px 15px #f0f0"; // Adiciona a sombra ao texto
    mensagemTexto.className = `mensagem-texto ${classe}`;
    mensagensDiv1.appendChild(mensagemTexto);
    mensagensDiv1.style.display = "block"; // Garante que a div esteja visível
}

function fecharMensagemTemporaria() {
    const mensagensDiv1 = document.getElementById("mensagens");
    if (mensagensDiv1) {
        mensagensDiv1.style.display = "none";
    }
}

document.getElementById("addVertex").addEventListener("click", () => {
    iniciarJogo();
});

let numVerticesAdicionados = 0;
let numArestas = 0;
let numArestasAdicionadas = 0;
function iniciarJogo() {
    if (numVertices === 0) {
        numVertices = parseInt(prompt("Escolha o número de vértices (mínimo 3):", 3));
        if (isNaN(numVertices) || numVertices < 3) {
            alert("Número inválido! Tente novamente.");
            numVertices = 0;
            return;
        }
        const mensagem1 = '<span class="blink">Clique na <strong> malha </strong> para inserir os vértices</span>.';
        exibirMensagemTemporaria(mensagem1, "mensagem-white");
        canvas.addEventListener("click", addVertice);
    }
}

function addVertice(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    numVerticesAdicionados++; // Incrementa o contador de vértices
    vertices.push({ id: numVerticesAdicionados, x, y }); // Adiciona o ID único
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    if (vertices.length >= numVertices) {
        canvas.removeEventListener("click", addVertice);
        document.getElementById("addVertex").disabled = true;
        fecharMensagemTemporaria();
        const mensagem2 = '<span class="blink">Clique no botão <strong> Adicionar Aresta </strong> para ligar dois pontos.</span>';
        exibirMensagemTemporaria(mensagem2, "mensagem-azul");
        document.getElementById("addEdge").disabled = false;
    }
}

document.getElementById("addEdge").addEventListener("click", function() {
    canvas.addEventListener("click", selectVertices);
    fecharMensagemTemporaria();
    const mensagemAresta = '<span class="blink">Clique em <strong>dois vértices</strong> para adicionar uma aresta.</span>';
    exibirMensagemTemporaria(mensagemAresta, "mensagem-verde");
});

let selectedVertices = [];
let arestaSelecionada = [];

function selectVertices(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    let vertex = vertices.find(v => Math.hypot(v.x - x, v.y - y) < 10);
    if (vertex && selectedVertices.length < 2) {
        selectedVertices.push(vertex);
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
        if (selectedVertices.length === 2) {
            addAresta();
        }
    }
}

function addAresta() {
    let v1 = selectedVertices[0];
    let v2 = selectedVertices[1];
    if (!edgeExists(v1, v2) && !linesIntersect(v1, v2)) {
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
        arestas.push({ v1, v2 });
        atualizarContadorArestas(); // Atualiza o contador após adicionar uma aresta

        // Verifica se o número de arestas atingiu o limite para um polígono triangulado
        const numArestasPoligono = calcularArestasPoligonoTriangulado(numVertices);
        if (arestas.length >= 2 * numVertices - 3) {
            canvas.removeEventListener("click", selectVertices);
            document.getElementById("addEdge").disabled = true;
            fecharMensagemTemporaria();
            const mensagemPintar = '<span class="blink">Clique em <strong> Pintar Elementos </strong> para colorir a figura.</span>';
            exibirMensagemTemporaria(mensagemPintar, "mensagem-azul");
            document.getElementById("pintarElementos").disabled = false;
        } else {
            canvas.addEventListener("click", selectVertices);
            const mensagemAresta = '<span class="blink">Clique em <strong>dois vértices</strong> para adicionar uma aresta.</span>';
            exibirMensagemTemporaria(mensagemAresta, "mensagem-verde");
        }
    }
    selectedVertices = [];
    ctx.fillStyle = "black"; // Reset fill color
    vertices.forEach(v => { // Redraw vertices
        ctx.beginPath();
        ctx.arc(v.x, v.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function edgeExists(v1, v2) {
    return arestas.some(aresta =>
        (aresta.v1 === v1 && aresta.v2 === v2) ||
        (aresta.v1 === v2 && aresta.v2 === v1)
    );
}

function linesIntersect(v1, v2) {
    for (let aresta of arestas) {
        if (doLinesIntersect(v1, v2, aresta.v1, aresta.v2)) {
            return true;
        }
    }
    return false;
}

function doLinesIntersect(p1, p2, p3, p4) {
    function ccw(A, B, C) {
        return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    }
    return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4));
}

ctx.lineWidth = 3;