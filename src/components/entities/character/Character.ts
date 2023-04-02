import { context, GROUND_LEVEL, CANVAS_WIDTH, TILE_SIZE, timer, STANDARD_CANVAS_WIDTH } from "globals";
import Entity from "../Entity";
import Vector from "lib/Vector";
import { UpperBody } from "./UpperBody";
import { LowerBody } from "./LowerBody";
import Genders from "components/enums/Genders";
import Directions from "components/enums/Directions";
import StateMachine from "lib/StateMachine";
import CharacterState from "components/states/entity/character/CharacterState";
import CharacterWalkingState from "components/states/entity/character/CharacterWalkingState";
import CharacterStandingStillState from "components/states/entity/character/CharacterStandingStillState";
import CharacterLyingDownState from "components/states/entity/character/CharacterLyingDownState";
import Flower from "components/objects/Flower";

/**
 * Represents a character (male or female).
 */
export default class Character extends Entity {

    static RENDER_SCALE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5);

    static RENDER_WIDTH = TILE_SIZE * Character.RENDER_SCALE;
    static RENDER_HEIGHT = TILE_SIZE * 2 * Character.RENDER_SCALE;

    static LOWER_BODY_WIDTH = 0;
    static TOTAL_SKIN_COLORS = 3;

    static SPEED_SCALAR = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5);
    static VELOCITY_LIMIT = new Vector(
        CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 100),
        0
    );

    static FALL_DISTANCE_FROM_STONE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5);
    static FLOWER_DROP_DISTANCE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 30);

    gender: Genders;
    hairColor: number;
    skinColor: number;
    upperClothesColor: number;
    lowerClothesColor: number;
    shoesColor: number;
    direction: Directions;
    upperBody: UpperBody;
    lowerBody: LowerBody;
    stateMachine: StateMachine;
    states: CharacterState[];
    isHoldingFlower: boolean;
    didDropFlower: boolean;
    flower: Flower;
    isLyingDown: boolean;
    leftRenderOffset: Vector;
    rightRenderOffset: Vector;
    isParalyzed: boolean;
    position: Vector;
    dimensions: Vector;
    speedScalar: number;
    isAutoMoving: boolean;
    velocity: any;
    velocityLimit: any;
    
    /**
     * Initializes a character.
     * 
     * @param {Vector} dimensions dimensions of the character.
     * @param {Vector} position position of the character.
     * @param {number} hairColor hair color code.
     * @param {number} skinColor skin color code.
     * @param {number} upperClothesColor shirt/blouse color code.
     * @param {number} lowerClothesColor shorts/skirt color code.
     * @param {number} shoesColor shoes color code.
     */
    constructor(dimensions: Vector, position: Vector, gender, hairColor: number, skinColor: number, upperClothesColor: number, lowerClothesColor: number, shoesColor: number) {
        super(dimensions, position, Character.VELOCITY_LIMIT, Character.SPEED_SCALAR)
        
        this.gender = gender;

        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.upperClothesColor = upperClothesColor;
        this.lowerClothesColor = lowerClothesColor;
        this.shoesColor = shoesColor;
        this.direction = Directions.Right;

        this.upperBody = new UpperBody();
        this.lowerBody = new LowerBody();

        this.stateMachine = new StateMachine();
        this.states = [
            new CharacterStandingStillState(this),
            new CharacterWalkingState(this),
            new CharacterLyingDownState(this)
        ];

        this.states.forEach(state => this.stateMachine.add(state));

        this.stateMachine.change(CharacterStandingStillState.NAME);

        this.isHoldingFlower = false;
        this.didDropFlower = false;
        this.flower = null;
        this.isLyingDown = false;

        this.leftRenderOffset = new Vector(0, 0);
        this.rightRenderOffset = new Vector(0, 0);
    }

    /**
     * Sets hair color based on the given code and resets the current state's sprites.
     * @param {number} colorCode 
     */
    setHairColor(colorCode) {
        this.hairColor = colorCode;
        this.upperBody.setSprites(this.stateMachine.currentState.getUpperBodySprites(true));
    }

    /**
     * Sets skin color based on the given code and resets the current state's sprites.
     * @param {number} colorCode 
     */
    setSkinColor(colorCode) {
        this.skinColor = colorCode;
        this.upperBody.setSprites(this.stateMachine.currentState.getUpperBodySprites(true));
        this.lowerBody.setSprites(this.stateMachine.currentState.getLowerBodySprites(true));
    }

    /**
     * Sets upper clothes color based on the given code and resets the current state's sprites.
     * @param {number} colorCode 
     */
    setUpperClothesColor(colorCode) {
        this.upperClothesColor = colorCode;
        this.upperBody.setSprites(this.stateMachine.currentState.getUpperBodySprites(true));
    }

    /**
     * Sets lower clothes color based on the given code and resets the current state's sprites.
     * @param {number} colorCode 
     */
    setLowerClothesColor(colorCode) {
        this.lowerClothesColor = colorCode;
        this.lowerBody.setSprites(this.stateMachine.currentState.getLowerBodySprites(true));
    }

    /**
     * Sets shoes color based on the given code and resets the current state's sprites.
     * @param {number} colorCode 
     */
    setShoesColor(colorCode) {
        this.shoesColor = colorCode;
        this.lowerBody.setSprites(this.stateMachine.currentState.getLowerBodySprites(true));
    }

    /**
     * Refreshes sprites of all states.
     */
    refreshSprites() {
        this.states.forEach(state => {
            if (state == this.stateMachine.currentState) {
                this.upperBody.setSprites(state.getUpperBodySprites(true));
                this.lowerBody.setSprites(state.getLowerBodySprites(true));
            }
            else {
                state.getUpperBodySprites(true);
                state.getLowerBodySprites(true);
            }
        })
    }

    update(dt) {
        super.update(dt);

        if (this.isParalyzed) return;

        this.upperBody.update(dt);
        this.lowerBody.update(dt);
    }

    renderEntity() {
        this.stateMachine.render();

        if (this.didDropFlower) {
            this.flower?.render();
        }

        if (this.direction === Directions.Left) {
			context?.save();
			context?.translate(
                Math.floor(this.position.x) + this.dimensions.x + this.leftRenderOffset.x, 
                Math.floor(this.position.y) + this.leftRenderOffset.y
            );
			context?.scale(-1, 1);
			this.upperBody.render(0, 0, this.dimensions.x, this.dimensions.y);
            this.lowerBody.render(0, 0, this.dimensions.x, this.dimensions.y);
			context?.restore();
		}
		else {
			this.upperBody.render(
                Math.floor(this.position.x) + this.rightRenderOffset.x, 
                Math.floor(this.position.y) + this.rightRenderOffset.y, 
                this.dimensions.x, 
                this.dimensions.y
            );
            this.lowerBody.render(
                Math.floor(this.position.x) + this.rightRenderOffset.x, 
                Math.floor(this.position.y) + this.rightRenderOffset.y, 
                this.dimensions.x, 
                this.dimensions.y
            );
		}
    }

    setSpeedScalar(speedScalar) {
        this.speedScalar = speedScalar;
    }

    resetSpeedScalar() {
        this.speedScalar = Character.SPEED_SCALAR;
    }

    setDimensions(stateName) {
    }

    setRenderOffset(stateName) {
    }

    /**
     * Enables the character to auto-move towards the given direction.
     * @param {Directions} toDirection 
     */
    enableAutoMove(toDirection) {
        if (this.isAutoMoving) return;

        this.isAutoMoving = true;

        if (toDirection == Directions.Left) {
            this.direction = Directions.Left;
        }
        else {
            this.direction = Directions.Right;
        }

        this.changeState(CharacterWalkingState.NAME);
    }
    changeState(NAME: any) {
        throw new Error("Method not implemented.");
    }

    /**
     * Stops the character from auto-moving.
     */
    disableAutoMove() {
        if (!this.isAutoMoving) return;
        
        this.isAutoMoving = false;
        this.stop();
        this.changeState(CharacterStandingStillState.NAME);
    }

    moveLeft() {
		this.direction = Directions.Left;
		this.velocity.x = Math.max(this.velocity.x - this.speedScalar, -this.velocityLimit.x);
	}

	moveRight() {
		this.direction = Directions.Right;
		this.velocity.x = Math.min(this.velocity.x + this.speedScalar, this.velocityLimit.x);
	}

	stop() {
		this.velocity.x = 0;
        this.changeState(CharacterStandingStillState.NAME);
	}

    holdFlower() {
        this.isHoldingFlower = true;
        this.didDropFlower = false;
    }

    dropFlower(position, direction) {
        this.isHoldingFlower = false;
        this.didDropFlower = true;

        this.flower = new Flower(
            new Vector(Flower.RENDER_WIDTH, Flower.RENDER_HEIGHT),
            position
        );

        this.refreshSprites();

        this.flower.setDirection(direction);
    }

    despawnFlower() {
        if (!this.flower) return;

        this.flower = null;

        if (this.didDropFlower)
            this.didDropFlower = false;
    }

    fall(obj) {
        if (this.isLyingDown) return;

        this.isLyingDown = true;
        
        this.setDimensions(CharacterLyingDownState.NAME);

        if (this.direction == Directions.Left) {
            this.position.x = obj.position.x - this.dimensions.x - Character.FALL_DISTANCE_FROM_STONE;

            this.dropFlower(new Vector(
                this.position.x - Character.FLOWER_DROP_DISTANCE, 
                GROUND_LEVEL - Flower.RENDER_HEIGHT
            ), Directions.Left);
        }
        else {
            this.position.x = obj.position.x + obj.dimensions.x + Character.FALL_DISTANCE_FROM_STONE;

            this.dropFlower(new Vector(
                this.position.x + (this.dimensions.x + Character.FLOWER_DROP_DISTANCE - Flower.RENDER_WIDTH), 
                GROUND_LEVEL - Flower.RENDER_HEIGHT
            ), Directions.Right);
        }     

        this.position.y += TILE_SIZE * Character.RENDER_SCALE;
        
        this.setRenderOffset(CharacterLyingDownState.NAME);

        this.changeState(CharacterLyingDownState.NAME);

        this.onFall();
    }

    onFall() {
        timer.addTask(async () => {
            await timer.wait(2);
            this.standUp();
        }, 0);
    }

    standUp() {
        if (!this.isLyingDown) return;

        this.isLyingDown = false;

        this.position.y -= TILE_SIZE * Character.RENDER_SCALE;

        this.setDimensions(CharacterStandingStillState.NAME);

        this.setRenderOffset(CharacterStandingStillState.NAME);

        this.changeState(CharacterStandingStillState.NAME);
    }
}