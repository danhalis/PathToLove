import { images, keys, timer } from "globals.js";
import State from "lib/State.js";
import ImageNames from "../../../enums/ImageNames.js";
import Sprite from "lib/Sprite.js";
import Animation from "lib/Animation.js";
import Heart from "../../../entities/Heart.js";
import LockedHeart from "../../../entities/LockedHeart.js";
import { getRandomPositiveInteger, getRandomPositiveNumber } from "lib/RandomNumberHelpers.js";
import LockedHeartFlyingUpState from "./LockedHeartFlyingUpState.js";
import LockedHeartFlyingDownState from "./LockedHeartFlyingDownState.js";

export default class LockedHeartIdleState extends State {
	
    static NAME = "locked-heart-idle-state";

	static ANIMATION_FRAMES = [0, 1, 2, 3, 4, 5];
	static ANIMATION_INTERVAL = 0.1;

    static DECISIONS = {
        FLY_UP : 0,
        FLY_DOWN : 1
    };

	/**
	 * Initializes an idle state of the heart.
	 *
	 * @param {LockedHeart} heart The heart.
	 */
	constructor(heart) {
		super();

        this.heart = heart;
        this.name = LockedHeartIdleState.NAME;
        this.sprites = null;

        this.preparingToFly = false;
        this.jumping = false;

        this.jumpingTask =  timer.addTask(() => {
            this.jumping = !this.jumping;
        }, 1);
	}

	enter() {
        this.heart.setSprites(this.getSprites());
        this.heart.setAnimation(new Animation(
            LockedHeartIdleState.ANIMATION_FRAMES,
            LockedHeartIdleState.ANIMATION_INTERVAL
        ));
	}

    getSprites() {
        return LockedHeart.SPRITES;
    }

    update(dt) {
        if (this.heart.randomFlyingUpAndDown && !this.preparingToFly) {
            this.prepareToFly();
        }

        if (this.jumping) {
            this.heart.floatUp();
        }
        else {
            this.heart.fallDown();
        }
    }

    async prepareToFly() {
        if (this.preparingToFly) return;

        this.preparingToFly = true;

        const decision = getRandomPositiveInteger(0, 1);

        await timer.wait(3);

        this.preparingToFly = false;

        switch(decision) {
            case LockedHeartIdleState.DECISIONS.FLY_UP:
                this.heart.changeState(
                    LockedHeartFlyingUpState.NAME, 
                    {
                        yDestination: getRandomPositiveNumber(LockedHeartFlyingUpState.Y_LIMIT, this.heart.position.y)
                    }
                );
                break;
            case LockedHeartIdleState.DECISIONS.FLY_DOWN:
                this.heart.changeState(
                    LockedHeartFlyingDownState.NAME, 
                    {
                        yDestination: getRandomPositiveNumber(this.heart.position.y, LockedHeartFlyingDownState.Y_LIMIT - LockedHeart.RENDER_HEIGHT)
                    }
                );
                break;
        }
    }
}
