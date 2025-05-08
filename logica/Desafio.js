function regularizarPoligono(verticesIrregulares) {
    const numLados = verticesIrregulares.length;
  
    // 1. Calcular o centroide
    let centroideX = 0;
    let centroideY = 0;
    for (const vertice of verticesIrregulares) {
      centroideX += vertice.x;
      centroideY += vertice.y;
    }
    centroideX /= numLados;
    centroideY /= numLados;
  
    // 2. Calcular um raio médio (opcional: usar a área para estimar o raio)
    let raioMedio = 0;
    for (const vertice of verticesIrregulares) {
      const distancia = Math.sqrt(Math.pow(vertice.x - centroideX, 2) + Math.pow(vertice.y - centroideY, 2));
      raioMedio += distancia;
    }
    raioMedio /= numLados;
  
    // 3. Gerar os vértices do polígono regular
    const verticesRegulares = [];
    for (let i = 0; i < numLados; i++) {
      const angulo = (2 * Math.PI * i) / numLados;
      const x = centroideX + raioMedio * Math.cos(angulo);
      const y = centroideY + raioMedio * Math.sin(angulo);
      verticesRegulares.push({ x: x, y: y });
    }
  
    return verticesRegulares;
  }
  
  // Suponha que 'verticesIrregulares' seja o array com as coordenadas do polígono existente
  const verticesIrregulares = [
    // ... coordenadas do seu polígono irregular
  ];
  
  const verticesRegulares = regularizarPoligono(verticesIrregulares);
  
  // Agora, você precisará de uma função para redesenhar o polígono na tela
  function desenharPoligono(vertices) {
    // Lógica para desenhar o polígono usando Canvas, SVG ou o método que sua aplicação utiliza
    console.log("Vértices do polígono regular:", vertices);
    // Atualize a visualização aqui
  }
  
  desenharPoligono(verticesRegulares);