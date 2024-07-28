let board;  
let score = 0;  
let rows = 4;   
let columns = 4;    
let is2048Exist = false;    
let is4096Exist = false;    
let is8192Exist = false;    
let gameOver = false;  
let startX = 0;
let startY = 0;

const scoreDisplay = document.getElementById('score');  
const newGameButton = document.getElementById('new-game-button');   

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];  
    score = 0;  
    is2048Exist = false;    
    is4096Exist = false;    
    is8192Exist = false;    
    gameOver = false;   
    updateScore();

    const boardElement = document.getElementById("board");  
    boardElement.innerHTML = ''; 

    for (let r = 0; r < rows; r++) {    
        for (let c = 0; c < columns; c++) {     
            let tile = document.createElement("div");   
            tile.id = r.toString() + "-" + c.toString();    
            let num = board[r][c];  
            updateTile(tile, num);  
            boardElement.append(tile);  
            positionTile(tile, r, c); 
        }
    }

    setTwo();   
    setTwo();   
}

function updateTile(tile, num) {    
    tile.innerText = "";    
    tile.classList.value = "";  
    tile.classList.add("tile");     

    if (num > 0) {  
        tile.innerText = num.toString();    

        if (num <= 4096) {  
            tile.classList.add("x" + num.toString());   
        } else {
            tile.classList.add("x8192");    
        }
    }
}

window.onload = function() {
    setGame();  
    newGameButton.addEventListener('click', setGame);   
}

function handleSlide(event) {
    if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(event.code)) {
        event.preventDefault(); 

        let moved = false;  
        if (event.code == "ArrowLeft") {    
            moved = slideLeft();   
        } else if (event.code == "ArrowRight") {    
            moved = slideRight();
        } else if (event.code == "ArrowDown") {     
            moved = slideDown();
        } else if (event.code == "ArrowUp") {       
            moved = slideUp();
        }

        if (moved) {    
            setTimeout(() => {
                setTwo();   
                updateScore();  
                checkWin(); 
                if (hasLost()) {   
                    alert("Game Over"); 
                    gameOver = true;    
                    setGame();  
                }
            }, 200); // Delay to allow slide animation to complete
        }
    }
}

document.addEventListener("keydown", handleSlide); 

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            positionTile(tile, r, c);
            if (num > 0 && originalRow[c] !== row[c]) {
                moved = true;
                addAnimationClass(tile, 'left');
            }
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            positionTile(tile, r, c);
            if (num > 0 && originalRow[c] !== row[c]) {
                moved = true;
                addAnimationClass(tile, 'right');
            }
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = [...col];
        col = slide(col);

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            positionTile(tile, r, c);
            if (num > 0 && originalCol[r] !== col[r]) {
                moved = true;
                addAnimationClass(tile, 'up');
            }
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = [...col];
        col.reverse();
        col = slide(col);
        col.reverse();

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            positionTile(tile, r, c);
            if (num > 0 && originalCol[r] !== col[r]) {
                moved = true;
                addAnimationClass(tile, 'down');
            }
        }
    }
    return moved;
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = Math.random() < 0.1 ? 4 : 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = board[r][c].toString();
            tile.classList.add(board[r][c] == 2 ? "x2" : "x4");
            positionTile(tile, r, c); // Position the new tile
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function updateScore() {
    scoreDisplay.innerText = score;
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048 && !is2048Exist) {
                alert("You Win! You've reached 2048!");
                is2048Exist = true;
            } else if (board[r][c] == 4096 && !is4096Exist) {
                alert("You Win! You've reached 4096!");
                is4096Exist = true;
            } else if (board[r][c] == 8192 && !is8192Exist) {
                alert("You Win! You've reached 8192!");
                is8192Exist = true;
            }
        }
    }
}

function hasLost() {
    if (hasEmptyTile()) return false;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (r < rows - 1 && board[r][c] == board[r + 1][c]) return false;
            if (c < columns - 1 && board[r][c] == board[r][c + 1]) return false;
        }
    }
    return true;
}

// New animation handler for slides
function addAnimationClass(tile, direction) {
    const animationClass = `slide-${direction}`;
    tile.classList.add(animationClass);
    setTimeout(() => {
        tile.classList.remove(animationClass);
    }, 200);
}

function positionTile(tile, r, c) {
    const tileSize = 100;
    const tileMargin = 1;
    tile.style.top = `${r * (tileSize + tileMargin)}px`;
    tile.style.left = `${c * (tileSize + tileMargin)}px`;
}

document.addEventListener('touchstart', (event) =>{
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
})

document.addEventListener('touchend', (event) => {

	if(!event.target.className.includes("tile")){
		return; // "I will do nothing, since you haven't touched a tile"
	}

	// touchstart - touchend
	let diffX = startX - event.changedTouches[0].clientX;
	let diffY = startY - event.changedTouches[0].clientY;

	if(Math.abs(diffX) > Math.abs(diffY)){
		if(diffX > 0 ){
			moved = slideLeft();
		}
		else{
			moved = slideRight();
		}
	}
	else{

		if(diffY > 0 ){
			moved = slideUp();
		}
		else{
			moved = slideDown();
		}

	}
    if (moved) {    
        setTimeout(() => {
            setTwo();   
            updateScore();  
            checkWin(); 
            if (hasLost()) {   
                alert("Game Over"); 
                gameOver = true;    
                setGame();  
            }
        }, 200);
    }
})

document.addEventListener('touchmove', (e)=>{
	if(!e.target.className.includes("tile")){
		return; // "I will do nothing, since the player/user does not touch a tile"
	}

	e.preventDefault();

}, {passive: false}); // Use passive: false, to make preventDefault() work