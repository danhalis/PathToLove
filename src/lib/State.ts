export default abstract class State {

	enter(parameters) {}

	exit() {}

	abstract update(dt: number): void;

	abstract render(): void;
}
