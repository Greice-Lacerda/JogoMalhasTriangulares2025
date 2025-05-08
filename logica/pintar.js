document.addEventListener("DOMContentLoaded", () => {
    // Acessa as variáveis globais definidas em fase1.js
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    let corSelecionada = "#f0ff00"; // Cor padrão
    let pinturaConcluida = false;
    let selectedVerticesForTriangle = [];
    let paintedTriangles = new Set(); // Para rastrear triângulos pintados (usando strings de IDs de vértices)
    const cores = [
        "#f0ff00", "#ff0000", "#00ff00", "#ff00ff", "#00ffff",
        "#800000", "#808000", "#008080", "#800080", "#ff8000", "#80ff00",
        "#00ff80", "#8000ff", "#ff0080", "#ff8080", "#80ff80",
        "#8080ff", "#ffff80"
    ];
    let originalCursorColor = canvas.style.cursor;
    const precisaoSelecao = 15; // Aumenta a precisão para seleção de vértices
    let mensagemPintarExibida = false;

    document.getElementById("pintarElementos").addEventListener("click", () => {
        if (!pinturaConcluida && vertices.length >= 3) {
            exibirMensagemComSeletor("Selecione a cor para o próximo triângulo:");
            selectedVerticesForTriangle = []; // Reinicia a seleção de vértices
            canvas.addEventListener("click", selecionarVerticePintura); // Ativa a seleção de vértices para pintura
        } else if (vertices.length < 3) {
            exibirMensagemTemporaria("Adicione pelo menos <strong> 3 vértices </strong> para pintar.");
        } else {
            exibirMensagemTemporaria("Figura concluída com sucesso! Clique em Salvar para prosseguir.");
            setTimeout(() => {
                document.getElementById("salvar").disabled = false;
            }, 500);
        }
    });

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
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const verticeSelecionado = encontrarVerticeProximo(x, y);

        if (verticeSelecionado && !selectedVerticesForTriangle.includes(verticeSelecionado)) {
            selectedVerticesForTriangle.push(verticeSelecionado);
            // Realiza a pintura se três vértices forem selecionados
            if (selectedVerticesForTriangle.length === 3) {
                paintTriangle();
            } else if (selectedVerticesForTriangle.length > 3) {
                selectedVerticesForTriangle = [verticeSelecionado]; // Reinicia se mais de 3 forem selecionados
                exibirMensagemTemporaria("Selecione exatamente <strong> três vértices </strong> para um triângulo.");
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
            exibirMensagemTemporaria("Selecione <strong> três vértices </strong> para pintar um triângulo.");
            selectedVerticesForTriangle = [];
            return;
        }

        if (verificarTrianguloPintado(v1, v2, v3)) {
            exibirMensagemTemporaria("Esse triângulo já foi colorido, escolha outro.");
            selectedVerticesForTriangle = [];
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

        // A condição para pintura concluída agora depende do número de triângulos possíveis (n-2)
        if (paintedTriangles.size === Math.max(0, vertices.length - 2)) {
            pinturaConcluida = true;
            document.getElementById("addVertex").disabled = true;
            document.getElementById("addEdge").disabled = true;
            document.getElementById("pintarElementos").disabled = true;
            canvas.removeEventListener("click", selecionarVerticePintura);
            exibirMensagemPinturaConcluida(); // Chama a função modificada
        } else {
            exibirMensagemComSeletor("Selecione a cor para o próximo triângulo:");
        }
    }

    function exibirMensagemTemporaria(mensagem) {
        const mensagensDiv1 = document.getElementById("mensagens");
        if (!mensagensDiv1) return;
        mensagensDiv1.textContent = mensagem;
        mensagensDiv1.style.display = "flex";
        mensagensDiv1.style.justifyContent = "center";
        mensagensDiv1.style.fontSize = "14px"; // Reduz a fonte para 14px
        mensagensDiv1.style.alignItems = "center";
        mensagensDiv1.style.width = "80%";
        mensagensDiv1.style.height = "auto";
        mensagensDiv1.style.background = "linear-gradient(to right, #ff7e5f, #feb47b)";
        setTimeout(() => {
            mensagensDiv1.style.display = "none";
        }, 3000);
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
        mensagensDiv1.style.padding = "5px";
        mensagensDiv1.style.width = "auto";
        mensagensDiv1.style.height = "160px";
        mensagensDiv1.style.maxWidth = "80%";
        mensagensDiv1.style.maxHeight = "160%";
        mensagensDiv1.style.overflowY = "auto";
        mensagensDiv1.style.marginBottom = "20px";

        const mensagemTexto = document.createElement("p");
        mensagemTexto.textContent = mensagem;
        mensagemTexto.style.textAlign = "center";
        mensagemTexto.style.marginBottom = "5px";
        mensagemTexto.style.fontSize = "14px";
        mensagensDiv1.appendChild(mensagemTexto);

        const tabela = document.createElement("table");
        tabela.className = "color-table";
        tabela.style.width = "auto";
        tabela.style.tableLayout = "fixed";
        tabela.style.marginBottom = "5px";

        let row;
        const numCoresPorLinha = 6; // Ajustado para 6 colunas
        const fatorReducao = 0.65;
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
                document.getElementById("addVertex").disabled = true;
                document.getElementById("addEdge").disabled = true;
                mensagensDiv1.style.display = "none"; // Fecha o seletor após escolher a cor
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
                    mensagemTexto.style.fontSize = "14px";
                } else {
                    mensagemTexto.style.fontSize = "14px";
                }
            });
        });
        observer.observe(mensagensDiv1);
    }

    function exibirMensagemPinturaConcluida() {
        const mensagensDiv1 = document.getElementById("mensagens");
        if (!mensagensDiv1) return;
        mensagensDiv1.style.display = "flex";
        mensagensDiv1.style.justifyContent = "center";
        mensagensDiv1.style.fontSize = "14px";
        mensagensDiv1.style.alignItems = "center";
        mensagensDiv1.style.width = "80%";
        mensagensDiv1.style.height = "auto"; // Ajustado para auto para melhor responsividade
        mensagensDiv1.style.background = "linear-gradient(to right, #ff7e5f, #feb47b)";
        mensagensDiv1.textContent = "Figura concluída com sucesso!";

        // Após 3.5 segundos, fecha a mensagem de conclusão e exibe a mensagem para salvar
        setTimeout(() => {
            mensagensDiv1.style.display = "none";
            exibirMensagemTemporaria("Clique em <strong> Salvar </strong> para prosseguir.");

            // Adiciona um ouvinte para o evento de clique no botão "Salvar"
            const botaoSalvar = document.getElementById("salvar");
            if (botaoSalvar) {
                const originalSalvarClickListener = botaoSalvar.onclick; // Salva o ouvinte original, se existir

                botaoSalvar.onclick = function() {
                    // Chama o ouvinte original do botão "Salvar", se houver
                    if (originalSalvarClickListener) {
                        originalSalvarClickListener.call(this);
                    }
                    mensagensDiv1.style.display = "none"; // Fecha a mensagem "Clique em Salvar..."
                    PoligonoRegular(); // Chama a função PoligonoRegular
                    // Restaura o ouvinte original para evitar comportamentos inesperados em cliques futuros
                    botaoSalvar.onclick = originalSalvarClickListener;
                };
                botaoSalvar.disabled = false; // Garante que o botão "Salvar" esteja habilitado
            } else {
                console.error("Botão com id 'salvar' não encontrado.");
            }
        }, 3500);
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
            if (this.disabled && !mensagemPintarExibida) {
                exibirMensagemTemporaria("Clique no Botão <strong> Pintar Elementos </strong> para colorir a figura.");
                mensagemPintarExibida = true;
            }
        };
    }
});