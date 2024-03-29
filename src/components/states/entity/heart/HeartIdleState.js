import { images, keys } from "globals";
import State from "lib/State.ts";
import ImageNames from "../../../enums/ImageNames.js";
import Sprite from "lib/Sprite.js";
import Animation from "lib/Animation.js";
import Heart from "../../../entities/Heart.js";

export default class HeartIdleState extends State {
	
    static NAME = "heart-idle-state";

	static IDLE_ANIMATION_FRAMES = [0, 1, 2, 3, 4, 5];
	static IDLE_ANIMATION_INTERVAL = 0.1;

	/**
	 * Initializes an idle state of the heart.
	 *
	 * @param {Heart} heart The heart.
	 */
	constructor(heart) {
		super();

        this.heart = heart;
        this.name = HeartIdleState.NAME;
        this.sprites = null;
	}

	enter() {
        this.heart.setSprites(this.getSprites());
        this.heart.setAnimation(new Animation(
            HeartIdleState.IDLE_ANIMATION_FRAMES,
            HeartIdleState.IDLE_ANIMATION_INTERVAL
        ));
	}

    getSprites(refresh) {
        if (!refresh && this.sprites != null) {
            return this.sprites;
        }

        let sprites = [];
        for (let i = 0; i < HeartIdleState.IDLE_ANIMATION_FRAMES.length; i++) {
            sprites.push(new Sprite(
                images.get(ImageNames.HeartBeating),
                i * 42,
                0,
                42,
                35
            ));
        }
        this.sprites = sprites;
        return this.sprites;
    }
}
