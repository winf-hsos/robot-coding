async function moveForward() {
    commandInProgress = true;
    if (frontIsClear()) {
        // Animate move forward and get new level state
        postMessage({ command: "moveForward" });

        // Wait for the animation to complete
        await _waitForCommand();

    }
    else {
        // Run hitWall() function, if provided
        await warning("Hit a wall. Running event handler...");
        await onHitWall();
    }
}

async function turnLeft() {
    commandInProgress = true;
    postMessage({ command: "turnLeft" });
    await _waitForCommand();
}

async function turnRight() {
    commandInProgress = true;
    postMessage({ command: "turnRight" });
    await _waitForCommand();
}

async function exit() {
    // Send message to kill the worker
    // Wait not necessary
    postMessage({ command: "exit" });
}