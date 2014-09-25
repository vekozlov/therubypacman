game = new Game()
  
function Game(){

  this.settings = {
    fieldSize: 25,
    rubiesQuantity: 5,
    bombsQuantity: 15
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
    ruby = '<img class=\"rubyzone\"      src=\''+ruby_source()+'\'>'
    startCell.html(worm)
    
    deadZones = []
    for (i = 0; i < this.settings.bombsQuantity; i++) { 
      randomX = Math.floor(Math.random() * (this.settings.fieldSize - 1 + 1)) + 1
      randomY = Math.floor(Math.random() * (this.settings.fieldSize - 1 + 1)) + 1
      deadZone = $('table#wormfield tr:eq('+ randomY +') td:eq('+ randomX +')').addClass('deadzone')
      deadZone.html(bomb)  
      deadZones.push(deadZone)}
      
    rubyZones = []
    for (i = 0; i < this.settings.rubiesQuantity; i++) { 
      randomX = Math.floor(Math.random() * (this.settings.fieldSize - 1 + 1)) + 1
      randomY = Math.floor(Math.random() * (this.settings.fieldSize - 1 + 1)) + 1
      rubyZone = $('table#wormfield tr:eq('+ randomY +') td:eq('+ randomX +')')
      if (!rubyZone.hasClass('deadzone')){ rubyZone.addClass('rubyzone') }
      rubyZone.html(ruby)
      rubyZones.push(rubyZones)
    }
    
    // проверка на склеивание зон - если одна и та же клетка имеет класс как еда и бомба
    // оставить что-то одно
    $('td.rubyzone.deadzone').removeClass('deadzone')
    
    outLineMin = - 1
    outLineMax = e
    lastId = e - 1
    running = 0
    worm = new Worm()
   } // populate end

  this.buildWormField = function (e){ 
    td =''
    for (i = 0; i < e; i++) {
     td += '<td id=\'' + i + '\'></td>'}  
     
    for (i = 0; i < e; i++) {
      $('table#wormfield').append('<tr id=\'' + i + '\'>' + td +'</tr>')}
      
    wormfield = $('table#wormfield') 
    wormfield.hide()
  } //buildWormField end
  
  this.start = function(){
    this.prepare()
    wormfield.fadeIn() 
    createCleverEnemy() 
    $('#count .rubyman').removeClass('died') 
    countReset()
  } //start end
  
  this.reset = function(e){ 
     worm.stop()
     superenemy.stop()
     $('#wormfield tr').remove() 
     game.prepare(this.settings.fieldSize) 
     enemyKilled = 0
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

// function go(){  

//   thisCell = $('table#wormfield td.selected').removeClass('selected myshift').addClass('myshift') 
//   $('td.myshift').removeClass('myshift').children('img').attr('id','').attr('direction','').fadeOut(1000).queue(function(){
//     $(this).remove() 
//   }) 
//   thisCellXY = myXY(thisCell)
  
//   newX = parseInt(thisCellXY.x) + parseInt(step.x)
//   newY = parseInt(thisCellXY.y) + parseInt(step.y)

//   if (newX == outLineMax){newX = 0} else if (newX == outLineMin){newX = lastId}
//   if (newY == outLineMax){newY = 0} else if (newY == outLineMin){newY = lastId}

//   nextCell = $('table#wormfield tr:eq(' + newY + ') td:eq(' + newX + ')').addClass('selected').removeClass('myshift').html('<img src=\''+pacman_source()+'\' id=\'worm\' class=\''+rotation+'\'>') 

//   if       (nextCell.hasClass('deadzone')){game.end()}
//   else if  (nextCell.hasClass('rubyzone')){worm.eatFood(nextCell)}
//   else if  (nextCell.hasClass('enemy'))   {pacmanFaceTheEnemy()}
// }

function pacmanFaceTheEnemy(){
  superenemy.dies()
  worm.kill()
}

//  определяет координаты ячейки, переданной в z
function myXY(z) { 
  return {'x': z.attr('id'), 'y': z.parent().attr('id')}
}