export default class Graphic {
	/**
	 * A wrapper for creating/loading a new Image() object.
	 *
	 * @param {String} path
	 * @param {Number} width
	 * @param {Number} height
	 */
	constructor(source, width, height, context) {
		this.image = new Image(width, height);
		this.image.src = source;
		this.width = width;
		this.height = height;
		this.context = context;
	}

	render(x, y, width = this.width, height = this.height) {
		this.context.drawImage(this.image, x, y, width, height);
	}
}
