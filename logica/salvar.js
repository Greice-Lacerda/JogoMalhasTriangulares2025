let contador = 1; // Contador para nomear as imagens sequencialmente

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

  let imagensSalvas = JSON.parse(localStorage.getItem(".imagensSalvas")) || [];

  // Garantir que o contador seja um número inteiro
  contador = parseInt(contador) || 0;

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
localStorage.setItem(".imagensSalvas", JSON.stringify(imagensSalvas));

// Exibir mensagem de sucesso sem confirmação
exibirMensagemTemporaria(
    "Imagem salva com sucesso!",
    "Indo para a próxima fase!",
    1000,
    1000,
    "C:/Users/Greice Lacerda/OneDrive/ASSUNTOS DE KELI/CAP-UERJ/PARA ARTIGOS FUTUROS 2025/Jogo Malhas/pages/Desafio.html"
);

// Função para exibir a mensagem temporária no meio da tela
function exibirMensagemTemporaria(mensagem1, mensagem2, tempo1 = 1000, tempo2 = 1000, url = "") {
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

// Evento para carregar imagens ao iniciar a página
window.onload = carregarImagens;
