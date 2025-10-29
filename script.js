let canvas;
let ctx;
let gBArrayHeight = 20; //grid  size 20 rows, 12 columns
let gBArrayWidth = 12;
let startX = 4; //x,y of the starting falling tetromino
let startY = 0; //these represent the TOPLEFT ORGIIN of the shape
 
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0)); //spread operator
// Array() = constructor crrates a new array i.e Array(3) = [empty x 3] 3 empty items. ofr this array 
// the spread operator converts the array of empty slots into an array to map over
// [undefined,undefined, undefined]
// for each element in that array it creates another array within with the length of array width of 0s
 
let score = 0;
let level = 1;
let winOrLose = "Playing";
let currentTetromino = [[1,0],[0,1],[1,1],[2,1]];
let tetrisLogo;
let tetrominos = []; 
let tetrominosColors = ["purple","cyan","blue","yellow", "orange", "green","red"];
let curTetrominoColor;
let gameBoardArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let stoppedShapeArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill());
let DIRECTION = { IDLE: 0, DOWN: 1, LEFT: 2, RIGHT: 3 }; //object literals
// that maps direction names to unique numeric codes.
//It’s used to standardize how directions are referenced i


let direction;

class Coordinates { //class
    constructor(x, y) { //constructor
        this.x = x;
        this.y = y;
    }
}
//"DOMContentloaded"
//The HTML document is completely loaded and parsed. (parsed i.e the browser has read and understood the html structure and built the DOM)
document.addEventListener('DOMContentLoaded', SetupCanvas);
//method listens for events (like clicks, key presses) and runs a callback function when that event happens. - //element.addEventListener(eventType, callbackFunction);
//document  = the entire html page loaded in the browser, its an object giving you access to the DOM, so you can interact and manipulate HTML elements
// so when the web page is loaded, setupcanvas is called
function CreateCoordArray() {
    let i = 0, j = 0;
    for (let y = 9; y <= 446; y += 23) {
        for (let x = 11; x <= 265; x += 23) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas'); // gets the canvas element in html using the id
    ctx = canvas.getContext('2d'); // tells the canvas we want 2d surface
    canvas.width = 936;
    canvas.height = 956;
    ctx.scale(2, 2); //scales the coordinate system, x,y 2,2 both are 2 times bigger

    ctx.fillStyle = 'white';// tells us the fill colour
    ctx.fillRect(0, 0, canvas.width, canvas.height); // draws a filled rectangle x,y ,width height

    ctx.fillStyle = 'black'; // fill colour
    ctx.strokeRect(8, 8, 280, 462); //draws the border

    tetrisLogo = new Image(161, 54); // new image object Image(width,height)   aka (x,y)
    tetrisLogo.onload = DrawTetrisLogo; // when the image is loaded call the function
    tetrisLogo.src = "tetris.png"; //the image name

    ctx.fillStyle = 'black'; //back
    ctx.font = '21px Arial';// font
    ctx.fillText("SCORE", 300, 98); // draws text onto canvas 300 wide 98 tall
    ctx.strokeRect(300, 107, 161, 24);
    ctx.fillText(score.toString(), 310, 127); //converts to a string, because rhw ctx.filltext expects a string

    ctx.fillText("LEVEL", 300, 157);
    ctx.strokeRect(300, 171, 161, 24);
    ctx.fillText(level.toString(), 310, 190);

    ctx.fillText("WIN / LOSE", 300, 221);
    ctx.fillText(winOrLose, 310, 261);
    ctx.strokeRect(300, 232, 161, 95);

    ctx.fillText("CONTROLS", 300, 354);
    ctx.strokeRect(300, 366, 161, 104);
    ctx.font = "19px Arial";
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate Left", 310, 462);

    document.addEventListener('keydown', HandleKeyPress); //event handling Listens for key presses, and calls the  function
    CreateTetrominos();
    CreateTetromino();
    CreateCoordArray();
    DrawTetromino();
    GameLoop();


}
function GameLoop() {
    if (winOrLose !== "Game Over") { // note != means not equal, !== means data and the datatype arent equal
        MoveTetrominoDown();
        setTimeout(GameLoop, Math.max(100, 1000 - level * 100)); // prevents speed from going too fast
    }
    }
 

function DrawTetrisLogo() {
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54); //image, the top left corner where the image will be plced in the canvas
    //how big the image will be. - ctx.drawImage(image, x, y, width, height);
}

function DrawTetromino() {
    for (let i = 0; i < curTetromino.length; i++) { //++i or i++ is the same
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyPress(key) {
    if (winOrLose !== "Game Over") { //if not game over...
        if (key.keyCode === 65) { //these a numereic representtions of the keyboard
            direction = DIRECTION.LEFT;
            if (!HittingTheWall() && !CheckForHorizontalCollision()) {
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        } else if (key.keyCode === 68) {
            direction = DIRECTION.RIGHT;
            if (!HittingTheWall() && !CheckForHorizontalCollision()) {
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        } else if (key.keyCode === 83) {
            MoveTetrominoDown();
        } else if (key.keyCode === 69) {
            RotateTetromino();
        }
        else if (key.keyCode === 81) { // Q key gameover
            winOrLose = "Game Over";
            ctx.fillStyle = "white";
            ctx.fillRect(310, 242, 140, 30); //x,y starting points and then width and height of the rectangle
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261); //starting at this coordinate write
        }
        
    }
}

function MoveTetrominoDown() {
    direction = DIRECTION.DOWN;
    if (!CheckForVerticalCollision()) {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

function DeleteTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = "white"; // loops through and deletes covering in white
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function CreateTetrominos() {
    tetrominos.push([[1, 0], [0, 1], [1, 1], [2, 1]]); //push adds to the end of the array
    tetrominos.push([[0, 0], [1, 0], [2, 0], [3, 0]]); // each shape has 4 squares
    tetrominos.push([[0, 0], [0, 1], [1, 1], [2, 1]]); // so its saying place a block in 1,0 , 0,1 etc
    tetrominos.push([[0, 0], [1, 0], [0, 1], [1, 1]]); // each coordinates tells them where to add a block for the shape
    tetrominos.push([[2, 0], [0, 1], [1, 1], [2, 1]]);
    tetrominos.push([[1, 0], [2, 0], [0, 1], [1, 1]]);
    tetrominos.push([[0, 0], [1, 0], [1, 1], [2, 1]]);
}//tetrominos =[]
// defines 7 different tetominos on an array 2d array
//each shape is an array coordinate pairs

function CreateTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length); //Math.random() ➝ generates a number between 0 and 1, floor rounds down length no.of shapes (7)
    // tries to pick a random tetromino
    curTetromino = tetrominos[randomTetromino]; //from the array randomly choosw
    curTetrominoColor = tetrominosColors[randomTetromino]; //the colour
}

function HittingTheWall() {
    for (let i = 0; i < curTetromino.length; i++) { //loops through the current tetromino 2d array
        let newX = curTetromino[i][0] + startX; //
        if (newX <= 0 && direction === DIRECTION.LEFT) return true; //if any block equal the wall (collision), return true
        if (newX >= 11 && direction === DIRECTION.RIGHT) return true;
    }
    //else no collision, return false
    return false;
}

function CheckForVerticalCollision() {
    let collision = false;
    for (let i = 0; i < curTetromino.length; i++) {//loops
        let x = curTetromino[i][0] + startX; // stores absoolute position
        let y = curTetromino[i][1] + startY;

        if (y + 1 >= gBArrayHeight || typeof stoppedShapeArray[x][y + 1] === 'string') {
            collision = true;// checking is the space below the block is occupoied by another shape
            //will the block exceed the bottom of the grid, then a collison has occurred
            break; //break
        }
    }

    if (collision) {// if this collision is true
        if (startY <= 0) { // the coordinate y is the top row, game over 
            winOrLose = "Game Over";
            ctx.fillStyle = "white";
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        } else {
            for (let i = 0; i < curTetromino.length; i++) {
                let x = curTetromino[i][0] + startX;
                let y = curTetromino[i][1] + startY;
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
            CheckForCompletedRows(); //clear full row
            CreateTetromino(); //vchoose next piece
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }

    return collision; //Returns true or false so the game logic knows if it should continue falling or stop.
}

function CheckForHorizontalCollision() {
    for (let i = 0; i < curTetromino.length; i++) { //loops through each block
        let x = curTetromino[i][0] + startX + (direction === DIRECTION.LEFT ? -1 : 1); // tternary operator If moving left ➝ -1 If moving right ➝ +1 
        let y = curTetromino[i][1] + startY; //y stays same this is checking horizontal movement
        if (typeof stoppedShapeArray[x][y] === 'string') return true;
    }// type of operator returns a string  of the data type; if the block has stopped
    return false;
}

function CheckForCompletedRows() {
    let rowsToDelete = 0;
    let startOfDeletion = 0;

    for (let y = 0; y < gBArrayHeight; y++) {//check each row
        let complete = true;
        for (let x = 0; x < gBArrayWidth; x++) { //check each column
            let square = stoppedShapeArray[x][y];  //stopped = ones that have landed
            if (!square) {
                complete = false;
                break;
            }
        }
        if (complete) { //if complete is true
            if (startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for (let i = 0; i < gBArrayWidth; i++) {
                stoppedShapeArray[i][y] = 0; // clear the row in logic arrays
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x; //redraw as white on canvas
                let coorY = coordinateArray[i][y].y;
                ctx.fillStyle = "white";
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }

    if (rowsToDelete > 0) {
        score += 10; //if the number of rows deleted is more than 0, score increases
        if (score % 50 === 0) {
            level++;// every 50 points level up
            ctx.fillStyle = "white";// repainrs white
            ctx.fillRect(310, 173, 140, 19); // clears the original level
            ctx.fillStyle = "black"; // redraws
            ctx.fillText(level.toString(), 310, 190);
        }
        // same for score
        ctx.fillStyle = "white";
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = "black";
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (let i = startOfDeletion - 1; i >= 0; i--) {
        for (let x = 0; x < gBArrayWidth; x++) {
            let y2 = i + rowsToDelete;
            let square = stoppedShapeArray[x][i];
            if (square) {
                stoppedShapeArray[x][y2] = square;
                gameBoardArray[x][y2] = 1;
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = square;
                ctx.fillRect(coorX, coorY, 21, 21);

                stoppedShapeArray[x][i] = 0;
                gameBoardArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = "white";
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function RotateTetromino() {
    let newRotation = [];//empty array to store the now rotated blocks
    let backup = [...curTetromino]; //spread operator  = shallow copy of the current shape

    for (let i = 0; i < curTetromino.length; i++) { //loops through the blocks
        let x = curTetromino[i][0];
        let y = curTetromino[i][1];
        newRotation.push([GetLastSquareX() - y, x]); // adds to the en of the array
    }

    DeleteTetromino(); //deletes current shape, by covering it white
    curTetromino = newRotation;

    if (!HittingTheWall() && !CheckForHorizontalCollision()) {
        DrawTetromino(); //if not hitting wall left or right and notcolliding with other shape, draw new shape
    } else {
        curTetromino = backup;// else, cannot rotate, reassignes the copy of the orginal
        DrawTetromino(); 
    }
}

function GetLastSquareX() {
    return Math.max(...curTetromino.map(t => t[0])); //spread operator curTetromino is an arroay of 4 coordinate pairs
   // .map means  for each block  (t), get the x coodinate (x[0] index)
   //therefore returns all the x coordinates 
   // .max will find the largest number in that
   //spread spreads the array into separate arguemnets

}
