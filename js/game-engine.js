class GameEngine {
	constructor() {
		this.title = 'Tic-Tac-Toe';
		this.author = 'JP Beyong';
		
		this.MAX_WIDTH = 580;
		this.MAX_HEIGHT = 580;

		this.centerX = Math.floor(this.MAX_WIDTH / 2);
		this.centerY = Math.floor(this.MAX_HEIGHT / 2);

		this.BG_COLOR = 'black';
		this.defaultFont = '30px san-serif';

		this.canvas = null;
		this.ctx = null;

		this.recentlyStarted = true;
		this.running = false;

		this.cols = 3;
		this.rows = 3;

		this.rectWidth = 180;
		this.rectHeight = 180;
		this.rectGap = 10;

		this.board;
		this.buttons = [];

		this.empty = '';
		this.player = 'X';
		this.opponent = 'O';
		this.currentPlayer = this.empty;

		this.hasWinner = false;
		this.winner = '';

		this.levels = [1, 4, 5, 7];
		this.currentLevel = this.levels[1];
		this.currentLevelText = 'Easy';

		this.createCanvas(this.MAX_WIDTH, this.MAX_HEIGHT);
		this.initButtons();
	}

	// Main Functions

	initButtons() {
		this.buttons.push(new Button('Easy', 150, 220, 280, 50, 20));
		this.buttons.push(new Button('Normal', 150, 280, 280, 50, 20));
		this.buttons.push(new Button('Hard', 150, 340, 280, 50, 20));
		this.buttons.push(new Button('Impossible', 150, 400, 280, 50, 20));
	}

	initRects() {
		this.board = [];
		this.currentPlayer = this.player;
		this.hasWinner = false;
		this.winner = '';

		for (let y = 0; y < this.cols; y++) {
			const arr = [];

			for (let x = 0; x < this.rows; x++) {
				arr.push(new Button(this.empty, (this.rectWidth * x) + (this.rectGap * (x + 1)),
								(this.rectHeight * y) + (this.rectGap * (y + 1)),
								this.rectWidth, this.rectHeight, 80));
			}

			this.board.push(arr);
		}
	}

	update() {
		if (this.running) {
			for (let y = 0; y < this.cols; y++) {
				for (let x = 0; x < this.rows; x++) {
					const b = this.board[y][x];

					if (b.text != this.empty) {
						b.buttonColor = 'lightgray';
					}
					else if (b.collide(mouse)) {
						if (mouse.down) {
							b.buttonColor = 'green';
						}
						else if (mouse.click) {
							if (this.currentPlayer === this.player) {
								b.text = this.player;
								this.currentPlayer = this.opponent;
							}
						}
						else {
							b.buttonColor = 'lightgray';
						}
					}
					else {
						b.buttonColor = 'gray';
					}
				}
			}

			if (this.isFull(this.board)) {
				this.running = false;

				for (let y = 0; y < this.cols; y++) {
					for (let x = 0; x < this.rows; x++) {
						const b = this.board[y][x];

						b.buttonColor = 'lightgray';
					}
				}
			}
			else if (this.isWinner(this.board, 'X')) {
				this.hasWinner = true;
				this.winner = this.player;
				this.running = false;
				this.highlightWinner(this.board, this.winner);
			}
			else if (this.isWinner(this.board, 'O')) {
				this.hasWinner = true;
				this.winner = this.opponent;
				this.running = false;
				this.highlightWinner(this.board, this.winner);
			}
			else if (this.currentPlayer === this.opponent) {
				const bestMove = this.aiMove(this.board);
				this.board[bestMove.y][bestMove.x].text = this.opponent;
				this.board[bestMove.y][bestMove.x].buttonColor = 'lightgray';
				this.currentPlayer = this.player;
			}

			mouse.click = false;
		}
	}

	render() {
		this.renderBackgroundScreen();

		if (this.recentlyStarted) {
			this.renderStartingScreen();
		}
		else if (this.running) {
			this.renderInGameScreen();
		}
		else {
			this.renderInGameScreen();

			this.ctx.globalAlpha = 0.8;
			this.renderBackgroundScreen();
			this.ctx.globalAlpha = 1;

			this.renderPlayAgainScreen();
		}
	}

	// Render Screen Functions

	renderBackgroundScreen() {
		this.ctx.fillStyle = this.BG_COLOR;
		this.ctx.fillRect(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT);
	}

	renderStartingScreen() {
		this.renderText(this.title, this.centerX, 100, 'white', 'center');
		this.renderText('By: ' + this.author, this.centerX, 150, 'white', 'center');

		for (let i = 0; i < this.buttons.length; i++) {
			const b = this.buttons[i];
			b.render(this.ctx);

			if (b.collide(mouse)) {
				if (mouse.down) {
					b.buttonColor = 'green';
				}
				else if (mouse.click) {
					this.running = true;
					this.recentlyStarted = false;
					this.currentLevel = this.levels[i];
					this.currentLevelText = b.text;
					this.initRects();
				}
				else {
					b.buttonColor = 'lightgray';
				}
			}
			else {
				b.buttonColor = 'gray';
			}
		}

		mouse.click = false;
	}

	renderInGameScreen() {
		for (let y = 0; y < this.cols; y++) {
			for (let x = 0; x < this.rows; x++) {
				this.board[y][x].render(this.ctx);
			}
		}

		this.renderText('Difficulty: ' + this.currentLevelText, 20, 40, 'white', 'left', '20px san-serif');
	}

	renderPlayAgainScreen() {
		const winnerInfo = (this.hasWinner ? 'Player ' + this.winner + ', Wins!' : 'It\'s a Tie!');

		this.renderText(winnerInfo, this.centerX, 320, 'yellow', 'center', '15px san-serif');
		this.renderText('[Touch the screen to Play Again]', this.centerX, 350, 'white', 'center', '15px san-serif');

		if (mouse.click) {
			this.recentlyStarted = true;
			this.initRects();
		}

		mouse.click = false;
	}

	// Canvas Functions

	renderText(text, x, y, color, alignment, font) {
		if (font === undefined) {
			font = this.defaultFont;
		}

		if (alignment === 'center') {
			this.ctx.textBaseline = 'middle';
			this.ctx.textAlign = 'center';
		}

		this.ctx.font = font;
		this.ctx.fillStyle = color;
		this.ctx.fillText(text, x, y);

		if (alignment === 'center') {
			this.ctx.textBaseline = 'alphabetic';
			this.ctx.textAlign = 'start';
		}
	}

	// Special Functions

	createCanvas(width, height) {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.canvas.width = width;
		this.canvas.height = height;

		document.body.appendChild(this.canvas);
	}

	highlightWinner(board, winner) {
		winner = winner.repeat(3);
		const p = this.player.repeat(3);
		const color = (winner === p) ? 'green' : 'red';

		if (board[0][0].text + board[0][1].text + board[0][2].text === winner) {
			board[0][0].buttonColor = color;
			board[0][1].buttonColor = color;
			board[0][2].buttonColor = color;
		}
		else if (board[1][0].text + board[1][1].text + board[1][2].text === winner) {
			board[1][0].buttonColor = color;
			board[1][1].buttonColor = color;
			board[1][2].buttonColor = color;
		}
		else if (board[2][0].text + board[2][1].text + board[2][2].text === winner) {
			board[2][0].buttonColor = color;
			board[2][1].buttonColor = color;
			board[2][2].buttonColor = color;
		}
		//
		else if (board[0][0].text + board[1][0].text + board[2][0].text === winner) {
			board[0][0].buttonColor = color;
			board[1][0].buttonColor = color;
			board[2][0].buttonColor = color;
		}
		else if (board[0][1].text + board[1][1].text + board[2][1].text === winner) {
			board[0][1].buttonColor = color;
			board[1][1].buttonColor = color;
			board[2][1].buttonColor = color;
		}
		else if (board[0][2].text + board[1][2].text + board[2][2].text === winner) {
			board[0][2].buttonColor = color;
			board[1][2].buttonColor = color;
			board[2][2].buttonColor = color;
		}
		//
		else if (board[0][0].text + board[1][1].text + board[2][2].text === winner) {
			board[0][0].buttonColor = color;
			board[1][1].buttonColor = color;
			board[2][2].buttonColor = color;
		}
		else if (board[0][2].text + board[1][1].text + board[2][0].text === winner) {
			board[0][2].buttonColor = color;
			board[1][1].buttonColor = color;
			board[2][0].buttonColor = color;
		}
	}

	isWinner(board, player) {
		player = player.repeat(3);

		return ((board[0][0].text + board[0][1].text + board[0][2].text === player) ||
				(board[1][0].text + board[1][1].text + board[1][2].text === player) ||
				(board[2][0].text + board[2][1].text + board[2][2].text === player) ||

				(board[0][0].text + board[1][0].text + board[2][0].text === player) ||
				(board[0][1].text + board[1][1].text + board[2][1].text === player) ||
				(board[0][2].text + board[1][2].text + board[2][2].text === player) ||

				(board[0][0].text + board[1][1].text + board[2][2].text === player) ||
				(board[0][2].text + board[1][1].text + board[2][0].text === player));
	}

	isFull(board) {
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				if (board[y][x].text === this.empty) {
					return false;
				}
			}
		}

		return true;
	}

	getAvailableMoves(board) {
		const moves = [];

		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				if (board[y][x].text === this.empty) {
					moves.push({y: y, x: x});
				}
			}
		}

		return moves;
	}

	minimax(board, depth, isMaximizing, alpha, beta) {
		if (this.isWinner(board, this.player)) {
			return -1;
		}
		else if (this.isWinner(board, this.opponent)) {
			return 1;
		}
		else if (this.isFull(board) || depth === 0) {
			return 0;
		}

		if (isMaximizing) {
			const moves = this.getAvailableMoves(board);
			let bestScore = -Infinity;

			for (let i = 0; i < moves.length; i++) {
				board[moves[i].y][moves[i].x].text = this.opponent;
				const score = this.minimax(board, depth - 1, false, alpha, beta);
				board[moves[i].y][moves[i].x].text = this.empty;

				bestScore = Math.max(score, bestScore);
				alpha = Math.max(score, alpha);

				if (beta <= alpha) {
					break;
				}
			}

			return bestScore;
		}
		else {
			const moves = this.getAvailableMoves(board);
			let bestScore = Infinity;

			for (let i = 0; i < moves.length; i++) {
				board[moves[i].y][moves[i].x].text = this.player;
				const score = this.minimax(board, depth - 1, true, alpha, beta);
				board[moves[i].y][moves[i].x].text = this.empty;

				bestScore = Math.min(score, bestScore);
				beta = Math.min(score, beta);

				if (beta <= alpha) {
					break;
				}
			}

			return bestScore;
		}
	}

	aiMove(board) {
		const moves = this.getAvailableMoves(board);
		let bestScore = -Infinity;
		let bestMove = {y: -1, x: -1};

		if (this.currentLevel === this.levels[3] || Math.random() > 0.2) {
			for (let i = 0; i < moves.length; i++) {
				board[moves[i].y][moves[i].x].text = this.opponent;
				const score = this.minimax(board, this.currentLevel, false, -Infinity, Infinity);
				board[moves[i].y][moves[i].x].text = this.empty;

				if (score > bestScore) {
					bestScore = score;
					bestMove = {y: moves[i].y, x: moves[i].x};
				}
			}
		}
		else {
			const i = this.randRange(0, moves.length);
			bestMove = {y: moves[i].y, x: moves[i].x};
		}

		return bestMove;
	}

	randRange(min, max) {
		return Math.floor((Math.random() * (max - min)) + min);
	}
}