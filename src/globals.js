import Fonts from "lib/Fonts.js";
import Images from "lib/Images.js";
import Sounds from "lib/Sounds.js";
import StateMachine from "lib/StateMachine.js";
import Timer from "lib/Timer.js";

// const element = document.createElement('canvas');
// element.tabIndex = 1;
// document.body.appendChild(getCanvas());

export const canvas = document.querySelector('canvas');
export const context = canvas.getContext('2d');

export const CANVAS_HEIGHT = document.body.offsetHeight;
export const STANDARD_CANVAS_WIDTH = 835;
export const CANVAS_WIDTH = document.body.offsetHeight;

export const GROUND_LEVEL = CANVAS_HEIGHT * 0.6;

export const TILE_SIZE = 16;

export const keys = {};
export const sounds = new Sounds();
export const images = new Images(context);
export const fonts = new Fonts();
export const timer = new Timer();
export const stateMachine = new StateMachine();

export const playerAndCrush = {
    player: null,
    crush: null
}

export const backgroundMusicSrc = "assets/sounds/buttercup.mp3";
export const backGroundMusic = new Audio(backgroundMusicSrc);
export const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export const DEBUG = false;