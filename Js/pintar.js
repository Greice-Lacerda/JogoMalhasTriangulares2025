function exibirMensagemComSeletor(mensagem) {
  const mensagensDiv = document.getElementById("mensagens");

  if (!mensagensDiv) {
    console.error("Elemento com id 'mensagens' não encontrado.");
    return;
  }

  mensagensDiv.innerHTML = "";

  const mensagemTexto = document.createElement("p");
  mensagemTexto.textContent = mensagem;
  mensagemTexto.className = "mensagem-texto";

  mensagensDiv.appendChild(mensagemTexto);

  const tabela = document.createElement("table");
  tabela.className = "color-table";
  // Adiciona uma classe condicional para telas menores
  if (window.innerWidth < 768) {
    tabela.classList.add("color-table-small");
  }
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
      mensagensDiv.style.display = "none";
    });
    cell.appendChild(button);
  });

  mensagensDiv.appendChild(tabela);

  mensagensDiv.className = "mensagens-div";
  mensagensDiv.style.display = "flex";
}