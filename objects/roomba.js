class Roomba {
    constructor(fieldX, fieldY, direction) {

        this.fieldX = fieldX;
        this.fieldY = fieldY;

        var pixelCoords = this._coordsToPixel();
        this.pixelX = pixelCoords[0];
        this.pixelY = pixelCoords[1];

        this.setDirection(direction);
    }

    data() {
        return { "x": this.fieldX, "y": this.fieldY, "direction": this.direction }
    }

    frontIsClear() {
        return !this.field.isBlockedByWall(this.fieldX, this.fieldY, this.direction);
    }

    // Animates a move forward and returns the new JSON
    async moveForward() {
        await this._animateMove();

        // Adjust the field coordinates
        switch (this.direction) {
            case "right":
                this.fieldX += 1;
                break;
            case "left":
                this.fieldX -= 1;
                break;
            case "down":
                this.fieldY += 1;
                break;
            case "up":
                this.fieldY -= 1;
                break;
        }
        return this.data();
    }

    // Animates a turn left and returns the new JSON
    async turnLeft() {
        await this._animateTurn("left");
        return this.data();
    }

    // Animates a turn right and returns the new JSON
    async turnRight() {
        await this._animateTurn("right");
        return this.data();
    }

    setDirection(direction) {
        this.direction = direction;
        switch (direction) {
            case "right":
                this.angle = 90;
                break;
            case "down":
                this.angle = 180;
                break;
            case "left":
                this.angle = 270;
                break;
            case "up":
                this.angle = 0;
                break;
        }

        return this.data();
    }

    draw() {
        var image = new Image();
        image.src = "img/roomba.svg"
        angleMode(DEGREES);
        let margin = 5;
        translate(margin + this.pixelX, margin + this.pixelY);
        rotate(this.angle);

        drawingContext.drawImage(image, - 20, - 20, 40, 40);
    }

    async _animateMove() {
        for (var i = 0; i < 50; i++) {

            switch (this.direction) {
                case "right":
                    this.pixelX += 1;
                    break;
                case "left":
                    this.pixelX -= 1;
                    break;
                case "down":
                    this.pixelY += 1;
                    break;
                case "up":
                    this.pixelY -= 1;
                    break;
            }

            await this._sleep((10 - speed) * 2);
        }


    }

    async _animateTurn(direction) {

        for (var i = 0; i < 90; i++) {

            switch (direction) {
                case "right":
                    this.angle += 1;
                    if (this.angle >= 360)
                        this.angle = 0;
                    break;
                case "left":
                    this.angle -= 1;
                    if (this.angle < 0)
                        this.angle = 359;
                    break;
            }

            await this._sleep((10 - speed) * 2);
        }

        if (this.direction === "left" && direction === "left")
            this.direction = "down";
        else if (this.direction === "left" && direction === "right")
            this.direction = "up";

        else if (this.direction === "right" && direction === "left")
            this.direction = "up";
        else if (this.direction === "right" && direction === "right")
            this.direction = "down";

        else if (this.direction === "up" && direction === "left")
            this.direction = "left";
        else if (this.direction === "up" && direction === "right")
            this.direction = "right";

        else if (this.direction === "down" && direction === "left")
            this.direction = "right";
        else if (this.direction === "down" && direction === "right")
            this.direction = "left";
    }

    _coordsToPixel() {
        return [25 + 50 * (this.fieldX - 1), 25 + 50 * (this.fieldY - 1)];
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}