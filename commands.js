async function moveForward() {
    // Check if move is possible
    if (frontIsClear()) {
        return level.roomba.moveForward();
    }
    else {
        let errorMessage = "Cannot move forward! Hitting an obstacle!";
        console.error(errorMessage);
        logConsole(errorMessage);
        return new Error(errorMessage);
    }

}

function frontIsClear() {
    return level.roomba.frontIsClear();
}

async function turnLeft() {
    return level.roomba.turnLeft();
}

async function turnRight() {
    return level.roomba.turnRight();
}