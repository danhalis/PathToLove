import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Character from "../../entities/Character.js";
import Female from "../../entities/Female.js";
import Male from "../../entities/Male.js";
import Genders from "../../enums/Genders.js";
import SoundNames from "../../enums/SoundNames.js";
import { context, CANVAS_WIDTH, CANVAS_HEIGHT, STANDARD_CANVAS_WIDTH, keys, stateMachine, GROUND_LEVEL, sounds } from "globals.js";
import CustomizationManager from "../../services/CustomizationManager.js";
import OpeningState from "./OpeningState.js";

export default class TitleScreenState extends State {

    static NAME = "title-screen-state";

    static TITLE_FONT_SIZE = CANVAS_WIDTH / (835 / 40);
    static INSTRUCTION_FONT_SIZE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 20);

    static INSTRUCTION = "PRESS ENTER TO RESTART";

    static CANVAS_CENTER_X = CANVAS_WIDTH * 0.5;
    static TITLE_Y = CANVAS_HEIGHT * 0.2;
    static INSTRUCTION_Y = TitleScreenState.TITLE_Y + CANVAS_HEIGHT * 0.1;

    static BUTTON_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 160);
    static BUTTON_HEIGHT = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 60);
    static BUTTON_BORDER_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5);

	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	constructor() {
		super();

        this.name = TitleScreenState.NAME;

        this.options = {
            start: 'START',
            customize: 'CUSTOMIZE'
        }

        this.highlighted = this.options.start;
	}

	enter() {

	}

    update(dt) {
		// Toggle highlighted option if we press w or s.
		if (keys.w || keys.s ||
            keys.a || keys.d) {
            keys.w = false;
            keys.s = false;
			keys.a = false;
			keys.d = false;

            sounds.play(SoundNames.Selection);

			this.highlighted = this.highlighted === this.options.start ? this.options.customize : this.options.start;
		}

		// Confirm whichever option we have selected to change screens.
		if (keys.Enter) {
			keys.Enter = false;

            sounds.play(SoundNames.Selection);
            
            if (this.highlighted == this.options.start) {
                const customization = CustomizationManager.getCustomization();

                if (!customization) {
                    stateMachine.change("gender-selection-state-for-player");
                }
                else {

                    let player;
                    if (customization.player.gender == Genders.Male) {
                        player = new Male(
                            new Vector(Character.RENDER_WIDTH, Character.RENDER_HEIGHT),
                            new Vector(CANVAS_WIDTH * 0.2, GROUND_LEVEL - Character.RENDER_HEIGHT),
                            customization.player.hairColor,
                            customization.player.skinColor,
                            customization.player.upperClothesColor,
                            customization.player.lowerClothesColor,
                            customization.player.shoesColor
                        )
                    }
                    else {
                        player = new Female(
                            new Vector(Character.RENDER_WIDTH, Character.RENDER_HEIGHT),
                            new Vector(CANVAS_WIDTH * 0.2, GROUND_LEVEL - Character.RENDER_HEIGHT),
                            customization.player.hairColor,
                            customization.player.skinColor,
                            customization.player.upperClothesColor,
                            customization.player.lowerClothesColor,
                            customization.player.shoesColor
                        )
                    }

                    player.holdFlower();

                    let crush;
                    if (customization.crush.gender == Genders.Male) {
                        crush = new Male(
                            new Vector(Character.RENDER_WIDTH, Character.RENDER_HEIGHT),
                            new Vector(CANVAS_WIDTH * 0.2, GROUND_LEVEL - Character.RENDER_HEIGHT),
                            customization.crush.hairColor,
                            customization.crush.skinColor,
                            customization.crush.upperClothesColor,
                            customization.crush.lowerClothesColor,
                            customization.crush.shoesColor
                        )
                    }
                    else {
                        crush = new Female(
                            new Vector(Character.RENDER_WIDTH, Character.RENDER_HEIGHT),
                            new Vector(CANVAS_WIDTH * 0.2, GROUND_LEVEL - Character.RENDER_HEIGHT),
                            customization.crush.hairColor,
                            customization.crush.skinColor,
                            customization.crush.upperClothesColor,
                            customization.crush.lowerClothesColor,
                            customization.crush.shoesColor
                        )
                    }

                    stateMachine.change(OpeningState.NAME, { player, crush });
                }
            }
            else {
                stateMachine.change("gender-selection-state-for-player");
            }
		}
    }

    render() {
        
		context.save();
		context.font = `${TitleScreenState.TITLE_FONT_SIZE}px Joystix`;
		context.fillStyle = "black";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`PATH TO LOVE`, TitleScreenState.CANVAS_CENTER_X, TitleScreenState.TITLE_Y);
		// context.font = `${TitleScreenState.INSTRUCTION_FONT_SIZE}px Joystix`;
        // context.fillText(this.instruction, TitleScreenState.CANVAS_CENTER_X, GenderSelectionState.INSTRUCTION_Y);
		
        // Set the fill style based on which option is highlighted.
        
        context.font = `${TitleScreenState.INSTRUCTION_FONT_SIZE}px Joystix`;
        context.save();
        context.beginPath();

        if (this.highlighted === this.options.start) {
            context.rect(
                CANVAS_WIDTH * 0.5 - (TitleScreenState.BUTTON_WIDTH / 2), 
                CANVAS_HEIGHT * 0.5 - (TitleScreenState.BUTTON_HEIGHT / 2), 
                TitleScreenState.BUTTON_WIDTH, 
                TitleScreenState.BUTTON_HEIGHT);
        }
        else {
            context.rect(
                CANVAS_WIDTH * 0.5 - (TitleScreenState.BUTTON_WIDTH / 2), 
                CANVAS_HEIGHT * 0.6 - (TitleScreenState.BUTTON_HEIGHT / 2), 
                TitleScreenState.BUTTON_WIDTH, 
                TitleScreenState.BUTTON_HEIGHT);
        }

        context.lineWidth = TitleScreenState.BUTTON_BORDER_WIDTH;
        context.stroke();
        context.restore();

		context.fillText(`${this.options.start}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
		context.fillText(`${this.options.customize}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.6);
		context.restore();
    }
}