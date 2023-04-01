import { CANVAS_HEIGHT, CANVAS_WIDTH, images, keys, timer } from "globals.js";
import State from "lib/State.js";
import ImageNames from "../../../enums/ImageNames.js";
import Sprite from "lib/Sprite.js";
import Animation from "lib/Animation.js";
import Heart from "../../../entities/Heart.js";
import LockedHeart from "../../../entities/LockedHeart.js";
import LockedHeartIdleState from "./LockedHeartIdleState.js";

export default class LockedHeartFlyingDownState extends State {
	
    static NAME = "locked-heart-flying-down-state";

	static ANIMATION_FRAMES = [0, 1, 2, 3, 4, 5];
	static ANIMATION_INTERVAL = 0.1;

    static Y_LIMIT = CANVAS_HEIGHT - (CANVAS_HEIGHT * 0.2);

	/**
	 * Initializes an idle state of the heart.
	 *
	 * @param {LockedHeart} heart The heart.
	 */
	constructor(heart) {
		super();

        this.heart = heart;
        this.name = LockedHeartFlyingDownState.NAME;
        this.sprites = null;

        this.yDestination = this.heart.position.y;

        this.preparingToStop = false;
	}

	enter(params) {
        this.heart.setSprites(this.getSprites());
        this.heart.setAnimation(new Animation(
            LockedHeartFlyingDownState.ANIMATION_FRAMES,
            LockedHeartFlyingDownState.ANIMATION_INTERVAL
        ));

        this.yDestination = params.yDestination;
	}

    getSprites() {
        return LockedHeart.SPRITES;
    }

    update(dt) {
        if (this.heart.position.y >= this.yDestination) {
            this.heart.changeState(LockedHeartIdleState.NAME);
            return;
        }

        this.heart.flyDown();
    }
}
