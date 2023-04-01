import Directions from "../enums/Directions.js";
import { context, DEBUG } from "globals.js";
import Vector from "../../lib/Vector.js";
import Entity from "../entities/Entity.js";
import { isAABBCollision } from "../../lib/CollisionHelpers.js";
import Hitbox from "../../lib/Hitbox.js";

export default class Object {
	/**
	 * The base class to be extended by all objects in the game.
	 *
	 * @param {Vector} dimensions The height and width of the entity.
	 * @param {Vector} position The x and y coordinates of the entity.
	 */
	constructor(dimensions, position) {
		this.dimensions = dimensions;
		this.position = position;
		this.direction = Directions.Right;
		
		this.hitboxes = [];
		this.hitboxes.push(new Hitbox(position.x, position.y, dimensions.x, dimensions.y));
		this.useDefaultHitbox = true;

		this.sprites = this.getSprites();
		this.currentAnimation = null;
		this.renderAlpha = 1;

		this.stateMachine = null;

		this.isHidden = false;
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

	setWidth(width) {
		this.dimensions.x = width;
		this.hitboxes[0].dimensions.x = width;
	}

	setHeight(height) {
		this.dimensions.y = height;
		this.hitboxes[0].dimensions.y = height;
	}

	setX(x) {
		this.position.x = x;
		this.hitboxes[0].position.x = x;
	}

	setY(y) {
		this.position.y = y;
		this.hitboxes[0].position.y = y;
	}

    getSprites() {
        return [];
    }

	setSprites(sprites) {
		this.sprites = sprites;
	}

	setAnimation(animation) {
		this.currentAnimation = animation;
	}

	changeState(state, params) {
		this.stateMachine.change(state, params);
	}

	update(dt) {
		this.stateMachine?.update(dt);
		this.currentAnimation?.update(dt);
		this.updateObject(dt);
		this.updateHitboxes(dt);
	}

	updateObject(dt) {
	}

	updateHitboxes(dt) {
		if (this.useDefaultHitbox) {
			this.hitboxes[0].setX(this.position.x);
			this.hitboxes[0].setY(this.position.y);
		}
	}

	render() {
		if (this.isHidden) return;

		context.save();
		context.globalAlpha = this.renderAlpha;

		this.stateMachine?.render();

		this.renderObject();

		if (DEBUG) this.renderHitboxes();

		context.restore();
	}

	renderHitboxes() {
		this.hitboxes.forEach(hitbox => {
			hitbox.render(context);
		});
	}

	renderObject() {
		if (this.direction === Directions.Left) {
			context.save();
			context.translate(Math.floor(this.position.x) + this.dimensions.x, Math.floor(this.position.y));
			context.scale(-1, 1);
			this.sprites[this.currentAnimation?.getCurrentFrame()].render(
				0, 
				0,
				this.dimensions.x,
				this.dimensions.y);
			context.restore();
		}
		else {
			this.sprites[this.currentAnimation?.getCurrentFrame()].render(
				Math.floor(this.position.x), 
				Math.floor(this.position.y),
				this.dimensions.x,
				this.dimensions.y
			);
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
	removeCollidableObject(entity) {
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
