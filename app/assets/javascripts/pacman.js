function Worm(name){
  that = this
  this.name = name

  this.settings = {
    speed: 200
  }

  this.status = {
    running: 0,
    killed: 0
  }

  this.eatFood = function(e){
    e.removeClass('rubyzone')
    counter.wormEats()
    counter.checkCount()
  }

  this.go = function (){  
    if (this.status.killed == 1){return false}
      
    thisCell = $('table#wormfield td.selected').removeClass('selected myshift').addClass('myshift') 
    $('td.myshift').removeClass('myshift').children('img').attr('id','').attr('direction','').fadeOut(1000).queue(function(){
      $(this).remove() 
    }) 
    thisCellXY = myXY(thisCell)
    
    newX = parseInt(thisCellXY.x) + parseInt(step.x)
    newY = parseInt(thisCellXY.y) + parseInt(step.y)

    if (newX == outLineMax){newX = 0} else if (newX == outLineMin){newX = lastId}
    if (newY == outLineMax){newY = 0} else if (newY == outLineMin){newY = lastId}

    nextCell = $('table#wormfield tr:eq(' + newY + ') td:eq(' + newX + ')').addClass('selected').removeClass('myshift').html('<img src=\''+pacman_source()+'\' id=\'worm\' class=\''+rotation+'\'>') 

    if       (nextCell.hasClass('deadzone')){game.end()}
    else if  (nextCell.hasClass('rubyzone')){worm.eatFood(nextCell)}
    else if  (nextCell.hasClass('enemy'))   {worm.pacmanFaceTheEnemy()}
  }

  this.run = function(){
    this.runningWorm = setInterval(this.go, this.settings.speed)
    this.status.running = 1
  }
  
  this.kill = function () {
    $('#worm')
      .attr('src', blood_source)
      .removeAttr('class').removeAttr('id')
      .parent().removeAttr('class')
    $('#count .rubyman').addClass('died') 
    this.stop() 
    message('Game Over')
    this.status.killed = 1
  } 
  this.stop = function(){
    clearInterval(this.runningWorm)
    this.status.running = 0
  } 

  this.pacmanFaceTheEnemy = function(){
    meduze.dies()
    worm.kill()
  }  
} // Worm end