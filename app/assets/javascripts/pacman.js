function Worm(){
  this.eatFood = function(e){
    e.removeClass('rubyzone')
    rubymanCount = parseInt($('#count .rubyman').text()) + 1
    $('#count .rubyman').text(rubymanCount)
    checkCount()
    if ($('#wormfield tr td.rubyzone img').length == 0){
      game.victory()
    }
    
  }

  this.run = function(){
    that.runningWorm = setInterval(go, speed)
    running = 1
  }
  
  this.kill = function () {
    $('#worm')
      .attr('src', blood_source)
      .removeAttr('class').removeAttr('id')
      .parent().removeAttr('class')
    $('#count .rubyman').addClass('died') 
    this.stop() 
    message('Game Over')
    killed = 1
  } 
  this.stop = function(){
    clearInterval(that.runningWorm)
    running = 0
  }   
} // Worm end