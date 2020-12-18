// Global Variables
const keypress = [];
const mouse = {
	x: 0,
	y: 0,
	down: false,
	click: false,
};
const game = new GameEngine();
const canvasBoundingClientRect = game.canvas.getBoundingClientRect();

function render() {
	requestAnimationFrame(render);
	game.render();
	game.update();
}

// Event Listeners

game.canvas.addEventListener('click', (e) => {
	mouse.click = true;
});

game.canvas.addEventListener('mousedown', (e) => {
	mouse.down = true;
});

game.canvas.addEventListener('mouseup', (e) => {
	mouse.down = false;
});

document.addEventListener('mousemove', (e) => {
	mouse.x = e.clientX - canvasBoundingClientRect.left;
	mouse.y = e.clientY - canvasBoundingClientRect.top;
});

document.addEventListener('keydown', (e) => {
	keypress[e.keyCode] = true;
});

document.addEventListener('keyup', (e) => {
	keypress[e.keyCode] = false;
});