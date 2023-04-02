export default class Vector {
	x: number;
	y: number;

	/**
	 * A simple vector class that can add two vectors together.
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(vector: Vector, dt = 1) {
		this.x += vector.x * dt;
		this.y += vector.y * dt;
	}
}
