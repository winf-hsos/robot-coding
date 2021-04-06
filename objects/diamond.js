class Diamond {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        var image = new Image();
        image.src = "/img/diamond.svg"
        var size = 30;
        var coords = coordsToPixel(this.x, this.y, size);
        drawingContext.drawImage(image, coords[0], coords[1], size, size);
    }
}