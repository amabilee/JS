// Obtém referências aos elementos HTML relevantes
const grid = document.getElementById('grid'); // O elemento do grid onde o jogo ocorre
const gameOverScreen = document.getElementById('gameOver'); // A tela de fim de jogo
const restartButton = document.getElementById('restartButton'); // Botão de reinício do jogo
const startButton = document.getElementById('startButton'); // Botão de início do jogo
const scoreElement = document.getElementById('score'); // Elemento que exibe a pontuação

// Inicialização das variáveis do jogo
let snake = [
  { x: 5, y: 5 }, // Cabeça da cobra
  { x: 4, y: 5 }  // Corpo da cobra
];
let apple = { x: 10, y: 10 }; // Posição inicial da maçã
let direction = 'right'; // Direção inicial da cobra
let score = 0; // Pontuação do jogador
let gameInterval; // Intervalo de atualização do jogo

// Função para criar a grade do jogo no HTML
function createGrid() {
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      grid.appendChild(cell);
    }
  }
}

// Função para desenhar a cobra na grade
function drawSnake() {
  snake.forEach((segment, index) => {
    const cellIndex = segment.y * 15 + segment.x;
    const cell = grid.children[cellIndex];
    
    cell.classList.add('snake'); // Adiciona a classe para exibir a cobra

    if (index === 0) {
      // Cabeça da cobra
      cell.classList.add('snake-head');

      // Remove todas as classes da cabeça da cobra
      cell.classList.remove('snake-head-up', 'snake-head-down', 'snake-head-left', 'snake-head-right');

      // Adiciona a classe apropriada com base na direção
      switch (direction) {
        case 'up':
          cell.classList.add('snake-head', 'snake-head-up');
          break;
        case 'down':
          cell.classList.add('snake-head', 'snake-head-down');
          break;
        case 'left':
          cell.classList.add('snake-head', 'snake-head-left');
          break;
        case 'right':
          cell.classList.add('snake-head', 'snake-head-right');
          break;
      }
    } else {
      // Corpo da cobra
      cell.classList.add('snake');
    }
  });
}

// Função para desenhar a maçã na grade
function drawApple() {
  const cellIndex = apple.y * 15 + apple.x;
  const cell = grid.children[cellIndex];
  cell.classList.add('apple'); // Adiciona a classe para exibir a maçã
}

// Função para limpar a grade (remover todas as classes das células)
function clearGrid() {
  const cells = grid.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.className = 'cell';
  });
}

// Função para mover a cobra
function moveSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    generateApple();
  } else {
    snake.pop();
  }
}

// Função para gerar a posição da maçã aleatoriamente
function generateApple() {
  do {
    apple.x = Math.floor(Math.random() * 15);
    apple.y = Math.floor(Math.random() * 15);
  } while (snake.some(segment => segment.x === apple.x && segment.y === apple.y));
}

// Função para verificar colisões com as paredes e com a própria cobra
function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= 15 ||
    head.y < 0 ||
    head.y >= 15 ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    gameOverScreen.style.display = 'block';
    scoreElement.textContent = score;
  }
}

// Função de atualização do jogo (chamada repetidamente)
function updateGame() {
  clearGrid();
  moveSnake();
  checkCollision();
  drawSnake();
  drawApple();
}

// Função para reiniciar o jogo
function restartGame() {
  snake = [
    { x: 5, y: 5 }, // Cabeça da cobra
    { x: 4, y: 5 }  // Corpo da cobra
  ];
  direction = 'right';
  score = 0;
  gameOverScreen.style.display = 'none';
  scoreElement.textContent = '';
  createGrid();
  gameInterval = setInterval(updateGame, 150); // Iniciar o jogo novamente
}

// Função para iniciar um novo jogo
function startNewGame() {
  startButton.style.display = 'none';
  restartGame(); // Chama a função para reiniciar o jogo
  document.addEventListener('keydown', handleKeyPress);
}

// Função para lidar com eventos de teclado (controle da cobra)
function handleKeyPress(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right';
      break;
  }
}

// Inicialização do jogo
createGrid();
restartButton.addEventListener('click', restartGame);
startButton.addEventListener('click', startNewGame);

startButton.style.display = 'block';
