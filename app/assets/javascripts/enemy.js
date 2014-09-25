//========================================================================
//  TODO
//  а. враг целенаправленно идет к рубинам (в планах)
//  б. сделать возможность создания 2-3-5 врагов одновременно
//========================================================================

function createCleverEnemy(){
  function Enemy(name){
    that = this

    this.status = {
      running: 0,
      direction: 'up'
    }

    //создать врага на поле
    this.create = function(){ 
      enemy = '<img class=\"enemy\" src=\''+meduze_source()+'\' direction=\'up\'>' 
      randomX = Math.floor(Math.random() * (game.settings.fieldSize - 1 + 1)) + 1
      randomY = Math.floor(Math.random() * (game.settings.fieldSize - 1 + 1)) + 1
      enemyPlace = $('table#wormfield tr:eq('+ randomY +') td:eq('+ randomX +')').addClass('enemy').html(enemy)
      if (this.status.running < 1){ superenemy.run() }   
      $('#count .enemycount').removeClass('died')
    }  
    // каждая координата по отдельности
    this.x          = function(){return $('td.enemy').attr('id')}
    this.y          = function(){return $('td.enemy').parent().attr('id')} 
    this.direction  = function(){return $('td.enemy img').attr('direction')}

    // один шаг врага
    this.step = function(){ 
         
      // определяем координаты текущего положения 
      x = parseInt(that.x())
      y = parseInt(that.y()) 
      that.status.direction = that.direction()   
        
      //определяем новые координаты
      switch(that.status.direction){
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
        that.avoidBomb()
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
      else if (nextEnemyCell.hasClass('rubyzone')){that.eats(nextEnemyCell)} 
      else if (nextEnemyCell.hasClass('selected')){that.dies(); worm.kill()}
    }//.step end 
    
    //запустить автоматическое движение врага каждую 1 секунду
    this.run   = function (){
      runningEnemy = setInterval(this.step, 300);
      this.status.running = 1
      changingDirectionsInitiated = 0
    }  
             
    //изменить направление движения врага
    this.changeDirection = function(){ 
      randomNumber = (Math.floor(Math.random() * (directions.length - 0)) + 0).toString();
      $('td.enemy img').attr('direction', directions[randomNumber]); 
    }
        
    // система уклонения от бомб - враг меняет направление, если следующая клетка содержит бомбу
    // НО! он меняет направление один раз. поэтому если в измененном направлении тоже есть бомба,
    // т.е. он попал в "коробочку" - он наступит на нее.       
    this.avoidBomb = function(){
      // определяем новое безопасное направление движения, где нет бомбы
      for (i = 0; i < directions.length; i++){
        if (directions[i] != that.status.direction){
          that.status.direction = directions[i]
          break
        }
      }     

      // определяем координаты текущего положения 
      x = parseInt(this.x())
      y = parseInt(this.y())
      
      //определяем новые координаты
      switch(that.status.direction){
        case'up': newY = y - 1; newX = x
        break
        case'down': newY = y + 1; newX = x
        break
        case'left': newY = y; newX = x - 1
        break
        case'right': newY = y; newX = x + 1
        break
      }  

      // TODO 
      // Можно сократить код, просто передавай новое значение в уже существующую функцию step()  
    }      
    
    //запустить автоматическое изменение направления движения через 2 секунды
    this.intervalChangeDirections = function(){
      if (changingDirectionsInitiated == 0) {
        enemyChangesDirections = setInterval(this.changeDirection, 2000)
        changingDirectionsInitiated = 1
      }
    }
    
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
      e.removeClass('rubyzone')
      enemyCount = parseInt($('#count .enemycount').text()) + 1
      $('#count .enemycount').text(enemyCount)
      checkCount()
    }
       
  } // Enemy object End 
  
  superenemy = new Enemy('Mr. Evil')
  superenemy.create()  
  superenemy.intervalChangeDirections()
}