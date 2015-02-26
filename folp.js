/*
  Folp
  A minimalist puzzle game

  INSTRUCTIONS
  Use arrow keys to color squares in different directions. If you make 10
  matches you win. If you get stuck you lose. The next three square colors are
  on deck. Use this knowledge to plan you next moves.

*/

var grid = [];
var available_positions = [];
var current_position = [];
var colors_on_deck = [];
var score = 0;

function randInt(end){
  return Math.floor(Math.random()*100) % end;
}

function randColor(){
  // return 1, 2 or 3
  return (Math.floor(Math.random()*100)%3)+1;
}

function nextColor(){
  // dequeue color and enqueue random one.
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
  setAvailableMoves();
}
function setAvailableMoves(){
  available_positions = movesAvailable();
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

function adjDups(curr_pos){
  var y = curr_pos[0];
  var x = curr_pos[1];
  return [[y,x+1],[y,x-1],[y+1,x],[y-1,x]].filter(
    function(p){
      // only if it does not contain -1 or 6
      // and the grid spot color matches
      return !contains(p,[-1,6]) && grid[p[0]][p[1]]==grid[y][x];
    });
}

function toKey(coord){
  // Compares the current position to the coordinant and returns the direction
  // up - 38
  // right - 39
  // left - 37
  // down - 40
  var y = current_position[0];
  var x = current_position[1];
  var cy = coord[0];
  var cx = coord[1];
  if(y-1==cy){
    return 38;
  }
  if(y+1==cy){
    return 40;
  }
  if(x-1==cx){
    return 37;
  }
  if(x+1==cx){
    return 39;
  }
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
  console.log('Colors on deck: '+colors_on_deck+'\n')
  var rendition = '\n';
  for (var i = 0; i < a_grid.length; i++) {
    var row = a_grid[i];
    for (var j = 0; j < row.length; j++) {
      rendition+=row[j]+' ';
    }
    rendition+='\n';
  }
  rendition+='current_position = '+current_position+'\n'
  rendition+='available_moves = '+available_positions.map(toKey)+'\n'
  rendition+='available_positions = '+available_positions+'\n'

  console.log(rendition);
}

function copy2d(arr2d){
  var out = []
  for (var i = 0; i < arr2d.length; i++) {
      out.push(arr2d[i].slice());
  }
  return out;
}

function annGrid(annotations){
  var copy = copy2d(grid);
  for (var i = 0; i < annotations.length; i++) {
    var y = annotations[i][0];
    var x = annotations[i][1];
    copy[y][x]='X';
  }
  return copy;
}

function stuck(){
  if(available_positions.length==0)
    console.log('YOU ARE STUCK!');
}

function move(keyCode){
  var available_moves = available_positions.map(toKey);
  if(contains(available_moves,[keyCode])){
    var pos = available_positions[_.indexOf(available_moves, keyCode)];
    current_position = pos;
    grid[pos[0]][pos[1]] = nextColor();
    setAvailableMoves();
  } 

  // TODO: check if match, remove from grid
  // TODO: check if win
  stuck();
  drawGrid(grid);
}

initGrid();
setAvailableMoves();
drawGrid(grid);