import { isAABBCollision } from "../../lib/CollisionHelpers.js";
import Vector from "../../lib/Vector.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context } from "globals.js";
import Object from "./Object.js";

export default class FrequencyBar extends Object {

    static STROKE_WIDTH = CANVAS_WIDTH / (835 / 5);

    constructor(dimensions, position) {

        super(dimensions, position);

        this.hitboxes[0].colour = 'green';
    }

    renderHitboxes() {
        this.hitboxes.forEach(hitbox => {
            // draw hitboxes on the ceiling
            context.save();
            context.strokeStyle = this.hitboxes[0].colour;
            context.beginPath();
            context.rect(CANVAS_WIDTH - this.dimensions.x - this.position.x, 0, this.dimensions.x, this.dimensions.y);
            context.stroke();
            context.closePath();
            context.restore();

            // draw hitboxes on the floor
            hitbox.render(context);
        });
    }

    renderObject() {
        context.save();

        context.lineWidth = FrequencyBar.STROKE_WIDTH;
        context.strokeStyle = 'rgb(60, 60, 60)'
        context.fillStyle = 'rgb(150, 40, 40)';

        // draw bar on the ceiling
        context.beginPath();
        context.rect(CANVAS_WIDTH - this.dimensions.x - this.position.x, 0, this.dimensions.x, this.dimensions.y);
        context.stroke();
        context.fill();
        context.closePath();

        // draw bar on the floor
        context.beginPath();
        context.rect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
        context.stroke();
        context.fill();
        context.closePath();

        context.restore();
    }

    didCollideWithEntity(entity) {
        for (const hitbox1 of this.hitboxes) {
            for (const hitbox2 of entity.hitboxes) {          

                // check collision on the ceiling
                if (isAABBCollision(
					CANVAS_WIDTH - this.dimensions.x - hitbox1.position.x,
					0,
					hitbox1.dimensions.x,
					hitbox1.dimensions.y,
					hitbox2.position.x,
					hitbox2.position.y,
					hitbox2.dimensions.x,
					hitbox2.dimensions.y
				)) {
                    return true;
                }

                // check collision on the floor
				if (isAABBCollision(
					hitbox1.position.x,
					hitbox1.position.y,
					hitbox1.dimensions.x,
					hitbox1.dimensions.y,
					hitbox2.position.x,
					hitbox2.position.y,
					hitbox2.dimensions.x,
					hitbox2.dimensions.y
				)) {
                    return true;
                }	
			}
        }

        return false;
    }
}