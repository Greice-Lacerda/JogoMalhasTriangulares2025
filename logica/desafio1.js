const quizContainer = document.getElementById('quiz-container'); // Container das perguntas (AJUSTADO)
const resultadoDiv = document.getElementById('resultado'); // Container do resultado final
const proximoFaseDiv = document.getElementById('proximoFase'); // Seleciona a div que já contém o botão
const reiniciarFaseDiv = document.getElementById('ReiniciarFase'); // Seleciona a div que já contém o botão
const comentarioDiv = document.getElementById('Respostas'); // Container para exibir as respostas e comentários
const perguntaDivElement = document.getElementById('pergunta'); // Seleciona a div da pergunta para manipulação da imagem (AJUSTADO)
let pontuacao = 0;
let indicePergunta = 0;

const perguntas = [
    {
        pergunta: "Um triângulo possui 3 vértices?",
        resposta: true,
        comentario: "Resposta: Um triângulo é um polígono com três lados e, consequentemente, três vértices, que são os pontos de encontro desses lados."
    },
    {
        pergunta: "Um quadrado possui 5 arestas?",
        resposta: false,
        comentario: "Resposta: Um quadrado possui 4 arestas (os lados) e 4 vértices. Arestas são os segmentos de reta que conectam os vértices."
    },
    {
        pergunta: "Um cubo é uma figura plana?",
        resposta: false,
        comentario: "Incorreto. Um cubo é um sólido geométrico tridimensional (possui largura, altura e profundidade) com 6 faces quadradas, 12 arestas e 8 vértices. Figuras planas existem em duas dimensões."
    },
    {
        pergunta: "Um pentágono regular possui todos os lados e ângulos iguais?",
        resposta: true,
        comentario: "Correto! A característica de um polígono regular é ter todos os seus lados com o mesmo comprimento e todos os seus ângulos internos com a mesma medida."
    },
    {
        pergunta: "Um polígono côncavo possui todos os seus ângulos internos menores que 180 graus?",
        resposta: false,
        comentario: "Incorreto. Um polígono côncavo possui pelo menos um ângulo interno maior que 180 graus. Em contraste, um polígono convexo tem todos os seus ângulos internos menores que 180 graus."
    },
    {
        pergunta: "Um círculo é considerado um polígono?",
        resposta: false,
        comentario: "Incorreto. Polígonos são figuras fechadas formadas por segmentos de reta (arestas). Um círculo é uma curva fechada onde todos os pontos estão à mesma distância do centro."
    },
    {
        pergunta: "As faces de um tetraedro regular são triângulos equiláteros?",
        resposta: true,
        comentario: "Correto! Um tetraedro regular é um sólido platônico com quatro faces que são triângulos equiláteros congruentes."
    },
    {
        pergunta: "Um octógono possui 6 vértices?",
        resposta: false,
        comentario: "Incorreto. O prefixo 'octo' significa oito. Portanto, um octógono possui 8 lados e 8 vértices."
    },
    {
        pergunta: "Um polígono não regular não pode ser convexo?",
        resposta: false,
        comentario: "Incorreto. Um polígono pode ser convexo mesmo que seus lados e ângulos não sejam todos iguais. A convexidade depende de se todos os segmentos de reta que conectam dois pontos quaisquer dentro do polígono também estão inteiramente contidos dentro dele."
    },
    {
        pergunta: "Uma reta é formada por infinitos vértices?",
        resposta: true,
        comentario: "Correto! Embora uma reta não seja um polígono (pois não é fechada), podemos pensar nela como sendo composta por uma infinidade de pontos, que poderiam ser considerados como vértices em um sentido mais amplo."
    }
];

function exibirPergunta() {
    if (indicePergunta < perguntas.length) {
        const perguntaAtual = perguntas[indicePergunta];
        const perguntaDiv = document.createElement('div');
        perguntaDiv.classList.add('pergunta');
        perguntaDiv.innerHTML = `<p>${perguntaAtual.pergunta}</p>`;
        const botoesDiv = document.createElement('div');
        botoesDiv.classList.add('botoes-pergunta');
        botoesDiv.innerHTML = `
            <button onclick="responder(true)">Sim</button>
            <button onclick="responder(false)">Não</button>
        `;

        perguntaDiv.appendChild(botoesDiv);
        quizContainer.appendChild(perguntaDiv);
        comentarioDiv.innerHTML = ''; // Limpa as respostas/comentários anteriores
    } else {
        exibirResultado();
    }
}

function responder(respostaUsuario) {
    const perguntaAtual = perguntas[indicePergunta];
    const perguntaDiv = quizContainer.querySelector('.pergunta');
    const botoesDiv = quizContainer.querySelector('.botoes-pergunta');
    const respostaDiv = document.createElement('div');
    respostaDiv.classList.add('resposta-feedback'); // Adiciona a classe base para o estilo

    if (respostaUsuario === perguntaAtual.resposta) {
        pontuacao++;
        respostaDiv.innerHTML = `<p><strong>A sua resposta está correta!</strong><br><br>${perguntaAtual.comentario}</p>`;
        respostaDiv.classList.add('correta'); // Adiciona classe para resposta correta
    } else {
        respostaDiv.innerHTML = `<p><strong>A sua resposta está incorreta!</strong><br><br>${perguntaAtual.comentario}</p>`;
        respostaDiv.classList.add('incorreta'); // Adiciona classe para resposta incorreta
        const audio2 = new Audio('../sons/Erro.mp3'); // Certifique-se de ter o arquivo 'aplausos.mp3' na pasta correta
        audio2.play();
    }

    comentarioDiv.appendChild(respostaDiv);

    // Remover botões "Sim" e "Não"
    botoesDiv.remove();

    // Container para o próximo botão
    const proximoBotaoContainer = document.createElement('div');
    proximoBotaoContainer.classList.add('proximo-botao-container');

    let proximoBotao; // Variável para o botão "Próxima Pergunta" ou "Finalizar Quiz"

    // Verificar se o número de perguntas respondidas é igual a 9 (para que a próxima seja a décima)
    if (indicePergunta === perguntas.length - 1) {
        // Criar e exibir o botão "Finalizar Quiz"
        proximoBotao = document.createElement('button');
        proximoBotao.textContent = 'Finalizar Quiz';
        proximoBotao.classList.add('proximo-botao-estilo'); // Adiciona a classe de estilo
        proximoBotao.onclick = () => {
            quizContainer.innerHTML = ''; // Limpa a pergunta atual
            exibirResultado();
        };
    } else {
        // Criar e exibir o botão "Próxima Pergunta"
        proximoBotao = document.createElement('button');
        proximoBotao.textContent = 'Próxima Pergunta';
        proximoBotao.classList.add('proximo-botao-estilo'); // Adiciona a classe de estilo
        proximoBotao.onclick = () => {
            quizContainer.innerHTML = ''; // Limpa a pergunta atual
            indicePergunta++;
            exibirPergunta();
        };
    }

    proximoBotaoContainer.appendChild(proximoBotao);
    perguntaDiv.appendChild(proximoBotaoContainer);
}

const proximoFaseButton = proximoFaseDiv.querySelector('button'); // Seleciona o botão dentro da div
const ReiniciarButton = reiniciarFaseDiv.querySelector('button'); // Seleciona o botão dentro da div

function exibirResultado() {
    const audio1 = new Audio('../sons/Aplausos.mp3'); // Certifique-se de ter o arquivo 'aplausos.mp3' na pasta correta
    const audio3 = new Audio('../sons/Fim.mp3');
    const totalPerguntas = perguntas.length;
    const porcentagemAcerto = (pontuacao / totalPerguntas) * 100;
    comentarioDiv.innerHTML = '';    
    resultadoDiv.style.textAlign = 'center';
    resultadoDiv.style.backgroundColor = 'rgba(81, 169, 245, 0.8)';    
    resultadoDiv.style.boxShadow = ' #0c0601 12px 12px 10px'; // Sombra para os botões}
    resultadoDiv.style.padding = '15px';
    resultadoDiv.style.borderRadius = '5px';
    resultadoDiv.style.marginLeft = '-10px';
    resultadoDiv.style.marginRight = '100px';

    // Exibir o botão "Próximo Desafio" se a pontuação for >= 60%
    if (porcentagemAcerto >= 60) {
        audio1.play();
        resultadoDiv.innerHTML = `<span style="color: red; font-weight: bold; font-size: 32px; text-decoration: underline; animation: blink 1s infinite;">Parabéns!</span><br> Você acertou ${pontuacao} de ${totalPerguntas} perguntas.
        <br> (${porcentagemAcerto.toFixed(2)}% de acerto.) <br><br>Clique em <span style="color: black; font-weight: bold; text-decoration: underline;">Próximo Desafio</span> para continuar!`;
        proximoFaseButton.style.display = 'block';
        ReiniciarButton.style.display = 'none';

        // Adicionar confetes
        gerarConfetes();

    } else {
        audio3.play();
        resultadoDiv.innerHTML = `<span style="color: red; font-weight: bold; font-size: 32px; text-decoration: underline; animation: blink 1s infinite;">Que Pena!</span><br> Você acertou ${pontuacao} de ${totalPerguntas} perguntas.
        <br> (${porcentagemAcerto.toFixed(2)}% de acerto.) <br><br>Clique em <span style="color: black; font-weight: bold; text-decoration: underline;">Reiniciar</span> para tentar novamente.`;
        proximoFaseButton.style.display = 'none';
        ReiniciarButton.style.display = 'block';
    }
}

// Função para gerar confetes
function gerarConfetes() {
    const container = document.getElementById('game-container'); // Ou outro container de sua preferência
    const numConfetes = 200;

    for (let i = 0; i < numConfetes; i++) {
        const confete = document.createElement('div');
        confete.classList.add('confete');
        confete.style.left = `${Math.random() * 100}vw`;
        confete.style.animationDelay = `${Math.random()}s`;
        confete.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        container.appendChild(confete);
    }
}

// Iniciar o quiz somente se o container de perguntas estiver presente no DOM
if (quizContainer) {
    exibirPergunta();
}