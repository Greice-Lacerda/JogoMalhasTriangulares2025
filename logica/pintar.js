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
  let originalCursorColor = canvas.style.cursor;

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
          mensagensDiv1.style.width = "350px";
          mensagensDiv1.style.zoom = window.innerWidth <= 1200 ? 0.5 : 1;
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
      canvas.style.cursor = originalCursorColor; // Retorna a cor original do ponteiro
      if (isFullyPainted()) {
          pinturaConcluida = true;
          document.getElementById("addVertex").disabled = true;
          document.getElementById("pintarElementos").disabled = true;
          canvas.removeEventListener("click", selecionarVertice);
          canvas.addEventListener("click", selecionarVertice);
          canvas.style.zoom = window.innerWidth <= 1200 ? 0.5 : 1;
          exibirMensagemPinturaConcluida();
      }
  }

  function isFullyPainted() {
      return triangles.length >= vertices.length - 2;
  }

  function exibirMensagemTemporaria(mensagem) {
      const mensagensDiv1 = document.getElementById("mensagens");
      if (!mensagensDiv1) return;
      mensagensDiv1.style.display = "flex";
      mensagensDiv1.style.justifyContent = "center";
      mensagensDiv1.style.fontSize = "20px";
      mensagensDiv1.style.alignItems = "center";
      mensagensDiv1.style.width = "100%";
      mensagensDiv1.style.height = "100%";
      mensagensDiv1.style.background = "linear-gradient(to right, #ff7e5f, #feb47b)";
      mensagensDiv1.textContent = mensagem;
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
              originalCursorColor = canvas.style.cursor; // Salva a cor original do ponteiro
              canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewport="0 0 32 32" style="fill: ${cor};"><circle cx="16" cy="16" r="16"/></svg>') 16 16, auto`; // Muda a cor do ponteiro
              canvas.addEventListener("click", selecionarVertice);
              document.getElementById("addVertex").disabled = true;
          });
          cell.appendChild(button);
      });
      mensagensDiv1.appendChild(tabela);
      mensagensDiv1.className = "mensagensDiv2";
      mensagensDiv1.style.display = "flex";
      mensagensDiv1.style.flexDirection = "column"; // Alinha a mensagem e a tabela em coluna
      mensagensDiv1.style.alignItems = "center"; // Centraliza a mensagem e a tabela
      mensagensDiv1.style.marginTop = "10px"; // Adiciona margem superior
      mensagensDiv1.style.width = "350px";
      mensagensDiv1.style.height = "250px";
      mensagensDiv1.style.borderRadius = "20px";
  }

  function exibirMensagemPinturaConcluida() {
      const mensagensDiv1 = document.getElementById("mensagens");
      if (!mensagensDiv1) return;
      mensagensDiv1.style.display = "flex";
      mensagensDiv1.style.justifyContent = "center";
      mensagensDiv1.style.fontSize = "20px";
      mensagensDiv1.style.alignItems = "center";
      mensagensDiv1.style.width = "100%";
      mensagensDiv1.style.height = "100%";
      mensagensDiv1.style.background = "linear-gradient(to right, #ff7e5f, #feb47b)";
      mensagensDiv1.textContent = "Pintura concluída!";
  }

  // Desabilitar todos os botões no fieldset de legenda controles ao iniciar a função pintar
  function desabilitarBotoes() {
      const fieldset = document.getElementById('legendaControles');
      const buttons = fieldset.querySelectorAll('button');
      buttons.forEach(button => {
          button.disabled = true;
      });
  }

  // Função para pintar os elementos
  function pintar() {
      desabilitarBotoes(); // Desabilita todos os botões
      console.log("Função pintar chamada.");
      // Adicione aqui a lógica para pintar os elementos
  }

  document.getElementById('pintarElementos').addEventListener('click', pintar);
});