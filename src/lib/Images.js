import Graphic from "./Graphic.js";

export default class Images {
	constructor(context) {
		this.context = context;
		this.images = {};
	}

	load(imageDefinitions) {
		imageDefinitions.forEach((imageDefinition) => {
			this.images[imageDefinition.name] = new Graphic(
				imageDefinition.source,
				imageDefinition.width,
				imageDefinition.height,
				this.context,
			);
		});
	}

	get(name) {
		return this.images[name];
	}

	render(name, x, y) {
		this.get(name).render(x, y);
	}

	render(name, x, y, width, height) {
		this.get(name).render(x, y, width, height);
	}
}
