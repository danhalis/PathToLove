import { CANVAS_WIDTH, images, sounds, STANDARD_CANVAS_WIDTH, timer } from "globals";
import State from "lib/State.ts";
import ImageNames from "../../../enums/ImageNames.js";
import Sprite from "lib/Sprite.js";
import Animation from "lib/Animation.js";
import Heart from "../../../entities/Heart.js";
import Vector from "lib/Vector.ts";
import { getRandomPositiveNumber } from "lib/RandomNumberHelpers.js";
import SoundNames from "../../../enums/SoundNames.js";

export default class HeartShootingState extends State {
	
    static NAME = "heart-shooting-state";

	static IDLE_ANIMATION_FRAMES = [0, 1, 2, 3, 4, 5];
	static IDLE_ANIMATION_INTERVAL = 0.1;

    static LITTLE_HEART_PER_FRAME = 1;

    static LITTLE_HEART_LOWEST_POSITION_OFFSET = new Vector(
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (24 * 2)),
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (10 * 2))
    );

    static LITTLE_HEART_HIGHEST_POSITION_OFFSET = new Vector(
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (30 * 2)),
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (26 * 2))
    )

	/**
	 * Initializes an shooting state of the heart.
	 *
	 * @param {Heart} heart The heart.
	 */
	constructor(heart) {
		super();

        this.heart = heart;
        this.name = HeartShootingState.NAME;
        this.sprites = null;

        this.coolingDown = false;
	}

	enter() {
        this.heart.setSprites(this.getSprites());
        this.heart.setAnimation(new Animation(
            HeartShootingState.IDLE_ANIMATION_FRAMES,
            HeartShootingState.IDLE_ANIMATION_INTERVAL
        ));
	}

    getSprites(refresh) {
        if (!refresh && this.sprites != null) {
            return this.sprites;
        }

        let sprites = [];
        for (let i = 0; i < HeartShootingState.IDLE_ANIMATION_FRAMES.length; i++) {
            sprites.push(new Sprite(
                images.get(ImageNames.HeartShooting),
                i * 42,
                0,
                42,
                35
            ));
        }
        this.sprites = sprites;
        return this.sprites;
    }

    update(dt) {

        for (let i = 0; i < HeartShootingState.LITTLE_HEART_PER_FRAME; i++) {
            if (!this.coolingDown) {

                this.coolDown();

                sounds.play(SoundNames.Shoot);

                const newLittleHeart = this.heart.littleHeartFactory.create(
                    new Vector(
                        getRandomPositiveNumber(
                            this.heart.position.x + HeartShootingState.LITTLE_HEART_LOWEST_POSITION_OFFSET.x,
                            this.heart.position.x + HeartShootingState.LITTLE_HEART_HIGHEST_POSITION_OFFSET.x
                        ),
                        getRandomPositiveNumber(
                            this.heart.position.y + HeartShootingState.LITTLE_HEART_LOWEST_POSITION_OFFSET.y,
                            this.heart.position.y + HeartShootingState.LITTLE_HEART_HIGHEST_POSITION_OFFSET.y
                        )
                    )
                );

                if (this.heart.targetToShoot) {
                    newLittleHeart.addCollidableEntity(this.heart.targetToShoot);
                }

                this.heart.littleHearts.push(newLittleHeart);
            }
        }
    }

    async coolDown() {
        if (this.coolDown) return;

        this.coolingDown = true;

        await timer.wait(0.01);
        this.coolingDown = false;
    }
}
