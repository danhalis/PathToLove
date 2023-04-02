import { images, keys, TILE_SIZE } from "globals";
import State from "lib/State.ts";
import ImageNames from "../../../enums/ImageNames.js";
import Sprite from "lib/Sprite.js";
import Character from "../../../entities/character/Character.ts";
import CharacterWalkingState from "./CharacterWalkingState.js";
import Genders from "../../../enums/Genders.js";
import Animation from "lib/Animation.js";
import CharacterState from "./CharacterState";
import { UpperBodySprites } from "components/entities/character/UpperBody";
import { LowerBodySprites } from "components/entities/character/LowerBody";

export default class CharacterStandingStillState extends CharacterState {
	
	static NAME = "character-standing-still";

	static STANDING_STILL_UPPER_BODY_ANIMATION_FRAMES = [0, 1];
	static STANDING_STILL_UPPER_BODY_ANIMATION_INTERVAL = 0.3;

	/**
	 * Initializes a standing still state of the charater. 
	 *
	 * @param {Character} character character.
	 */
	constructor(character) {
		super(character);

		this.name = CharacterStandingStillState.NAME;

		this.upperBodySprites = null;
		this.lowerBodySprites = null;
	}

	enter() {
		this.character.upperBody.setSprites(this.getUpperBodySprites());
        this.character.upperBody.setAnimation(new Animation(
			CharacterStandingStillState.STANDING_STILL_UPPER_BODY_ANIMATION_FRAMES,
			CharacterStandingStillState.STANDING_STILL_UPPER_BODY_ANIMATION_INTERVAL
		));

		this.character.lowerBody.setSprites(this.getLowerBodySprites());
        this.character.lowerBody.setAnimation(null);
	}

	/**
	 * Retrieves the standing still upper boddy sprites. If refresh is true, the sprites is refreshed.
	 * @param {boolean} refresh 
	 * @returns standing still upper body sprites.
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
		let outlineSprites = [];
		for (let i = 0; i < 2; i++) {
			outlineSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				0,
				TILE_SIZE,
				TILE_SIZE * 2
			));
		}

		// generate hair sprites
		let hairSprites = [];
		for (let i = 0; i < 2; i++) {
			hairSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				(1 + this.character.hairColor) * TILE_SIZE * 2,
				TILE_SIZE,
				TILE_SIZE * 2
			));
		}

		// generate skin sprites
		let skinSprites = [];
		for (let i = 0; i < 2; i++) {
			skinSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				(4 + this.character.skinColor) * TILE_SIZE * 2,
				TILE_SIZE,
				TILE_SIZE * 2
			));
		}

		// generate shirt/blouse sprites
		let clothesSprites = [];
		for (let i = 0; i < 2; i++) {
		clothesSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				(7 + this.character.upperClothesColor) * TILE_SIZE * 2,
				TILE_SIZE,
				TILE_SIZE * 2
			));
		}

		this.upperBodySprites = new UpperBodySprites({
			outlineSprites,
			hairSprites,
			skinSprites,
      clothesSprites,
		});

		return this.upperBodySprites;
	}

	/**
	 * Retrieves the standing still lower boddy sprites. If refresh is true, the sprites is refreshed.
	 * @param {boolean} refresh 
	 * @returns standing still lower body sprites.
	 */
	getLowerBodySprites(refresh = false) {

		if (!refresh && this.lowerBodySprites != null) {
			return this.lowerBodySprites;
		}

		let imageName;
		if (this.character.gender == Genders.Male) {
			imageName = ImageNames.MaleStandingStillLowerBody;
		}
		else {
			imageName = ImageNames.FemaleStandingStillLowerBody;
		}

		// generate outline sprites
		let outlineSprites = [];
		for (let i = 0; i < 2; i++) {
			outlineSprites.push(new Sprite(
				images.get(imageName),
				i * TILE_SIZE,
				0,
				TILE_SIZE,
				TILE_SIZE * 2,
			));
		}

		// generate shorts/skirt sprites
		let clothesSprites = [];
		for (let i = 0; i < 2; i++) {
				clothesSprites.push(new Sprite(
						images.get(imageName),
						i * TILE_SIZE,
						(1 + this.character.lowerClothesColor) * TILE_SIZE * 2,
						TILE_SIZE,
						TILE_SIZE * 2,
				));
		}

		// generate skin sprites
		let skinSprites = [];
		for (let i = 0; i < 2; i++) {
				skinSprites.push(new Sprite(
						images.get(imageName),
						i * TILE_SIZE,
						(4 + this.character.skinColor) * TILE_SIZE * 2,
						TILE_SIZE,
						TILE_SIZE * 2,
				));
		}

		// generate shoes sprites
		let shoesSprites = [];
		for (let i = 0; i < 2; i++) {
				shoesSprites.push(new Sprite(
						images.get(imageName),
						i * TILE_SIZE,
						(7 + this.character.shoesColor) * TILE_SIZE * 2,
						TILE_SIZE,
						TILE_SIZE * 2,
				));
		}

		this.lowerBodySprites = new LowerBodySprites({
			outlineSprites,
			clothesSprites,
			skinSprites,
			shoesSprites,
		});

		return this.lowerBodySprites;
	}

	update(dt) {
        if (keys.a) {

			if (this.character.checkLeftConstraintBox()) {
				return;
			}

			this.character.changeState(CharacterWalkingState.NAME);
		}
		else if (keys.d) {
			if (this.character.checkRightConstraintBox()) {
				return;
			}

			this.character.changeState(CharacterWalkingState.NAME);
		}
	}
}
