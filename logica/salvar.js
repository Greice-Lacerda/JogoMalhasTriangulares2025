let contador = parseInt(localStorage.getItem("contadorImagens")) || 1; // Contador para nomear as imagens sequencialmente

document.getElementById("salvarJogo").addEventListener("click", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const canvasComFundo = document.createElement("canvas");
    const ctxComFundo = canvasComFundo.getContext("2d");
    canvasComFundo.width = canvas.width;
    canvasComFundo.height = canvas.height;

    ctxComFundo.fillStyle = "white";
    ctxComFundo.fillRect(0, 0, canvasComFundo.width, canvasComFundo.height);
    ctxComFundo.drawImage(canvas, 0, 0);

    let imagensSalvas = JSON.parse(localStorage.getItem("imagens_salvas")) || []; // Chave atualizada

    // Criar uma nova legenda
    let novaLegenda;
    do {
        novaLegenda = "Pol_" + contador++;
    } while (imagensSalvas.some((img) => img.legenda === novaLegenda));

    const dataURL = canvasComFundo.toDataURL("image/jpeg");
    imagensSalvas.push({ dataURL, legenda: novaLegenda });

    // Ordenar as imagens por legenda em ordem crescente
    imagensSalvas.sort((a, b) => {
        let numA = parseInt(a.legenda.split("_")[1]);
        let numB = parseInt(b.legenda.split("_")[1]);
        return numA - numB;
    });

    // Salvar imagem no localStorage
    localStorage.setItem("imagens_salvas", JSON.stringify(imagensSalvas)); // Chave atualizada

    // Atualizar o contador no localStorage
    localStorage.setItem("contadorImagens", contador);

// Exibir mensagem de sucesso sem confirmação
exibirMensagemComBotaoTemporario(
  "Imagem salva com sucesso!",
  "Clique no botão para ir para a próxima fase!",
  1000,
  3000,
  "Próxima Fase", // Texto do botão
  "./desafio1.html" // URL para redirecionar
);

// Função para exibir uma ou duas mensagens temporárias com um botão no meio da tela
function exibirMensagemComBotaoTemporario(mensagem1, mensagem2 = "", tempo1 = 1000, tempo2 = 3000, textoBotao = "", urlRedirecionamento = "") {
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
          fontSize: "36px",
          fontWeight: "bold",
          zIndex: "1000",
          textAlign: "center",
      });
      document.body.appendChild(msgDiv);
      return msgDiv;
  }

  const msg1 = criarMensagem(mensagem1);
  setTimeout(() => {
      msg1.remove();
      let elementoAposMensagem;
      if (mensagem2) {
          const msg2 = criarMensagem(mensagem2);
          elementoAposMensagem = msg2;
          setTimeout(() => {
              msg2.remove();
              if (textoBotao && urlRedirecionamento) {
                  criarBotao(textoBotao, urlRedirecionamento);
              }
          }, tempo2);
      } else if (textoBotao && urlRedirecionamento) {
          criarBotao(textoBotao, urlRedirecionamento);
      }
  }, tempo1);

  function criarBotao(texto, url) {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = texto;
      botao.className = "btn btn-primary btn-lg btn-block"; // Adicione suas classes CSS aqui
      Object.assign(botao.style, {
        position: "fixed",
        top: "45%", // Ajuste a posição vertical conforme necessário
        left: "50%",
        width: "250px", // Correção: usar string para valor de largura
        height: "60px", // Correção: usar string para valor de altura
        borderRadius: "15px",
        margin: "25px", // Correção: usar string para valor de margem
        alignItems: "flex-start", // Correção de camelCase
        padding: "10px", // Correção: usar string para valor de padding
        fontSize: "24px", // Correção: usar string para valor de fontSize
        cursor: "pointer", // Correção: usar string para valor de cursor
        border: "outset 5px rgb(151, 151, 181)", // Correção: usar string para valor de border
        background: "linear-gradient(45deg, #006782 40%, #0b1284 50%, #760ea1 60%, #83096e)", // Correção: usar string para valor de background
        color: "white", // Correção: usar string para valor de color
        transition: "0.2s", // Correção: usar string para valor de transition
        transform: "translateX(-230%)", // Correção: centralizar o botão
        zIndex: "1001", // Garante que o botão fique acima da mensagem (se ainda visível)
    });
    botao.addEventListener("click", function() {
        window.location.href = url;
    });
    document.body.appendChild(botao);
  }
}
});

// Evento para carregar imagens ao iniciar a página
window.onload = carregarImagens;
