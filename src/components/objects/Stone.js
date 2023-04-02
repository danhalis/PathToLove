import Sprite from "../../lib/Sprite.js";
import ImageNames from "../enums/ImageNames.js";
import { CANVAS_WIDTH, images, TILE_SIZE } from "globals";
import Object from "./Object.js";

export default class Stone extends Object {
    static RENDER_WIDTH = CANVAS_WIDTH / (835 / (TILE_SIZE * 2));
    static RENDER_HEIGHT = CANVAS_WIDTH / (835 / (TILE_SIZE * 2));

    constructor(dimensions, position) {
        super(dimensions, position);
    }

    getSprites() {
        let sprites = [];
        sprites.push(new Sprite(
            images.get(ImageNames.Stone),
            0,
            0,
            TILE_SIZE,
            TILE_SIZE
        ));
        return sprites;
    }

    update(dt) {
	}

    renderObject() {
		this.sprites[0].render(
            Math.floor(this.position.x), 
            Math.floor(this.position.y),
            this.dimensions.x,
            this.dimensions.y
        );
	}
}