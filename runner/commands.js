async function moveForward(pos) {
    commandInProgress = true;
    if (await frontIsClear() === true) {
        // Animate move forward and get new level state
        postMessage({ command: "moveForward", position: pos });

        // Wait for the animation to complete
        await _waitForCommand();

    }
    else {
        // Run hitWall() function, if provided
        await warning("Hit a wall. Running event handler...");
        await onHitWall();
    }
}

async function turnLeft(pos) {
    commandInProgress = true;
    postMessage({ command: "turnLeft", position: pos });
    await _waitForCommand();
}

async function turnRight(pos) {
    commandInProgress = true;
    postMessage({ command: "turnRight", position: pos });
    await _waitForCommand();
}

async function exit() {
    // Send message to kill the worker
    // Wait not necessary
    postMessage({ command: "exit" });
}