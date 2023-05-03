import Entity from "./Entity";
import StateMachine from "../../lib/StateMachine.js";
import LittleHeartMovingState from "../states/entity/little-heart/LittleHeartMoving.js";
import { CANVAS_WIDTH, images, STANDARD_CANVAS_WIDTH, TILE_SIZE, timer } from "globals";
import ImageNames from "../enums/ImageNames.js";
import Sprite from "../../lib/Sprite.js";
import LittleHeartBreakingState from "../states/entity/little-heart/LittleHeartBreakingState.js";

export default class LittleHeart extends Entity {

    static RENDER_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (TILE_SIZE * 1.5));
    static RENDER_HEIGHT = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (13 * 1.5));

    static SPEED_SCALAR = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 500);
    static VELOCITY_LIMIT = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 500);

    static ANIMATION_FRAMES = [0, 1, 2, 3, 4, 5];
    static SPRITES = [];

    static DAMAGE =100;

    constructor(dimensions, position) {
        super(dimensions, position, LittleHeart.VELOCITY_LIMIT, LittleHeart.SPEED_SCALAR);

        if (LittleHeart.SPRITES.length == 0) {
            LittleHeart.initSprites();
        }

        this.stateMachine = new StateMachine();
        this.states = [
            new LittleHeartMovingState(this),
            new LittleHeartBreakingState(this)
        ];

        this.states.forEach(state => this.stateMachine.add(state));

        this.stateMachine.change(LittleHeartMovingState.NAME);

        this.isBroken = false;

        this.damage = LittleHeart.DAMAGE;
    }

    static initSprites() {

        for (let i = 0; i < LittleHeart.ANIMATION_FRAMES.length; i++) {
            LittleHeart.SPRITES.push(new Sprite(
                images.get(ImageNames.LittleHeart),
                0 + i * TILE_SIZE,
                0,
                TILE_SIZE,
                13
            ));
        }
    }

    moveRight() {
        this.velocity.x = Math.min(this.velocity.x + this.speedScalar, this.velocityLimit);
    }

    update(dt) {
        super.update(dt);
    }

    updateEntity(dt) {
        if (this.isBroken) return;

        if (this.checkRightConstraintBox()) {
            this.break();
            return;
        }

        const entity = this.didHitACollidableEntities();
        if (entity) {
            this.break();
            entity.takeDamage(this.damage);
        }
    }

    stop() {
        this.velocity.x = 0;
    }

    break() {
        if (this.isBroken) return;

        this.isBroken = true;

        this.stop();

        this.changeState(LittleHeartBreakingState.NAME);   
    }
}