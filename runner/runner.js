importScripts('/objects/level.js', '/objects/roomba.js', '/objects/stain.js', '/objects/diamond.js', '/objects/wall.js',
    '/utils.js', 'commands.js', 'eventhandler.js', 'conditions.js', 'https://unpkg.com/esprima@~4.0/dist/esprima.js');

var level;
var commandInProgress = false;
var codeAsFunction;

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

onmessage = async function (e) {

    // Determine the type of message (code, continue)
    var messageType = e.data.type;

    if (messageType === "run") {
        run(e.data.level, e.data.code);
    }
    else if (messageType === "stateUpdate") {
        // Create a new level based on the new state
        level = new Level(e.data.level);
        // End the previous command
        commandInProgress = false;
    }
}

// Central wrapper function to execute built-in commands
async function runCommand(command, location) {
    switch (command) {
        case 'moveForward':
            moveForward();
            break;
        case 'turnLeft':
            turnLeft();
            break;
        case 'turnRight':
            turnRight();
            break;
        default:
            break;
    }
}

// Create the level and run the code step by step
async function run(levelJson, code) {

    level = new Level(levelJson);

    try {
        // Create an async function prototype
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

        // Evaulate the code to create user defined functions and variables
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

