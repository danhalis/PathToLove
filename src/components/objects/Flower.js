import Sprite from "../../lib/Sprite.js";
import Directions from "../enums/Directions.js";
import ImageNames from "../enums/ImageNames.js";
import { CANVAS_WIDTH, context, images } from "globals.js";
import Object from "./Object.js";

export default class Flower extends Object {

    static RENDER_WIDTH = CANVAS_WIDTH / (835 / (13 * 5));
    static RENDER_HEIGHT = CANVAS_WIDTH / (835 / (5 * 5));

    constructor(dimensions, position) {
        super(dimensions, position);
    }

    getSprites() {
        let sprites = [];
        sprites.push(new Sprite(
            images.get(ImageNames.FlowerOnGround),
            0,
            0,
            13,
            5
        ));
        return sprites;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    update(dt) {
    }

    renderObject() {
        if (this.direction === Directions.Left) {
			context.save();
			context.translate(Math.floor(this.position.x) + this.dimensions.x, Math.floor(this.position.y));
			context.scale(-1, 1);
			this.sprites[0].render(
				0, 
				0,
				this.dimensions.x,
				this.dimensions.y);
			context.restore();
		}
		else {
			this.sprites[0].render(
				Math.floor(this.position.x), 
				Math.floor(this.position.y),
				this.dimensions.x,
				this.dimensions.y
			);
		}
	}
}