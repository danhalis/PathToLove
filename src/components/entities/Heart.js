import Hitbox from "../../lib/Hitbox.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.ts";
import SoundNames from "../enums/SoundNames.js";
import { CANVAS_WIDTH, keys, sounds, STANDARD_CANVAS_WIDTH, timer } from "globals";
import HeartCryingState from "../states/entity/heart/HeartCryingState.js";
import HeartIdleState from "../states/entity/heart/HeartIdleState.js";
import HeartShootingState from "../states/entity/heart/HeartShooting.js";
import Entity from "./Entity.js";
import LittleHeartFactory from "./factories/LittleHeartFactory.js";

export default class Heart extends Entity {

    static RENDER_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (42 * 2));
    static RENDER_HEIGHT = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (35 * 2));

    static GRAVITY_SCALAR = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 10);
    static GRAVITY_LIMIT  = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 240);

    static SPEED_SCALAR = new Vector(
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 60),
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 60)
    );

    static VELOCITY_LIMIT = new Vector(
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 240),
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 240)
    );

    static MAX_HP = 100;

    static INVICIBLE_TIME = 3;
    static SHOOTING_TIME = 5;

    constructor(dimensions, position) {
        super(dimensions, position, Heart.VELOCITY_LIMIT, Heart.SPEED_SCALAR);

        this.gravityScalar = Heart.GRAVITY_SCALAR;
        
        this.stateMachine = new StateMachine();
        this.states = [
            new HeartIdleState(this),
            new HeartCryingState(this),
            new HeartShootingState(this)
        ];

        this.states.forEach(state => this.stateMachine.add(state));

        this.stateMachine.change(HeartIdleState.NAME);

        this.littleHeartFactory = new LittleHeartFactory();

        this.littleHearts = [];

        this.health = Heart.MAX_HP;

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

        this.isCrying = false;
        this.isInvicible = false;
        this.isShooting = false;

        this.targetToShoot = null;
    }

    updateHitboxes(dt) {
        this.hitboxes[0].setX(this.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (3 * 2)));
        this.hitboxes[0].setY(this.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (3 * 2)));

        this.hitboxes[1].setX(this.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (7 * 2)));
        this.hitboxes[1].setY(this.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (25 * 2)));

        this.hitboxes[2].setX(this.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (11 * 2)));
        this.hitboxes[2].setY(this.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / (29 * 2)));
	}

    setTargetToShoot(entity) {
        this.targetToShoot = entity;
    }

    updateEntity(dt) {
        if (!this.isDisable) {
            this.checkMovement();
        }

        this.cleanUpLittleHearts();

        this.littleHearts.forEach(littleHeart => {
            littleHeart.update(dt);
        });
    }

    cleanUpLittleHearts() {
        this.littleHearts = this.littleHearts.filter(littleHeart => !littleHeart.cleanUp);
    }

    renderEntity(){
        super.renderEntity();

        this.littleHearts.forEach(littleHeart => {
            littleHeart.render();
        });
    }

    checkMovement() {

        if (keys[" "]) {
            this.shoot();
        }

        if (!keys.a && !keys.d) {
            this.stopMoving();
        }
        else {
            if (keys.a) {

                if (!this.checkLeftConstraintBox()) {
                    this.moveLeft();
                }
            }
            if (keys.d) {
                if (!this.checkRightConstraintBox()) {
                    this.moveRight();
                }
            }
        }    

        if (keys.w) {
            if (this.checkTopConstraintBox()) {
                this.velocity.y = 0;
                return;
            }

            this.stopFalling();

            this.flyUp();
        }
        else {
            if (this.checkBottomConstraintBox()) {
                return;
            }

            this.fallDown();
        }
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

    fallDown() {
        this.velocity.y = Math.min(this.velocity.y + this.gravityScalar, Heart.GRAVITY_LIMIT);
    }

    stopMoving() {
        this.velocity.x = 0;
    }
    
    stopFalling() {
        if (this.velocity.y <= 0) return;

        this.velocity.y = 0;
    }

    cry() {
        if (this.isCrying) return;

        this.isCrying = true;

        if (this.isShooting) {
            return;
        }

        this.changeState(HeartCryingState.NAME);
    }

    stopCrying() {
        if (!this.isCrying) return;       
        
        this.isCrying = false;

        if (this.isShooting) {
            this.changeState(HeartShootingState.NAME) 
        }
        else {
            this.changeState(HeartIdleState.NAME);
        }
    }

    takeDamage(damage) {
        if (this.isInvicible) return;

        super.takeDamage(damage);

        sounds.play(SoundNames.Hit);

        this.cry();

        this.isInvicible = true;

        timer.addTask(
            () => {
                this.renderAlpha = this.renderAlpha === 1 ? 0.3 : 1;
            }, 
            0.1, 
            Heart.INVICIBLE_TIME, 
            () => {
                this.isInvicible = false;
                this.stopCrying();
                this.renderAlpha = 1;
            }
        );
    }

    shoot() {
        if (this.isShooting) return;

        this.isShooting = true;

        this.changeState(HeartShootingState.NAME);

        timer.addTask(
            () => {

            }, 
            0.1, 
            Heart.SHOOTING_TIME, 
            () => {
                this.stopShooting();
            }
        );
    }

    stopShooting() {
        if (!this.isShooting) return;

        this.isShooting = false;

        if (this.isCrying) {
            this.changeState(HeartCryingState.NAME);
        }
        else {
            this.changeState(HeartIdleState.NAME);
        }
    }
}