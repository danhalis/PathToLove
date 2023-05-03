import Genders from "../enums/Genders.js";
import Character from "./character/Character.ts";
import Vector from "../../lib/Vector.ts";
import FemaleColors from "../enums/FemaleColors.js";
import Directions from "../enums/Directions.js";
import { context, TILE_SIZE } from "globals";
import CharacterStandingStillState from "components/states/entity/character/CharacterStandingStillState";
import CharacterLyingDownState from "components/states/entity/character/CharacterLyingDownState";

export default class Female extends Character {

    /**
     * Initializes a female character.
     * 
     * @param {Vector} dimensions dimensions of the character.
     * @param {Vector} position position of the character.
     * @param {number} hairColor hair color code.
     * @param {number} skinColor skin color code.
     * @param {number} blouseColor blouse color code.
     * @param {number} skirtColor skirt color code.
     * @param {number} shoesColor shoes color code.
     */
    constructor(dimensions, 
                position, 
                hairColor = FemaleColors.Hair.Black, 
                skinColor = FemaleColors.Skin.Black, 
                blouseColor = FemaleColors.Blouse.Red, 
                skirtColor = FemaleColors.Skirt.Black, 
                shoesColor = FemaleColors.Shoes.Black) {

        super(dimensions, 
                position, 
                Genders.Female, 
                hairColor, 
                skinColor, 
                blouseColor, 
                skirtColor, 
                shoesColor);

        this.setDimensions(this.stateMachine.currentState.name);
        this.setRenderOffset(this.stateMachine.currentState.name);
    }

    setDimensions(stateName) {
        switch (stateName) {
            case CharacterStandingStillState.NAME:
                this.dimensions.x = Character.RENDER_WIDTH;
                this.dimensions.y = Character.RENDER_HEIGHT;
                this.hitboxes[0].setWidth(Character.RENDER_WIDTH - 2 * Character.RENDER_SCALE);
                this.hitboxes[0].setHeight(Character.RENDER_HEIGHT);
                break;
            case CharacterLyingDownState.NAME:
                this.dimensions.x = TILE_SIZE * 2 * Character.RENDER_SCALE;
                this.dimensions.y = TILE_SIZE * Character.RENDER_SCALE;
                this.hitboxes[0].setWidth(this.dimensions.x);
                this.hitboxes[0].setHeight(this.dimensions.y - 9 * Character.RENDER_SCALE);
                break;
        }
    }

    updateHitboxes() {
        let currentStateName = this.stateMachine.currentState.name;
        
        switch (currentStateName) {
            case CharacterStandingStillState.NAME:
                this.hitboxes[0].setY(this.position.y);
                break;
            case CharacterLyingDownState.NAME:
                this.hitboxes[0].setY(this.position.y + 9 * Character.RENDER_SCALE);
                break;
        }

		this.hitboxes[0].setX(this.position.x);
	}

    setRenderOffset(stateName) {
        switch (stateName) {
            case CharacterStandingStillState.NAME:
                this.leftRenderOffset.x = -2 * Character.RENDER_SCALE;
                this.rightRenderOffset.x = 0;
                this.leftRenderOffset.y = 0;
                this.rightRenderOffset.y = 0;
                break;
            case CharacterLyingDownState.NAME:
                this.leftRenderOffset.x = 0;
                this.rightRenderOffset.x = 0;
                this.leftRenderOffset.y = 0;
                this.rightRenderOffset.y = 0;
                break;
        }
    }
}