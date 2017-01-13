/*  
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Title : Assignment 1 Sliding Block Puzzle
Author : Vita Chen
Created : 9/28/2016
Modified : 
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/

// When DOM is ready
$(function() {

	initialize();

	// If a tile is clicked, call tileClicked
	$(document).on("click", ".tile", tileClicked);

	// If the reset button is clicked, call shuffleTiles
	$(document).on("click", "#reset", restart);

	// If a key is pressed, call keyboardControl
	$(document).keydown(keyboardControl);

	// If a level is choosed, restart the game
	$('.level-choice').click(function() {
		$(this).addClass('level-active');
		$(this).siblings().removeClass('level-active');
		restart();
	});

	// If the size of the browser window changes, resize the game area
	$(window).resize(function(){
		var new_window_width = $(window).width();
		var new_window_height = $(window).height();
		var new_tile_width = new_window_width*0.13;
		if (new_tile_width > 120) {
			new_tile_width = 120;
		}
		if (new_tile_width < 60) {
			new_tile_width = 60;
		}
		$(".tile").height(new_tile_width).width(new_tile_width);
		$(".puzzle-row").height(new_tile_width);
	});

	/**
	* Initialize the game
	* @return undefined
	*/
	function initialize() {
		// Add any other global variables you may need here.
		var move_count = 0;
		var tile_size = $(".puzzle-row").width()/4;

		// Create tile array 
		// Draw the image on tiles
		var tile = [];
		for (i=0;i<15;i++) {
			tile[i] = $('#tile'+i)[0];
			tile_row = parseInt($('#tile'+i).attr('tile-row'));
			tile_col = parseInt($('#tile'+i).attr('tile-col'));
			drawImg(tile_size, tile[i], tile_row, tile_col);
		}
		// Draw image on the empty tile
		tile[16] = $('#emptytile')[0];
		drawImg(tile_size, tile[16], 3, 3);

		shuffleTiles();

		checkSolved(true);		
	}

	/**
	 * Draw image on the tiles.
	 * @param{object}: tile_canvas  the tile for the image to be drawn on
	 * @param{int}: tile_canvas_row  the row number of the tile
	 * @param{int}: tile_canvas_col  the column number of the tile
	 * @return undefined
	 */
	function drawImg(tile_size, tile_canvas, tile_canvas_row, tile_canvas_col){
		tile_canvas.width = tile_size;
		tile_canvas.height = tile_size;
		var tile_context = tile_canvas.getContext("2d");
		var img = new Image();
		img.onload = function(){
			tile_context.drawImage(img, tile_canvas_col*tile_size, tile_canvas_row*tile_size, tile_size, tile_size, 0, 0, tile_size, tile_size);
		}
		img.src= "img/panda.jpg";
	}



	/**
	 * Check if the clicked tile is a neighbor tile of the empty tile, and if it is, 
	 *	  pass it to a move function.
	 * @return undefined
	 */
	function tileClicked(){
		// Check if the puzzle is already solved
		var solved = checkSolved(true);
		if (solved == 3) {
			// If the puzzle is already solved, do nothing
		}
		else {
			// check if the tile can move to the empty spot
			// if the tile can move, move the tile to the empty spot
			var tileClicked = $(this).attr('id');
			var tileClickedRow = parseInt($(this).attr('tile-row'));
			var tileClickedCol = parseInt($(this).attr('tile-col'));

			// Find the empty tile
			var emptytileRow = parseInt($('#emptytile').attr('tile-row'));
			var emptytileCol = parseInt($('#emptytile').attr('tile-col'));

			moveTile(tileClicked,tileClickedRow, tileClickedCol, emptytileRow, emptytileCol, true);
			
			checkSolved(false);		
		}

	}



	/**
	 * Swap the empty tile and another tile w/o animation effect
	 * @param{int} tile1id  the id of the other tile
	 * @param{int} tile1Row  the row number of the other tile
	 * @param{int} tile1Col  the col number of the other tile
	 * @param{int} tile2Row  the row number of the empty tile
	 * @param{int} tile2Col  the col number of the empty tile
	 * @param{boolean} animation  true if animation effect added, false if not
	 * @return undefined
	 */
	function moveTile(tile1id, tile1Row, tile1Col, tile2Row, tile2Col, animation){
		// Default duration is 400 milliseconds (animation effect)
		var options = {duration: 400};
		// For shuffle function, set the duration to be 0 (no animation effect)
		if (animation == false) {
			options = {duration: 0};
		}

		// Move - with animation
		// Move up
		if (tile1Row + 1 == tile2Row && tile1Col == tile2Col) {
			$('#'+tile1id).animate({"top": "+=" + '100%'}, options);
			$('#emptytile').animate({"top": "-=" + '100%'}, options);
			// Update the position
			$('#'+tile1id).attr('tile-row', tile1Row+1);
			$('#emptytile').attr('tile-row', tile2Row-1);
			// Update the move count
			move_count += 1;
			updateMoveCount(move_count);
		}
		// Move down
		if (tile1Row - 1 == tile2Row && tile1Col == tile2Col) {
			$('#'+tile1id).animate({"top": "-=" + '100%'}, options);
			$('#emptytile').animate({"top": "+=" + '100%'}, options);
			// Update the position
			$('#'+tile1id).attr('tile-row', tile1Row-1);
			$('#emptytile').attr('tile-row', tile2Row+1);
			// Update the move count
			move_count += 1;
			updateMoveCount(move_count);
		}	
		// Move left
		if (tile1Row == tile2Row && tile1Col - 1 == tile2Col) {
			$('#'+tile1id).animate({"left": "-=" + '25%'}, options);
			$('#emptytile').animate({"left": "+=" + '25%'}, options);
			// Update the position
			$('#'+tile1id).attr('tile-col', tile1Col-1);
			$('#emptytile').attr('tile-col', tile2Col+1);
			// Update the move count
			move_count += 1;
			updateMoveCount(move_count);
		}	
		// Move right
		if (tile1Row == tile2Row && tile1Col + 1 == tile2Col) {
			$('#'+tile1id).animate({"left": "+=" + '25%'}, options);
			$('#emptytile').animate({"left": "-=" + '25%'}, options);
			// Update the position
			$('#'+tile1id).attr('tile-col', tile1Col+1);
			$('#emptytile').attr('tile-col', tile2Col-1);
			// Update the move count
			move_count += 1;
			updateMoveCount(move_count);
		}
	};

	/**
	 * Restart the game
	 * @return undefined
	 */
	function restart() {
		solveGame();
		shuffleTiles();
	};

	/**
	 * Return the game state to solved 
	 * @return undefined
	 */
	function solveGame() {
		for (i = 0; i < 4; i++) { // row
			for (j = 0; j < 4; j++) { // col
				// Remove style
				$('[tile-row="'+i+'"][tile-col="'+j+'"]').css("right", "").css("left", "").css("top", "").css("down", "");
			}
		}
		for (i = 0; i < 4; i++) { // row
			for (j = 0; j < 4; j++) { // col
				// Mark the correct position
				$('.puzzle-row-'+i).children().eq(j).attr('tile-row', i).attr('tile-col', j);
			}
		}
	};


	/**
	 * Update the move count 
	 * @return undefined
	 */
	function updateMoveCount(move_count){
		$('#move_count').html(move_count);
	}

	/**
	 * Shuffle up the tiles 
	 * @return undefined
	 */
	function shuffleTiles(){
		// Hide the empty tile
		$("#emptytile").hide();
		// set the move to 0
		move_count = 0;
		updateMoveCount(move_count);

		var dir = 0;

		// Move the empty tiles n times depending on the difficulty level, default is easy
		n = getLevel();
		for (i = 0; i < n; i++){
			var emptytileRow = parseInt($('#emptytile').attr('tile-row'));
			var emptytileCol = parseInt($('#emptytile').attr('tile-col'));

			// dir can be 0(up), 1(down), 2(left), 3(right)
			dir = Math.floor(Math.random()*4);

			// Emptytile will ...
			// Swap with the neighbor tile above
			if (dir == 0 && emptytileRow != 0){
				tile1Row = emptytileRow - 1;
				tile1Col = emptytileCol; 
				tile1id = $('[tile-row="'+tile1Row+'"][tile-col="'+tile1Col+'"]').attr('id');
				moveTile(tile1id, tile1Row, tile1Col, emptytileRow, emptytileCol, false);
			}

			// Swap with the neighbor tile below
			if (dir == 1 && emptytileRow != 3){
				tile1Row = emptytileRow + 1;
				tile1Col = emptytileCol; 
				tile1id = $('[tile-row="'+tile1Row+'"][tile-col="'+tile1Col+'"]').attr('id');
				moveTile(tile1id, tile1Row, tile1Col, emptytileRow, emptytileCol, false);				
			}

			// Swap with the neighbor tile to its left
			if (dir == 2 && emptytileCol != 0){
				tile1Row = emptytileRow;
				tile1Col = emptytileCol - 1; 
				tile1id = $('[tile-row="'+tile1Row+'"][tile-col="'+tile1Col+'"]').attr('id');
				moveTile(tile1id, tile1Row, tile1Col, emptytileRow, emptytileCol, false);				
			}

			// Swap with the neighbor tile to its right
			if (dir == 3 && emptytileCol != 3){
				tile1Row = emptytileRow;
				tile1Col = emptytileCol + 1; 
				tile1id = $('[tile-row="'+tile1Row+'"][tile-col="'+tile1Col+'"]').attr('id');
				moveTile(tile1id, tile1Row, tile1Col, emptytileRow, emptytileCol, false);				
			}

		}
		// set the move to 0
		move_count = 0;
		updateMoveCount(move_count);
	} // End of shuffleTile



	/**
	 * Check if the puzzle is solved
	 * @param{boolean} recheck  true if this check is before the move, false if not
	 * @return{int} 0 if the puzzle is solved, 1 if the puzzle is unsolved, 3 if the puzzle is already solved (end of game)
	 */
	 function checkSolved(recheck) {
	 	// 0 = unsolved, 1 = solved, 2 = already done
	 	var solved = 1;

	 	for (i = 0; i < 4; i++){
			tile_row = parseInt($('#tile'+i).attr('tile-row'));
			tile_col = parseInt($('#tile'+i).attr('tile-col'));
	 		if (tile_row != 0 || tile_col != i){
	 			solved = 0;
	 		}
	 	}
	 	for (i = 4; i < 8; i++){
			tile_row = parseInt($('#tile'+i).attr('tile-row'));
			tile_col = parseInt($('#tile'+i).attr('tile-col'));
	 		if (tile_row != 1 || tile_col != (i-4)){
	 			solved = 0;
	 		}
	 	}
	 	for (i = 9; i < 12; i++){
			tile_row = parseInt($('#tile'+i).attr('tile-row'));
			tile_col = parseInt($('#tile'+i).attr('tile-col'));
	 		if (tile_row != 2 || tile_col != (i-8)){
	 			solved = 0;
	 		}
	 	}
	 	for (i = 13; i < 15; i++){
			tile_row = parseInt($('#tile'+i).attr('tile-row'));
			tile_col = parseInt($('#tile'+i).attr('tile-col'));
	 		if (tile_row != 3 || tile_col != (i-12)){
	 			solved = 0;
	 		}
	 	}

	 	if (recheck==false && solved == 1){
	 		alert("You win! Your used "+move_count+" moves!");
	 		// Set move to 0
			move_count = 0;
			updateMoveCount(move_count);
			$("#emptytile").fadeIn(2500);
	 	}
	 	if (recheck==true && solved == 1){
	 		solved = 3;
	 		alert ("You already solved the puzzle!");
	 		$("#emptytile").fadeIn(2500);
	 	}
	 	return solved;
	 }


	/**
	 * Get difficulty level
	 * @return 10 (easy), 50 (medium) or 200 (hard)
	 */
	 function getLevel() {
	 	var level = $('.level-active').attr('level');
	 	switch(level) {
	 		case 'easy':
	 			return 10;
	 		case 'medium':
	 			return 50;
	 		case 'hard':
	 			return 200;
	 	}
	 }	

	/**
	 * Add support for keyboard control (up, down, left and right arrow key)
	 * @param{int} e  keyboard number
	 * @return undefined
	 */
	 function keyboardControl(e){

		var keyCode = e.which;
		var arrow = {up: 38, down: 40, left:37, right:39};

		// if the key pressed are one of the up/down/left/right keys
		if (keyCode == 38 || keyCode == 40 || keyCode == 37 || keyCode == 39) {
			// Check if the puzzle is already solved
			var solved = checkSolved(true);
			if (solved == 3) {
				// If the puzzle is already solved, do nothing
			}
			else {

				// Find the empty tile
				var emptytileRow = parseInt($('#emptytile').attr('tile-row'));
				var emptytileCol = parseInt($('#emptytile').attr('tile-col'));

				switch(keyCode){
					case arrow.up:
						// Find the neighbor tile below the empty tile and move it up
						if (emptytileRow != 3){
							tile1Row = emptytileRow + 1;
							tile1Col = emptytileCol; 
							tile1id = $('[tile-row="'+tile1Row+'"][tile-col="'+tile1Col+'"]').attr('id');
							moveTile(tile1id, tile1Row, tile1Col, emptytileRow, emptytileCol, true);					
						}
						break;
					case arrow.down:
						// Find the neighbor tile above the empty tile and move it down
						if (emptytileRow != 0){
							tile1Row = emptytileRow - 1;
							tile1Col = emptytileCol; 
							tile1id = $('[tile-row="'+tile1Row+'"][tile-col="'+tile1Col+'"]').attr('id');
							moveTile(tile1id, tile1Row, tile1Col, emptytileRow, emptytileCol, true);
						}
						break;
					case arrow.left:
						// Find the neighbor tile to the right of the empty tile and move it left
						if (emptytileCol != 3){
							tile1Row = emptytileRow;
							tile1Col = emptytileCol + 1; 
							tile1id = $('[tile-row="'+tile1Row+'"][tile-col="'+tile1Col+'"]').attr('id');
							moveTile(tile1id, tile1Row, tile1Col, emptytileRow, emptytileCol, true);
						}
						break;
					case arrow.right:
						// Find the neighbor tile to the left of the empty tile and move it right
						if (emptytileCol != 0){
							tile1Row = emptytileRow;
							tile1Col = emptytileCol - 1; 
							tile1id = $('[tile-row="'+tile1Row+'"][tile-col="'+tile1Col+'"]').attr('id');
							moveTile(tile1id, tile1Row, tile1Col, emptytileRow, emptytileCol, true);
						}
						break;
				}// end of switch
				checkSolved(false);
			}// end of else	
		}// end of if
	 }// end of keyboard control

}); // end of DOM ready


	// // Randomly determine on the image
	// var img = new Image();
	// var img_no = Math.floor(Math.random()*5);
	// switch(img_no){
	// 	case 0:
	// 		img.src = "img/lovelive.jpg";
	// 		break;
	// 	case 1:
	// 		img.src = "img/dog.jpg";
	// 		break;
	// 	case 2:
	// 		img.src = "img/hamster.jpg";
	// 		break;
	// 	case 3: 
	// 		img.src = "img/cat.jpg";
	// 		break;
	// 	case 4:
	// 		img.src = "img/panda.jpg";
	// 		break;
	// }