// Função para voltar à fase 1
function voltarParaFase1() {
  window.location.href = "C:/Users/Greice Lacerda/OneDrive/ASSUNTOS DE KELI/CAP-UERJ/PARA ARTIGOS FUTUROS 2025/Jogo Malhas/pages/fase1.html";
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
          <fieldset class="orientacao-imprimir">
              <legend class="Tb-imprimir" style="text-align: center;">
                  <input type='checkbox' class='imagensSalvas' data-index='${i}' style="width: 22px; height: 22px; margin-top: 25px;">
                  ${imagem.legenda}
              </legend>
              <div>
                  <button class="deleteBtn-imprimir" data-index="${i}"
                      style="position: absolute; margin-top: 5px; left: 140px;
                      background: none;
                      border: none;
                      cursor: pointer;">
                      <i class="fas fa-trash-alt" style="color: black; font-size: 18px;"></i>
                  </button>
                  <img src='${imagem.dataURL}' alt='${imagem.legenda}' style="width: 280px; margin: 15px; border: 3px solid white; object-fit: contain;">
              </div>
          </fieldset>
      `;

      row.appendChild(cell);
  });

  // Evento para deletar uma única imagem ao clicar na lixeira
  document.querySelectorAll(".deleteBtn-imprimir").forEach((button) => {
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
  document.getElementById("imprimirBtn").addEventListener("click", () => {
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
              <link rel="stylesheet" href="C:/Users/Greice Lacerda/OneDrive/ASSUNTOS DE KELI/CAP-UERJ/PARA ARTIGOS FUTUROS 2025/Jogo Malhas/estilos/estilo-imprimir.css"/>
              <meta
                  name="description"
                  content="Um jogo educativo para aprender sobre triangulação."/>
              <meta name="keywords" content="triangulação, educação, jogo, geometria"/>
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
                  #game-container {
                      display: flex;
                      flex-wrap: wrap;
                      justify-content: center;
                      width: 90%;
                  }
                  .orientacao-imprimir {
                      border: 1px solid #ccc;
                      padding: 10px;
                      margin: 10px;
                      text-align: center;
                  }
                  .Tb-imprimir {
                      font-weight: bold;
                      margin-bottom: 5px;
                  }
                  .deleteBtn-imprimir {
                      position: absolute;
                      top: 10px;
                      right: 10px;
                      background: none;
                      border: none;
                      cursor: pointer;
                  }
                  #imagensSalvas-imprimir {
                      margin-top: 10px;
                  }
                  #imagensSalvas-imprimir img {
                      max-width: 100%;
                      height: auto;
                      border: 1px solid #eee;
                  }
                  footer {
                      margin-top: 20px;
                      padding: 10px;
                      background-color: #f0f0f0;
                      text-align: center;
                      width: 100%;
                  }
                  @media print {
                      body {
                          display: block;
                      }
                      #game-container {
                          display: block;
                      }
                      .orientacao-imprimir {
                          border: 1px solid #000;
                          margin: 5mm;
                          page-break-inside: avoid;
                      }
                      .deleteBtn-imprimir {
                          display: none;
                      }
                      input[type="checkbox"] {
                          display: none;
                      }
                      header {
                          margin-bottom: 5mm;
                      }
                      footer {
                          position: fixed;
                          bottom: 0;
                          left: 0;
                      }
                  }
              </style>
          </head>
          <body>
              <header><h1>Triangularizando e Aprendendo</h1></header>
              <main id="game-container">
      `);

      checkboxesSelecionados.forEach((checkbox) => {
          const index = parseInt(checkbox.dataset.index);
          const imagem = imagensSalvas[index];

          janelaImpressao.document.write(`
                  <fieldset class="orientacao-imprimir">
                      <legend><b class="Tb-imprimir" style="text-align: center;">${imagem.legenda}</b></legend>
                      <div id="imagensSalvas-imprimir">
                          <img src='${imagem.dataURL}'>
                      </div>
                  </fieldset>
          `);
      });

      janelaImpressao.document.write(`
              </main>
              <footer>
                  <fieldset id="credits">
                      <legend>Créditos</legend>
                      Criado por Pablo e Greice em 2025
                  </fieldset>
              </footer>
          </body>
          </html>
      `);

      // Fecha o documento da janela de impressão
      janelaImpressao.document.close();

      // Imprime a janela após um pequeno delay para garantir que o conteúdo seja carregado
      setTimeout(() => {
          janelaImpressao.print();
          janelaImpressao.close();
      }, 500);
  });

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

          // Remover em ordem decrescente para não afetar os índices dos elementos restantes
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

  document.addEventListener('DOMContentLoaded', () => {
    const imprimirBtn = document.getElementById('imprimirJogo');

    if (imprimirBtn) {
        imprimirBtn.addEventListener('click', () => {
            console.log("Evento de clique adicional do listener!");
            // Você pode adicionar lógica extra aqui, ou apenas deixar o 'onclick' no HTML fazer o trabalho.
        });
    }
});

function imprimir() {
    // Sua lógica de impressão aqui
    console.log("Função imprimir() chamada pelo atributo onclick!");
    window.print();
}

  // Adiciona eventos aos botões
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