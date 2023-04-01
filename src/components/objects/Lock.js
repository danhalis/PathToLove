import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Directions from "../enums/Directions.js";
import ImageNames from "../enums/ImageNames.js";
import SoundNames from "../enums/SoundNames.js";
import { CANVAS_WIDTH, context, images, sounds, STANDARD_CANVAS_WIDTH, timer } from "globals.js";
import LockBreakingState from "../states/object/LockBreakingState.js";
import LockIdleState from "../states/object/LockIdleState.js";
import Object from "./Object.js";

export default class Lock extends Object {

    static RENDER_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (42 * 2));
    static RENDER_HEIGHT = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (35 * 2));

    static ANIMATION_FRAMES = [0, 1, 2, 3];
    static SPRITES = [];

    static MAX_HP = 100;

    static TopLayer = class TopLayer {
        constructor(lock) {
            this.lock = lock;
            this.sprites = [];
        }

        setSprites(sprites) {
            this.sprites = sprites;
        }

        render(x, y, width = Lock.RENDER_WIDTH, height = Lock.RENDER_HEIGHT) {
            this.sprites[0].render(x, y, width, height);
        }
    }

    static BottomLayer = class BottomLayer {
        constructor(lock) {
            this.lock = lock;
            this.sprites = [];
        }

        setSprites(sprites) {
            this.sprites = sprites;
        }

        render(x, y, width = Lock.RENDER_WIDTH, height = Lock.RENDER_HEIGHT) {
            this.sprites[0].render(x, y, width, height);
        }
    }

    constructor(dimensions, position, objectPosition) {
        super(dimensions, position);

        this.objectPosition = objectPosition;

        if (Lock.SPRITES.length == 0) {
            Lock.initSprites();
        }

        this.topLayer = new Lock.TopLayer(this);
        this.bottomLayer = new Lock.BottomLayer(this);

        this.topLayer.setSprites([Lock.SPRITES[0]]);
        this.bottomLayer.setSprites([Lock.SPRITES[1]]);

        this.topLayerRenderAlpha = 1;

        this.stateMachine = new StateMachine();
        this.states = [
            new LockIdleState(this),
            new LockBreakingState(this)
        ];

        this.states.forEach(state => this.stateMachine.add(state));

        this.stateMachine.change(LockIdleState.NAME);

        this.health = Lock.MAX_HP;

        this.isBroken = false;
    }

    static initSprites() {

        for (let i = 0; i < Lock.ANIMATION_FRAMES.length; i++) {
            Lock.SPRITES.push(new Sprite(
                images.get(ImageNames.Lock),
                0 + i * 42,
                0,
                42,
                35
            ));
        }
    }

    update(dt) {
        super.update(dt);
    }

    updateObject(dt) {
        this.position.x = this.objectPosition.x;
        this.position.y = this.objectPosition.y;
    }

    renderObject() {
        if (this.isBroken) {
            super.renderObject();
            return;
        }

        if (this.direction === Directions.Left) {
			context.save();
			context.translate(Math.floor(this.position.x) + this.dimensions.x, Math.floor(this.position.y));
			context.scale(-1, 1);

            this.bottomLayer.render(
                0, 
                0,
                this.dimensions.x,
                this.dimensions.y
            );
            
            context.save();
            context.globalAlpha = this.topLayerRenderAlpha;
            this.topLayer.render(
                0, 
                0,
                this.dimensions.x,
                this.dimensions.y);
            context.restore();

            context.restore();
		}
		else {
            this.bottomLayer.render(
                Math.floor(this.position.x), 
                Math.floor(this.position.y),
                this.dimensions.x,
                this.dimensions.y
            );

            context.save();
            context.globalAlpha = this.topLayerRenderAlpha;
            this.topLayer.render(
                Math.floor(this.position.x), 
                Math.floor(this.position.y),
                this.dimensions.x,
                this.dimensions.y
            );
            context.restore();
		}
    }

    takeDamage(damage) {
        super.takeDamage(damage);

        sounds.play(SoundNames.MetalHit);

        timer.addTask(
            () => {
                this.topLayerRenderAlpha = this.topLayerRenderAlpha === 1 ? 0.3 : 1;
            }, 
            0.1, 
            0.2, 
            () => {
                this.topLayerRenderAlpha = 1;
            }
        );
    }

    break() {
        if (this.isBroken) return;

        this.isBroken = true;

        this.changeState(LockBreakingState.NAME);   
    }
}