import { images, keys, TILE_SIZE, timer } from "globals";
import State from "lib/State.ts";
import ImageNames from "../../../enums/ImageNames.js";
import Sprite from "lib/Sprite.js";
import Animation from "lib/Animation.js";
import Character from "../../../entities/character/Character.ts";
import CharacterStandingStillState from "./CharacterStandingStillState.js";
import Genders from "../../../enums/Genders.js";
import Directions from "../../../enums/Directions.js";
import CharacterState from "./CharacterState";
import { UpperBodySprites } from "components/entities/character/UpperBody";
import { LowerBodySprites } from "components/entities/character/LowerBody";

export default class CharacterWalkingState extends CharacterState {

	static NAME = "character-walking";

	static WALKING_UPPER_BODY_ANIMATION_FRAMES = [0, 1];
	static WALKING_UPPER_BODY_ANIMATION_INTERVAL = 0.3;
	static WALKING_LOWER_BODY_ANIMATION_FRAMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	static WALKING_LOWER_BODY_ANIMATION_INTERVAL = 0.09;

	/**
	 * Initializes a walking state of the charater. 
	 *
	 * @param {Character} character character.
	 */
	constructor(character) {
		super(character);

		this.name = CharacterWalkingState.NAME;

		this.upperBodySprites = null;
		this.lowerBodySprites = null;
	}

	enter() {
		this.character.upperBody.setSprites(this.getUpperBodySprites());
		this.character.upperBody.setAnimation(new Animation(
			CharacterWalkingState.WALKING_UPPER_BODY_ANIMATION_FRAMES,
			CharacterWalkingState.WALKING_UPPER_BODY_ANIMATION_INTERVAL
		));

		this.character.lowerBody.setSprites(this.getLowerBodySprites());
		this.character.lowerBody.setAnimation(new Animation(
			CharacterWalkingState.WALKING_LOWER_BODY_ANIMATION_FRAMES,
			CharacterWalkingState.WALKING_LOWER_BODY_ANIMATION_INTERVAL
		));
	}

	/**
	 * Retrieves the walking upper boddy sprites. If refresh is true, the sprites is refreshed.
	 * @param {boolean} refresh 
	 * @returns walking upper body sprites.
	 */
	getUpperBodySprites(refresh = false) {

		if (!refresh && this.upperBodySprites != null) {
			return this.upperBodySprites;
		}

		let imageName;
		if (this.character.gender == Genders.Male) {
			if (this.character.isHoldingFlower)
				imageName = ImageNames.MaleOfferingFlowerUpperBody;
			else
				imageName = ImageNames.MaleStandingStillUpperBody;
		}
		else {
			if (this.character.isHoldingFlower)
				imageName = ImageNames.FemaleOfferingFlowerUpperBody;
			else
				imageName = ImageNames.FemaleStandingStillUpperBody;
		}

		// generate outline sprites
		let outlineSprites = this.getUpperOutlineSprites(imageName);

		// generate hair sprites
		let hairSprites = this.getHairSprites(imageName);

		// generate skin sprites
		let skinSprites = this.getUpperSkinSprites(imageName);

		// generate shirt/blouse sprites
		let clothesSprites = this.getUpperClothesSprites(imageName);

		this.upperBodySprites = new UpperBodySprites({
			outlineSprites,
			hairSprites,
			skinSprites,
      clothesSprites,
		});

		return this.upperBodySprites;
	}

	getUpperOutlineSprites(imageName) {

		let outlineSprites = [];
		for (let i = 0; i < CharacterWalkingState.WALKING_UPPER_BODY_ANIMATION_FRAMES.length; i++) {
			outlineSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				0,
				TILE_SIZE,
				TILE_SIZE * 2
			));
		}

		return outlineSprites;
	}

	getHairSprites(imageName = null) {

		if (imageName == null) {
			if (this.character.gender == Genders.Male) {
				imageName = ImageNames.MaleOfferingFlowerUpperBody;
			}
			else {
				imageName = ImageNames.FemaleOfferingFlowerUpperBody;
			}
		}

		let hairSprites = [];
		for (let i = 0; i < CharacterWalkingState.WALKING_UPPER_BODY_ANIMATION_FRAMES.length; i++) {
			hairSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				(1 + this.character.hairColor) * TILE_SIZE * 2,
				TILE_SIZE,
				TILE_SIZE * 2
			));
		}

		return hairSprites;
	}

	getUpperSkinSprites(imageName = null) {

		if (imageName == null) {
			if (this.character.gender == Genders.Male) {
				imageName = ImageNames.MaleOfferingFlowerUpperBody;
			}
			else {
				imageName = ImageNames.FemaleOfferingFlowerUpperBody;
			}
		}

		let skinSprites = [];
		for (let i = 0; i < CharacterWalkingState.WALKING_UPPER_BODY_ANIMATION_FRAMES.length; i++) {
			skinSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				(4 + this.character.skinColor) * TILE_SIZE * 2,
				TILE_SIZE,
				TILE_SIZE * 2
			));
		}

		return skinSprites;
	}

	getUpperClothesSprites(imageName = null) {

		if (imageName == null) {
			if (this.character.gender == Genders.Male) {
				imageName = ImageNames.MaleOfferingFlowerUpperBody;
			}
			else {
				imageName = ImageNames.FemaleOfferingFlowerUpperBody;
			}
		}

		let clothesSprites = [];
		for (let i = 0; i < CharacterWalkingState.WALKING_UPPER_BODY_ANIMATION_FRAMES.length; i++) {
			clothesSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				(7 + this.character.upperClothesColor) * TILE_SIZE * 2,
				TILE_SIZE,
				TILE_SIZE * 2
			));
		}

		return clothesSprites;
	}

	/**
	 * Retrieves the walking lower boddy sprites. If refresh is true, the sprites is refreshed.
	 * @param {boolean} refresh 
	 * @returns walking lower body sprites.
	 */
	getLowerBodySprites(refresh = false) {

		if (!refresh && this.lowerBodySprites != null) {
			return this.lowerBodySprites;
		}

		let imageName;
		if (this.character.gender == Genders.Male) {
			imageName = ImageNames.MaleWalkingLowerBody;
		}
		else {
			imageName = ImageNames.FemaleWalkingLowerBody;
		}

		// generate outline sprites
		let outlineSprites = this.getLowerOutlineSprites(imageName);

		// generate shorts/skirt sprites
		let clothesSprites = this.getLowerClothesSprites(imageName);

		// generate skin sprites
		let skinSprites = this.getLowerSkinSprites(imageName);

		// generate shoes sprites
		let shoesSprites = this.getShoesSprites(imageName);

		this.lowerBodySprites = new LowerBodySprites({
			outlineSprites,
      clothesSprites,
      skinSprites,
      shoesSprites,
		});

		return this.lowerBodySprites;
	}

	getLowerOutlineSprites(imageName) {

		let outlineSprites = [];
		for (let i = 0; i < CharacterWalkingState.WALKING_LOWER_BODY_ANIMATION_FRAMES.length; i++) {
			outlineSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				0,
				TILE_SIZE,
				TILE_SIZE * 2,
			));
		}

		return outlineSprites;
	}

	getLowerClothesSprites(imageName = null) {

		if (imageName == null) {
			if (this.character.gender == Genders.Male) {
				imageName = ImageNames.MaleOfferingFlowerUpperBody;
			}
			else {
				imageName = ImageNames.FemaleOfferingFlowerUpperBody;
			}
		}

		let clothesSprites = [];
        for (let i = 0; i < CharacterWalkingState.WALKING_LOWER_BODY_ANIMATION_FRAMES.length; i++) {
            clothesSprites.push(new Sprite(
                images.get(imageName),
                i * TILE_SIZE,
                (1 + this.character.lowerClothesColor) * TILE_SIZE * 2,
                TILE_SIZE,
                TILE_SIZE * 2,
            ));
        }

		return clothesSprites;
	}

	getLowerSkinSprites(imageName = null) {

		if (imageName == null) {
			if (this.character.gender == Genders.Male) {
				imageName = ImageNames.MaleOfferingFlowerUpperBody;
			}
			else {
				imageName = ImageNames.FemaleOfferingFlowerUpperBody;
			}
		}

		let skinSprites = [];
        for (let i = 0; i < CharacterWalkingState.WALKING_LOWER_BODY_ANIMATION_FRAMES.length; i++) {
            skinSprites.push(new Sprite(
                images.get(imageName),
                i * TILE_SIZE,
                (4 + this.character.skinColor) * TILE_SIZE * 2,
                TILE_SIZE,
                TILE_SIZE * 2,
            ));
        }

		return skinSprites;
	}

	getShoesSprites(imageName = null) {

		if (imageName == null) {
			if (this.character.gender == Genders.Male) {
				imageName = ImageNames.MaleOfferingFlowerUpperBody;
			}
			else {
				imageName = ImageNames.FemaleOfferingFlowerUpperBody;
			}
		}

		let shoesSprites = [];
        for (let i = 0; i < CharacterWalkingState.WALKING_LOWER_BODY_ANIMATION_FRAMES.length; i++) {
            shoesSprites.push(new Sprite(
                images.get(imageName),
                i * TILE_SIZE,
                (7 + this.character.shoesColor) * TILE_SIZE * 2,
                TILE_SIZE,
                TILE_SIZE * 2,
            ));
        }

		return shoesSprites;
	}

	update(dt) {
		if (this.character.isAutoMoving) {
			if (this.character.direction == Directions.Left) {
				if (this.character.checkLeftConstraintBox()) {
					this.character.stop();
					this.character.changeState(CharacterStandingStillState.NAME);
					return;
				}

				this.character.moveLeft();
			}
			else {
				if (this.character.checkRightConstraintBox()) {
					this.character.stop();
					this.character.changeState(CharacterStandingStillState.NAME);
					return;
				}

				this.character.moveRight();
			}
			
			let obj = this.character.didHitACollidableObjects();

			if (obj) {
				this.character.stop();
				this.character.fall(obj);
			}

			return;
		}

		if (!keys.a && !keys.d && Math.abs(this.character.velocity.x) === 0) {
			this.character.changeState(CharacterStandingStillState.NAME);
		}
		else if (keys.a) {
			if (this.character.checkLeftConstraintBox()) {
				this.character.stop();
				this.character.changeState(CharacterStandingStillState.NAME);
				return;
			}

			this.character.moveLeft();

			let obj = this.character.didHitACollidableObjects();

			if (obj) {
				this.character.stop();
				this.character.fall(obj);
			}
		}
		else if (keys.d) {
			if (this.character.checkRightConstraintBox()) {
				this.character.stop();
				this.character.changeState(CharacterStandingStillState.NAME);
				return;
			}

			this.character.moveRight();

			let obj = this.character.didHitACollidableObjects();

			if (obj) {
				this.character.stop();
				this.character.fall(obj);
			}
		}
		else {
			this.character.stop();
		}
	}
}
