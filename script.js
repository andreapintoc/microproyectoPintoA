// Definir variables globales
var playerNames = [];
var cardSize = 4; // Valor predeterminado de tamaño de cartón
var currentPlayerIndex = 0;
var turnCounter = 0;
var numbersCalled = [];
var playerCards = [];

// Función para iniciar el juego
function startGame() {
   // Obtener nombres de los jugadores y tamaño del cartón
   var namesInput = document.getElementById('player-names');
   playerNames = namesInput.value.split(',').map(name => name.trim());
   cardSize = parseInt(document.getElementById('card-size').value);

   // Ocultar menú principal y mostrar tablero de juego
   document.getElementById('main-menu').style.display = 'none';
   document.getElementById('game-board').style.display = 'block';

   // Generar cartones de Bingo para cada jugador
   for (var i = 0; i < playerNames.length; i++) {
      var card = generateRandomCard();
      playerCards.push(card);
      displayCard(card, i === 0); // Mostrar solo el primer cartón
      displayPlayerName(playerNames[i]);
   }

   // Actualizar el jugador actual
   updateCurrentPlayerDisplay();
}

// Función para generar un cartón de Bingo aleatorio
function generateRandomCard() {
   var card = [];
   var numbers = [];

   for (var i = 1; i <= 50; i++) {
      numbers.push(i);
   }

   for (var row = 0; row < cardSize; row++) {
      var rowNumbers = [];
      for (var col = 0; col < cardSize; col++) {
         var randomIndex = Math.floor(Math.random() * numbers.length);
         var number = numbers.splice(randomIndex, 1)[0];
         rowNumbers.push(number);
      }
      card.push(rowNumbers);
   }

   return card;
}

// Función para mostrar un cartón de Bingo en la interfaz
function displayCard(card, highlight) {
   var cardContainer = document.getElementById('card-container');
   cardContainer.innerHTML = ''; // Limpiar el contenedor de cartones

   var cardSize = card.length; // Obtener el tamaño del cartón

   // Calcular el ancho y alto de cada celda en función del tamaño del cartón
   var cellSize = 100 / cardSize; // Ajustar el valor según tus necesidades

   for (var row = 0; row < cardSize; row++) {
      for (var col = 0; col < cardSize; col++) {
         var number = card[row][col];
         var cell = document.createElement('div');
         cell.classList.add('card');
         cell.style.width = cellSize + '%'; // Establecer el ancho de la celda
         cell.style.height = cellSize + '%'; // Establecer el alto de la celda

         // Verificar si el número está tachado y cambiar el contenido y color de fondo
         if (number === -1) {
            cell.textContent = 'X'; // Mostrar 'X' en lugar del número tachado
            cell.style.backgroundColor = 'gray'; // Cambiar el color de fondo para indicar el número tachado
         } else {
            cell.textContent = number; // Mostrar el número normalmente
         }

         if (highlight && playerCards[currentPlayerIndex][row][col] === number) {
            cell.classList.add('highlight');
         }

         cardContainer.appendChild(cell);
      }
   }
}

// Función para mostrar el nombre de un jugador en la interfaz
function displayPlayerName(name) {
   var playerList = document.getElementById('player-list');
   var playerName = document.createElement('div');
   playerName.classList.add('player-name');
   playerName.textContent = name;
   playerList.appendChild(playerName);
}

// Función para actualizar el jugador actual en la interfaz
function updateCurrentPlayerDisplay() {
   var currentPlayerDisplay = document.getElementById('current-player');
   currentPlayerDisplay.textContent = playerNames[currentPlayerIndex];
}

// Función para dibujar un número aleatorio y verificar si está en los cartones de los jugadores
function drawNumber() {
   // Verificar si ya se han llamado todos los números posibles
   if (numbersCalled.length === 50) {
      document.getElementById('number-display').textContent = 'TODOS LOS NUMEROS HAN SIDO LLAMADOS';
      document.getElementById('result-display').textContent = '';
      return;
   }

   // Verificar si se han realizado los 25 intentos
   if (turnCounter === 25*playerNames.length) {
      checkWinCondition();
      return;
   }

   // Generar un número aleatorio que no haya sido llamado antes
   var randomNumber;
   do {
      randomNumber = Math.floor(Math.random() * 50) + 1;
   } while (numbersCalled.includes(randomNumber));

   // Marcar el número como llamado
   numbersCalled.push(randomNumber);

   // Mostrar el número llamado en la interfaz
   document.getElementById('number-display').textContent = 'NUMERO: ' + randomNumber;

   // Verificar si el número está en el cartón del jugador actual
   var currentPlayerCard = playerCards[currentPlayerIndex];
   var numberFound = false;

   for (var row = 0; row < cardSize; row++) {
      for (var col = 0; col < cardSize; col++) {
         if (currentPlayerCard[row][col] === randomNumber) {
            currentPlayerCard[row][col] = -1; // Marcar el número como tachado
            numberFound = true;
            break;
         }
      }
      if (numberFound) {
         break;
      }
   }

   // Mostrar el resultado en la interfaz
   if (numberFound) {
      document.getElementById('result-display').textContent = 'EL NUMERO ESTA EN TABLERO!';
   } else {
      document.getElementById('result-display').textContent = 'EL NUMERO NO ESTA EN EL TABLERO!';
   }

   // Actualizar el cartón del jugador actual en la interfaz
   displayCard(currentPlayerCard, true);

   // Pasar al siguiente jugador
   currentPlayerIndex = (currentPlayerIndex + 1) % playerNames.length;
   turnCounter++;

   // Actualizar el jugador actual en la interfaz
   updateCurrentPlayerDisplay();

   // Verificar la condición de ganar o perder después de los 25 intentos
   if (turnCounter === 25*playerNames.length) {
      checkWinCondition();
   }
}

// Función para verificar la condición de ganar o perder
function checkWinCondition() {
   var currentPlayerCard = playerCards[currentPlayerIndex];

   // Verificar si el cartón del jugador actual está lleno
   var isCardFull = currentPlayerCard.every(row => row.every(number => number === -1));

   // Mostrar la alarma correspondiente
   if (isCardFull) {
      alert('GANASTE!');
   } else {
      alert('PERDISTE!');
   }
}