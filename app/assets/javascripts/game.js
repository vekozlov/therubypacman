game = new Game()
  
function Game(){

  this.settings = {
    fieldSize: 25,
    rubiesQuantity: 145,
    bombsQuantity: 5
  }

  this.prepare = function(){
    game.buildWormField(this.settings.fieldSize) 
    game.populate(this.settings.fieldSize)
    enableButtons()  
    directions = ['up','down', 'left','right']; 
    } // prepare end
   
  this.populate = function (e){
    startCell = $('table#wormfield tr:first td:first').addClass('selected')
    rotation = 'up' 
    worm = '<img class=\''+rotation+'\' src=\''+ pacman_source() +'\' id=\'worm\'>'
    bomb = '<img class=\"bomb\"         src=\''+bomb_source()+'\'>' 
    ruby = '<img class=\"ruby\"      src=\''+ruby_source()+'\'>'
    startCell.html(worm)
    
    deadZones = []
    for (i = 0; i < this.settings.bombsQuantity; i++) { 
      randomX = Math.floor(Math.random() * (this.settings.fieldSize - 1 + 1))
      randomY = Math.floor(Math.random() * (this.settings.fieldSize - 1 + 1))
      deadZone = $('table#wormfield tr:eq('+ randomY +') td:eq('+ randomX +')').addClass('deadzone')
      deadZone.html(bomb)  
      deadZones.push(deadZone)}
      
    rubyZones = []
    for (i = 0; i < this.settings.rubiesQuantity; i++) { 
      randomX = Math.floor(Math.random() * (this.settings.fieldSize - 1 + 1)) + 1
      randomY = Math.floor(Math.random() * (this.settings.fieldSize - 1 + 1)) + 1
      rubyZone = $('table#wormfield tr:eq('+ randomY +') td:eq('+ randomX +')')
      // проверка на склеивание зон - если в зоне есть бомба - не ставить туда рубины
      if (!rubyZone.hasClass('deadzone')){
        rubyZone.addClass('rubyzone');
        rubyZone.html(ruby)
        rubyZones.push(rubyZone)
      }
    }
    
    outLineMin = - 1
    outLineMax = e
    lastId = e - 1
   } // populate end

  this.buildWormField = function (e){ 
    wormfield = $('table#wormfield')
    $('#wormfield tr').remove() 
    td =''
    for (i = 0; i < e; i++) {
     td += '<td id=\'' + i + '\'></td>'}  
     
    for (i = 0; i < e; i++) {
      wormfield.append('<tr id=\'' + i + '\'>' + td +'</tr>')}
    wormfield.hide()
  } //buildWormField end
  
  this.start = function(){
    this.prepare()
    wormfield.fadeIn()
    worm = new Worm()
    createCleverEnemy()
    counterReset()
  } //start end
  
  this.reset = function(e){ 
     worm.stop()
     superenemy.stop()
     game.start()    
  }// reset end
  
  this.end = function(e){ 
    worm.kill()
  }  
  
  this.victory = function(){
    message('Congratulations! You win!')
    worm.stop()
  }
}

function pacmanFaceTheEnemy(){
  superenemy.dies()
  worm.kill()
}