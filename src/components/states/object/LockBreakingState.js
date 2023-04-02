import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.ts";
import SoundNames from "../../enums/SoundNames.js";
import { sounds } from "globals";
import Lock from "../../objects/Lock.js";

export default class LockBreakingState extends State {

    static NAME = "lock-breaking-state";
    
    static ANIMATION_FRAMES = [1, 2, 3];
    static ANIMATION_INTERVAL = 0.5;

    constructor(lock) {
        super();

        this.lock = lock;
        this.name = LockBreakingState.NAME;
        this.sprites = null;
    }

    enter() {
        this.lock.setSprites(this.getSprites());
        this.lock.setAnimation(new Animation(
            LockBreakingState.ANIMATION_FRAMES,
            LockBreakingState.ANIMATION_INTERVAL,
            true,
            () => {
                this.lock.selfCleanUp();
            }
        ));

        sounds.play(SoundNames.Chain);
    }

    getSprites() {
        return Lock.SPRITES;
    }
}