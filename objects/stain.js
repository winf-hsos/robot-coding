class Stain {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        var image = new Image();
        image.src = "/img/stain.svg"
        var size = 50;
        var coords = coordsToPixel(this.x, this.y, size);
        drawingContext.drawImage(image, coords[0], coords[1], size, size);
    }
}