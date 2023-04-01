import { CANVAS_WIDTH, STANDARD_CANVAS_WIDTH } from "globals.js";

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius.
 *
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius.
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
export const roundedRectangle = (context, x, y, width, height, radius = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5), fill = false, fillColor = null, stroke = true, corner = null) => {
	context.save();
	context.beginPath();
	context.moveTo(x + radius, y);
	
	if (corner == "left") {
		context.lineTo(x + width, y);
		context.lineTo(x + width, y + height);
	}
	else {
		context.lineTo(x + width - radius, y);
		context.quadraticCurveTo(x + width, y, x + width, y + radius);
		context.lineTo(x + width, y + height - radius);
		context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	}
	
	if (corner == "right") {
		context.lineTo(x, y + height);
		context.lineTo(x, y);
		context.lineTo(x + radius, y);
	}
	else {
		context.lineTo(x + radius, y + height);
		context.quadraticCurveTo(x, y + height, x, y + height - radius);
		context.lineTo(x, y + radius);
		context.quadraticCurveTo(x, y, x + radius, y);
	}

	context.closePath();

	if (fill) {
		context.save();

		if (fillColor) {
			context.fillStyle = fillColor;
		}

		context.fill();
		context.restore();
	}

	if (stroke) {
		context.stroke();
	}

	context.restore();
}
