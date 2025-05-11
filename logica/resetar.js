 // Adiciona o evento de clique ao botão de reset
document.getElementById("resetButton").addEventListener("click", function () {
  // Verifica se o usuário confirmou o reset
  if (confirm("Tem certeza de que deseja resetar o jogo?")) {
    // Redireciona para a página de impressão
    window.location.href = "./fase1.html";
  } else {
    // Se o usuário não confirmou, exibe um alerta
    alert("O jogo não foi resetado.");
  }
});