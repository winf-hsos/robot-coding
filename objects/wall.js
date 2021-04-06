class Wall {
    constructor(startX, endX, startY, endY) {

        // Always draw walls from left to right and from to down
        if (startX > endX) {
            console.warn("Not a valid wall. Draw from left to right or from top to bottom. Switching start and end.");

            let startXCopy = startX;
            startX = endX;
            endX = startXCopy;
        }

        if (startY > endY) {
            console.warn("Not a valid wall. Draw from left to right or from top to bottom. Switching start and end.");
            let startYCopy = startY;
            startY = endY;
            endY = startYCopy;
        }

        // Check if wall is valid and the direction
        if (!(startX === endX || startY === endY)) {
            console.error("Not a valid wall");
        }
        else {
            if (startX === endX) {
                this.position = "v"
            }
            else this.position = "h";
        }

        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

    }

    draw() {
        var coordsStart = coordsToPixel(this.startX, this.startY, -50);
        var coordsEnd = coordsToPixel(this.endX, this.endY, -50);

        stroke("#000000");
        strokeWeight(3);
        line(coordsStart[0], coordsStart[1], coordsEnd[0], coordsEnd[1]);
    }

    // Checks if this wall blocks a position on the field
    blocks(fieldX, fieldY, direction) {
        if (direction === "right") {
            // Must be a vertical wall
            // X coordinate must be equal to the field coordinate
            if (this.position === "v" && this.startX === fieldX) {
                // Y coordinate must enclose fieldY
                if (this.startY < fieldY && this.endY >= fieldY) {
                    return true;
                }
            }
        }

        if (direction === "left") {
            // Must be a vertical wall
            // X coordinate must be equal to the field coordinate minus one
            if (this.position === "v" && this.startX === fieldX - 1) {
                // Y coordinate must enclose fieldY
                if (this.startY < fieldY && this.endY >= fieldY) {
                    return true;
                }
            }
        }

        if (direction === "down") {
            // Must be a horizontal wall
            // Y coordinate must be equal to the field coordinate
            if (this.position === "h" && this.startY === fieldY) {
                // X coordinate must enclose fieldY
                if (this.startX < fieldX && this.endX >= fieldX) {
                    return true;
                }
            }
        }

        if (direction === "up") {
            // Must be a horizontal wall
            // Y coordinate must be equal to the field coordinate minus one
            if (this.position === "h" && this.startY === fieldY - 1) {
                // X coordinate must enclose fieldY
                if (this.startX < fieldX && this.endX >= fieldX) {
                    return true;
                }
            }
        }


        return false;
    }

    data() {
        let data = { startX: this.startX, endX: this.endX, startY: this.startY, endY: this.endY }
        return data;
    }


}