import { getRandomPositiveNumber } from "../../../lib/RandomNumberHelpers.js";
import Vector from "../../../lib/Vector.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, STANDARD_CANVAS_WIDTH, TILE_SIZE } from "globals.js";
import LittleHeart from "../LittleHeart.js";

export default class LittleHeartFactory {

    constructor() {
    }

    create(position) {

        const newLittleHeart = new LittleHeart(
            new Vector(
                LittleHeart.RENDER_WIDTH,
                LittleHeart.RENDER_HEIGHT
            ),
            new Vector(
                position.x,
                position.y
            )
        );

        newLittleHeart.setConstraintBox(
            new Vector(0, 0),
            new Vector(CANVAS_WIDTH + LittleHeart.RENDER_WIDTH, CANVAS_HEIGHT)
        )

        return newLittleHeart;
    }
}