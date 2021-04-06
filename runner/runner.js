importScripts('/objects/level.js', '/objects/roomba.js', '/objects/stain.js', '/objects/diamond.js', '/objects/wall.js', '/utils.js', 'https://unpkg.com/esprima@~4.0/dist/esprima.js');

var level;
var commandInProgress = false;
var codeAsFunction;

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

async function frontIsClear() {
    return await level.roomba.frontIsClear();
}

async function onHitWall() {
    await error("Cannot move forward! Hitting an obstacle!")
    exit();
}

function idle() {
    // This function must be overwritten by the player, otherwise program aborts on execution
}

function exit() {
    // Send message to kill the worker
    postMessage({ command: "exit" });
}

async function error(errorMessage) {
    postMessage({ command: "error", message: errorMessage });
}

async function warning(warningMessage) {
    commandInProgress = true;
    postMessage({ command: "warning", message: warningMessage });
    await _waitForCommand();
}

async function _waitForCommand() {
    while (commandInProgress === true) {
        await sleep(10);
    }
    return true;
}

async function _waitForever() {
    while (1 === 1) {
        await sleep(100);
    }
    return true;
}

onmessage = async function (e) {

    // Determine the type of message (code, continue)
    var messageType = e.data.type;

    if (messageType === "run") {
        run(e.data.level, e.data.code);
    }
    else if (messageType === "stateUpdate") {
        //console.log("Command finished");
        // Create a new level based on the new state
        level = new Level(e.data.level);
        commandInProgress = false;
    }

}

// Create the level and run the code step by step
async function run(levelJson, code) {

    level = new Level(levelJson);

    try {
        // Shim for allowing async function creation via new Function
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

        var geval = eval;
        geval(code);

        // Every program runs start() at the beginning
        codeAsFunction = new AsyncFunction("start();");

        // Run the start() function
        codeAsFunction().then(() => {
            console.log("Code completed!");
        }).catch(err => {
            postMessage({ command: "error", message: err.message })
        });

    } catch (ex) {
        console.log(ex)
        postMessage({ command: "error", message: ex.errorMessage })
    }
}

