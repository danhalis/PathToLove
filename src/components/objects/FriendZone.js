import Sprite from "../../lib/Sprite.js";
import Directions from "../enums/Directions.js";
import ImageNames from "../enums/ImageNames.js";
import { CANVAS_WIDTH, images, STANDARD_CANVAS_WIDTH, timer } from "globals";
import Object from "./Object.js";

export default class FriendZone extends Object {
    
    static RENDER_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (412 / 2.5));
    static RENDER_HEIGHT = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (412 / 2.5));

    static DAMAGE = 30;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.damage = FriendZone.DAMAGE;

        this.target = null;
        this.timeout = true;

        this.attacking = true;
    }

    getSprites() {
        let sprites = [];
        sprites.push(new Sprite(
            images.get(ImageNames.FriendZone),
            0,
            0,
            412,
            412
        ));
        return sprites;
    }

    setTarget(entity) {
        this.target = entity;
    }

    async count() {
        this.timeout = false;
        this.isHidden = false;
        await timer.wait(3);
        if (this.attacking && this.target && this.didCollideWithEntity(this.target)) {
            this.target.takeDamage(this.damage);
        }
        this.timeout = true;
        this.isHidden = true;
    }

    stopAttacking() {
        this.attacking = false;
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