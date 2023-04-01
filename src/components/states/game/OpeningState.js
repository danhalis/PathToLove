import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Character from "../../entities/Character.js";
import Heart from "../../entities/Heart.js";
import Directions from "../../enums/Directions.js";
import Genders from "../../enums/Genders.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, GROUND_LEVEL, keys, playerAndCrush, STANDARD_CANVAS_WIDTH, stateMachine, TILE_SIZE, timer } from "globals.js";
import Stone from "../../objects/Stone.js";
import PlayState from "./PlayState.js";

export default class OpeningState extends State {

    static NAME = "opening-state";

    static CANVAS_CENTER_X = CANVAS_WIDTH * 0.5;

    static INSTRUCTION = "PRESS ENTER TO CHASE";
    static INSTRUCTION_FONT_SIZE = CANVAS_WIDTH / (835 / 20);
    static INSTRUCTION_Y = CANVAS_HEIGHT * 0.3;

    constructor() {
        super();

        this.name = OpeningState.NAME;

        this.stone = new Stone(
            new Vector(Stone.RENDER_WIDTH, Stone.RENDER_HEIGHT),
            new Vector(CANVAS_WIDTH * 0.3, GROUND_LEVEL - Stone.RENDER_HEIGHT)
        );
    }

    enter(params) {
        this.player = params.player;
        this.crush = params.crush;

        this.player.position.x = -Character.RENDER_WIDTH;
        this.player.enableAutoMove(Directions.Right);
        this.player.setSpeedScalar(0);

        this.crush.position.x = -Character.RENDER_WIDTH;
        this.crush.enableAutoMove(Directions.Right);

        this.player.addCollidableObject(this.stone);

        this.minDistance = this.player.position.x + 
        Character.RENDER_WIDTH + Stone.RENDER_WIDTH + 
        CANVAS_WIDTH / (835 / 5) + TILE_SIZE * 2 * Character.RENDER_SCALE + CANVAS_WIDTH / (835 / 50);

        this.playerFell = false;
        this.playerStoodUp = false;
        this.heartIsGrowing = false;

        this.heart = null;
        this.displayInstruction = false;
    }

    update(dt) {
        this.player.update(dt);
        this.crush.update(dt);

        this.heart?.update(dt);

        if (!this.crush.isHidden) {
            // if the crush has reached a certain distance
            if (this.crush.position.x >= this.minDistance
                && this.crush.position.x < CANVAS_WIDTH) {
                // let the player walk in
                this.player.resetSpeedScalar();
            }
            // if the crush has gone off screen
            else if (this.crush.position.x >= CANVAS_WIDTH) {
                this.crush.stop();
                this.crush.paralyze();
                this.crush.hide();
            }
        }

        // if the player is lying down
        if (this.player.isLyingDown) {
            this.player.removeCollidableObject(this.stone);
            this.playerFell = true;
        }
        // if the player is no longer lying down
        else if (this.playerFell && !this.playerStoodUp) {
            
            this.playerStoodUp = true;
            this.player.disableAutoMove();
            
            this.player.setConstraintBox(
                new Vector(
                    this.player.position.x, 
                    this.player.position.y
                ),
                new Vector(
                    this.player.position.x + TILE_SIZE * 2 * Character.RENDER_SCALE + CANVAS_WIDTH / (835 / 30), 
                    this.player.position.y + this.player.dimensions.y
                )
            );

            this.displayInstruction = true;

            this.flashingInstructionTask = timer.addTask(() => {
                this.displayInstruction = this.displayInstruction === true ? false : true;
                }, 0.5
            );
        }
        // if the heart is not growing yet
        else if (this.playerStoodUp && !this.heartIsGrowing) {

            // listen for key press
            if (keys.Enter) {
                keys.Enter = false;

                this.heartIsGrowing = true;

                this.player.direction = Directions.Right;
                this.player.stop();
                this.player.paralyze();
                this.player.setConstraintBox(null);

                if (this.heart == null) {
                    if (this.player.gender == Genders.Male) {
                        this.heart = new Heart(
                            new Vector(0, 0),
                            new Vector(
                                this.player.position.x + 8 * Character.RENDER_SCALE, 
                                this.player.position.y + 12 * Character.RENDER_SCALE
                            )
                        );
                    }
                    else {
                        this.heart = new Heart(
                            new Vector(0, 0),
                            new Vector(
                                this.player.position.x + 8 * Character.RENDER_SCALE, 
                                this.player.position.y + 13 * Character.RENDER_SCALE
                            )
                        );
                    }
                }

                this.heart.setConstraintBox(
                    new Vector(0, 0),
                    new Vector(CANVAS_WIDTH, CANVAS_HEIGHT)
                );

                this.heart.disable();

                this.flashingInstructionTask.markAsDone();
                this.displayInstruction = false;

                this.sendHeart();
            }
        }
    }

    async sendHeart() {
        await this.tweenHeartAsync(
            [Heart.RENDER_WIDTH, Heart.RENDER_HEIGHT],
            [(CANVAS_WIDTH - Heart.RENDER_WIDTH) / 2, 
            CANVAS_HEIGHT * 0.35 - Heart.RENDER_HEIGHT / 2],
            3
        );

        this.heart.enable();

        stateMachine.change(PlayState.NAME, {
            stone: this.stone,
            player: this.player,
            crush: this.crush,
            heart: this.heart
        });
    }

    async tweenHeartAsync(newDimensions, newPosition, duration) {
        timer.tweenAsync(
            this.heart.dimensions, ["x", "y"], 
            newDimensions, 
            duration
        );
        await timer.tweenAsync(
            this.heart.position, ["x", "y"], 
            newPosition, 
            duration
        );
    }

    render() {
        this.renderGround();
        this.player.render();
        this.crush.render();
        this.stone.render();
        this.heart?.render();

        if (this.displayInstruction) {
            context.save();
            context.textBaseline = 'middle';
		    context.textAlign = 'center';
            context.font = `${OpeningState.INSTRUCTION_FONT_SIZE}px Joystix`;
            context.fillText(OpeningState.INSTRUCTION, OpeningState.CANVAS_CENTER_X, OpeningState.INSTRUCTION_Y); 
            context.restore;
        }
    }

    renderGround() {
        context.save();
        context.lineWidth = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5);
        context.fillStyle = 'rgb(164, 164, 164)';
        context.strokeRect(0, GROUND_LEVEL - CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 3), CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_LEVEL);
        context.fillRect(0, GROUND_LEVEL - CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 3), CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_LEVEL);
        context.fillStyle = 'black';
        context.restore;
    }
}