// pintar.js
document.addEventListener("DOMContentLoaded", () => {
    // Acessa as variáveis globais definidas em fase1.js
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    let corSelecionada = "#f0ff00"; // Cor padrão
    let pinturaConcluida = false;
    let selectedVerticesForTriangle = [];
    let paintedTriangles = new Set(); // Para rastrear triângulos pintados (usando strings de IDs de vértices)
    let modoPinturaAtivo = false;
    let esperandoSegundoVertice = false;
    let esperandoTerceiroVertice = false;
    let esperandoEscolhaCor = false;

    const cores = [
        "#f0ff00", "#ff0000", "#00ff00", "#ff00ff", "#00ffff", "#800000",
        "#808000", "#008080", "#800080", "#ff8000", "#80ff00", "#00ff80",
        "#8000ff", "#ff0080", "#ff8080", "#80ff80", "#8080ff", "#ffff80",
        "#80ffff", "#ff80ff", "#ff80ff", "#ffff00", "#00ffff", "#0000ff"
    ];

    let originalCursorColor = canvas.style.cursor;
    const precisaoSelecao = 15; // Aumenta a precisão para seleção de vértices

    document.getElementById("salvarJogo").disabled = true;
    document.getElementById("Imprimir").disabled = true;

    document.getElementById("pintarElementos").addEventListener("click", () => {
        // 1 - Clique em pintar
        if (!pinturaHabilitada) {
            exibirMensagemTemporaria("Adicione as arestas para poder pintar.");
            return;
        }
        modoPinturaAtivo = true;
        document.getElementById("AdicionarVertice").disabled = true;
        document.getElementById("AdicionarAresta").disabled = true;
        document.getElementById("pintarElementos").disabled = true; // Bloqueia o botão pintar inicialmente
        document.getElementById("resetButton").disabled = false;
        document.getElementById("salvarJogo").disabled = true;
        document.getElementById("Imprimir").disabled = true;
        exibirMensagemComSeletor("Selecione a cor do triângulo:"); // Permitir escolha da cor
        esperandoEscolhaCor = true;
    });

    function iniciarSelecaoDeCor() {
        exibirMensagemComSeletor("Selecione a cor do triângulo:");
        esperandoEscolhaCor = true;
    }

    function encontrarVerticeProximo(x, y) {
        if (!vertices) return null;
        for (const vertex of vertices) {
            if (Math.hypot(vertex.x - x, vertex.y - y) < precisaoSelecao) {
                return vertex;
            }
        }
        return null;
    }

    function selecionarVerticePintura(event) {
        if (!modoPinturaAtivo || esperandoEscolhaCor) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const verticeSelecionado = encontrarVerticeProximo(x, y);

        if (verticeSelecionado && !selectedVerticesForTriangle.includes(verticeSelecionado)) {
            selectedVerticesForTriangle.push(verticeSelecionado);
            if (selectedVerticesForTriangle.length === 1) {
                exibirMensagemTemporaria("Escolha o segundo vértice para o triângulo."); // Mensagem após o primeiro vértice
                esperandoSegundoVertice = true;
            } else if (selectedVerticesForTriangle.length === 2) {
                exibirMensagemTemporaria("Escolha o terceiro vértice para o triângulo."); // Mensagem após o segundo vértice
                esperandoTerceiroVertice = true;
            } else if (selectedVerticesForTriangle.length === 3) {
                paintTriangle();
            }
        } else if (verticeSelecionado && selectedVerticesForTriangle.includes(verticeSelecionado)) {
            exibirMensagemTemporaria("Este vértice já foi selecionado para este triângulo.");
        }

        const mensagensDiv1 = document.getElementById("mensagens");
        if (mensagensDiv1 && mensagensDiv1.style.display !== "none") {
            mensagensDiv1.style.display = "none";
        }
    }

    function verificarTrianguloPintado(v1, v2, v3) {
        const key = [v1.id, v2.id, v3.id].sort().join('-');
        return paintedTriangles.has(key);
    }

    function paintTriangle() {
        const [v1, v2, v3] = selectedVerticesForTriangle;
        const keyTriangulo = [v1.id, v2.id, v3.id].sort().join('-');

        if (!v1 || !v2 || !v3) {
            console.warn("Três vértices não foram selecionados corretamente.");
            selectedVerticesForTriangle = [];
            esperandoSegundoVertice = false;
            esperandoTerceiroVertice = false;
            modoPinturaAtivo = true;
            canvas.addEventListener("click", selecionarVerticePintura);
            exibirMensagemTemporaria("Selecione três vértices para pintar o triângulo.");
            return;
        }

        if (verificarTrianguloPintado(v1, v2, v3)) {
            exibirMensagemTemporaria("Esse triângulo já foi colorido, escolha outro.");
            selectedVerticesForTriangle = [];
            esperandoSegundoVertice = false;
            esperandoTerceiroVertice = false;
            modoPinturaAtivo = true;
            canvas.addEventListener("click", selecionarVerticePintura);
            return;
        }

        ctx.fillStyle = corSelecionada;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        paintedTriangles.add(keyTriangulo);
        selectedVerticesForTriangle = [];
        esperandoSegundoVertice = false;
        esperandoTerceiroVertice = false;
        modoPinturaAtivo = false;
        document.getElementById("pintarElementos").disabled = false; // Reabilita o botão pintar
        console.log("Botão 'Pintar Elementos' reabilitado.");
        console.log("Triângulo pintado. paintedTriangles.size:", paintedTriangles.size, "vertices.length:", vertices.length);
        exibirMensagemTemporaria("Triângulo pintado! Clique novamente em <u>Pintar Elementos</u> para pintar outro triângulo."); // Repetir processo
        esperandoEscolhaCor = false;

        if (paintedTriangles.size === Math.max(0, vertices.length - 2)) {
            // Pintura completa
            pinturaConcluida = true;
            document.getElementById("salvarJogo").disabled = false;
            document.getElementById("Imprimir").disabled = false;
            document.getElementById("pintarElementos").disabled = true; // Bloqueia o botão pintar
            exibirMensagemTemporaria("Pintura completa! Clique em <u>Salvar</u> ou <u>Imprimir</u>."); // Mensagem de pintura completa
        }
    }

    function exibirMensagemTemporaria(mensagem) {
        const mensagensDiv1 = document.getElementById("mensagens");
        if (!mensagensDiv1) return;
        mensagensDiv1.innerHTML = mensagem; // Permite HTML na mensagem para o <strong>
        mensagensDiv1.style.display = "flex";
        mensagensDiv1.style.justifyContent = "center";
        mensagensDiv1.style.fontSize = "20px";
        mensagensDiv1.style.alignItems = "center";
        mensagensDiv1.style.width = "80%";
        mensagensDiv1.style.height = "auto";
        mensagensDiv1.style.background = "linear-gradient(to right, #ff7e5f, #feb47b)";
        setTimeout(() => {
            mensagensDiv1.style.display = "none";
        }, 5000);
    }

    function exibirMensagemComSeletor(mensagem) {
        const mensagensDiv1 = document.getElementById("mensagens");
        if (!mensagensDiv1) {
            console.error("Elemento com id 'mensagens' não encontrado.");
            return;
        }
        mensagensDiv1.innerHTML = "";
        mensagensDiv1.style.display = "flex";
        mensagensDiv1.style.flexDirection = "column";
        mensagensDiv1.style.alignItems = "center";
        mensagensDiv1.style.justifyContent = "flex-start";
        mensagensDiv1.style.borderRadius = "20px";
        mensagensDiv1.style.padding = "2px";
        mensagensDiv1.style.width = "76%"; // Faz a div ocupar toda a largura disponível do pai
        mensagensDiv1.style.maxWidth = "78%"; // Garante que não exceda a largura do pai
        mensagensDiv1.style.height = "76%"; // Ajusta a altura automaticamente
        mensagensDiv1.style.maxHeight = "78%";
        mensagensDiv1.style.overflowY = "auto";
        mensagensDiv1.style.background = "linear-gradient(to right, #ff7e5f, #feb47b)";
        mensagensDiv1.style.marginBottom = "15px";
        mensagensDiv1.style.marginTop = "5px";

        const mensagemTexto = document.createElement("p");
        mensagemTexto.textContent = mensagem;
        mensagemTexto.style.textAlign = "center";
        mensagemTexto.style.marginBottom = "10px";
        mensagemTexto.style.fontSize = "14px";
        mensagensDiv1.appendChild(mensagemTexto);

        const tabela = document.createElement("table");
        tabela.className = "color-table";
        tabela.style.width = "auto";
        tabela.style.tableLayout = "fixed";
        tabela.style.marginBottom = "15px";

        let row;
        const numCoresPorLinha = 8;
        const fatorReducao = 0.6;
        const novoTamanhoBotao = 20 * fatorReducao;

        cores.forEach((cor, index) => {
            if (index % numCoresPorLinha === 0) {
                row = tabela.insertRow();
            }
            const cell = row.insertCell();
            const button = document.createElement("div");
            button.className = "color-button";
            button.style.backgroundColor = cor;
            button.style.width = `${novoTamanhoBotao}px`;
            button.style.height = `${novoTamanhoBotao}px`;
            button.style.margin = "2px";
            button.addEventListener("click", () => {
                corSelecionada = cor;
                originalCursorColor = canvas.style.cursor;
                canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewport="0 0 32 32" style="fill: ${cor};"><circle cx="16" cy="16" r="16"/></svg>') 16 16, auto`;
                canvas.addEventListener("click", selecionarVerticePintura);
                mensagensDiv1.style.display = "none"; // Fecha o seletor após escolher a cor
                exibirMensagemTemporaria("Escolha três vértices para pintar o triângulo."); // Mensagem após seleção de cor
                esperandoEscolhaCor = false;
            });
            cell.appendChild(button);
        });
        mensagensDiv1.appendChild(tabela);
        mensagensDiv1.className = "mensagensDiv2";

        // Ajuste dinâmico do tamanho da fonte
        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                const divHeight = entry.contentRect.height;
                if (divHeight < 180) {
                    mensagemTexto.style.fontSize = "16px";
                } else {
                    mensagemTexto.style.fontSize = "16px";
                }
            });
        });
        observer.observe(mensagensDiv1);
    }

    // Adiciona um ouvinte de evento para verificar quando todas as arestas foram construídas
    const addEdgeButton = document.getElementById("addEdge");
    if (addEdgeButton) {
        const originalAddEdgeClickListener = addEdgeButton.onclick; // Salva o ouvinte original

        addEdgeButton.onclick = function() {
            if (originalAddEdgeClickListener) {
                originalAddEdgeClickListener.call(this); // Chama o ouvinte original
            }
            // Verifica se o botão "Adicionar Aresta" está desabilitado, o que indica que todas as arestas foram construídas
            if (this.disabled || !mensagemPintarExibida) {
                exibirMensagemTemporaria("Clique no Botão <br><span><b><u>Pintar Elementos</u></b></span><br> para colorir a figura.");
                mensagemPintarExibida = true;
            }
        };
    }
});