import State from "../../../lib/State.ts";
import SoundNames from "../../enums/SoundNames.js";
import { context, CANVAS_WIDTH, CANVAS_HEIGHT, STANDARD_CANVAS_WIDTH, keys, stateMachine, backGroundMusic, sounds } from "globals";
import TitleScreenState from "./TitleScreenState.js";

export default class GameOverState extends State {

    static NAME = "game-over-state";

    static TITLE_FONT_SIZE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 40);
    static SCORE_FONT_SIZE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 30);
    static MESSAGE_FONT_SIZE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 30);
    static INSTRUCTION_FONT_SIZE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 20);

    static INSTRUCTION = "PRESS ENTER TO RESTART";

    static CANVAS_CENTER_X = CANVAS_WIDTH * 0.5;
    static TITLE_Y = CANVAS_HEIGHT * 0.3;
    static SCORE_Y = CANVAS_HEIGHT * 0.4;
    static MESSAGE_Y = CANVAS_HEIGHT * 0.5;
    static INSTRUCTION_Y = GameOverState.MESSAGE_Y + CANVAS_HEIGHT * 0.1;

	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	constructor() {
		super();

        this.name = GameOverState.NAME;
	}

	enter(params) {
        this.score = Math.floor(params.score);
        this.message = params.message;
	}

    exit() {
        backGroundMusic.pause();
        backGroundMusic.currentTime = 0;
    }

	update() {
		if (keys.Enter) {
			keys.Enter = false;

            sounds.play(SoundNames.Selection);

			location.reload();
		}
	}

	render() {
        context.save();
		context.font = `${GameOverState.TITLE_FONT_SIZE}px Joystix`;
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('GAME OVER', GameOverState.CANVAS_CENTER_X, GameOverState.TITLE_Y);

        context.font = `${GameOverState.SCORE_FONT_SIZE}px Joystix`;
        context.fillText(`SCORE: ${this.score}`, GameOverState.CANVAS_CENTER_X, GameOverState.SCORE_Y);

		context.font = `${GameOverState.MESSAGE_FONT_SIZE}px Brush Script MT`;
		
        context.fillText(this.message, GameOverState.CANVAS_CENTER_X, GameOverState.MESSAGE_Y);
		
        context.font = `${GameOverState.INSTRUCTION_FONT_SIZE}px Joystix`;
        context.fillText(GameOverState.INSTRUCTION, GameOverState.CANVAS_CENTER_X, GameOverState.INSTRUCTION_Y);
        context.restore();
	}
}