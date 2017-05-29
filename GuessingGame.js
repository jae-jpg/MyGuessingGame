var generateWinningNumber = function() {
	return Math.floor(Math.random() * 100 + 1);
};

var shuffle = function(array) {
	var n = array.length, r, t;

	// while there are elements left to sort
	while (n) {
		r = Math.floor(Math.random() * n--);

		// swap (next to) last element of array with the randomly selected element
		t = array[n];
		array[n] = array[r];
		array[r] = t;
	};
	return array;
};

var Game = function() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
};

Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
	return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
	if (num < 1 || num > 100 || typeof num !== "number") {
		throw "That is an invalid guess."
	} else {
		this.playersGuess = num;
	};
	return this.checkGuess();
};

Game.prototype.checkGuess = function() {
	if (this.playersGuess === this.winningNumber) {
		return "You Win!";
	} else if (this.pastGuesses.length >= 4) {
		return "You Lose.";
	} else if (this.pastGuesses.includes(this.playersGuess)) {
		return "You have already guessed that number."
	} else {
		this.pastGuesses.push(this.playersGuess);
		if (this.difference() < 10) {
			return "You're burning up!";
		} else if (this.difference() < 25) {
			return "You're lukewarm.";
		} else if (this.difference() < 50) {
			return "You're a bit chilly."
		} else if (this.difference() < 100) {
			return "You're ice cold!";
		};
	};
};


Game.prototype.provideHint = function() {
	var hintArray = [this.winningNumber];
	while (hintArray.length < 3) {
		hintArray.push(generateWinningNumber());
	}
	return shuffle(hintArray);
};


$(document).ready(function() {

	var ourGame = new Game;

	$('#reset').on('click', function(event) {
		ourGame = new Game;
		resetValues();
	});

	$('#hint').on('click', function(event) {
		var hints = ourGame.provideHint();
		var string = "The winning number is " + hints[0] + ", " + hints[1] + ", or " + hints[2] + ".";
		$('h1').text(string);
	});

	var resetValues = function() {
		$('h1').text("Guessing Game");
		$('h2').text("Welcome! Guess a number between 1 and 100!");
		$('li').text("-");
		$('#submit, #hint').removeAttr('disabled');
	};

	// function for saving user input and clearing input field
	var saveInput = function() {
		var input = $('#player-input').val(); // save user input as input
		int = parseInt(input, 10); // convert to a number
		$('#player-input').val(''); // clear the input field
		return int; // return the number
	};

	// save input, check the guess, and return the result of the turn
	var returnResult = function(guess) {
		var result = ourGame.playersGuessSubmission(guess);
		return(result);
	};

	// change HTML based on the return result
	var changeHeading = function(guess, result) {
		if (result === "You have already guessed that number.") {
			$('h1').text(result);
		} else if (result === "You Win!" || result === "You Lose.") {
			$('#submit, #hint').attr('disabled', 'disabled');
			$('h1').text(result);
			$('h2').text("Click the Reset button.");
		} else {
			// convert the next empty list item to the guess
			nextListItem = $('li:contains("-")').first();
			nextListItem.text(guess);

			// tell the user whether to guess higher or lower
			var hintNextNum;
			if (ourGame.isLower()) {
				hintNextNum = "Guess higher!";
			} else {
				hintNextNum = "Guess lower!"
			};
			$('h1').text(result)
			$('h2').text(hintNextNum);
		};
	};

	// select list item to add the new guess to - ON HOLD - TRY "FIND"ING THE NEXT EMPTY ELEMENT
	var selectListItem = function(list) {
		var nextItem;

	};


	//event handler that will trigger when the #submit button is clicked
	$('#submit').on('click', function(event) {
		var guess = saveInput();
		var result = returnResult(guess)
		changeHeading(guess, result);
	})

	$('#input-parent').on('keypress', function(event) {
		if (event.which === 13) { // event.which needs to be a number, not a string
			var guess = saveInput();
			var result = returnResult(guess)
			changeHeading(guess, result);
		};
	})



});























