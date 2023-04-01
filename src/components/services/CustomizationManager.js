
export default class CustomizationManager {
	static getCustomization() {
		const customization = JSON.parse(localStorage.getItem('customization')) ?? null;

		return customization;
	}

	static saveCustomization(customization) {
		localStorage.setItem('customization', JSON.stringify(customization));
	}
}
