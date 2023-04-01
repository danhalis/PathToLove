import Timer from "./Timer.js";

export default class Animation {
	constructor(frames, interval, playedOnce = false, callBack = () => {}) {
		this.frames = frames;
		this.interval = interval;

		this.playedOnce = playedOnce;
		this.callBack = callBack;

		this.timer = new Timer();
		this.currentFrame = 0;

		this.startTimer();
	}

	update(dt) {
		// No need to update if animation is only one frame.
		if (this.frames.length === 1) {
			return;
		}

		this.timer.update(dt);
	}

	startTimer() {
		if (this.playedOnce) {
			this.task = this.timer.addTask(() => {
				this.currentFrame = Math.max(0, (this.currentFrame + 1) % (this.frames.length));
			}, this.interval, this.interval * (this.frames.length - 1), this.callBack);
		}
		else {
			this.task = this.timer.addTask(() => {
				this.currentFrame = Math.max(0, (this.currentFrame + 1) % (this.frames.length));
			}, this.interval);
		}
	}

	getCurrentFrame() {
		return this.frames[this.currentFrame];
	}

	reset() {
		this.currentFrame = 0;
	}

	pause() {
		this.task.pause();
	}

	resume() {
		this.task.resume();
	}
}
