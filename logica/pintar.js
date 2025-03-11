document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let corSelecionada = "#f0ff00"; // Cor padrão
  let pinturaConcluida = false;
  let selectedVerticesForTriangle = [];
  let triangles = [];

  const cores = [
    "#f0ff00", "#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff",
    "#800000", "#808000", "#008080", "#800080", "#ff8000", "#80ff00",
    "#00ff80", "#0080ff", "#8000ff", "#ff0080", "#ff8080", "#80ff80",
    "#8080ff", "#ffff80"
  ];

  document.getElementById("pintarElementos").addEventListener("click", () => {
    if (!pinturaConcluida) {
      exibirMensagemComSeletor("Selecione a cor da figura:");
          }
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
    const mensagensDiv1 = document.getElementById("mensagens");
    if (mensagensDiv1) {
      mensagensDiv1.style.display = "none";
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

    if (isFullyPainted()) {
      pinturaConcluida = true;
      document.getElementById("pintarElementos").disabled = true;
      canvas.removeEventListener("click", selecionarVertice);
      exibirMensagemTemporaria("Imagem Completa! Clique em Salvar para continuar.");
    }
  }

  function isFullyPainted() {
    return triangles.length >= vertices.length - 2;
  }

  function exibirMensagemTemporaria(mensagem) {
    mensagem.style.display = "flex";
    mensagem.style.justifyContent = "center";
    mensagem.style.alignItems = "center";
    mensagem.style.height = "100%";
    mensagem.style.background = "linear-gradient(to right, #ff7e5f, #feb47b)";

    mensagensDiv.appendChild(mensagem);

    setTimeout(() => {
      mensagensDiv1.removeChild(mensagem);
    }, 5000);
  }

  function exibirMensagemComSeletor(mensagem) {
    const mensagensDiv1 = document.getElementById("mensagens");

    if (!mensagensDiv1) {
      console.error("Elemento com id 'mensagens' não encontrado.");
      return;
    }

    mensagensDiv1.innerHTML = "";

    const mensagemTexto = document.createElement("p");
    mensagemTexto.textContent = mensagem;
    mensagemTexto.className = "mensagemTexto";
    mensagemTexto.style.paddingBottom = "5px"; // Adiciona padding abaixo da mensagem

    mensagensDiv1.appendChild(mensagemTexto);

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

        mensagensDiv1.style.display = "none";
      });
      cell.appendChild(button);
    });

    mensagensDiv1.appendChild(tabela);

    mensagensDiv1.className = "mensagensDiv2";
    mensagensDiv1.style.display = "flex";
    mensagensDiv1.style.flexDirection = "column"; // Alinha a mensagem e a tabela em coluna
    mensagensDiv1.style.alignItems = "center"; // Centraliza a mensagem e a tabela
    mensagensDiv1.style.marginTop = "10%"; // Adiciona margem superior
  }

  function salvar() {
    // Função para salvar a imagem
    console.log("Imagem salva!");
  }

  // Exibe a mensagem inicial
  exibirMensagemTemporaria("Clique no botão Pintar Elementos para pintar os triângulos.");
});