// fase1.js
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

// Desabilita os botões inicialmente
document.getElementById("AdicionarAresta").disabled = true;
document.getElementById("pintarElementos").disabled = true;
document.getElementById("resetButton").disabled = true;
document.getElementById("salvarJogo").disabled = true;
document.getElementById("Imprimir").disabled = true;

// Variável para controlar se a inserção de vértices está ativa
let inserindoVertices = false;
let adicionandoArestas = false;
let pinturaHabilitada = false;

// Ouve o clique no botão "Adicionar Vértice"
document.getElementById("AdicionarVertice").addEventListener("click", () => {
    // Passo 1: Inserir vértices
    iniciarInsercaoVertices();
});

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

let numVerticesAdicionados = 0;
let numArestas = 0;
let numArestasAdicionadas = 0;
// É importante inicializar numVertices fora da função, ou garantir que ela seja definida antes de iniciarJogo ser chamada.

function iniciarInsercaoVertices() {
    inserindoVertices = true;
    document.getElementById("AdicionarVertice").disabled = true;
    document.getElementById("AdicionarAresta").disabled = true;
    document.getElementById("pintarElementos").disabled = true;
    document.getElementById("resetButton").disabled = true;
    document.getElementById("salvarJogo").disabled = true;
    document.getElementById("Imprimir").disabled = true;
    canvas.removeEventListener("click", selectVertices); // Garante que o listener de arestas seja removido
    canvas.addEventListener("click", addVertice);
    const mensagemVertices = '<span class="blink"> Clique na <br><strong><u>malha quadriculada</u></strong><br> e insira o número de vértices desejado.</span>.';
    exibirMensagemTemporaria(mensagemVertices, "mensagem-azul");

    const escolha = prompt("Escolha o número de vértices (mínimo 3):", 3);
    numVertices = parseInt(escolha);
    if (isNaN(numVertices) || numVertices < 3) {
        alert("Número inválido! Tente novamente.");
        numVertices = 0;
        inserindoVertices = false;
        document.getElementById("AdicionarVertice").disabled = false; // Reabilita o botão
        fecharMensagemTemporaria();
        return;
    }
    const mensagemCliqueMalha = `<span class="blink"> Agora clique na <br><strong><u>malha quadriculada</u></strong><br> para inserir <strong>${numVertices}</strong> pontos.</span>.`;
    exibirMensagemTemporaria(mensagemCliqueMalha, "mensagem-azul");
}

function addVertice(event) {
    if (!inserindoVertices) return; // Impede a adição de vértices se não estiver no modo de inserção
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
        // Passo 2: Terminou addVertice
        inserindoVertices = false;
        canvas.removeEventListener("click", addVertice);
        fecharMensagemTemporaria();
        const mensagemArestas = '<span class="blink"> Clique no botão <br> <strong> <u>Adicionar Aresta</u> </strong> <br> para ligar dois pontos.</span>';
        exibirMensagemTemporaria(mensagemArestas, "mensagem-verde");
        document.getElementById("AdicionarVertice").disabled = true; // Bloqueia o botão Adicionar Vértice
        document.getElementById("AdicionarAresta").disabled = false; // Habilita o botão Adicionar Aresta
        document.getElementById("pintarElementos").disabled = true;
        document.getElementById("resetButton").disabled = false;
        document.getElementById("salvarJogo").disabled = true;
        document.getElementById("Imprimir").disabled = true;
        adicionandoArestas = true;
        canvas.addEventListener("click", selectVertices);
    }
}

document.getElementById("AdicionarAresta").addEventListener("click", function() {
    if (!adicionandoArestas) return; // Impede a ação se não estiver no modo de adicionar arestas
    selectedVertices = [];
    canvas.addEventListener("click", selectVertices);
    fecharMensagemTemporaria();
    const mensagemAresta = '<span class="blink"> Clique em <strong> <u>dois pontos</u> </strong> <br> para adicionar arestas externas e internas.</span>';
    exibirMensagemTemporaria(mensagemAresta, "mensagem-verde");
});

let selectedVertices = [];
let arestaSelecionada = [];

function selectVertices(event) {
    if (!adicionandoArestas) return; // Impede a seleção de vértices se não estiver adicionando arestas
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
    if (!adicionandoArestas) return; // Impede a adição de arestas se não estiver no modo de adicionar arestas
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
        if (arestas.length >= numArestasPoligono) {
            // Passo 3: Terminou addAresta
            adicionandoArestas = false;
            canvas.removeEventListener("click", selectVertices);
            document.getElementById("AdicionarVertice").disabled = true;
            document.getElementById("AdicionarAresta").disabled = true;
            document.getElementById("pintarElementos").disabled = false; // Habilita pintar no fase1.js
            document.getElementById("resetButton").disabled = false; // Habilita resetar
            document.getElementById("salvarJogo").disabled = true;
            document.getElementById("Imprimir").disabled = true;
            const mensagemPintar = '<span class="blink"> Clique no botão <br> <strong> <u>Pintar Elementos </u> <br> </strong> para colorir os triângulos.</span>';
            exibirMensagemTemporaria(mensagemPintar, "mensagem-azul");
            pinturaHabilitada = true;
        } else {
            const mensagemAresta = '<span class="blink"> Clique em <strong> <u> dois pontos </u></strong> <br> para adicionar mais arestas.</span>';
            exibirMensagemTemporaria(mensagemAresta, "mensagem-verde");
            document.getElementById("pintarElementos").disabled = true;
            document.getElementById("salvarJogo").disabled = true;
            document.getElementById("Imprimir").disabled = true;
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