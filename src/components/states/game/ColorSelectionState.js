import { 
    context, 
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    TILE_SIZE,
    keys,
    stateMachine, 
    images,
    playerAndCrush,
    GROUND_LEVEL,
    sounds
} from "globals";
import State from "../../../lib/State.ts";
import Vector from "../../../lib/Vector.ts";
import Character from "../../entities/character/Character.ts";
import Male from "../../entities/Male.js";
import Genders from "../../enums/Genders.js";
import Female from "../../entities/Female.js";
import Directions from "../../enums/Directions.js";
import MaleColors from "../../enums/MaleColors.js";
import FemaleColors from "../../enums/FemaleColors.js";
import ImageNames from "../../enums/ImageNames.js";
import CustomizationManager from "../../services/CustomizationManager.js";
import SoundNames from "../../enums/SoundNames.js";

export default class ColorSelectionState extends State {

    static NAME = "color-selection-state";

    static TITLE_FONT_SIZE = CANVAS_WIDTH / (835 / 40);
    static INSTRUCTION_FONT_SIZE = CANVAS_WIDTH / (835 / 20);

    static INSTRUCTION_FOR_PLAYER = "CHOOSE YOUR COLORS";
    static INSTRUCTION_FOR_CRUSH = "CHOOSE YOUR CRUSH'S COLORS"

    static COLOR_OPTIONS_NUM = 6;

    static CANVAS_CENTER_X = CANVAS_WIDTH * 0.5;
    static TITLE_Y = CANVAS_HEIGHT * 0.2;
    static INSTRUCTION_Y = ColorSelectionState.TITLE_Y + CANVAS_HEIGHT * 0.1;
    static TABLE_X = ColorSelectionState.CANVAS_CENTER_X - CANVAS_WIDTH / (835 / 20);
    static TABLE_Y = ColorSelectionState.INSTRUCTION_Y + CANVAS_WIDTH / (835 / 50);

    static TABLE_BORDER_WIDTH = CANVAS_WIDTH / (835 / 5);

    static LABEL_WIDTH = CANVAS_WIDTH / (835 / 110);
    static LABEL_HEIGHT = CANVAS_WIDTH / (835 / 50);
    static COLOR_LIST_WIDTH = CANVAS_WIDTH / (835 / 200);
    static COLOR_CELL_SIZE = CANVAS_WIDTH / (835 / 30);
    static COLOR_CELL_TOP_MARGIN = (ColorSelectionState.LABEL_HEIGHT - ColorSelectionState.COLOR_CELL_SIZE) / 2;
    static COLOR_CELL_LEFT_MARGIN = (ColorSelectionState.COLOR_LIST_WIDTH - ColorSelectionState.COLOR_CELL_SIZE * 3) / 4;
     
    static CHECK_WIDTH = CANVAS_WIDTH / (835 / TILE_SIZE);
    static CHECK_HEIGHT = CANVAS_WIDTH / (835 / TILE_SIZE);
    static CHECK_RENDER_OFFSET = new Vector(
        -CANVAS_WIDTH / (835 / 10),
        -CANVAS_WIDTH / (835 / 10)
    );

    static NEXT_BUTTON_WIDTH = CANVAS_WIDTH / (835 / 100);
    static NEXT_BUTTON_HEIGHT = CANVAS_WIDTH / (835 / 40);
    static NEXT_BUTTON_X = ColorSelectionState.TABLE_X + (ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_LIST_WIDTH) - ColorSelectionState.NEXT_BUTTON_WIDTH;
    static NEXT_BUTTON_Y = ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN * 2 + ColorSelectionState.LABEL_HEIGHT * (ColorSelectionState.COLOR_OPTIONS_NUM - 1);

    constructor(forWho) {
        super();

        this.name = ColorSelectionState.NAME + forWho;

        if (this.name == "color-selection-state-for-player") {
            this.nextStateName = "gender-selection-state-for-crush";
            this.instruction = ColorSelectionState.INSTRUCTION_FOR_PLAYER;
        }
        else {
            this.nextStateName = "opening-state";
            this.instruction = ColorSelectionState.INSTRUCTION_FOR_CRUSH;
        }

        this.maleColorOptions = [
            MaleColors.Skin,
            MaleColors.Hair,
            MaleColors.Shirt,
            MaleColors.Shorts,
            MaleColors.Shoes
        ];

        this.femaleColorOptions = [
            FemaleColors.Skin,
            FemaleColors.Hair,
            FemaleColors.Blouse,
            FemaleColors.Skirt,
            FemaleColors.Shoes
        ];
    }

    enter(params) {

        this.chosenGender = params.chosenGender;

        if (this.chosenGender === Genders.Male) {
            this.character = new Male(
                new Vector(Character.RENDER_WIDTH, Character.RENDER_HEIGHT),
                new Vector(CANVAS_WIDTH * 0.2, GROUND_LEVEL - Character.RENDER_HEIGHT)
            );
        }
        else {
            this.character = new Female(
                new Vector(Character.RENDER_WIDTH, Character.RENDER_HEIGHT),
                new Vector(CANVAS_WIDTH * 0.2, GROUND_LEVEL - Character.RENDER_HEIGHT)
            );
        }

        if (this.name == "color-selection-state-for-player") {
            this.character.holdFlower();
        }

        this.character.enableAutoMove(Directions.Right);
        this.character.setSpeedScalar(0);

        this.cursorPos = new Vector(0, 0);
        this.rowOptionsNum = 3;

        this.labels = {
            skin: 'SKIN',
            hair: 'HAIR',
            upperClothes: this.character.gender == Genders.Male ? 'SHIRT' : 'BLOUSE',
            lowerClothes: this.character.gender == Genders.Male ? 'SHORTS' : 'SKIRT',
            shoes: 'SHOES'
        }

        let skinColors = [
            '#8f563b',
            this.character.gender == Genders.Male ? '#eec39a' : '#f6cda6',
            '#ffdfc0'
        ];
        let hairColors = [
            '#000000',
            this.character.gender == Genders.Male ? '#e16327' : '#df7126',
            this.character.gender == Genders.Male ? '#f2e700' : '#fff67b'
        ];
        let upperClothesColors = [
            this.character.gender == Genders.Male ? '#e92525' : '#8f252b',
            this.character.gender == Genders.Male ? '#99e550' : '#fb9ca1',
            '#ffffff'
        ];
        let lowerClothesColors = [
            '#000000',
            this.character.gender == Genders.Male ? '#d9a066' : '#222034',
            '#ffffff'
        ];
        let shoesColors = [
            '#000000',
            '#5fcde4',
            '#ffffff'
        ]
        let confirm = [
            'Next'
        ]
        
        this.colorOptions = [
            skinColors,
            hairColors,
            upperClothesColors,
            lowerClothesColors,
            shoesColors,
            confirm
        ];

        this.chosenColorOptions = {
            skin: MaleColors.Skin.Black,
            hair: MaleColors.Hair.Black,
            upperClothes: MaleColors.Shirt.Red,
            lowerClothes: MaleColors.Shorts.Black,
            shoes: MaleColors.Shoes.Black
        }
    }

    update(dt) {

        if (keys.w) {
            keys.w = false;

            sounds.play(SoundNames.Selection);
            
            this.cursorPos.y = this.cursorPos.y - 1;
            if (this.cursorPos.y < 0) {
                this.cursorPos.y = this.colorOptions.length - 1;
            }
        }
        else if (keys.s) {
            keys.s = false;

            sounds.play(SoundNames.Selection);

            this.cursorPos.y = (this.cursorPos.y + 1) % this.colorOptions.length;
        }
        else if (keys.a) {
            keys.a = false;

            sounds.play(SoundNames.Selection);

            if (this.cursorPos.y != this.colorOptions.length - 1) {
                this.cursorPos.x = this.cursorPos.x - 1;
                if (this.cursorPos.x < 0) {
    
                    this.cursorPos.x = this.rowOptionsNum - 1;
                }
            }
        }
        else if (keys.d) {
            keys.d = false;

            sounds.play(SoundNames.Selection);

            if (this.cursorPos.y != this.colorOptions.length - 1) {
                this.cursorPos.x = (this.cursorPos.x + 1) % this.rowOptionsNum;
            }
        }      
        else if (keys.Enter) {
            keys.Enter = false;

            sounds.play(SoundNames.Selection);
            
            switch(this.cursorPos.y) {
                case 0:
                    this.chosenColorOptions.skin = this.cursorPos.x;
                    this.character.setSkinColor(this.chosenColorOptions.skin);
                    break;
                case 1:
                    this.chosenColorOptions.hair = this.cursorPos.x;
                    this.character.setHairColor(this.chosenColorOptions.hair);
                    break;
                case 2:
                    this.chosenColorOptions.upperClothes = this.cursorPos.x;
                    this.character.setUpperClothesColor(this.chosenColorOptions.upperClothes);
                    break;
                case 3:
                    this.chosenColorOptions.lowerClothes = this.cursorPos.x;
                    this.character.setLowerClothesColor(this.chosenColorOptions.lowerClothes);
                    break;
                case 4:
                    this.chosenColorOptions.shoes = this.cursorPos.x;
                    this.character.setShoesColor(this.chosenColorOptions.shoes);
                    break;
                case 5:
                    this.character.disableAutoMove();
                    this.character.resetSpeedScalar();
                    this.character.refreshSprites();

                    if (this.nextStateName == "gender-selection-state-for-crush") {
                        playerAndCrush.player = this.character;
                    }
                    else {
                        playerAndCrush.crush = this.character;

                        const customization = {
                            player: {
                                gender: playerAndCrush.player.gender,
                                hairColor: playerAndCrush.player.hairColor,
                                skinColor: playerAndCrush.player.skinColor,
                                upperClothesColor: playerAndCrush.player.upperClothesColor,
                                lowerClothesColor: playerAndCrush.player.lowerClothesColor,
                                shoesColor: playerAndCrush.player.shoesColor
                            },
                            crush: {
                                gender: playerAndCrush.crush.gender,
                                hairColor: playerAndCrush.crush.hairColor,
                                skinColor: playerAndCrush.crush.skinColor,
                                upperClothesColor: playerAndCrush.crush.upperClothesColor,
                                lowerClothesColor: playerAndCrush.crush.lowerClothesColor,
                                shoesColor: playerAndCrush.crush.shoesColor
                            }
                        }

                        CustomizationManager.saveCustomization(customization);
                    }

                    stateMachine.change(this.nextStateName, playerAndCrush);
                    return;
            }
        }

        this.character.update(dt);
    }

    renderCheck(x, y) {
        images.render(ImageNames.Check, x, y, ColorSelectionState.CHECK_WIDTH, ColorSelectionState.CHECK_HEIGHT);
    }

    renderCursor(x, y, width = ColorSelectionState.COLOR_CELL_SIZE, height = ColorSelectionState.COLOR_CELL_SIZE) {
        context.save();
        context.strokeStyle = 'green';
        context.strokeRect(x, y, width, height);
        context.restore();
    }

    renderNextButton(x, y) {
        context.strokeRect(x, y, ColorSelectionState.NEXT_BUTTON_WIDTH, ColorSelectionState.NEXT_BUTTON_HEIGHT);
    }

    render() {

        context.save();
		context.font = `${ColorSelectionState.TITLE_FONT_SIZE}px Joystix`;
		context.fillStyle = "black";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`PATH TO LOVE`, ColorSelectionState.CANVAS_CENTER_X, ColorSelectionState.TITLE_Y);

		context.font = `${ColorSelectionState.INSTRUCTION_FONT_SIZE}px Joystix`;
        context.fillText(this.instruction, ColorSelectionState.CANVAS_CENTER_X, ColorSelectionState.INSTRUCTION_Y);       

        context.save;
        context.beginPath();
        context.lineWidth = ColorSelectionState.TABLE_BORDER_WIDTH;

        // skin color label
        context.fillText(this.labels.skin, ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH / 2, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT / 2);
        context.rect(ColorSelectionState.TABLE_X, ColorSelectionState.TABLE_Y, ColorSelectionState.LABEL_WIDTH, ColorSelectionState.LABEL_HEIGHT);
        
        // skin color list
        context.rect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH, ColorSelectionState.TABLE_Y, ColorSelectionState.COLOR_LIST_WIDTH, ColorSelectionState.LABEL_HEIGHT);

        // brown skin
        context.save();
        context.fillStyle = this.colorOptions[0][0];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // yellow skin
        context.save();
        context.fillStyle = this.colorOptions[0][1];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // white skin
        context.save();
        context.fillStyle = this.colorOptions[0][2];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();


        // hair color label
        context.fillText(this.labels.hair, ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH / 2, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT + ColorSelectionState.LABEL_HEIGHT / 2);
        context.rect(ColorSelectionState.TABLE_X, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT, ColorSelectionState.LABEL_WIDTH, ColorSelectionState.LABEL_HEIGHT);

        // hair color list
        context.rect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT, ColorSelectionState.COLOR_LIST_WIDTH, ColorSelectionState.LABEL_HEIGHT);

        // black hair
        context.save();
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // orange hair
        context.save();
        context.fillStyle = this.colorOptions[1][1];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // yellow hair
        context.save();
        context.fillStyle = this.colorOptions[1][2];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();


        // shirt/blouse color label
        context.fillText(this.labels.upperClothes, ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH / 2, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT * 2 + ColorSelectionState.LABEL_HEIGHT / 2);
        context.rect(ColorSelectionState.TABLE_X, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT * 2, ColorSelectionState.LABEL_WIDTH, ColorSelectionState.LABEL_HEIGHT);

        // shirt color list
        context.rect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT * 2, ColorSelectionState.COLOR_LIST_WIDTH, ColorSelectionState.LABEL_HEIGHT);

        // red shirt/blouse
        context.save();
        context.fillStyle = this.colorOptions[2][0];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 2, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 2, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // green shirt/ pink blouse
        context.save();
        context.fillStyle = this.colorOptions[2][1];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 2, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 2, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // white shirt/blouse
        context.save();
        context.fillStyle = this.colorOptions[2][2];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 2, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 2, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();


        // shorts/skirt color label
        context.fillText(this.labels.lowerClothes, ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH / 2, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT * 3 + ColorSelectionState.LABEL_HEIGHT / 2);
        context.rect(ColorSelectionState.TABLE_X, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT * 3, ColorSelectionState.LABEL_WIDTH, ColorSelectionState.LABEL_HEIGHT);

        // shorts color list
        context.rect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT * 3, ColorSelectionState.COLOR_LIST_WIDTH, ColorSelectionState.LABEL_HEIGHT);

        // black shorts/skirt
        context.save();
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 3, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 3, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // brown shorts/ purple skirt
        context.save();
        context.fillStyle = this.colorOptions[3][1];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 3, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 3, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // white shorts
        context.save();
        context.fillStyle = this.colorOptions[3][2];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 3, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 3, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();


        // shoes color label
        context.fillText(this.labels.shoes, ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH / 2, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT * 4 + ColorSelectionState.LABEL_HEIGHT / 2);
        context.rect(ColorSelectionState.TABLE_X, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT * 4, ColorSelectionState.LABEL_WIDTH, ColorSelectionState.LABEL_HEIGHT);

        // shoes color list
        context.rect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH, ColorSelectionState.TABLE_Y + ColorSelectionState.LABEL_HEIGHT * 4, ColorSelectionState.COLOR_LIST_WIDTH, ColorSelectionState.LABEL_HEIGHT);

        // black shoes
        context.save();
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 4, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 4, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // blue shoes
        context.save();
        context.fillStyle = this.colorOptions[4][1];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 4, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 2 + ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 4, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // white shoes
        context.save();
        context.fillStyle = this.colorOptions[4][2];
        context.fillRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 4, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.strokeStyle = '#1a1a1a';
        context.strokeRect(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * 3 + ColorSelectionState.COLOR_CELL_SIZE * 2, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 4, ColorSelectionState.COLOR_CELL_SIZE, ColorSelectionState.COLOR_CELL_SIZE);
        context.restore();

        // render NEXT button
        context.fillText("NEXT", ColorSelectionState.NEXT_BUTTON_X + ColorSelectionState.NEXT_BUTTON_WIDTH / 2, ColorSelectionState.NEXT_BUTTON_Y + ColorSelectionState.NEXT_BUTTON_HEIGHT / 2);
        this.renderNextButton(ColorSelectionState.NEXT_BUTTON_X, ColorSelectionState.NEXT_BUTTON_Y);

        // render cursor
        if (this.cursorPos.y < this.colorOptions.length - 1) {
            this.renderCursor(ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * (this.cursorPos.x + 1) + ColorSelectionState.COLOR_CELL_SIZE * this.cursorPos.x, ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * this.cursorPos.y);
        }
        else {
            this.renderCursor(ColorSelectionState.NEXT_BUTTON_X, ColorSelectionState.NEXT_BUTTON_Y, ColorSelectionState.NEXT_BUTTON_WIDTH, ColorSelectionState.NEXT_BUTTON_HEIGHT);
        }

        // render check on the chosen skin color
        this.renderCheck(
            ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * (this.chosenColorOptions.skin + 1) + ColorSelectionState.COLOR_CELL_SIZE * this.chosenColorOptions.skin + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.x, 
            ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.y
        );
        // render check on the chosen hair color
        this.renderCheck(
            ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * (this.chosenColorOptions.hair + 1) + ColorSelectionState.COLOR_CELL_SIZE * this.chosenColorOptions.hair + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.x, 
            ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.y
        );
        // render check on the chosen shirt/blouse color
        this.renderCheck(
            ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * (this.chosenColorOptions.upperClothes + 1) + ColorSelectionState.COLOR_CELL_SIZE * this.chosenColorOptions.upperClothes + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.x, 
            ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 2 + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.y
        );
        // render check on the chosen shorts/skirt color
        this.renderCheck(
            ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * (this.chosenColorOptions.lowerClothes + 1) + ColorSelectionState.COLOR_CELL_SIZE * this.chosenColorOptions.lowerClothes + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.x, 
            ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 3 + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.y
        );
        // render check on the chosen shirt/blouse color
        this.renderCheck(
            ColorSelectionState.TABLE_X + ColorSelectionState.LABEL_WIDTH + ColorSelectionState.COLOR_CELL_LEFT_MARGIN * (this.chosenColorOptions.shoes + 1) + ColorSelectionState.COLOR_CELL_SIZE * this.chosenColorOptions.shoes + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.x, 
            ColorSelectionState.TABLE_Y + ColorSelectionState.COLOR_CELL_TOP_MARGIN + ColorSelectionState.LABEL_HEIGHT * 4 + ColorSelectionState.COLOR_CELL_SIZE + ColorSelectionState.CHECK_RENDER_OFFSET.y
        );

        context.stroke();
        context.restore();

        context.restore();

        this.character.render();
    }
}