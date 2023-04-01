import { images, keys } from "globals.js";
import State from "lib/State.js";
import ImageNames from "../../../enums/ImageNames.js";
import Sprite from "lib/Sprite.js";
import Animation from "lib/Animation.js";
import Heart from "../../../entities/Heart.js";

export default class HeartCryingState extends State {
	
    static NAME = "heart-crying-state";

	static IDLE_ANIMATION_FRAMES = [0, 1, 2, 3, 4, 5];
	static IDLE_ANIMATION_INTERVAL = 0.1;

	/**
	 * Initializes an crying state of the heart.
	 *
	 * @param {Heart} heart The heart.
	 */
	constructor(heart) {
		super();

        this.heart = heart;
        this.name = HeartCryingState.NAME;
        this.sprites = null;
	}

	enter() {
        this.heart.setSprites(this.getSprites());
        this.heart.setAnimation(new Animation(
            HeartCryingState.IDLE_ANIMATION_FRAMES,
            HeartCryingState.IDLE_ANIMATION_INTERVAL
        ));
	}

    getSprites(refresh) {
        if (!refresh && this.sprites != null) {
            return this.sprites;
        }

        let sprites = [];
        for (let i = 0; i < HeartCryingState.IDLE_ANIMATION_FRAMES.length; i++) {
            sprites.push(new Sprite(
                images.get(ImageNames.HeartCrying),
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
