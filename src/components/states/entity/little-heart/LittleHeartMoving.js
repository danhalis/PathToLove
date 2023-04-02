import Animation from "lib/Animation.js";
import Sprite from "lib/Sprite.js";
import State from "lib/State.ts";
import LittleHeart from "../../../entities/LittleHeart.js";
import ImageNames from "../../../enums/ImageNames.js";
import { images, TILE_SIZE } from "globals";

export default class LittleHeartMovingState extends State {

    static NAME = "little-heart-moving-state";
    
    static ANIMATION_FRAMES = [0];
    static ANIMATION_INTERVAL = 1;

    constructor(littleHeart) {
        super();

        this.littleHeart = littleHeart;
        this.name = LittleHeartMovingState.NAME;
        this.sprites = null;
    }

    enter() {
        this.littleHeart.setSprites(this.getSprites());
        this.littleHeart.setAnimation(new Animation(
            LittleHeartMovingState.ANIMATION_FRAMES,
            LittleHeartMovingState.ANIMATION_INTERVAL
        ));
    }

    getSprites() {
        return LittleHeart.SPRITES;
    }

    update(dt) {
        this.littleHeart.moveRight();
    }
}