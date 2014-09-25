function Counter(){
  this.reset = function(){
    $('#count .enemycount, #count .rubyman').removeClass('died')
    $('#count .rubyman').text('0')
    $('#count .enemycount').text('0') 
  }

  this.checkCount = function(){
    if ($('.rubyzone').length == 0){
      game.stop()
      rubymanPoints = $('#count .rubyman').text()
      enemyPoints   = $('#count .enemycount').text()
      if      (enemyPoints >  rubymanPoints ) {game.meduzeWins()        }
      else if (enemyPoints <  rubymanPoints ) {game.wormWins ()         }
      else if (enemyPoints == rubymanPoints ) {game.equalPointsResult() }
    }
  }

  this.wormEats = function(){
    rubymanCount = parseInt($('#count .rubyman').text()) + 1
    $('#count .rubyman').text(rubymanCount)
  }

  this.meduzeEats = function(){
    enemyCount = parseInt($('#count .enemycount').text()) + 1
    $('#count .enemycount').text(enemyCount)
  }
}

// выводит сообщения в левой парели
function message(x){
  $('.attention').fadeIn('slow')
  $('.attention .content h1').text(x)
}

//  определяет координаты ячейки, переданной в z
function myXY(z) { 
  return {'x': z.attr('id'), 'y': z.parent().attr('id')}
}