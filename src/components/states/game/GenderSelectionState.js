import { 
    context, 
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    keys,
    stateMachine, 
    TILE_SIZE,
    STANDARD_CANVAS_WIDTH,
    sounds
} from "globals";
import State from "../../../lib/State.ts";
import ColorSelectionState from "./ColorSelectionState.js";
import Genders from "../../enums/Genders.js";
import SoundNames from "../../enums/SoundNames.js";

export default class GenderSelectionState extends State {

    static NAME = "gender-selection-state";

    static TITLE_FONT_SIZE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 40);
    static INSTRUCTION_FONT_SIZE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 20);

    static INSTRUCTION_FOR_PLAYER = "CHOOSE YOUR GENDER";
    static INSTRUCTION_FOR_CRUSH = "CHOOSE YOUR CRUSH'S GENDER";

    static CANVAS_CENTER_X = CANVAS_WIDTH * 0.5;
    static TITLE_Y = CANVAS_HEIGHT * 0.2;
    static INSTRUCTION_Y = ColorSelectionState.TITLE_Y + CANVAS_HEIGHT * 0.1;

    static BUTTON_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 80);
    static BUTTON_HEIGHT = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 60);
    static BUTTON_BORDER_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5);

    constructor(forWho) {
        super();

        this.name = GenderSelectionState.NAME + forWho;

        this.genderOptions = {
			male: '♂',
			female: '♀',
		};

		this.highlighted = this.genderOptions.male;

        if (this.name == "gender-selection-state-for-player") {
            this.nextStateName = "color-selection-state-for-player";
            this.instruction = GenderSelectionState.INSTRUCTION_FOR_PLAYER;
        }
        else {
            this.nextStateName = "color-selection-state-for-crush";
            this.instruction = GenderSelectionState.INSTRUCTION_FOR_CRUSH;
        }
      
        this.chosenGender = Genders.Male;
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
            
			this.highlighted = this.highlighted === this.genderOptions.male ? this.genderOptions.female : this.genderOptions.male;
            this.chosenGender = this.chosenGender === Genders.Male ? Genders.Female : Genders.Male;
		}

		// Confirm whichever option we have selected to change screens.
		if (keys.Enter) {
			keys.Enter = false;

            sounds.play(SoundNames.Selection);

			stateMachine.change(this.nextStateName, { chosenGender: this.chosenGender });
		}
    }

    render() {
        
		context.save();
		context.font = `${GenderSelectionState.TITLE_FONT_SIZE}px Joystix`;
		context.fillStyle = "black";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`PATH TO LOVE`, GenderSelectionState.CANVAS_CENTER_X, GenderSelectionState.TITLE_Y);
		context.font = `${GenderSelectionState.INSTRUCTION_FONT_SIZE}px Joystix`;
        context.fillText(this.instruction, GenderSelectionState.CANVAS_CENTER_X, GenderSelectionState.INSTRUCTION_Y);
		// Set the fill style based on which option is highlighted.
        
        context.font = `${GenderSelectionState.TITLE_FONT_SIZE}px Joystix`;

        context.save();
        context.beginPath();

        if (this.highlighted === this.genderOptions.male) {
            context.rect(
                CANVAS_WIDTH * 0.4 - (GenderSelectionState.BUTTON_WIDTH / 2), 
                CANVAS_HEIGHT * 0.5 - (GenderSelectionState.BUTTON_HEIGHT / 2), 
                GenderSelectionState.BUTTON_WIDTH, 
                GenderSelectionState.BUTTON_HEIGHT);
        }
        else {
            context.rect(
                CANVAS_WIDTH * 0.6 - (GenderSelectionState.BUTTON_WIDTH / 2), 
                CANVAS_HEIGHT * 0.5 - (GenderSelectionState.BUTTON_HEIGHT / 2), 
                GenderSelectionState.BUTTON_WIDTH, 
                GenderSelectionState.BUTTON_HEIGHT);
        }

        context.lineWidth = GenderSelectionState.BUTTON_BORDER_WIDTH;
        context.stroke();
        context.restore();

		context.fillStyle = "cornflowerblue";
		context.fillText(`${this.genderOptions.male}`, CANVAS_WIDTH * 0.4, CANVAS_HEIGHT * 0.5);
		context.fillStyle = "pink";
		context.fillText(`${this.genderOptions.female}`, CANVAS_WIDTH * 0.6, CANVAS_HEIGHT * 0.5);
		context.restore();
    }
}