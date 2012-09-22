// Place all the styles related to the bomber controller here.
// They will automatically be included in application.css.
// You can use Sass (SCSS) here: http://sass-lang.com/

// Constantes du jeu
var NBR_LINES = 20;
var NBR_BOX_PER_LINE = 20;
var MAP_SIZE = 400;
var BOX_SIZE = 25;

// Variables
var boxTab; // Tab with all walls box in
var context; // ctx
var loop; // infinite refresh return
var x;
var y;


// Wall Variables
var breakableWall;
var unBreakableWall;
WALL_COLORS = ["#EBEBEB", "#362F2D", "#A67C52", "#4285F4"];

// Players tab posX/posY
PLAYER_ONE = [0, 0, 1, 1];


// Bomb variables
BOMB_COLOR = ["#DA4336"];

window.addEventListener('load', function () {

    var elem = document.getElementById('bomberMan');
    if (!elem || !elem.getContext) {
	return;
    }
    
    context = elem.getContext('2d');
    if (!context) {
	return;
    }

    // Setting primary wall unbreakables as breakable walls
    setMap(context, NBR_LINES, NBR_BOX_PER_LINE, BOX_SIZE);

    // Infinite refresh on map to see players mooves and bomb explose
    loop = setInterval(refreshMyGame, 10);

    // get keyboard actions
    window.document.onkeydown = checkMoves;

}, false);

function placeBomb() 
{
    if (PLAYER_ONE[2] > 0)
    {
    var posX = PLAYER_ONE[0];
    var posY = PLAYER_ONE[1];
    boxTab[posY][posX] = 3;
    PLAYER_ONE[2]-= 1;
    setTimeout(function()
        {
        exploseBomb(posY,posX);
        }, 3000);
    }

}

function exploseBomb(posY, posX) 
{
    var explosionSize = PLAYER_ONE[3]
    boxTab[posY][posX] = 0;
    // we check if it's not a border
    if (posY>0 && posX>0 && posY<19 && posX<19)
    {
        if (boxTab[posY+explosionSize][posX] == 2)
        {
            boxTab[posY+explosionSize][posX] = 0;
        }
        if (boxTab[posY-explosionSize][posX] == 2)
        {
            boxTab[posY-explosionSize][posX] = 0;
        }
        if (boxTab[posY][posX+explosionSize] == 2)
        {
            boxTab[posY][posX+explosionSize] = 0;
        }
        if (boxTab[posY][posX-explosionSize] == 2)
        {
            boxTab[posY][posX-explosionSize] = 0;
        }
    }
    else if (posY == 0 || posX == 0 || posX == 19 || posY == 19)
    {
        if (posX != 19)
        {
            if (boxTab[posY][posX+explosionSize] == 2)
            {
                boxTab[posY][posX+explosionSize] = 0;        
            }
        }
        if (posY != 19)
        {
            if (boxTab[posY+explosionSize][posX] == 2)
            {
                boxTab[posY+explosionSize][posX] = 0;
            }
        }
        if (posX != 0)
        {
            if (boxTab[posY][posX-explosionSize] == 2)
            {
                boxTab[posY][posX-explosionSize] = 0;
            }
        }
        if (posY != 0)
        {
            if (boxTab[posY-explosionSize][posX] == 2)
            {
                boxTab[posY-explosionSize][posX] = 0;
            }
        }
    }
    PLAYER_ONE[2]+= 1;
}


// function setBomb()
// {
//     var bomb;
  
//     this.sayHello = function()
//     {
// 	alert("Bonjour "+ this.bomb);
//     }

//     this.bomb = "Thibault";
// }
 

// function placeBomb()
// {
//     if(placebomb && player.bombs != 0){
//         map[player.Y][player.X].object = 2;
//         bombX = player.X; bombY = player.Y;
//         placebomb = false;
//         player.bombs--;
//         setTimeout(explode, 3000);
//     }
// }

// function explode(){
//     alert('BOOM!');
//     delete map[bombY][bombX].object;
//     player.bombs++;
// }





// We set primary walls on the map
function setMap(ctx, nbrLines, nbrPerLine, boxSize) {

    // Setting boxTab that will contains all walls
    boxTab = new Array(nbrLines);
    for (var i=0; i < nbrLines; i++) {
	boxTab[i] = new Array(nbrPerLine);
	ctx.fillStyle = WALL_COLORS[0];
	for (var j=0; j < nbrPerLine; j++) {
	    // We print box depending on x / y pos
	    ctx.fillRect((j * boxSize), (i * boxSize), boxSize, boxSize);
	    // We set box to 0 to all box to say its a normal free box
	    boxTab[i][j] = 0; 
	}
    }


    // set breakable walls
    breakableWall = 0;
    unBreakableWall = 0;
    while (breakableWall < 200)
    {
	x = Math.floor((Math.random() * NBR_LINES));
	y = Math.floor((Math.random() * NBR_LINES));
	if ((x > 0)&&(x < MAP_SIZE)&&(y > 0)&&(y < MAP_SIZE))
	{
	    if (boxTab[x][y] == 0)
	    {
		boxTab[x][y] = 2;
	    	ctx.fillStyle = WALL_COLORS[2];
	    	ctx.fillRect((x * boxSize), (y * boxSize), boxSize, boxSize);
		breakableWall += 1;
	    }
	}
    }

    // set unbreakable walls
    unBreakableWall = 0;
    while (unBreakableWall < 100)
    {
	x = Math.floor((Math.random() * NBR_LINES));
	y = Math.floor((Math.random() * NBR_LINES));
	if ((boxTab[x][y] == 0)&&(boxTab[x][y] != 2))
	{
	    boxTab[x][y] = 1;
	    ctx.fillStyle = WALL_COLORS[1];
	    ctx.fillRect((x * boxSize), (y * boxSize), boxSize, boxSize);
	    unBreakableWall += 1;
	}
    }
   
    //Set safe border
    for (var i=0; i < nbrLines; i++) {
    	for (var j=0; j < nbrPerLine; j++) {
    	    if ((i == 0) || (j == 0) || (i == 19) || (j == 19))
    	    {
    		boxTab[i][j] = 0; 
    		ctx.fillStyle = WALL_COLORS[0];
    		ctx.fillRect((j * boxSize), (i * boxSize), boxSize, boxSize);
    	    }
    	}
    }
    return (1);
}


function refreshMyGame() {

    var ctx = context;
    // We clear before we print again
    clearContexte(context, 0, NBR_BOX_PER_LINE, 0, NBR_LINES);

    // We print map after refreshing div to clear
    for (var i=0; i < NBR_LINES; i++) {
    	for (var j=0; j < NBR_BOX_PER_LINE; j++) {
    	    if ((boxTab[i][j] == 0))
    	    {
    		ctx.fillStyle = WALL_COLORS[0];
    		ctx.fillRect((j * BOX_SIZE), (i * BOX_SIZE), BOX_SIZE, BOX_SIZE);
    	    }
    	    else if ((boxTab[i][j] == 1))
    	    {
    		ctx.fillStyle = WALL_COLORS[1];
    		ctx.fillRect((j * BOX_SIZE), (i * BOX_SIZE), BOX_SIZE, BOX_SIZE);
    	    }
    	    else if ((boxTab[i][j] == 2))
    	    {
    		ctx.fillStyle = WALL_COLORS[2];
    		ctx.fillRect((j * BOX_SIZE), (i * BOX_SIZE), BOX_SIZE, BOX_SIZE);
    	    }
            else if ((boxTab[i][j] == 3))
            {
            ctx.fillStyle = BOMB_COLOR[0];
            ctx.fillRect((j * BOX_SIZE), (i * BOX_SIZE), BOX_SIZE, BOX_SIZE);
            }
    	}
    }


    // Set player one pos
    ctx.fillStyle = WALL_COLORS[3];
    ctx.fillRect((PLAYER_ONE[0] * BOX_SIZE), (PLAYER_ONE[1] * BOX_SIZE), BOX_SIZE, BOX_SIZE);

}


function checkMoves(e) {


    // var bombing = new setBomb();  
    // bombing.sayHello();

    var x = PLAYER_ONE[0];
    var y = PLAYER_ONE[1];

    // right direction key is pressed
    if (e.keyCode == 39)
    {
	if ((x < 19)&&(boxTab[y][x + 1] == 0))
	    PLAYER_ONE[0] += 1;
    }
    // left direction key is pressed
    else if (e.keyCode == 37) 
    {
	if ((x > 0)&&(boxTab[y][x - 1]) == 0) 
	    PLAYER_ONE[0] -= 1;
    }
    // down direction key is pressed
    if (e.keyCode == 40)
    {
	if ((y < 19)&&(boxTab[y + 1][x] == 0))
	    PLAYER_ONE[1] += 1;
    }
    // up direction key is pressed
    if (e.keyCode == 38)
    {
	if ((y > 0 )&&(boxTab[y - 1][x] == 0))
	    PLAYER_ONE[1] -= 1;
    }
    //space key is pressed
    if ((e.keyCode == 32) && (boxTab[y][x] == 0))
    {
        var placebomb = new placeBomb();
    }
}
