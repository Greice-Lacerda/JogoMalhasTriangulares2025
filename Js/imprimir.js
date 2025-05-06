// imprimir.js

// Função para voltar à fase 1 (manter como está, pois é específica para a navegação)
function voltarParaFase1() {
    window.location.href = "../fase1.html";
}

// Função para carregar imagens salvas do localStorage e exibir na página
document.addEventListener("DOMContentLoaded", () => {
    const imagensContainer = document.getElementById("imagensContainer");
    let imagensSalvas = JSON.parse(localStorage.getItem(".imagensSalvas")) || [];
    let imagensRemovidas =
        JSON.parse(localStorage.getItem(".imagensRemovidas")) || [];

    if (imagensSalvas.length === 0) {
        imagensContainer.innerHTML = "<p> Nenhuma imagem salva.</p>";
        return;
    }

    imagensContainer.innerHTML = ""; // Limpa o container antes de adicionar novas imagens

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    imagensContainer.appendChild(table);

    let row;

    imagensSalvas.forEach((imagem, i) => {
        if (i % 3 === 0) {
            row = document.createElement("tr");
            tbody.appendChild(row);
        }

        const cell = document.createElement("td");
        cell.innerHTML = `
            <fieldset class="imagem-impressa-container">
                <legend class="legenda-impressa" style="text-align: center;">
                    <input type='checkbox' class='imagensSalvas' data-index='${i}' style="width: 22px; height: 22px; margin-top: 1225px;">
                    ${imagem.legenda}
                </legend>
                <div class="imagem-wrapper-impressa">
                    <button class="deleteBtn-impressa" data-index="${i}"
                        style="position: absolute; top: 10px; right: 10px;
                        background: none; border: none; cursor: pointer;">
                        <i class="fas fa-trash-alt" style="color: black; font-size: 18px;"></i>
                    </button>
                    <img src='${imagem.dataURL}' alt='${imagem.legenda}' class="imagem-impressa">
                </div>
            </fieldset>
        `;

        row.appendChild(cell);
    });

    // Evento para deletar uma única imagem ao clicar na lixeira
    document.querySelectorAll(".deleteBtn-impressa").forEach((button) => {
        button.addEventListener("click", function () {
            const index = parseInt(this.dataset.index);
            const imagemRemovida = imagensSalvas.splice(index, 1)[0];
            imagensRemovidas.push(imagemRemovida);
            localStorage.setItem(".imagensSalvas", JSON.stringify(imagensSalvas));
            localStorage.setItem(
                ".imagensRemovidas",
                JSON.stringify(imagensRemovidas)
            );
            location.reload();
        });
    });

    // Evento para imprimir as imagens selecionadas
    const imprimirBtn = document.getElementById("imprimirJogo");
    if (imprimirBtn) {
        imprimirBtn.addEventListener("click", imprimir);
    }

    function imprimir() {
        const checkboxesSelecionados = document.querySelectorAll(
            ".imagensSalvas:checked"
        );

        if (checkboxesSelecionados.length === 0) {
            alert("Nenhuma imagem selecionada para impressão.");
            return;
        }

        const janelaImpressao = window.open("", "_blank");

        janelaImpressao.document.write(`
            <html>
            <head>
                <title>Impressão - Triangularizando e Aprendendo</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <link rel="stylesheet" href="C:/Users/Greice Lacerda/OneDrive/ASSUNTOS DE KELI/CAP-UERJ/PARA ARTIGOS FUTUROS 2025/Jogo Malhas/estilos/estilos-comuns.css" />
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    header {
                        text-align: center;
                        width: 100%;
                        padding: 10px;
                        margin-bottom: 20px;
                        background-color: #f0f0f0;
                    }
                    #container-impressao {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        width: 95%;
                    }
                    .imagem-impressa-container {
                        border: 1px solid #ccc;
                        margin: 10mm;
                        padding: 10mm;
                        text-align: center;
                        box-sizing: border-box;
                        width: calc(33% - 20mm); /* Aproximadamente 3 imagens por linha */
                        page-break-inside: avoid;
                    }
                    .legenda-impressa {
                        font-weight: bold;
                        margin-bottom: 5mm;
                        display: block;
                    }
                    .imagem-wrapper-impressa {
                        position: relative;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .imagem-impressa {
                        max-width: 100%;
                        height: auto;
                        display: block;
                        margin: 0 auto;
                    }
                    .deleteBtn-impressa {
                        display: none; /* Oculta o botão de deletar na impressão */
                    }
                    input[type="checkbox"] {
                        display: none; /* Oculta os checkboxes na impressão */
                    }
                        footer{
                        bottom: 0px;
                    }
                    
                    @media print {
                        body {
                            display: block;
                        }
                        #container-impressao {
                            display: block;
                        }
                        .imagem-impressa-container {
                            border: 1px solid #000;
                            margin: 5mm;
                            padding: 5mm;
                            width: auto; /* Ocupa a largura disponível */
                            page-break-inside: avoid;
                        }
                        .deleteBtn-impressa {
                            display: none;
                        }
                        input[type="checkbox"] {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <header><h1>Triangularizando e Aprendendo</h1></header>
                <main id="container-impressao">
        `);

        checkboxesSelecionados.forEach((checkbox) => {
            const index = parseInt(checkbox.dataset.index);
            const imagem = imagensSalvas[index];

            janelaImpressao.document.write(`
                    <div class="imagem-impressa-container">
                        <legend class="legenda-impressa">${imagem.legenda}</legend>
                        <div class="imagem-wrapper-impressa">
                            <img src='${imagem.dataURL}' class="imagem-impressa">
                        </div>
                    </div>
                 </main>
                </body>
            </html>
        `);
});
        janelaImpressao.document.close();
        setTimeout(() => {
            janelaImpressao.print();
            janelaImpressao.close();
        }, 500);
    }

    // Função para selecionar/deselecionar todas as checkboxes
    function selecionarTodas() {
        const checkboxes = document.querySelectorAll(".imagensSalvas");
        const selecionarTodasBtn = document.getElementById("selecionarTodasBtn");
        const isChecked = selecionarTodasBtn.classList.toggle(".imagensSalvas");

        checkboxes.forEach((checkbox) => {
            checkbox.checked = isChecked;
        });
    }

    // Função para deletar todas as imagens selecionadas
    function deletarTodas() {
        if (
            confirm("Tem certeza que deseja deletar todas as imagens selecionadas?")
        ) {
            const imagensSalvas =
                JSON.parse(localStorage.getItem(".imagensSalvas")) || [];
            const checkboxesSelecionados = document.querySelectorAll(
                ".imagensSalvas:checked"
            );

            let indicesParaRemover = [];
            checkboxesSelecionados.forEach((checkbox) => {
                indicesParaRemover.push(parseInt(checkbox.dataset.index));
            });

            indicesParaRemover.sort((a, b) => b - a);

            indicesParaRemover.forEach((index) => {
                const imagemRemovida = imagensSalvas.splice(index, 1)[0];
                imagensRemovidas.push(imagemRemovida);
            });

            localStorage.setItem(".imagensSalvas", JSON.stringify(imagensSalvas));
            localStorage.setItem(
                "imagensRemovidas",
                JSON.stringify(imagensRemovidas)
            );
            location.reload();
        }
    }

    // Função para desfazer a última exclusão de imagem
    function desfazerDeletar() {
        if (imagensRemovidas.length === 0) {
            alert("Não há imagens deletadas para restaurar.");
            return;
        }

        const imagemRestaurada = imagensRemovidas.pop();
        imagensSalvas.push(imagemRestaurada);

        localStorage.setItem(".imagensSalvas", JSON.stringify(imagensSalvas));
        localStorage.setItem(".imagensRemovidas", JSON.stringify(imagensRemovidas));
        location.reload();
    }

    const selecionarTodasBtn = document.getElementById("selecionarTodasBtn");
    if (selecionarTodasBtn) {
        selecionarTodasBtn.addEventListener("click", selecionarTodas);
    }

    const deletarTodasBtn = document.getElementById("deletarTodasBtn");
    if (deletarTodasBtn) {
        deletarTodasBtn.addEventListener("click", deletarTodas);
    }

    const desfazerDeletarBtn = document.getElementById("desfazerDeletarBtn");
    if (desfazerDeletarBtn) {
        desfazerDeletarBtn.addEventListener("click", desfazerDeletar);
    }
});