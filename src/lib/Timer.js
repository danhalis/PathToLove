/**
 * Uses delta time passed in from our game loop to keep track of individual
 * tasks over a given period of time. You can specify an action to be done at
 * each interval of time, or only once after a duration. There is also a tween
 * function that makes use of the timer mechanism to interpolate a value between
 * a start and end value.
 */
export default class Timer {
	constructor() {
		this.tasks = [];
	}

	update(dt) {
		this.updateTasks(dt)
		this.removeFinishedTasks();
	}

	/**
	 * Adds a task to the timer's list of tasks to be run, then returns this Task for later modification.
	 *
	 * @param {function} action The function to execute after a certain period of time.
	 * @param {number} interval How often the action should execute (frequency).
	 * @param {number} duration How long the task will be tracked in this.tasks.
	 * @param {function} callback The function to execute after duration has passed.
	 * @param {object} object The object to be interpolated.
	 * @param {Array} objParamaters The object parameters to be interpolated.
	 */
	addTask(action, interval, duration = 0, callback = () => { }, object = {}, objParamaters = []) {
		const newTask = new Task(action, interval, duration, callback, object, objParamaters);
		this.tasks.push(newTask);

		// return the newly added task in case we want to modify the task
		// (Map can be used here and a hash code can be returned instead)
		return newTask;
	}

	/**
	 * Loops through the tasks and updates them accordingly based on delta time.
	 *
	 * @param {number} dt How much time has elapsed since the last time this was called.
	 */
	updateTasks(dt) {
		this.tasks.forEach((task) => {
			task.update(dt);
		});
	}

	/**
	 * Removes the finished tasks by looping through each tasks and checking the isDone flag.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	 */
	removeFinishedTasks() {
		this.tasks = this.tasks.filter(task => !task.isDone);
	}

	clear() {
		this.tasks = [];
	}

	/**
	 * Increase/Decrease a value until a specified value is reached
	 * over a specified period of time in seconds.
	 *
	 * @param {object} object The object to tween.
	 * @param {Array} parameters The paramaters on the object to tween as strings.
	 * @param {Array} endValues The final numerical values the parameters should reach.
	 * @param {number} duration How long the tween should take.
	 * @param {function} callback The function to execute after duration has passed.
	 */
	tween(object, parameters, endValues, duration, callback = () => { }) {
		
		let startingValues;
		try {
			startingValues = JSON.parse(JSON.stringify(object));
		} catch (error) {
			console.log(error);
		}

		this.addTask((time) => {
			parameters.forEach((parameter, index) => {
				// Calculate the direction in case we have to tween values from high to low.
				const direction = endValues[index] - object[parameter] > 0 ? 1 : -1;
				const startValue = startingValues[parameter];
				const endValue = endValues[index];
				const scaleRatio = time / duration;

				if (direction === 1) {
					const currentValue = startValue + ((endValue - startValue) * scaleRatio);
					object[parameter] = Math.min(endValue, currentValue);
				}
				else {
					const currentValue = startValue - ((startValue - endValue) * scaleRatio);
					object[parameter] = Math.max(endValue, currentValue);
				}
			});
		}, 0, duration, callback, object, parameters);
	}

	async tweenAsync(object, parameters, endValues, duration) {
		return new Promise((resolve) => {
			this.tween(object, parameters, endValues, duration, resolve);
		});
	}

	/**
	 * Increase/Decrease a value until a specified value is reached 
	 * and then roll back to the original value
	 * over a specified period of time in seconds.
	 * 
	 * @param {object} object The object to tween.
	 * @param {Array} parameters The paramaters on the object to tween as strings.
	 * @param {Array} endValues The final numerical values the parameters should reach.
	 * @param {number} duration How long the tween should take.
	 * @param {number} repeat How many times to repeat the tween.
	 */
	async tweenAsyncForthAndBack(object, parameters, endValues, duration, repeat) {
		let halfDuration = duration / 2;
		let oldValues = [];

		parameters.forEach(param => {
			oldValues.push(object[param]);
		});

		for (let i = 0; i < repeat; i++) {
			await this.tweenAsync(object, parameters, endValues, halfDuration);
			await this.tweenAsync(object, parameters, oldValues, halfDuration);
		}
	}

	async wait(duration) {
		return new Promise((resolve) => {
			this.addTask(() => { }, 0, duration, resolve);
		});
	}
}

class Task {
	/**
	 * Represents an action to be done after a certain period of time.
	 *
	 * @param {function} action The function to execute after a certain period of time.
	 * @param {number} interval How often the action should execute (frequency).
	 * @param {number} duration How long the task will be tracked in this.tasks.
	 * @param {function} callback The function to execute after duration has passed.
	 * @param {object} object The object to be interpolated.
	 * @param {Array} objParamaters The object parameters to be interpolated.
	 */
	constructor(action, interval, duration = 0, callback = () => { }, object = {}, objParamaters = []) {
		this.action = action;
		this.object = object;
		this.objParamaters = objParamaters;
		this.startingObjValues = [];
		objParamaters.forEach(param => {
			this.startingObjValues.push(object[param]);
		});
		this.paused = false;
		this.interval = interval;
		this.intervalTimer = 0;
		this.totalTime = 0;
		this.duration = duration;
		this.callback = callback;
		this.isDone = false;
	}

	setTotalTime(time) {
		this.totalTime = time;
	}

	update(dt) {
		if (this.paused) return;

		this.intervalTimer += dt; // Counts from 0 until interval.
		this.totalTime += dt; // Counts from 0 until duration.

		// An interval of 0 means we're tweening.
		if (this.interval === 0) {
			this.action(this.totalTime);
		}
		// Otherwise, at every interval, execute the action.
		else if (this.intervalTimer >= this.interval) {
			this.action(dt);
			this.intervalTimer %= this.interval;
		}

		// At the end of the duration, execute the callback.
		if (this.duration !== 0 && this.totalTime >= this.duration) {
			this.callback();
			this.isDone = true;
		}
	}

	pause() {
		this.paused = true;
	}

	resume() {
		this.paused = false;
	}

	markAsDone() {
		this.isDone = true;
	}
}
