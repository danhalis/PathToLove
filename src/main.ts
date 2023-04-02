import Game from "lib/Game.js";

import {
	canvas,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	context,
	fonts,
	keys,
	images,
	sounds,
	stateMachine,
} from "globals";
import PlayState from "./components/states/game/PlayState.js";
import GenderSelectionState from "./components/states/game/GenderSelectionState.js";
import ColorSelectionState from "./components/states/game/ColorSelectionState.js";
import CustomizationFor from "./components/enums/CustomizationFor.js";
import OpeningState from "./components/states/game/OpeningState.js";
import GameOverState from "./components/states/game/GameOverState.js";
import TitleScreenState from "./components/states/game/TitleScreenState.js";
import EndingState from "./components/states/game/EndingState.js";

// set up canvas
canvas!.width = CANVAS_WIDTH;
canvas!.height = CANVAS_HEIGHT;

import config from 'config.json';
// Fetch the asset definitions from config.json.

const {
	sounds: soundDefinitions,
	images: imageDefinitions,
	fonts: fontDefinitions,
} = config;

// Load all the assets from their definitions.
sounds.load(soundDefinitions);
images.load(imageDefinitions);
fonts.load(fontDefinitions);

// Add all the states to the state machine.
stateMachine.add(new TitleScreenState());
stateMachine.add(new GenderSelectionState(CustomizationFor.Player));
stateMachine.add(new GenderSelectionState(CustomizationFor.Crush));
stateMachine.add(new ColorSelectionState(CustomizationFor.Player));
stateMachine.add(new ColorSelectionState(CustomizationFor.Crush));
stateMachine.add(new OpeningState());
stateMachine.add(new PlayState());
stateMachine.add(new GameOverState());
stateMachine.add(new EndingState());

stateMachine.change(TitleScreenState.NAME);
// stateMachine.change(GenderSelectionState.NAME + CustomizationFor.Player);

// Add event listeners for player input.
canvas!.addEventListener('keydown', event => {
	if (event.key == 'w' || event.key == 'W') {
		keys['w'] = true;
	}
	else if (event.key == 's' || event.key == 'S') {
		keys['s'] = true;
	}
	else if (event.key == 'a' || event.key == 'A') {
		keys['a'] = true;
	}
	else if (event.key == 'd' || event.key == 'D') {
		keys['d'] = true;
	}
	else {
		keys[event.key] = true;
	}
});

canvas!.addEventListener('keyup', event => {
	if (event.key == 'w' || event.key == 'W') {
		keys['w'] = false;
	}
	else if (event.key == 's' || event.key == 'S') {
		keys['s'] = false;
	}
	else if (event.key == 'a' || event.key == 'A') {
		keys['a'] = false;
	}
	else if (event.key == 'd' || event.key == 'D') {
		keys['d'] = false;
	}
	else {
		keys[event.key] = false;
	}
});

const game = new Game(stateMachine, context, canvas!.width, canvas!.height);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas!.focus();
