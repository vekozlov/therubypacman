function enableButtons(e){
  $("body").keypress(function (e) { 
    //listening to WSAD buttons and changing moving direction, rotation 
    if      (e.which == 119)  { step = {'x' : 0,  'y' : -1}; run = 1; rotation = 'up'     }
    else if (e.which == 115)  { step = {'x' : 0,  'y' : 1 }; run = 1; rotation = 'down'   }
    else if (e.which == 97 )  { step = {'x' : -1, 'y' : 0 }; run = 1; rotation = 'left'   }
    else if (e.which == 100)  { step = {'x' : 1,  'y' : 0 }; run = 1; rotation = 'right'  }  
    else                      { step = {'x' : 0,  'y' : 0 }}  
    //to start the worm only when WSAD buttons are pressed.
    if(run == 1){
      running == 0 ? worm.run() : {}
      running = 1 
    }
  });
} // enable buttons end

function enableActions(){
  //control buttons
  $('a').click(function(){
    //TODO keep this info in the data attributes
    switch($(this).attr('id')){
      case'startgame':
        game.start()
        console.log("ok")
      break
      case'resetgame':
        game.reset()
      break
      case'endgame':
        game.end()
      break
    }})

  //closing the attention window
  $(".attention").click(function(){
    $(".attention").fadeOut()
  })
} // enable actions end

$(document).ready(function(){
    enableActions()
})