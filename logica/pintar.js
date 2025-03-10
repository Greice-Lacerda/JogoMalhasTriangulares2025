document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let corSelecionada = "#f0ff00"; // Cor padrão
  let pinturaConcluida = false;
  let selectedVerticesForTriangle = [];
  let triangles = [];

  const cores = [
    "#f0ff00",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ff00ff",
    "#00ffff",
    "#800000",
    "#808000",
    "#008080",
    "#800080",
    "#ff8000",
    "#80ff00",
    "#00ff80",
    "#0080ff",
    "#8000ff",
    "#ff0080",
    "#ff8080",
    "#80ff80",
    "#8080ff",
    "#ffff80",
  ];

  document.getElementById("pintarElementos").addEventListener("click", () => {
    exibirMensagemComSeletor("selecione a cor da figura");
  });

  function selecionarVertice(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!vertices) return; // Verifica se vertices está definido

    const vertex = vertices.find((v) => Math.hypot(v.x - x, v.y - y) < 10);

    if (vertex && !selectedVerticesForTriangle.includes(vertex)) {
      selectedVerticesForTriangle.push(vertex);

      if (selectedVerticesForTriangle.length === 3) {
        paintTriangle();
      }
    }

    // Fecha a mensagem temporária ao clicar no vértice
    const mensagensDiv = document.getElementById("mensagens");
    if (mensagensDiv) {
      mensagensDiv.style.display = "none";
    }
  }

  function paintTriangle() {
    const [v1, v2, v3] = selectedVerticesForTriangle;

    ctx.fillStyle = corSelecionada;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    triangles.push({ v1, v2, v3 });

    selectedVerticesForTriangle = [];

    // Verifica se a pintura está completa apenas depois de pintar todos os triângulos
    if (isFullyPainted()) {
      pinturaConcluida = true;
         // Verifica se a pintura está completa apenas depois de pintar todos os triângulos
    if (isFullyPainted()) {
      pinturaConcluida = true;
      // Exibir mensagem de sucesso sem confirmação
      exibirMensagemTemporaria1(
        "Imagem salva com sucesso!",
        "Salve a imagem para continuar",
        2000,
        3000,
      );
    }
  }

  function isFullyPainted() {
    return triangles.length >= vertices.length - 2;

    canvas.removeEventListener('click', 'pintarElementos');
    canvas.removeEventListener('click', 'exibirMensagemComSeletor');
  }
  }

  // Função para exibir a mensagem temporária no meio da tela
  function exibirMensagemTemporaria(mensagem) {
    const mensagensDiv = document.getElementById("mensagens");

    if (!mensagensDiv) {
      console.error("Elemento com id 'mensagens' não encontrado.");
      return;
    }

    // Limpa o conteúdo anterior da div
    mensagensDiv.innerHTML = "";

    // Adiciona a mensagem principal
    const mensagemTexto = document.createElement("p");
    mensagemTexto.textContent = mensagem;
    mensagemTexto.className = "mensagem-texto";

    // Aplica os estilos na div mensagens
    mensagensDiv.className = "mensagens-div";
    mensagensDiv.style.display = "flex"; // Exibe a janela de mensagens
  }

  // Função para exibir a mensagem com o seletor de cores
  function exibirMensagemComSeletor(mensagem) {
    const mensagensDiv = document.getElementById("mensagens");

    if (!mensagensDiv) {
      console.error("Elemento com id 'mensagens' não encontrado.");
      return;
    }

    // Limpa o conteúdo anterior da div
    mensagensDiv.innerHTML = "";

    // Adiciona a mensagem principal
    const mensagemTexto = document.createElement("p");
    mensagemTexto.textContent = mensagem;
    mensagemTexto.className = "mensagem-texto";

    // Adiciona o seletor de cores
    mensagensDiv.appendChild(mensagemTexto);

    const tabela = document.createElement("table");
    tabela.className = "color-table";
    let row;

    cores.forEach((cor, index) => {
      if (index % 5 === 0) {
        row = tabela.insertRow();
      }
      const cell = row.insertCell();
      const button = document.createElement("div");
      button.className = "color-button";
      button.style.backgroundColor = cor;
      button.addEventListener("click", () => {
        corSelecionada = cor;
        canvas.addEventListener("click", selecionarVertice);

        // Fecha a mensagem temporária ao selecionar a cor
        mensagensDiv.style.display = "none";
      });
      cell.appendChild(button);
    });

    mensagensDiv.appendChild(tabela);

    // Aplica os estilos na div mensagens
    mensagensDiv.className = "mensagens-div";
    mensagensDiv.style.display = "flex"; // Exibe a janela de mensagens
  }

  
// Função para exibir a mensagem temporária no meio da tela
function exibirMensagemTemporaria1(mensagem1, mensagem2, tempo1 = 2000, tempo2 = 3000) {
  function criarMensagem(mensagem) {
      const msgDiv = document.createElement("div");
      msgDiv.textContent = mensagem;
      Object.assign(msgDiv.style, {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0, 128, 0, 0.8)",
          color: "white",
          padding: "20px 30px",
          borderRadius: "8px",
          fontSize: "20px",
          fontWeight: "bold",
          zIndex: "1000",
      });
      document.body.appendChild(msgDiv);
      return msgDiv;
  }

  const msg1 = criarMensagem(mensagem1);
  setTimeout(() => {
      msg1.remove();
      const msg2 = criarMensagem(mensagem2);

      setTimeout(() => {
          msg2.remove();
          if (url) {
              window.location.href = url;
          }
      }, tempo2);
  }, tempo1);
}

});
