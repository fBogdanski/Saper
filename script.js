// // document.addEventListener('contextmenu', event => {
// //     event.preventDefault();
// // });
// let gameActive = true;
// let timeCounter = 5400;
// let setTime = timeCounter
// let flagCounter = 0;
// let size = 10;
// let bombPositions =[];
// let bombAmount = 1;
// let remainingFlagsToWin = bombAmount;
// const timeDisplay = document.getElementById("timer");
// function chooseDifficulty(difficulty){
//     switch(difficulty){
//         case "easy":
//             size = 10;
//             timeCounter = 600;
//             break;
//         case "medium":
//             size = 16;
//             timeCounter = 2400;
//             break;
//         case "hard":
//             size = 30;
//             timeCounter = 5940;
//             break;
// }
// }

// function updateTimer(){
//     const minutes = Math.floor(timeCounter/60);
//     const seconds = timeCounter %60;
//     timeDisplay.textContent = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
//     if(timeCounter>0){
//         timeCounter--;
//     }else{
//         gameOver(timeout);
//     }
// }
// updateTimer();
// let timer = setInterval(updateTimer, 1000)

// const bounds = [
//     [-1, -1], //top left
//     [-1, 0], //left middle
//     [0, -1], //middle down
//     [+1, +1], //bottom right
//     [+1, 0], //right middle
//     [0, +1], //middle top
//     [+1, -1], //right top
//     [-1, +1], //left bottom
// ];


// function gameWin() {
//     const gameStateField = document.getElementById("gamestate");
//     gameStateField.innerHTML = "You Win!<br><button onclick='restartGame()'>Play Again</button>";
//     gameStateField.style.display = "block";
//     gameActive = false;
//     clearInterval(timer);
// }

// function gameOver(loseType) {
//     const gameStateField = document.getElementById("gamestate");
//     switch (loseType) {
//         case "timeout":
//             gameStateField.innerHTML = "Timeout<br><button onclick='restartGame()'>Play Again</button>";
//             break;
//         case "bombExplosion":
//             gameStateField.innerHTML = "Game Over!<br><button onclick='restartGame()'>Play Again</button>";
//             break;
//     }
//     gameStateField.style.display = "block";
//     gameActive = false;
//     clearInterval(timer);
// }

// function getCellByCoords(i, j){
//     let cellWithCoords = document.getElementById(`${i},${j}`);
//     return cellWithCoords;
// }


// function checkSurroundingDiscovered(cell) {
//     let toBeRevealed = [];
//     const i = parseInt(cell.dataset.row);
//     const j = parseInt(cell.dataset.col);
//     const neighbors = bounds.map(([di, dj]) => [i + di, j + dj]).filter(([ni, nj]) => ni >= 0 && nj >= 0 &&ni<size&&nj<size);
//     console.log(neighbors);
//     const allDiscovered = neighbors.every(([ni, nj]) => {const neighborCell = getCellByCoords(ni, nj);
//         return neighborCell.dataset.discovered === "true";
//     });
    
//     if (!allDiscovered) {
//         neighbors.forEach(([ni, nj]) => {
//             const neighborCell = getCellByCoords(ni, nj);
//             if (neighborCell.dataset.discovered !== "true" && 
//                 neighborCell.dataset.hasFlag !== "true") {
//                 toBeRevealed.push(neighborCell);
//             }
//         });
//     }
//     return toBeRevealed;
// }


// function revealFields(cell){
//     if(parseInt(cell.dataset.adjacentMines)>0){
//         cell.dataset.discovered = "true";
//         cell.style.color = "black";
//         cell.style.backgroundColor = "lightgray";
//     }else{
//         cell.innerHTML = " ";
//         cell.dataset.discovered = "true";
//         cell.style.color = "black";
//         cell.style.backgroundColor = "lightgray";
//         let tobeRevealed = checkSurroundingDiscovered(cell);
//         tobeRevealed.forEach((cellToCheck)=>revealFields(cellToCheck));
//     }

// }

// function generateMineFields(amount, size) {
//     const board_size = size * size;
//     const mine_indexes = new Set();

//     while (mine_indexes.size < amount) {
//         mine_indexes.add(Math.floor(Math.random() * board_size));
//     }
//     const mine_list = Array.from(mine_indexes).map(index => {
//         const row = Math.floor(index / size);
//         const col = index % size;
//         return [row, col];
//     });

//     return mine_list;
// }


// function leftClick(cell) {
//     if (!gameActive) return;
//     if (cell.dataset.hasFlag === "false") {
//         if (cell.dataset.hasMine === "true") {
//             cell.style.backgroundColor = "red";
//             gameOver("bombExplosion");
//         } else {
//             revealFields(cell);
//         }
//     }
// }

// function rightClick(cell) {
//     if (!gameActive) return;
//     if (cell.dataset.discovered !== "true") {
//         if (cell.dataset.hasFlag !== "true") {
//             cell.dataset.hasFlag = "true";    
//             cell.dataset.prevContent = cell.innerHTML;
//             cell.innerHTML = "&#128681;";
//             cell.style.color = "black";
//             if (cell.dataset.hasMine === "true") {
//                 remainingFlagsToWin--;
//                 if (remainingFlagsToWin === 0) {
//                     gameWin();
//                 }
//             }
//         } else {
//             cell.innerHTML = cell.dataset.prevContent || "";
//             cell.dataset.hasFlag = "false";
//             cell.style.color = "transparent"; 
//             if (cell.dataset.hasMine === "true") {
//                 remainingFlagsToWin++;
//             }
//         }
//     }
// }


// function generateBoard(size, bomb_number){            
//     bombPositions = generateMineFields(bombAmount, size)
//     flagCounter = bomb_number;
//     const cell_amount = size*size;
//     const boardField = document.getElementById('board');
//     for (let i = 0; i <size; i++){
//         for (let j = 0; j<size; j++){
//             let cell = document.createElement('button')
//             cell.style.color = "transparent";
//             cell.style.backgroundColor = "darkgray";
//             cell.dataset.discovered = "false";                
//             cell.dataset.hasFlag = "false";
//             cell.dataset.adjacentMines = "0";
//             boardField.appendChild(cell);
//             cell.classList.add("boardFields")
//             cell.id = `${i},${j}`;
//             cell.dataset.row = i;
//             cell.dataset.col = j;

//             if (bombPositions.some(pair => pair[0]===i&& pair[1]===j)){
//                 cell.dataset.hasMine = "true";
//                 cell.innerHTML = "&#128163;";
//                 cell.innerHTML = "b";
//             }
//             else{
//                 cell.dataset.hasMine = "false";     
//                 const adjacentMineNumber = bounds.map(([di,dj]) => [i+di, j+dj]).filter(([ni,nj])=> ni>=0&&nj>=0&&ni<size&&nj<size).filter(([ni, nj])=>bombPositions.some(pair => pair[0]===ni&&pair[1]===nj)).length;
//                 cell.dataset.adjacentMines = adjacentMineNumber;
//                 cell.textContent = adjacentMineNumber;  
//             }            
//             cell.addEventListener("mousedown", function(event){
//                 switch(event.button){
//                     case 0:
//                         leftClick(cell);
//                         break;
//                     case 2:
//                         rightClick(cell);
//                         break;
//                 }
//              });
//         }
//         boardField.appendChild(document.createElement('br'));
//     }
// }
// function startGame(event) {
//     if (event) event.preventDefault(); 
//     const difficulty = document.getElementById("difficulty").value;
//     const bombAmountInput = document.querySelector("input[name='bomb_amount']").value;
//     const bombAmount = parseInt(bombAmountInput);

//     if (isNaN(bombAmount) || bombAmount < 1) {
//         alert("Please enter a valid bomb amount.");
//         return;
//     }

//     chooseDifficulty(difficulty);
//     restartGame(bombAmount);
// }

// function restartGame(newBombAmount) {
//     clearInterval(timer);
//     document.getElementById("board").innerHTML = "";
//     document.getElementById("gamestate").style.display = "none";
//     gameActive = true;
//     remainingFlagsToWin = newBombAmount;
//     bombAmount = newBombAmount; 
//     updateTimer();
//     timer = setInterval(updateTimer, 1000);

//     generateBoard(size, bombAmount);
// }

// generateBoard(size, bombAmount);
// const gameStateField = document.getElementById("gamestate");






