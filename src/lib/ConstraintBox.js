export default class ConstraintBox {
    constructor(topLeft, bottomRight) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    setTopLeft(topLeft) {
        this.topLeft = topLeft;
    }

    setBottomRight(bottomRight) {
        this.bottomRight = bottomRight;
    }
}