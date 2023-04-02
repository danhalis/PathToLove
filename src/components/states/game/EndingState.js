import State from "../../../lib/State.ts";
import Vector from "../../../lib/Vector.ts";
import Character from "../../entities/character/Character.ts";
import Heart from "../../entities/Heart.js";
import LockedHeart from "../../entities/LockedHeart.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, GROUND_LEVEL, STANDARD_CANVAS_WIDTH, stateMachine, timer } from "globals";
import Flower from "../../objects/Flower.js";
import Lock from "../../objects/Lock.js";
import SoundWaves from "../../objects/SoundWaves.js";
import HealthProgressBar from "../../user-interface/HealthProgressBar.js";
import GameOverState from "./GameOverState.js";

export default class EndingState extends State {

    static NAME = "ending-state";

    constructor() {
        super();

        this.name = EndingState.NAME;
    }

    enter(params) {
        this.player = params.player;
        this.crush = params.crush;
        this.heart = params.heart;
        this.didUnlockHeart = params.didUnlockHeart;
        this.score = params.score;
        this.soundwaves = params.soundwaves;

        this.tweenCrushAcrossScreenAsync();
    }

    async tweenCrushAcrossScreenAsync() {

        await timer.tweenAsync(this.crush.position, ["x"], [-Character.RENDER_WIDTH], 5);

        this.crush.hide();
    }

    update(dt) {

        this.score.add(new Vector(100, 0), dt);

        this.crush.updateHitboxes(dt);

        this.soundwaves.update();

        this.heart.update(dt);

        if (this.heart.didCollideWithEntity(this.crush)) {
            if (this.didUnlockHeart) {
                stateMachine.change(
                    GameOverState.NAME,
                    {
                        score: this.score.x + this.heart.health / Heart.MAX_HP * 100,
                        message: "Congratulations! That's a hit!"
                    }
                )
            }
            else {
                stateMachine.change(
                    GameOverState.NAME,
                    {
                        score: this.score.x + this.heart.health / Heart.MAX_HP * 100,
                        message: "Bad move! Please start again, don't rush!"
                    }
                )
            }

            return;
        }

        if (this.crush.position.x <= -Character.RENDER_WIDTH) {
            if (this.didUnlockHeart) {
                stateMachine.change(
                    GameOverState.NAME,
                    {
                        score: this.score.x + this.heart.health / Heart.MAX_HP * 100,
                        message: "Oh no! You missed the chance!"
                    }
                )
            }
            else {
                stateMachine.change(
                    GameOverState.NAME,
                    {
                        score: this.score.x + this.heart.health / Heart.MAX_HP * 100,
                        message: "Sometimes it's better to let go if you think so..."
                    }
                )
            }
        }
    }

    render() {

        this.renderGround();

        this.crush.render();

        this.soundwaves.render();
        this.heart.render();
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