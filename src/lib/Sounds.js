import SoundPool from "./SoundPool.js";

export default class Sounds {
	constructor() {
		this.sounds = {};
	}

	load(soundDefinitions) {
		soundDefinitions.forEach((soundDefinition) => {
			this.sounds[soundDefinition.name] = new SoundPool(
				soundDefinition.source,
				soundDefinition.maxStreams,
				soundDefinition.volume,
				soundDefinition.loop,
			);
		});
	}

	get(name) {
		return this.sounds[name];
	}

	play(name) {
		this.get(name).play();
	}

	pause(name) {
		this.get(name).pause();
	}
}
