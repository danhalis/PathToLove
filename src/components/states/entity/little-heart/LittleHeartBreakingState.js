import Animation from "lib/Animation.js";
import State from "lib/State.ts";
import LittleHeart from "../../../entities/LittleHeart.js";

export default class LittleHeartBreakingState extends State {

    static NAME = "little-heart-breaking-state";
    
    static ANIMATION_FRAMES = [1, 2, 3, 4, 5];
    static ANIMATION_INTERVAL = 0.1;

    constructor(littleHeart) {
        super();

        this.littleHeart = littleHeart;
        this.name = LittleHeartBreakingState.NAME;
        this.sprites = null;
    }

    enter() {
        this.littleHeart.setSprites(this.getSprites());
        this.littleHeart.setAnimation(new Animation(
            LittleHeartBreakingState.ANIMATION_FRAMES,
            LittleHeartBreakingState.ANIMATION_INTERVAL,
            true,
            () => {
                this.littleHeart.selfCleanUp();
            }
        ));
    }

    getSprites() {
        return LittleHeart.SPRITES;
    }
}