import { context, GROUND_LEVEL, CANVAS_WIDTH, TILE_SIZE, timer, STANDARD_CANVAS_WIDTH } from "globals.js";
import Animation from "lib/Animation.js";
import Sprite from "lib/Sprite.js"
import Directions from "../enums/Directions.js";
import StateMachine from "lib/StateMachine.js";
import CharacterWalkingState from "../states/entity/character/CharacterWalkingState.js";
import Entity from "./Entity.js";
import Vector from "lib/Vector.js";
import CharacterStandingStillState from "../states/entity/character/CharacterStandingStillState.js";
import { isAABBCollision } from "lib/CollisionHelpers.js";
import CharacterLyingDownState from "../states/entity/character/CharacterLyingDownState.js";
import Flower from "../objects/Flower.js";
import Object from "../objects/Object.js";
import ConstraintBox from "lib/ConstraintBox.js";

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

    /**
     * Represents the character's upper body.
     */
    static UpperBody = class UpperBody {

        /**
         * Represents the sprites of the character's upper body.
         */
        static UpperBodySprites = class UpperBodySprites {
            /**
             * Initializes a sprite holder for the character's upper body.
             */
            constructor() {
                this.outlineSprites = null;
				this.hairSprites = null;
				this.skinSprites = null;
				this.clothesSprites = null;
            }

            /**
             * Sets sprites for upper body's outline
             * 
             * @param {Array<Sprite>} outlineSprites upper body's outline sprites.
             */
            setOutlineSprites(outlineSprites) {
                this.outlineSprites = outlineSprites;
            }

            /**
             * Sets sprites for upper body's hair
             * 
             * @param {Array<Sprite>} hairSprites upper body's hair sprites.
             */
            setHairSprites(hairSprites) {
                this.hairSprites = hairSprites;
            }

            /** 
             * Sets sprites for upper body's skin
             * 
             * @param {Array<Sprite>} skinSprites upper body's skin sprites.
             */
            setSkinSprites(skinSprites) {
                this.skinSprites = skinSprites;
            }

            /** 
             * Sets sprites for upper body's shirt
             * 
             * @param {Array<Sprite>} clothesSprites upper body's shirt sprites.
             */
            setClothesSprites(clothesSprites) {
                this.clothesSprites = clothesSprites;
            }
        }

        /**
         * Initializes an upper body of the character.
         * 
         * @param {UpperBody.UpperBodySprites} sprites upper body's sprites.
         * @param {Animation} animation upper body's animation.
         */
        constructor(sprites = null, animation = null) {
            this.sprites = sprites;
            this.animation = animation;
        }

        /**
         * Sets sprites for upper body.
         * 
         * @param {UpperBody.UpperBodySprites} sprites upper body's sprites.
         */
        setSprites(sprites) {
            this.sprites = sprites;
        }

        /**
         * Sets animation for upper body.
         * 
         * @param {Animation} animation upper body's animation.
         */
        setAnimation(animation) {
            this.animation = animation;
        }

        getAnimation() {
            return this.animation;
        }

        update(dt) {
            this.animation?.update(dt);
        }

        /**
         * 
         * @param {number} x x position in the canvas.
         * @param {number} y y position in the canvas.
         */
        render(x, y, width = Character.RENDER_WIDTH, height = Character.RENDER_HEIGHT) {
            if (this.animation == null) {
                this.sprites.outlineSprites[0].render(x, y, width, height);
                this.sprites.hairSprites[0].render(x, y, width, height);
                this.sprites.skinSprites[0].render(x, y, width, height);
                this.sprites.clothesSprites[0].render(x, y, width, height);
            }
            else {
                this.sprites.outlineSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
                this.sprites.hairSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
                this.sprites.skinSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
                this.sprites.clothesSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
            }
        }
    }

    /**
     * Represents the character's lower body.
     */
    static LowerBody = class LowerBody {

        /**
         * Represents the sprites of the character's lower body.
         */
         static LowerBodySprites = class LowerBodySprites {
            /**
             * Initializes a sprite holder for the character's lower body.
             */
            constructor() {
                this.outlineSprites = null;
				this.clothesSprites = null;
				this.skinSprites = null;
				this.shoesSprites = null;
            }

            /**
             * Sets sprites for lower body's outline
             * 
             * @param {Array<Sprite>} outlineSprites lower body's outline sprites.
             */
            setOutlineSprites(outlineSprites) {
                this.outlineSprites = outlineSprites;
            }

            /**
             * Sets sprites for lower body's shorts
             * 
             * @param {Array<Sprite>} clothesSprites lower body's shorts sprites.
             */
            setClothesSprites(clothesSprites) {
                this.clothesSprites = clothesSprites;
            }

            /** 
             * Sets sprites for lower body's skin
             * 
             * @param {Array<Sprite>} skinSprites lower body's skin sprites.
             */
            setSkinSprites(skinSprites) {
                this.skinSprites = skinSprites;
            }

            /** 
             * Sets sprites for lower body's shoes
             * 
             * @param {Array<Sprite>} shoesSprites lower body's shoes sprites.
             */
            setShoesSprites(shoesSprites) {
                this.shoesSprites = shoesSprites;
            }
        }

        /**
         * Initializes a lower body of the character.
         * 
         * @param {Sprite} sprites 
         * @param {Animation} animation 
         */
        constructor(sprites = null, animation = null) {
            this.sprites = sprites;
            this.animation = animation;
        }

        /**
         * Sets sprites for lower body.
         * 
         * @param {LowerBody.LowerBodySprites} sprites lower body's sprites.
         */
        setSprites(sprites) {
            this.sprites = sprites;
        }

        /**
         * Sets animation for lower body.
         * 
         * @param {Animation} animation 
         */
        setAnimation(animation) {
            this.animation = animation;
        }

        getAnimation() {
            return this.animation;
        }


        update(dt) {
            this.animation?.update(dt);
        }

        /**
         * 
         * @param {number} x x position in the canvas.
         * @param {number} y y position in the canvas.
         */
        render(x, y, width = Character.RENDER_WIDTH, height = Character.RENDER_HEIGHT) {
            if (this.animation == null) {
                this.sprites.outlineSprites[0].render(x, y, width, height);
                this.sprites.clothesSprites[0].render(x, y, width, height);
                this.sprites.skinSprites[0].render(x, y, width, height);
                this.sprites.shoesSprites[0].render(x, y, width, height);
            }
            else {
                this.sprites.outlineSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
                this.sprites.clothesSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
                this.sprites.skinSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
                this.sprites.shoesSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
            }
        }
    }
    
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
    constructor(dimensions, position, gender, hairColor, skinColor, upperClothesColor, lowerClothesColor, shoesColor) {
        super(dimensions, position, Character.VELOCITY_LIMIT, Character.SPEED_SCALAR)
        
        this.gender = gender;

        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.upperClothesColor = upperClothesColor;
        this.lowerClothesColor = lowerClothesColor;
        this.shoesColor = shoesColor;
        this.direction = Directions.Right;

        this.upperBody = new Character.UpperBody();
        this.lowerBody = new Character.LowerBody();

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
            this.flower.render();
        }

        if (this.direction === Directions.Left) {
			context.save();
			context.translate(
                Math.floor(this.position.x) + this.dimensions.x + this.leftRenderOffset.x, 
                Math.floor(this.position.y) + this.leftRenderOffset.y
            );
			context.scale(-1, 1);
			this.upperBody.render(0, 0, this.dimensions.x, this.dimensions.y);
            this.lowerBody.render(0, 0, this.dimensions.x, this.dimensions.y);
			context.restore();
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
        if (this.autoMoving) return;

        this.autoMoving = true;

        if (toDirection == Directions.Left) {
            this.direction = Directions.Left;
        }
        else {
            this.direction = Directions.Right;
        }

        this.changeState(CharacterWalkingState.NAME);
    }

    /**
     * Stops the character from auto-moving.
     */
    disableAutoMove() {
        if (!this.autoMoving) return;
        
        this.autoMoving = false;
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