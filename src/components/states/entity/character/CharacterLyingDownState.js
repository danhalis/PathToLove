import { images, keys, TILE_SIZE } from "globals.js";
import State from "lib/State.js";
import ImageNames from "../../../enums/ImageNames.js";
import Sprite from "lib/Sprite.js";
import Character from "../../../entities/Character.js";
import CharacterWalkingState from "./CharacterWalkingState.js";
import Genders from "../../../enums/Genders.js";

export default class CharacterLyingDownState extends State {
	
    static NAME = "character-lying-down";

	/**
	 * Initializes a lying down state of the charater. 
	 *
	 * @param {Character} character character.
	 */
	constructor(character) {
		super();

        this.name = CharacterLyingDownState.NAME;
		this.character = character;
		this.upperBodySprites = null;
		this.lowerBodySprites = null;
	}

	enter() {
		this.character.upperBody.setSprites(this.getUpperBodySprites());
        this.character.upperBody.setAnimation(null);

		this.character.lowerBody.setSprites(this.getLowerBodySprites());
        this.character.lowerBody.setAnimation(null);
	}

	/**
	 * Retrieves the lying down upper boddy sprites. If refresh is true, the sprites is refreshed.
	 * @param {boolean} refresh 
	 * @returns lying down upper body sprites.
	 */
	getUpperBodySprites(refresh = false) {

		if (!refresh && this.upperBodySprites != null) {
			return this.upperBodySprites;
		}

		let imageName;
		if (this.character.gender == Genders.Male) {
			imageName = ImageNames.MaleLyingDownUpperBody;
		}
		else {
			imageName = ImageNames.FemaleLyingDownUpperBody;
		}

		// generate outline sprites
		let outlineSprites = [];
		outlineSprites.push(new Sprite(
			images.get(imageName),
			0,
			0,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate hair sprites
		let hairSprites = [];
		hairSprites.push(new Sprite(
			images.get(imageName),
			0,
			(1 + this.character.hairColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate skin sprites
		let skinSprites = [];
		skinSprites.push(new Sprite(
			images.get(imageName),
			0,
			(4 + this.character.skinColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate shirt/blouse sprites
		let clothesSprites = [];
		clothesSprites.push(new Sprite(
			images.get(imageName),
			0,
			(7 + this.character.upperClothesColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		this.upperBodySprites = new Character.UpperBody.UpperBodySprites();
		this.upperBodySprites.setOutlineSprites(outlineSprites);
		this.upperBodySprites.setHairSprites(hairSprites);
		this.upperBodySprites.setSkinSprites(skinSprites);
		this.upperBodySprites.setClothesSprites(clothesSprites);

		return this.upperBodySprites;
	}

	/**
	 * Retrieves the lying down lower boddy sprites. If refresh is true, the sprites is refreshed.
	 * @param {boolean} refresh 
	 * @returns lying down lower body sprites.
	 */
	getLowerBodySprites(refresh = false) {

		if (!refresh && this.lowerBodySprites != null) {
			return this.lowerBodySprites;
		}

		let imageName;
		if (this.character.gender == Genders.Male) {
			imageName = ImageNames.MaleLyingDownLowerBody;
		}
		else {
			imageName = ImageNames.FemaleLyingDownLowerBody;
		}

        // generate outline sprites
        let outlineSprites = [];
		outlineSprites.push(new Sprite(
			images.get(imageName),
			0,
			0,
			TILE_SIZE * 2,
			TILE_SIZE
		));

        // generate shorts/skirt sprites
        let clothesSprites = [];
		clothesSprites.push(new Sprite(
			images.get(imageName),
			0,
			(1 + this.character.lowerClothesColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

        // generate skin sprites
        let skinSprites = [];
		skinSprites.push(new Sprite(
			images.get(imageName),
			0,
			(4 + this.character.skinColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate shoes sprites
        let shoesSprites = [];
		shoesSprites.push(new Sprite(
			images.get(imageName),
			0,
			(7 + this.character.shoesColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		this.lowerBodySprites = new Character.LowerBody.LowerBodySprites();
		this.lowerBodySprites.setOutlineSprites(outlineSprites);
		this.lowerBodySprites.setClothesSprites(clothesSprites);
		this.lowerBodySprites.setSkinSprites(skinSprites);
		this.lowerBodySprites.setShoesSprites(shoesSprites);

		return this.lowerBodySprites;
	}

	update(dt) {
	}
}
