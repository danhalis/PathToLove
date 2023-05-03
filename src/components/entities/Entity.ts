import Directions from "../enums/Directions.js";
import { context, DEBUG } from "globals";
import Vector from "lib/Vector";
import Sprite from "lib/Sprite";
import Animation from "lib/Animation";
import StateMachine from "lib/StateMachine";
import { isAABBCollision } from "../../lib/CollisionHelpers.js";
import Hitbox from "lib/Hitbox";
import ConstraintBox from "lib/ConstraintBox";
import Object from "../objects/Object.js";

export default class Entity {
	dimensions: any;
	hitboxes: Hitbox[];
	useDefaultHitbox: boolean;
	position: any;
	velocity: Vector;
	velocityLimit: any;
	speedScalar: any;
	direction: any;
	sprites: Sprite[];
	isHidden: boolean;
	renderAlpha: number;
	isParalyzed: boolean;
	isDisable: boolean;
	currentAnimation: Animation;
	stateMachine: StateMachine;
	cleanUp: boolean;
	constraintBox: ConstraintBox;
	collidableEntities: Entity[];
	collidableObjects: Object[];
	health: number;
	damage: number;
	isDead: any;

	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {Vector} dimensions The height and width of the entity.
	 * @param {Vector} position The x and y coordinates of the entity.
	 * @param {Vector} velocityLimit The maximum speed of the entity.
	 * @param {Level} level The level that the entity lives in.
	 */
	constructor(dimensions, position, velocityLimit, speedScalar) {
		this.dimensions = dimensions;
		this.hitboxes = [];
		this.hitboxes.push(new Hitbox(position.x, position.y, dimensions.x, dimensions.y));
		this.useDefaultHitbox = true;
		this.position = position;
		
		this.velocity = new Vector(0, 0);
		this.velocityLimit = velocityLimit;
		this.speedScalar = speedScalar;

		this.direction = Directions.Right;
		this.sprites = [];

		this.isHidden = false;
		this.renderAlpha = 1;

		this.isParalyzed = false;
		this.isDisable = false;

		this.currentAnimation = null;
		this.stateMachine = new StateMachine();
		this.cleanUp = false;

		this.constraintBox = null;
		this.collidableEntities = [];
		this.collidableObjects = [];

		this.health = 100;
		this.damage = 0;
	}

	overwriteDefaultHitbox(newHitboxes) {
		this.useDefaultHitbox = false;
		this.hitboxes = newHitboxes;
	}

	getSprites() {
		return this.sprites;
	}

	setSprites(sprites) {
		this.sprites = sprites;
	}

	setAnimation(animation) {
		this.currentAnimation = animation;
	}

	changeState(state, params?) {
		this.stateMachine.change(state, params);
	}

	update(dt) {
		if (this.isParalyzed) return;

		this.stateMachine.update(dt);
		this.position.add(this.velocity, dt);
		this.currentAnimation?.update(dt);

		this.updateEntity(dt);
		this.updateHitboxes(dt);
	}

	updateEntity(dt) {
	}

	updateHitboxes(dt) {
		if (this.useDefaultHitbox) {
			this.hitboxes[0].setX(this.position.x);
			this.hitboxes[0].setY(this.position.y);
		}
	}

	render() {
		if (this.isHidden) return;

		context!.save();
		context!.globalAlpha = this.renderAlpha;

		this.stateMachine.render();

		if (this.isDead) {
			return;
		}

		this.renderEntity();
		context!.restore();

		if (DEBUG) this.renderHitboxes();
	}

	renderHitboxes() {
		this.hitboxes.forEach(hitbox => {
			hitbox.render(context);
		});
	}

	/**
	 * Draw character, this time getting the current frame from the animation.
	 * We also check for our direction and scale by -1 on the X axis if we're facing left.
	 */
	renderEntity() {

		if (this.direction === Directions.Left) {
			context!.save();
			context!.translate(Math.floor(this.position.x) + this.dimensions.x, Math.floor(this.position.y));
			context!.scale(-1, 1);
			this.sprites[this.currentAnimation.getCurrentFrame()].render(0, 0, this.dimensions.x, this.dimensions.y);
			context!.restore();
		}
		else {
			this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(this.position.x), Math.floor(this.position.y), this.dimensions.x, this.dimensions.y);
		}
	}

	/**
	 * Makes the given entity collidable.
	 * @param {Entity} entity The entity to make collidable.
	 */
	 addCollidableEntity(entity) {
		this.collidableEntities.push(entity);
	}

	/**
	 * Makes the given entity not collidable.
	 * @param {Entity} entity 
	 */
	removeCollidableEntity(entity) {
		this.collidableEntities = this.collidableEntities.filter(e => e != entity);
	}
	
	/**
	 * Checks if the entity collided with any other collidable entity.
	 * @returns The entity collided.
	 */
	didHitACollidableEntities() {
		for (const entity of this.collidableEntities) {
			
			if (this.didCollideWithEntity(entity)) {
				return entity;
			}
		}

		return null;
	}

	/**
	 * @param {Entity} entity
	 * @returns Whether this entity collided with another using AABB collision detection.
	 */
	didCollideWithEntity(entity) {
		for (const hitbox1 of this.hitboxes) {
			for (const hitbox2 of entity.hitboxes) {
				return isAABBCollision(
					hitbox1.position.x,
					hitbox1.position.y,
					hitbox1.dimensions.x,
					hitbox1.dimensions.y,
					hitbox2.position.x,
					hitbox2.position.y,
					hitbox2.dimensions.x,
					hitbox2.dimensions.y
				);		
			}
		}
	}

	/**
	 * Makes the given object collidable.
	 * @param {Object} obj The object to make collidable.
	 */
	addCollidableObject(obj) {
		this.collidableObjects.push(obj);
	}

	/**
	 * Makes the given object not collidable.
	 * @param {Object} obj 
	 */
	removeCollidableObject(obj) {
		this.collidableObjects = this.collidableObjects.filter(object => object != obj);
	}
	
	/**
	 * Checks if the entity collided with any collidable object.
	 * @returns The object collided.
	 */
	didHitACollidableObjects() {
		for (const obj of this.collidableObjects) {
			
			if (this.didCollideWithObject(obj)) {
				return obj;
			}
		}

		return null;
	}

	/**
	 * @param {Object} object
	 * @returns Whether this entity collided with an object using AABB collision detection.
	 */
	 didCollideWithObject(object) {
		for (const hitbox1 of this.hitboxes) {
			for (const hitbox2 of object.hitboxes) {
				return isAABBCollision(
					hitbox1.position.x,
					hitbox1.position.y,
					hitbox1.dimensions.x,
					hitbox1.dimensions.y,
					hitbox2.position.x,
					hitbox2.position.y,
					hitbox2.dimensions.x,
					hitbox2.dimensions.y
				);		
			}
		}
	}

	setConstraintBox(topLeft, bottomRight) {
        if (!this.constraintBox) {
            this.constraintBox = new ConstraintBox(topLeft, bottomRight);
        }
        else {
            this.constraintBox.setTopLeft(topLeft);
            this.constraintBox.setBottomRight(bottomRight);
        }
    }

	checkLeftConstraintBox() {
        if (this.constraintBox == null) return false;

        if (this.position.x <= this.constraintBox.topLeft.x) {
            this.position.x = this.constraintBox.topLeft.x;
            return true;
        }

        return false;
    }

    checkRightConstraintBox() {
        if (this.constraintBox == null) return false;

        if (this.position.x + this.dimensions.x >= this.constraintBox.bottomRight.x) {
            this.position.x = this.constraintBox.bottomRight.x - this.dimensions.x;
            return true;
        }

        return false;
    }

	checkTopConstraintBox() {
		if (this.constraintBox == null) return false;

        if (this.position.y <= this.constraintBox.topLeft.y) {
            this.position.y = this.constraintBox.topLeft.y;
            return true;
        }

		return false;
	}

	checkBottomConstraintBox() {
		if (this.constraintBox == null) return false;

	    if (this.position.y + this.dimensions.y >= this.constraintBox.bottomRight.y) {
            this.position.y = this.constraintBox.bottomRight.y - this.dimensions.y;
            return true;
        }

		return false;
	}

	/**
	 * @param {Entity} entity
	 * @param {boolean} absoluteValue
	 * @returns The horizontal distance between this entity and the specified entity.
	 */
	getDistanceTo(entity, absoluteValue) {
		if (absoluteValue) 
			return Math.abs(this.position.x - entity.position.x);

		return this.position.x - entity.position.x;
	}

	hide() {
		this.isHidden = true;
	}

	appear() {
		this.isHidden = false;
	}

	paralyze() {
		this.isParalyzed = true;
	}

	unparalyze() {
		this.isParalyzed = false;
	}

	disable() {
		this.isDisable = true;
	}

	enable() {
		this.isDisable = false;
	}

	takeDamage(damage) {
		this.health = Math.max(this.health - damage, 0);

		this.onTakingDamage();
	}

	onTakingDamage() {
		
	}

	setOnTakingDamage(callBack) {
		this.onTakingDamage = callBack;
	}

	selfCleanUp() {
		this.cleanUp = true;
		this.onSelfCleaningUp();
	}

	onSelfCleaningUp() {

	}

	setOnSelfCleaningUp(callback) {
		this.onSelfCleaningUp = callback;
	}
}
