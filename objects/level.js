/* This class creates a level from a JSON object. It can draw the state of the level to the field
 * This class makes no changes to the underlying data itself.
*/

class Level {
    constructor(data) {

        this.dimensions = data.field.x;
        this.walls = [];
        this.stains = [];
        this.diamonds = [];

        // Add walls
        var walls = data.walls;
        for (var i = 0; i < walls.length; i++) {
            this.addWall(walls[i].startX, walls[i].endX, walls[i].startY, walls[i].endY);
        }

        // Draw diamonds
        var diamonds = data.diamonds;
        if (diamonds) {
            for (var i = 0; i < diamonds.length; i++) {
                this.addDiamond(diamonds[i].x, diamonds[i].y);
            }
        }

        // Draw stains
        var stains = data.stains;
        if (stains) {
            for (var i = 0; i < stains.length; i++) {
                this.addStain(stains[i].x, stains[i].y);
            }
        }

        let roomba = new Roomba(data.roomba.x, data.roomba.y, data.roomba.direction);
        this.addRoomba(roomba)


        this.margin = 5;
    }

    addRoomba(roomba) {
        this.roomba = roomba;
        roomba.field = this;
    }

    addWall(startX, startY, endX, endY) {
        let wall = new Wall(startX, startY, endX, endY);
        this.walls.push(wall);
    }

    addDiamond(x, y) {
        let diamond = new Diamond(x, y);
        this.diamonds.push(diamond);
    }

    addStain(x, y) {
        let stain = new Stain(x, y);
        this.stains.push(stain);
    }

    draw() {
        strokeWeight(1);
        stroke("#f0f0f0");
        let margin = this.margin;
        for (var x = 0; x <= 10; x++) {
            line(margin + x * 50, margin, margin + x * 50, height - margin);
            line(margin, margin + x * 50, width - margin, margin + x * 50);
        }

        // Draw walls
        for (var i = 0; i < this.walls.length; i++) {
            this.walls[i].draw();
        }

        // Draw stains
        for (var i = 0; i < this.stains.length; i++) {
            this.stains[i].draw();
        }

        // Draw diamonds
        for (var i = 0; i < this.diamonds.length; i++) {
            this.diamonds[i].draw();
        }

        if (this.roomba)
            this.roomba.draw();
    }

    // x and y are the field coordinates, direction is either up, down, left, right
    isBlockedByWall(fieldX, fieldY, direction) {
        for (let i = 0; i < this.walls.length; i++) {
            if (this.walls[i].blocks(fieldX, fieldY, direction))
                return true;
        }
        return false;
    }

    // Return this level's state as JSON
    data() {
        let data = {};

        data.field = { x: this.dimensions, y: this.dimensions };

        data.walls = [];
        for (let i = 0; i < this.walls.length; i++) {
            data.walls.push(this.walls[i].data());
        }

        data.roomba = this.roomba.data();
        return data;
    }
}