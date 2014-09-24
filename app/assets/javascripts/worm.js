$(document).ready(function(){ 

  fieldSize = 25
  rubiesQuantity = 45
  bombsQuantity = 35
  game.prepare(fieldSize) 
  enemyRuns = 0
  killed = 0
  speed = 200
})  

function enableButtons(e){
  $("body").keypress(function (e) { 
    //listening to WSAD buttons and changing moving direction, rotation 
    if (e.which == 119)  { step = {'x' : 0, 'y' : -1}; run = 1; rotation = 'up' }
    else if (e.which == 115) { step = {'x' : 0, 'y' : 1}; run = 1;  rotation = 'down' }
    else if (e.which == 97) { step = {'x' : -1, 'y' : 0}; run = 1;  rotation = 'left' }
    else if (e.which == 100) { step = {'x' : 1, 'y' : 0}; run = 1; rotation = 'right' }  
    else { step = {'x' : 0, 'y' : 0} }  
    //to start the worm only when WSAD buttons are pressed.
    if(run == 1){
      running == 0 ? worm.run() : {}
      running = 1 
      //if worm dies buttons are being disabled
      if (killed != 1){
//        go()
      } 
    }
  }); 
} // enable buttons end

 
function enableActions(){  
  $('a').click(function(){
    m = $(this).attr('id')
    switch(m){
      case'theworm':game.start()
      break
      case'reset':game.reset()
      break
      case'end':game.end()
      break
    }})    
} // enable actions end
 
function go(){  

  thisCell = $('table#wormfield td.selected').removeClass('selected myshift').addClass('myshift') 
  $('td.myshift').removeClass('myshift').children('img').attr('id','').attr('direction','').fadeOut(1000).queue(function(){
    $(this).remove() 
  }) 
  thisCellXY = myXY(thisCell)
  
  newX = parseInt(thisCellXY.x) + parseInt(step.x)
    if (newX  == outLineMax){newX = 0} else if (newX == outLineMin){newX = lastId}
  newY = parseInt(thisCellXY.y) + parseInt(step.y)
    if (newY == outLineMax){newY = 0} else if (newY == outLineMin){newY = lastId}
  nextCell = $('table#wormfield tr:eq(' + newY + ') td:eq(' + newX + ')').addClass('selected').removeClass('myshift').html('<img src=\'assets/pacman.png\' id=\'worm\' class=\''+rotation+'\'>') 
//////  nextCellclass = $('table#wormfield tr:eq(' + newY + ') td:eq(' + newX + ')')
 
   if (nextCell.hasClass('deadzone')){game.end()}
   else if (nextCell.hasClass('foodzone')){
     worm.eatFood(nextCell)
   } 
   // если игрок сталкивается с врагом, они оба погибают
  else if (nextCell.hasClass('enemy')){superenemy.dies(); worm.kill()} 
}  


//========================================================================
//  Игра и ее основные функции 
//========================================================================


game = new Game()
  
function Game(){

  this.prepare = function(e){ 
     fieldSize = e
    game.buildWormField(fieldSize) 
    game.populate(fieldSize)
    enableButtons()  
    enableActions()
    $('div.attention').hide()
    directions = ['up','down', 'left','right']; 
    } // prepare end
   
  this.populate = function (e){
    startCell = $('table#wormfield tr:first td:first').addClass('selected')
    rotation = 'up' 
    worm = '<img src=\'assets/pacman.png\' id=\'worm\' class=\''+rotation+'\'>'
    bomb = '<img class=\"bomb\" src=\'assets/bomb.png\'>' 
    food = '<img class=\"chicken\"  src=\'assets/ruby4.png\'>'
    startCell.html(worm)
    
    deadZones = []
    for (i = 0; i < bombsQuantity; i++) { 
      randomX = Math.floor(Math.random() * (fieldSize - 1 + 1)) + 1
      randomY = Math.floor(Math.random() * (fieldSize - 1 + 1)) + 1
      deadZone = $('table#wormfield tr:eq('+ randomY +') td:eq('+ randomX +')').addClass('deadzone')
      deadZone.html(bomb)  
      deadZones.push(deadZone)}
      
    foodZones = [] 
    for (i = 0; i < rubiesQuantity; i++) { 
      randomX = Math.floor(Math.random() * (fieldSize - 1 + 1)) + 1
      randomY = Math.floor(Math.random() * (fieldSize - 1 + 1)) + 1
      foodZone = $('table#wormfield tr:eq('+ randomY +') td:eq('+ randomX +')').addClass('foodzone')
      foodZone.html(food)
      foodZones.push(foodZones)}
    
    // проверка на склеивание зон - если одна и та же клетка имеет класс как еда и бомба
    // оставить что-то одно
    $('td.foodzone.deadzone').removeClass('deadzone')
    
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
    wormfield.fadeIn() 
    killed = 0
    createCleverEnemy() 
    $('#count .rubyman').removeClass('died') 
    countReset()
  } //start end
  
  this.reset = function(e){ 
     worm.stop()
     $('#wormfield tr').remove() 
     game.prepare(fieldSize) 
     enemyRuns = 0
     enemyKilled = 0
     superenemy.stop()
     game.start()    
  } // reset end
  
  this.end = function(e){ 
    worm.kill()
  }  
  
  this.victory = function(){
    message('Congratulations! You win!')
    worm.stop()
  }
}


//========================================================================
//  Пакман 
//========================================================================


function Worm(){

  this.eatFood = function(e){
    e.removeClass('foodzone')
    rubymanCount = parseInt($('#count .rubyman').text()) + 1
    $('#count .rubyman').text(rubymanCount)
    checkCount()
    if ($('#wormfield tr td.foodzone img').length == 0){
      game.victory()
    }
    
  }

  this.run = function(){
    runningWorm = setInterval(go, speed)
    running = 1
  }
  
  this.kill = function () {
    $('#worm')
      .attr('src','assets/blood.png')
      .removeAttr('class').removeAttr('id')
      .parent().removeAttr('class')
    $('#count .rubyman').addClass('died') 
    this.stop() 
    message('Game Over')
    killed = 1
  } 
  this.stop = function(){
    clearInterval(runningWorm)
    running = 0
  }   
} // Worm end


//========================================================================
//  Умный враг
//  а. двигается
//  б. уклоняется от мин
//  в. ест рубины 
//  г. целенаправленно идет к рубинам (в планах)
//========================================================================

function createCleverEnemy(){
 
  function Enemy(name){
    
    that = this
    
    //создать врага на поле
    this.create = function(){ 
      enemy = '<img class=\"enemy\" src=\'assets/meduze.png\' direction=\'up\'>' 
      randomX = Math.floor(Math.random() * (fieldSize - 1 + 1)) + 1
      randomY = Math.floor(Math.random() * (fieldSize - 1 + 1)) + 1
      enemyPlace = $('table#wormfield tr:eq('+ randomY +') td:eq('+ randomX +')').addClass('enemy').html(enemy) 
      if (enemyRuns < 1){ superenemy.run() }   
      $('#count .enemycount').removeClass('died')
    }  
    // каждая координата по отдельности
    this.x = function(){return $('td.enemy').attr('id')}
    this.y = function(){return $('td.enemy').parent().attr('id')} 
    this.direction = function(){return $('td.enemy img').attr('direction')}
    
    // один шаг врага
    this.step = function(){ 
         
      // определяем координаты текущего положения 
      x = parseInt(that.x())
      y = parseInt(that.y()) 
      direction = that.direction()   
        
      //определяем новые координаты 
      switch(direction){
        case'up': newY = y - 1; newX = x
        break
        case'down': newY = y + 1; newX = x
        break
        case'left': newY = y; newX = x - 1
        break
        case'right': newY = y; newX = x + 1
        break
      }   
        
      //проверяем не выходят ли новые координаты за поле 
      if (newX  == outLineMax){newX = 0} else if (newX == outLineMin){newX = lastId} 
      if (newY == outLineMax){newY = 0} else if (newY == outLineMin){newY = lastId}  
      
      // если следующая ечейка с бомбой - то враг 1 раз меняет направление движения
      nextEnemyCell = $('tr[id='+newY+'] td[id='+newX+']') 
       if (nextEnemyCell.hasClass('deadzone')){ 
         this.avoidBomb()
       } 
      
      // перемещаем врага на 1 клетку
      enemyOld = $('td.enemy').toggleClass('old').html() 
      $('tr[id='+newY+'] td[id='+newX+']').toggleClass('new').removeClass('myshift shift').html(enemyOld).toggleClass('enemy new')  
      $('td.old').removeClass("enemy old").addClass('shift')
      $('td.shift').children('img').removeClass('enemy').addClass('shift').attr('direction','').fadeOut(1000).queue(function(){
        $(this).parent().removeClass('shift')
        $(this).remove()
      })   
      
      // проверяем, не наступил ли враг на мину или не съел ли рубин
      nextEnemyCell = $('tr[id='+newY+'] td[id='+newX+']')
       if (nextEnemyCell.hasClass('deadzone')){that.dies()}
       else if (nextEnemyCell.hasClass('foodzone')){that.eats(nextEnemyCell)} 
       else if (nextEnemyCell.hasClass('selected')){that.dies(); worm.kill()}   
    }//.step end 
    
      
    //запустить автоматическое движение врага каждую 1 секунду
    this.run   = function (){
      runningEnemy = setInterval(this.step, 300);} 
      
    // тут можно написать алгоритм, чтобы он не хаотично перемещался по пространству, а целенаправленно собирал рубиниы, составляя конкуренцию игроку.  
      //  ветка А: выбирается случайным образом из оставшихся
        //  а. найти все рубины и загнать в массив
        //  б. рандомным образом выбрать один целевой
        //  в. узнать координаты целевого рубина и координаты себя
        //  г. при выборе направления движения производится проверка - если расстояние между X или Y цели и врага сокращается, то направление остается, если нет, то нет, то выбирается другое направление
        //  д. когда враг ест рубин, выбирается другая цель -> пункт а или б (чтобы два раза не обращаться к дому). 
         
      //  ветка Б: выбирается ближаший
        //  а. найти все рубины и загнать в массив
        //  б. проверить координаты каждого - у кого меньше сумма разниц координат x и y - назначается целевой 
        //  в. при выборе направления движения производится проверка - если расстояние между X или Y цели и врага сокращается, то направление остается, если нет, то нет, то выбирается другое направление
        //  г. когда враг ест рубин, выбирается другая цель -> пункт а. 
       
      
       
    //изменить направление движения врага
    this.changeDirection = function(){ 
          randomNumber = (Math.floor(Math.random() * (directions.length - 0)) + 0).toString();
          $('td.enemy img').attr('direction', directions[randomNumber]); 
        } 
        
    // система уклонения от бомб - враг меняет направление, если следующая клетка содержит бомбу
    // НО! он меняет направление один раз. поэтому если в измененном направлении тоже есть бомба,
    // т.е. он попал в "коробочку" - он наступит на нее.       
    this.avoidBomb = function(){
      currentEnemyDirection = $('td.enemy img').attr('direction') 
      
      // определяем новое безопасное направление движения, где нет бомбы
      for (i = 0; i < directions.length; i++){
        if (directions[i] != currentEnemyDirection){
          safeDirectionNumber = i
          break
        }
      }     
      
      $('td.enemy img').attr('direction', directions[safeDirectionNumber]);
      
      // определяем координаты текущего положения 
        x = parseInt(this.x())
        y = parseInt(this.y())
        direction = this.direction()   
          
      //определяем новые координаты 
      switch(direction){
        case'up': newY = y - 1; newX = x
        break
        case'down': newY = y + 1; newX = x
        break
        case'left': newY = y; newX = x - 1
        break
        case'right': newY = y; newX = x + 1
        break}  
      
      // +++++++++++++++++++++ 
      // Можно сократить код, просто передавай новое значение в уже существующую функцию step()  
    }      
    
    //запустить автоматическое изменение направления движения через 5 секунд
    this.intervalChangeDirections = function(){
      enemyChangesDirections = setInterval(this.changeDirection, 2000)}    
    
    // смерть врага
    this.dies = function(){
      this.stop()
      $('td.enemy img').attr('src', 'assets/blood.png') 
      $('#count .enemycount').addClass('died')
       enemyKilled = 1
       message("Enemy Died. You win!")
    }
    
    // остановить ход врага
    this.stop = function(){
      clearInterval(runningEnemy)
      clearInterval(enemyChangesDirections)
    } 
    
    // враг кушает рубин и зарабатывает очко
    this.eats = function(e){
      e.removeClass('foodzone')
      enemyCount = parseInt($('#count .enemycount').text()) + 1
      $('#count .enemycount').text(enemyCount)
      checkCount()
    }
       
  } // Enemy object End 
  
  superenemy = new Enemy('Mr. Evil')
  superenemy.create()  
  superenemy.intervalChangeDirections()  
}
 
function checkCount(){
  
  if ($('.foodzone').length == 0){
    worm.stop()
    superenemy.stop()
    rubymanPoints =  $('#count .rubyman').text()
    enemyPoints = $('#count .enemycount').text()
    if (enemyPoints > rubymanPoints) {message('You loose. Try again.')}
    else if (enemyPoints < rubymanPoints) {message('Congratulations! You win!')}
    else if (enemyPoints == rubymanPoints) {message('You have equal number of points... Try again.')}
  }

}

function countReset(){ 
  $('#count .rubyman').text('0')
  $('#count .enemycount').text('0')  
}

// выводит сообщения в левой парели
function message(x){
//  $('p.log').append(x + ' ')
  $('div.attention').fadeIn('slow').text(x)
} 

//  определяет координаты ячейки, переданной в z
function myXY(z) { 
  return {'x': z.attr('id'), 'y': z.parent().attr('id')}
}   





