import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Lock from "../../objects/Lock.js";

export default class LockIdleState extends State {

    static NAME = "lock-idle-state";
    
    static ANIMATION_FRAMES = [0];
    static ANIMATION_INTERVAL = 1;

    constructor(lock) {
        super();

        this.lock = lock;
        this.name = LockIdleState.NAME;
        this.sprites = null;
    }

    enter() {
        this.lock.setSprites(this.getSprites());
        this.lock.setAnimation(new Animation(
            LockIdleState.ANIMATION_FRAMES,
            LockIdleState.ANIMATION_INTERVAL
        ));
    }

    getSprites() {
        return Lock.SPRITES;
    }
}