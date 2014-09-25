//= require jquery
//= require jquery_ujs
//= require src
//= require controls
//= require game
//= require pacman
//= require enemy
//= require helpers

$(document).ready(function(){
  fieldSize = 25
  rubiesQuantity = 5
  bombsQuantity = 15
  enemyRuns = 0
  killed = 0
  speed = 200
  game.prepare(fieldSize) 
})
