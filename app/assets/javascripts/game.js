game = new Game()
  
function Game(){

  this.settings = {
    fieldSize: 25,
    rubiesQuantity: 1,
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
    wormfield.fadeIn()
  } //buildWormField end
  
  this.start = function(){
    this.prepare()
    worm = new Worm('Mr. Pacman')
    meduze = new Enemy('Mr. Meduze')
    counter = new Counter()
  } //start end
  
  this.reset = function(e){ 
    worm.stop()
    meduze.stop()
    game.start()
    counter.reset()
  }// reset end
  
  this.end = function(e){ 
    worm.kill()
    meduze.stop()
  }  

  this.stop = function(){
    worm.stop()
    meduze.stop()
  }
  
  this.wormWins = function(){
    message('Congratulations'+ worm.name + '! You win!')
  }

  this.meduzeWins = function (){
    message('You loose. Try again.')   
  }

  this.equalPointsResult = function(){
    message('You have equal number of points... Try again.') 
  }
}