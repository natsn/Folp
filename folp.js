/*
  Folp
  A minimalist puzzle game

  INSTRUCTIONS
  Use arrow keys to color squares in different directions. If you make 10
  matches you win. If you get stuck you lose. The next three square colors are
  on deck. Use this knowledge to plan you next moves. Enjoy the 6x6 grid!

*/

function randPos(){
  return [Math.floor(Math.random()*100)%6,
          Math.floor(Math.random()*100)%6];
}
function randVal(){
  return (Math.floor(Math.random()*100)%3)+1;
}

var GridModel = Backbone.Model.extend({
  defaults:{
    deck:[],
    grid:[[0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0]],
    position:[],
    score:0,
    scores:[]
  },
  initialize: function(){
    this.set('position', randPos());
    this.get('grid')[this.get('position')[0]][this.get('position')[1]] = randVal(); // why does this work?
    this.set('deck',[randVal(),randVal(),randVal()]);
  }
});
      
var GridGameView = Backbone.View.extend({
  el:'#game',
  template: Handlebars.compile($('#folp').html()),
  initialize: function(){
    _.bindAll(this,'keyAction');
    $(document).bind('keydown', this.keyAction);
  },
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  keyAction: function(e){
    if(this.positionsAvailable()==0){
      console.log(this.model.get('score')+':'+new Date());
      this.model.set('scores',[{score:this.model.get('score')}].concat(this.model.get('scores')));
      this.reset();
      this.render()
    }
    var code = e.keyCode || e.which;
    var target = [];
    var x = this.model.get('position')[0],
        y = this.model.get('position')[1];
    if(code===38) target = [x-1,y];
    if(code===40) target = [x+1,y];
    if(code===39) target = [x,y+1];
    if(code===37) target = [x,y-1];
    if(this.validPosition(target)){
      var val = this.nextVal();
      this.model.set('position',target);
      var g = _.clone(this.model.get('grid'));
      g[target[0]][target[1]] = val;
      this.model.set('grid', g);
      if(this.madeMatch(target)){
        this.floodFill(this.model.get('grid'), target[1], target[0], null, 0);
        g[target[0]][target[1]] = val;
        this.model.set('grid', g);
      }
      this.render();
    }
  },
  contains: function(array,stuff){
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < stuff.length; j++) {
        if(array[i]==stuff[j]) return true;
      }
    }
    return false;
  },
  validPosition: function(p){
    var available = this.positionsAvailable()
    for (var i = 0; i < available.length; i++) {
      if(available[i][0]==p[0]&&available[i][1]==p[1]) return true;
    }
    return false
  },
  positionsAvailable: function(){
    // Returns and array of valid position arrays
    var y = this.model.get('position')[0],
        x = this.model.get('position')[1],
        self = this;
    return [[y,x+1],
            [y,x-1],
            [y+1,x],
            [y-1,x]].filter(function(p){
              return !self.contains(p,[-1,6])
               && self.model.get('grid')[p[0]][p[1]]===0; 
            });
  },
  movesAvailable: function(){
    // Returns an array of possible valid keycodes
    var self = this;
    return this.positionsAvailable().map(function(coord){
      var y = self.model.get('position')[0],
          x = self.model.get('position')[1],
          cy = coord[0],
          cx = coord[1];
      if(y-1==cy) return 38;
      if(y+1==cy) return 40;
      if(x-1==cx) return 37;
      if(x+1==cx) return 39;
    });
  },
  nextVal: function(){
    // dequeue color and enqueue random one.
    var curr = this.model.get('deck')[0];
    var d1 = this.model.get('deck')[1];
    var d2 = this.model.get('deck')[2];
    this.model.set('deck',[d1,d2,randVal()]);
    return curr;
  },
  adjDups: function(position){
    var y = position[0];
    var x = position[1];
    var self = this;
    return [[y,x+1],[y,x-1],[y+1,x],[y-1,x]].filter(
          function(p){
            return !self.contains(p,[-1,6]) && 
            self.model.get('grid')[p[0]][p[1]]==
            self.model.get('grid')[y][x];
          });
  },
  coordIn: function(array, coord){
    for (var i = 0; i < array.length; i++) {
      if(array[i][0]==coord[0] && array[i][1]==coord[1]) return true;
    }
    return false;
  },
  madeMatch: function(start){
    
    var l0 = this.adjDups(start);
    if(l0.length>=2) return true;

    var treasure = [start];
    for (var i = 0; i < l0.length; i++) {
      if(!this.coordIn(treasure, l0[i])) treasure.push(l0[i]);
      var search_set = this.adjDups(l0[i]);
      for (var k = 0; k < search_set.length; k++) {
        if(!this.coordIn(treasure, search_set[k])) treasure.push(search_set[k]);
      }
      search_set = []
    }

    return treasure.slice(1,treasure.length).length>=2;
  },
  floodFill: function(mapData, x, y, oldVal, newVal){
    this.model.set('score',this.model.get('score')+1);
    var mapWidth = mapData.length,
        mapHeight = mapData[0].length;

    if(oldVal == null) oldVal = mapData[y][x];
    if(mapData[y][x] !== oldVal) return true;

    mapData[y][x] = newVal;

    if(x > 0) this.floodFill(mapData, x-1, y, oldVal, newVal); // left
    if(y > 0) this.floodFill(mapData, x, y-1, oldVal, newVal); // up
    if(x < mapWidth-1)  this.floodFill(mapData, x+1, y, oldVal, newVal); // right
    if(y < mapHeight-1) this.floodFill(mapData, x, y+1, oldVal, newVal); // down
  },
  reset: function(){
    var g1 = this.model.get('grid');
    this.model.set('position', randPos());
    var p = this.model.get('position');
    var g2 = g1.map(function(r){return [0,0,0,0,0,0];});
    g2[p[0]][p[1]] = randVal();
    this.model.set('grid', g2);
    this.model.set('score', 0);
    this.model.set('deck',[randVal(),randVal(),randVal()]);
  }
});

Handlebars.registerHelper('first', function(context, every, options) {
  var fn = options.fn, inverse = options.inverse;
  
  return ret;
});

var grid = new GridModel();
var game = new GridGameView({model: grid});
game.listenTo(grid, 'change', game.render);

game.render();