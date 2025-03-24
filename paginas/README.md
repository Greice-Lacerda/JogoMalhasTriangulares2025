{
  "name": "jogo-malhas",
  "version": "0.0.1",
  "description": "Configuração do jogo Triangularizando e Aprendendo",
  "author": "Greice e Pablo",
  "homepage": "https://greice-lacerda.github.io/ProjetoNovoJogo/",
  "license": "MIT",
  "private": false,
  "scripts": {
    "start": "live-server --port=8080",
    "lint": "markdownlint-cli2 '**/*.md'"
  },
  "dependencies": {},
  "devDependencies": {
    "markdownlint-cli2": "^0.6.0",
    "live-server": "^1.2.1"
  },
  "markdownlint-cli2": {
    "config": {
      "MD032": false,
      "MD047": false
    }
  }
}
