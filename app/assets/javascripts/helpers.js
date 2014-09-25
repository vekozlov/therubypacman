function checkCount(){
  if ($('.rubyzone').length == 0){
    worm.stop()
    superenemy.stop()
    rubymanPoints = $('#count .rubyman').text()
    enemyPoints   = $('#count .enemycount').text()
    if      (enemyPoints >  rubymanPoints ) {message('You loose. Try again.')                         }
    else if (enemyPoints <  rubymanPoints ) {message('Congratulations! You win!')                     }
    else if (enemyPoints == rubymanPoints ) {message('You have equal number of points... Try again.') }
  }

}

function countReset(){ 
  $('#count .rubyman').text('0')
  $('#count .enemycount').text('0')  
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