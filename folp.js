/*
  Folp
  A minimalist puzzle game

  INSTRUCTIONS
  Use arrow keys to color squares in different directions. If you make 10
  matches you win. If you get stuck you lose. The next three square colors are
  on deck. Use this knowledge to plan you next moves.

*/

var grid = [];
var available_moves = [];
var current_position = [];
var colors_on_deck = [];

function randInt(end){
  return Math.floor(Math.random()*100) % end;
}

function randColor(){
  // return 1, 2 or 3
  return (Math.floor(Math.random()*100)%3)+1;
}

function nextColor(){
  var curr = colors_on_deck[0];
  colors_on_deck[0] = colors_on_deck[1];
  colors_on_deck[1] = colors_on_deck[2];
  colors_on_deck[2] = randColor();
  return curr;
}

function initGrid(){
  grid = [];
  for (var i = 0; i < 6; i++) {
    grid.push([0,0,0,0,0,0]);
  }
  var y = randInt(6);
  var x = randInt(6);
  grid[y][x] = randColor();
  current_position = [y,x];
  colors_on_deck = [randColor(),randColor(),randColor()];
}

function movesAvailable(){
  var y = current_position[0];
  var x = current_position[1];
  return [[y,x+1],
          [y,x-1],
          [y+1,x],
          [y-1,x]].filter(function(p){
            // only if it does not contain -1 or 6
            // and the grid spot is free
            return !contains(p,[-1,6]) && grid[p[0]][p[1]]==0; 
          });
}
function contains(array,stuff){
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < stuff.length; j++) {
      if(array[i]==stuff[j]) return true;
    }
  }
  return false;
}

function drawGrid(a_grid){
  var rendition = '\n';
  for (var i = 0; i < a_grid.length; i++) {
    var row = a_grid[i];
    for (var j = 0; j < row.length; j++) {
      rendition+=row[j]+' ';
    }
    rendition+='\n';
  }
  console.log(rendition);
}

function make2dArrayCopy(array_to_copy){
  var out = []
  for (var i = 0; i < array_to_copy.length; i++) {
      out.push(array_to_copy[i].slice());
  }
  return out;
}

function annGrid(annotations){
  var copy = make2dArrayCopy(grid);
  for (var i = 0; i < annotations.length; i++) {
    var y = annotations[i][0];
    var x = annotations[i][1];
    copy[y][x]='X';
  }
  return copy;
}

initGrid();
console.log('original grid-->');
drawGrid(grid);
console.log('annotated grid-->');
drawGrid(annGrid(movesAvailable()));
console.log('original grid-->');
drawGrid(grid);
