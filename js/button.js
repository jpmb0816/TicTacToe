class Button {
	constructor(text, x, y, width, height, fontSize) {
		this.text = text;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.fontSize = fontSize;

		this.buttonColor = 'gray';
		this.textColor = 'black';
	}

	render(ctx) {
		ctx.fillStyle = this.buttonColor;
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';

		ctx.font = this.fontSize + 'px san-serif';
		ctx.fillStyle = this.textColor;
		ctx.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2));

		ctx.textBaseline = 'alphabetic';
		ctx.textAlign = 'start';
	}

	collide(point) {
		return ((this.x < point.x && this.x + this.width > point.x) && (this.y < point.y && this.y + this.height > point.y));
	}
}