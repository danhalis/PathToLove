import { images, keys, TILE_SIZE } from "globals";
import State from "lib/State";
import ImageNames from "../../../enums/ImageNames.js";
import Sprite from "lib/Sprite";
import Character from "components/entities/character/Character";
import Genders from "../../../enums/Genders.js";
import CharacterState from "./CharacterState";
import { UpperBodySprites } from "components/entities/character/UpperBody";
import { LowerBodySprites } from "components/entities/character/LowerBody";

export default class CharacterLyingDownState extends CharacterState {

  static readonly NAME = "character-lying-down";
	name: string;
	
	upperBodySprites?: UpperBodySprites;
	lowerBodySprites?: LowerBodySprites;

	/**
	 * Initializes a lying down state of the charater. 
	 *
	 * @param {Character} character character.
	 */
	constructor(character: Character) {
		super(character);

		this.name = CharacterLyingDownState.NAME;
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
		let outlineSprites: Sprite[] = [];
		outlineSprites.push(new Sprite(
			images.get(imageName),
			0,
			0,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate hair sprites
		let hairSprites: Sprite[] = [];
		hairSprites.push(new Sprite(
			images.get(imageName),
			0,
			(1 + this.character.hairColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate skin sprites
		let skinSprites: Sprite[] = [];
		skinSprites.push(new Sprite(
			images.get(imageName),
			0,
			(4 + this.character.skinColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate shirt/blouse sprites
		let clothesSprites: Sprite[] = [];
		clothesSprites.push(new Sprite(
			images.get(imageName),
			0,
			(7 + this.character.upperClothesColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		this.upperBodySprites = new UpperBodySprites({
			outlineSprites,
			hairSprites,
			skinSprites,
      clothesSprites,
		});

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
		let outlineSprites: Sprite[] = [];
		outlineSprites.push(new Sprite(
			images.get(imageName),
			0,
			0,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate shorts/skirt sprites
		let clothesSprites: Sprite[] = [];
		clothesSprites.push(new Sprite(
			images.get(imageName),
			0,
			(1 + this.character.lowerClothesColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate skin sprites
		let skinSprites: Sprite[] = [];
		skinSprites.push(new Sprite(
			images.get(imageName),
			0,
			(4 + this.character.skinColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		// generate shoes sprites
		let shoesSprites: Sprite[] = [];
		shoesSprites.push(new Sprite(
			images.get(imageName),
			0,
			(7 + this.character.shoesColor) * TILE_SIZE,
			TILE_SIZE * 2,
			TILE_SIZE
		));

		this.lowerBodySprites = new LowerBodySprites({
			outlineSprites,
      clothesSprites,
      skinSprites,
      shoesSprites,
		});

		return this.lowerBodySprites;
	}
}
