import { roundedRectangle } from "../../lib/DrawingHelpers copy.js";
import Vector from "../../lib/Vector.ts";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, STANDARD_CANVAS_WIDTH, timer } from "globals";
import UserInterfaceElement from "./UserInterfaceElement.js";

export default class ProgressBar extends UserInterfaceElement {

    static STROKE_WIDTH = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5);
    static CORNER_RADIUS = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5);
    static WIDTH_CHANGE_PER_SECOND = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 100);

    constructor(x, y, width, height, max, progress = 0, fillColor = null) {
        super(x, y, width, height);

        this.max = max;

        this.progress = progress;
        this.bar = {
            position: this.position,
            dimensions: new Vector(this.calculateBarWidth(), this.dimensions.y),
            color: fillColor 
        };
    }

    calculateBarWidth() {
        let ratio = this.progress / this.max;
        return this.dimensions.x * ratio;
    }

    render() {
        context.save();
        context.lineWidth = ProgressBar.STROKE_WIDTH;

        if (this.bar.dimensions.x < ProgressBar.CORNER_RADIUS) {
            context.save();
            context.fillStyle = this.bar.color;
            context.fillRect(this.bar.position.x + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 1),
                this.bar.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 0.5),
                this.bar.dimensions.x,
                this.bar.dimensions.y - CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 1));
            context.restore();
        }
        else if (this.bar.dimensions.x < this.dimensions.x) {
            roundedRectangle(
                context,
                this.bar.position.x,
                this.bar.position.y,
                this.bar.dimensions.x - CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 0.5),
                this.bar.dimensions.y,
                ProgressBar.CORNER_RADIUS,
                true,
                this.bar.color,
                false,
                "left"
            );
        }
        else {
            roundedRectangle(
                context,
                this.bar.position.x,
                this.bar.position.y,
                this.bar.dimensions.x,
                this.bar.dimensions.y,
                ProgressBar.CORNER_RADIUS,
                true,
                this.bar.color,
                false
            );
        }
        
        roundedRectangle(
            context,
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y,
            ProgressBar.CORNER_RADIUS,
            false,
            null,
            true
        )

        context.restore();
    }

    async animate() {
        const targetBarWidth = this.calculateBarWidth();

        await timer.tweenAsync(this.bar.dimensions, ["x"], [targetBarWidth], (Math.abs(targetBarWidth - this.bar.dimensions.x) / ProgressBar.WIDTH_CHANGE_PER_SECOND));
    }

    setProgress(progress) {
        this.progress = progress;
    }

    async updateBar(progress) {
        if (this.progress == progress) return;

		this.setProgress(progress);
		await this.animate();
	}

    setMax(max) {
        this.max = max;
    }

    setColor(color) {
        this.bar.color = color;
    }

    refresh() {
        this.bar.dimensions.x = this.calculateBarWidth();
    }
}