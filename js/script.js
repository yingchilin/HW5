/*
File: script.js
GUI Assignment: Implement one line of Scrabble game with Drag-and-Drop by using jQuery UI.
Yingchi Lin, UMass Lowell Computer Science, yingchi_Lin@student.uml.edu
Copyright (c) 2022 by Yingchi. All rights reserved. May be freely copied or excerpted for educational purposes with credit to the author.
June 30, 2022
*/


const RACK_SIZE = 7;
const TILE_ZINDEX = 99;
var totalScore = 0;



$(document).ready(function() {
    getRemainingTiles();     
    displayTiles();             
    updateGameScore();    

    // Setup droppable for the slots
    $(".droppable").droppable({
        tolerance: "intersect",
        hoverClass: "highlightHover",
        drop: function (event, ui) {
            if ( $(this).children().length == 0 ) {    
                $(ui.draggable).css("left", "").css("top", "");        
                ui.draggable.appendTo($(this));               
                updateGameScore();
                document.getElementById("nextWord").disabled = false;
            }
        }
    });

    // Setup droppable for the rack
    $("#rack").droppable({
        tolerance: "intersect",
        drop: function (event, ui) {
            $(ui.draggable).css("left", "").css("top", "");
            ui.draggable.appendTo($(this));     
        }
    });

});



// Get all tiles based on the distribution
function getRemainingTiles() {
    var remainingLetterTiles = [];
    var key;
    for (key in ScrabbleTiles) {
        if (ScrabbleTiles.hasOwnProperty(key)) {
            var numRemaining = ScrabbleTiles[key]["number-remaining"];
            for (var i = 0; i < numRemaining; ++i) {
                remainingLetterTiles.push(key);
            }
        }
    }
    return remainingLetterTiles;
}

// Get tiles randomly based on the distribution
function getRandomTile () {
    var remainingLetterTiles = getRemainingTiles();
    var remainingLetterTilesLen = remainingLetterTiles.length;
    if (remainingLetterTilesLen < 1)
        return null;

    var randomIndex = Math.floor( Math.random() * remainingLetterTilesLen );
    var randomLetter = remainingLetterTiles.splice( randomIndex, 1 ); 
    
    ScrabbleTiles[randomLetter]["number-remaining"] -= 1; 
    $("#remainingTiles").html(remainingLetterTiles.length);
    return randomLetter;
}

// Display tiles and set tiles draggable
function displayTiles() {
    
    var rack = $('#rack');
    var i = rack.children().length;
    for (i ; i < RACK_SIZE; ++i) {
        var key = getRandomTile();
        if (key) {
            var newSrc = "graphics_data/tiles/Scrabble_Tile_" + key + ".jpg";
            var newTile = $("<img letter=\"" + key + "\" value=\"" + ScrabbleTiles[key].value + "\" src=\"" + newSrc + "\" class=\"tile\" />");
            newTile.addClass("draggable ui-widget-conten");
            newTile.appendTo("#rack");                
        } else {
            // If all tiles were depleted, prevent the users from playing the game
            document.getElementById("nextWord").disabled = true; 
        }
    }
    // Make tiles draggable
    $(".tile").draggable({
        revertDuration: 100, 
        start: function(event, ui) {
            $(this).draggable("option", "revert", "invalid");
            $(this).css("z-index", TILE_ZINDEX);
          },
          stop: function() {
            $(this).css("z-index", "");
          }
    });
}

// Calculate scores
function updateGameScore(){
    var word=" ";  
    var score = 0;
    var doublescore = 0;
    
  
    // Double letter score
    $("#doublescore img").each(function() {  
      for(var i =0; i< $(this).length; ++i) {
          doublescore += parseInt($(this).attr("value"), 10);
      } 
    })
    
    // Normal letter score
    $(".droppable img").each(function() {  
      for(var i =0; i< $(this).length; ++i) {
          word += $(this).attr("letter");
          score += parseInt($(this).attr("value"), 10);
      }
    })
  
    // Output values
    $("#word").html(word);
    // Add normal letter score and double letter score together
    score += doublescore;
    $("#curScore").html(score);
  
  }

// Restar the game and remove all tiles from the board and clear rack.
function restarGame() {
    for (var key in ScrabbleTiles) {
        if (ScrabbleTiles.hasOwnProperty(key)) {
          ScrabbleTiles[key]["number-remaining"] = ScrabbleTiles[key]["original-distribution"];
        }
      }
    getRemainingTiles();
    $("#board img").remove(); 
    $("#rack img").remove();               
    displayTiles();
    updateGameScore();
    totalScore = 0;
    $("#totalScore").html(totalScore); 
}

// A new word can be played after the "next" button is clicked and the score is kept for multiple words
function nextWord() {
    $("#board img").remove();     
    displayTiles();
    var curScore = parseInt($('#curScore').html(), 10);
    totalScore += curScore;
    $("#totalScore").html(totalScore);
    updateGameScore();
}