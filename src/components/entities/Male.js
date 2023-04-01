import Genders from "../enums/Genders.js";
import Character from "./Character.js";
import Vector from "../../lib/Vector.js";
import MaleColors from "../enums/MaleColors.js";
import Directions from "../enums/Directions.js";
import { context, TILE_SIZE } from "globals.js";
import CharacterStandingStillState from "../states/entity/character/CharacterStandingStillState.js";
import CharacterLyingDownState from "../states/entity/character/CharacterLyingDownState.js";

export default class Male extends Character {

    /**
     * Initializes a male character.
     * 
     * @param {Vector} dimensions dimensions of the character.
     * @param {Vector} position position of the character.
     * @param {number} hairColor hair color code.
     * @param {number} skinColor skin color code.
     * @param {number} shirtColor shirt color code.
     * @param {number} shortsColor shorts color code.
     * @param {number} shoesColor shoes color code.
     */
    constructor(dimensions, 
                position, 
                hairColor = MaleColors.Hair.Black, 
                skinColor = MaleColors.Skin.Black, 
                shirtColor = MaleColors.Shirt.Red, 
                shortsColor = MaleColors.Shorts.Black, 
                shoesColor = MaleColors.Shoes.Black) {

        super(dimensions, 
                position, 
                Genders.Male, 
                hairColor, 
                skinColor, 
                shirtColor, 
                shortsColor, 
                shoesColor);

        this.setDimensions(this.stateMachine.currentState.name);
        this.setRenderOffset(this.stateMachine.currentState.name);
    }

    setDimensions(stateName) {
        switch (stateName) {
            case CharacterStandingStillState.NAME:
                this.dimensions.x = Character.RENDER_WIDTH;
                this.dimensions.y = Character.RENDER_HEIGHT;
                this.hitboxes[0].setWidth(Character.RENDER_WIDTH - 4 * Character.RENDER_SCALE);
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
                this.leftRenderOffset.x = -4 * Character.RENDER_SCALE;
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