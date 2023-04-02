import Hitbox from "../../lib/Hitbox.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.ts";
import { CANVAS_WIDTH, images, STANDARD_CANVAS_WIDTH, timer } from "globals";
import LockedHeartIdleState from "../states/entity/locked-heart/LockedHeartIdleState.js";
import Entity from "./Entity.js";
import Lock from "../objects/Lock.js";
import Sprite from "../../lib/Sprite.js";
import ImageNames from "../enums/ImageNames.js";
import FriendZone from "../objects/FriendZone.js";
import Heart from "./Heart.js";
import LockedHeartFlyingUpState from "../states/entity/locked-heart/LockedHeartFlyingUpState.js";
import LockedHeartFlyingDownState from "../states/entity/locked-heart/LockedHeartFlyingDownState.js";

export default class LockedHeart extends Entity {

    static RENDER_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (42 * 2));
    static RENDER_HEIGHT = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (35 * 2));

    static ANIMATION_FRAMES = [0, 1, 2, 3, 4, 5];
    static SPRITES = [];

    static GRAVITY_SCALAR = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 20);
    static GRAVITY_LIMIT  = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 20);

    static SPEED_SCALAR = new Vector(
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 20),
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 60)
    );

    static VELOCITY_LIMIT = new Vector(
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 20),
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 240)
    );

    constructor(dimensions, position, playerHeart) {
        super(dimensions, position, LockedHeart.VELOCITY_LIMIT, LockedHeart.SPEED_SCALAR);

        if (LockedHeart.SPRITES.length == 0) {
            LockedHeart.initSprites();
        }

        this.gravityScalar = LockedHeart.GRAVITY_SCALAR;
        
        this.stateMachine = new StateMachine();
        this.states = [
            new LockedHeartIdleState(this),
            new LockedHeartFlyingUpState(this),
            new LockedHeartFlyingDownState(this)
        ];

        this.states.forEach(state => this.stateMachine.add(state));

        this.stateMachine.change(LockedHeartIdleState.NAME);

        this.lock = new Lock(
            new Vector(Lock.RENDER_WIDTH, Lock.RENDER_HEIGHT),
            new Vector(this.position.x, this.position.y),
            this.position
        );

        this.isLocked = true;

        this.lock.setOnSelfCleaningUp(() => {
            this.lock = null;
            this.isLocked = false;
        });

        this.friendZone = new FriendZone(
            new Vector(FriendZone.RENDER_WIDTH, FriendZone.RENDER_HEIGHT),
            new Vector(0, 0)
        );

        this.playerHeart = playerHeart;
        this.friendZone.setTarget(this.playerHeart);

        this.friendZone.isHidden = true;
        this.friendZoneCoolingDown = false;

        this.randomFlyingUpAndDown = true;

        this.attacking = true;

        this.overwriteDefaultHitbox([
            new Hitbox(
                this.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (3 * 2)), 
                this.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (3 * 2)), 
                CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (36 * 2)), 
                CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (22 * 2))
            ),
            new Hitbox(
                this.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (7 * 2)), 
                this.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (25 * 2)), 
                CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (28 * 2)), 
                CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (4 * 2))
            ),
            new Hitbox(
                this.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (11 * 2)), 
                this.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (29 * 2)), 
                CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (20 * 2)), 
                CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (3 * 2))
            )
        ]);
    }

    static initSprites() {
        for (let i = 0; i < LockedHeart.ANIMATION_FRAMES.length; i++) {
            LockedHeart.SPRITES.push(new Sprite(
                images.get(ImageNames.FacelessHeartBeating),
                i * 42,
                0,
                42,
                35
            ));
        }
    }

    updateHitboxes(dt) {
        this.hitboxes[0].setX(this.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (3 * 2)));
        this.hitboxes[0].setY(this.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (3 * 2)));

        this.hitboxes[1].setX(this.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (7 * 2)));
        this.hitboxes[1].setY(this.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (25 * 2)));

        this.hitboxes[2].setX(this.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (11 * 2)));
        this.hitboxes[2].setY(this.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (29 * 2)));
	}

    getLockHealth() {
        if (!this.lock) return 0;

        return this.lock.health;
    }

    updateEntity(dt) {

        this.checkTopConstraintBox();
        this.checkBottomConstraintBox();

        if (this.friendZone.timeout && !this.friendZoneCoolingDown) {
            this.spawnFriendZone();
        }
        
        this.lock?.update(dt);

        if (this.attacking) {
            this.friendZone.update(dt);
        }
    }

    renderEntity(){
        super.renderEntity();

        this.lock?.render();

        if (this.attacking) {
            this.friendZone.render();
        }
    }

    stopAttacking() {
        this.attacking = false;

        this.friendZone.stopAttacking();
    }

    moveLeft() {
		this.velocity.x = Math.max(this.velocity.x - this.speedScalar.x, -this.velocityLimit.x);
	}

	moveRight() {
		this.velocity.x = Math.min(this.velocity.x + this.speedScalar.x, this.velocityLimit.x);
	}

    flyUp() {
        this.velocity.y = Math.max(this.velocity.y - this.speedScalar.y, -this.velocityLimit.y);
    }

    flyDown() {
        this.velocity.y = Math.min(this.velocity.y + this.speedScalar.y, this.velocityLimit.y);
    }

    floatUp() {
        this.velocity.y = Math.max(this.velocity.y - this.gravityScalar, -LockedHeart.GRAVITY_LIMIT);
    }

    fallDown() {
        this.velocity.y = Math.min(this.velocity.y + this.gravityScalar, LockedHeart.GRAVITY_LIMIT);
    }

    stopMoving() {
        this.velocity.x = 0;
    }
    
    stopFalling() {
        if (this.velocity.y <= 0) return;

        this.velocity.y = 0;
    }

    flyRandomly() {
        this.randomFlyingUpAndDown = true;
    }

    stayStill() {
        this.randomFlyingUpAndDown = false;
        this.changeState(LockedHeartIdleState.NAME);
    }

    takeDamage(damage) {
        this.lock?.takeDamage(damage);
    }

    setOnTakingDamage(callBack) {
        this.lock?.setOnTakingDamage(callBack);
    }

    async friendZoneCoolDown() {
        if (this.friendZoneCoolingDown) return;

        this.friendZoneCoolingDown = true;

        await timer.wait(3);
        this.friendZoneCoolingDown = false;
    }

    async spawnFriendZone() {

        this.friendZone.setX((this.playerHeart.position.x - (FriendZone.RENDER_WIDTH - Heart.RENDER_WIDTH) / 2));
        this.friendZone.setY(this.playerHeart.position.y - (FriendZone.RENDER_WIDTH - Heart.RENDER_HEIGHT) / 2);

        await this.friendZone.count();

        this.friendZoneCoolDown();
    }

    breakLock() {
        this.lock?.break();
    }
}