//========================================================================
//  TODO
//  а. враг целенаправленно идет к рубинам (в планах)
//  б. сделать возможность создания 2-3-5 врагов одновременно
//========================================================================

// function createCleverEnemy(){
  function Enemy(name){
    that = this
    this.name = name
    this.id = Math.floor((Math.random() * 1000000000) + 1);
    this.tdClass = 'enemy_' + this.id
    this.tdSelector = '.' + this.tdClass
    this.status = {
      running: 0,
      direction: 'up',
      killed: 0,
      x: 0,
      y: 0,
      changingDirectionsInitiated: 0
    }

    this.init = function(){
      this.create()  
      this.intervalChangeDirections()
    }

    //создать врага на поле
    this.create = function(){ 
      enemy = '<img class=\"enemy\" src=\''+meduze_source()+'\'>' 
      randomX = Math.floor(Math.random() * (game.settings.fieldSize - 1 + 1)) + 1
      randomY = Math.floor(Math.random() * (game.settings.fieldSize - 1 + 1)) + 1
      enemyPlace = $('table#wormfield tr:eq('+ randomY +') td:eq('+ randomX +')').addClass(that.tdClass).html(enemy)
      if (this.status.running < 1){ that.run() }
    }  
    // каждая координата по отдельности
    this.x          = function(){return parseInt($(this.tdSelector).attr('id'))}
    this.y          = function(){return parseInt($(this.tdSelector).parent().attr('id'))} 

    // один шаг врага
    this.step = function(){ 
         
      // определяем координаты текущего положения 
      x = that.x()
      y = that.y() 
        
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
      enemyOld = $(that.tdSelector).toggleClass('old').html()
      $('tr[id='+newY+'] td[id='+newX+']').toggleClass('new').removeClass('myshift shift').html(enemyOld).toggleClass(that.tdClass + ' new')
      $('td.old').removeClass(that.tdClass + " old").addClass('shift')
      $('td.shift').children('img').removeClass(that.tdClass).addClass('shift').fadeOut(1000).queue(function(){
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
      this.runningEnemy = setInterval(this.step, 300);
      this.status.running = 1
      this.status.changingDirectionsInitiated = 0
    }  
             
    //изменить направление движения врага
    this.changeDirection = function(){ 
      randomNumber = (Math.floor(Math.random() * (directions.length - 0)) + 0).toString();
      that.status.direction = directions[randomNumber]
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
      if (this.status.changingDirectionsInitiated == 0) {
        this.enemyChangesDirections = setInterval(this.changeDirection, 2000)
        this.status.changingDirectionsInitiated = 1
      }
    }
    
    // смерть врага
    this.dies = function(){
      this.stop()
      $(that.tdSelector + ' img').attr('src', 'assets/blood.png') 
      $('#count .enemycount').addClass('died')
      that.status.killed = 1
      message("Enemy Died. You win!")
    }
    
    // остановить ход врага
    this.stop = function(){
      clearInterval(this.runningEnemy)
      clearInterval(this.enemyChangesDirections)
    }
    
    // враг кушает рубин и зарабатывает очко
    this.eats = function(e){
      e.removeClass('rubyzone')
      counter.meduzeEats()
      counter.checkCount()
    }

    this.init()
  } // Enemy object End
// }