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

		this.buttons = [];
		this.playerTurn = true;
		this.hasWinner = false;
		this.winner = '';

		this.createCanvas(this.MAX_WIDTH, this.MAX_HEIGHT);
	}

	// Main Functions

	init() {
		// Initialization
	}

	initRects() {
		for (let y = 0; y < this.cols; y++) {
			const arr = [];

			for (let x = 0; x < this.rows; x++) {
				arr.push(new Button('', (this.rectWidth * x) + (this.rectGap * (x + 1)),
								(this.rectHeight * y) + (this.rectGap * (y + 1)),
								this.rectWidth, this.rectHeight));
			}

			this.buttons.push(arr);
		}
	}

	restartGame() {
		this.playerTurn = true;
		this.hasWinner = false;
		this.winner = '';

		for (let y = 0; y < this.cols; y++) {
			for (let x = 0; x < this.rows; x++) {
				this.buttons[y][x].text = '';
			}
		}
	}

	update() {
		if (this.running) {
			for (let y = 0; y < this.cols; y++) {
				for (let x = 0; x < this.rows; x++) {
					const b = this.buttons[y][x];

					if (b.text != '') {
						b.buttonColor = 'lightgray';
					}
					else if (b.collide(mouse)) {
						if (mouse.down) {
							b.buttonColor = 'green';
						}
						else if (mouse.click) {
							if (this.playerTurn) {
								b.text = 'X';
								this.playerTurn = false;
							}
							else {
								b.text = 'O';
								this.playerTurn = true;
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

			if (this.isWinner('X')) {
				this.hasWinner = true;
				this.winner = 'X';
				this.running = false;
			}
			else if (this.isWinner('O')) {
				this.hasWinner = true;
				this.winner = 'O';
				this.running = false;
			}
		}

		mouse.click = false;
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
			this.renderPlayAgainScreen();
		}
	}

	// Render Screen Functions

	renderBackgroundScreen() {
		this.ctx.fillStyle = this.BG_COLOR;
		this.ctx.fillRect(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT);
	}

	renderStartingScreen() {
		this.renderText(this.title, this.centerX, 240, 'white', 'center');
		this.renderText('By: ' + this.author, this.centerX, 270, 'white', 'center');

		this.renderText('[Press Enter to Play]', this.centerX, 340, 'white', 'center', '15px san-serif');

		if (keypress[13]) {
			this.running = true;
			this.recentlyStarted = false;
			this.initRects();
		}
	}

	renderInGameScreen() {
		for (let y = 0; y < this.cols; y++) {
			for (let x = 0; x < this.rows; x++) {
				this.buttons[y][x].render(this.ctx);
			}
		}
	}

	renderPlayAgainScreen() {
		this.renderText('Player ' + this.winner + ', Wins!', this.centerX, 320, 'yellow', 'center', '15px san-serif');
		this.renderText('[Press Enter to Play Again]', this.centerX, 350, 'white', 'center', '15px san-serif');

		if (keypress[13]) {
			this.running = true;
			this.restartGame();
		}
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

	isWinner(player) {
		const board = this.buttons;
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
}