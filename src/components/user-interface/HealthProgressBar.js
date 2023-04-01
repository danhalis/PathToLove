import { CANVAS_WIDTH } from "globals.js";
import ProgressBar from "./ProgressBar.js";

export default class HealthProgressBar extends ProgressBar {

    static RENDER_WIDTH = CANVAS_WIDTH * 0.3;
    static RENDER_HEIGHT = CANVAS_WIDTH / 50;

    static HEALTH_RATIO_MILESTONES = {
        GREEN: {
            points: 0.51,
            color: "green"
        },
        YELLOW: {
            points: 0.26,
            color: "yellow"
        },
        RED: {
            points: 0,
            color: "red"
        }
    }

    constructor(x, y, width, height, max, currentHealth) {
        super(x, y, width, height, max, currentHealth);
    }

    render() {
        let currentHealthRatio = this.bar.dimensions.x / this.dimensions.x;
        if (currentHealthRatio >= HealthProgressBar.HEALTH_RATIO_MILESTONES.GREEN.points) {
            this.setColor(HealthProgressBar.HEALTH_RATIO_MILESTONES.GREEN.color);
        }
        else if (currentHealthRatio >= HealthProgressBar.HEALTH_RATIO_MILESTONES.YELLOW.points) {
            this.setColor(HealthProgressBar.HEALTH_RATIO_MILESTONES.YELLOW.color);
        }
        else {
            this.setColor(HealthProgressBar.HEALTH_RATIO_MILESTONES.RED.color);
        }

        super.render();
    }
}