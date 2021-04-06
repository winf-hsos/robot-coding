var runner;

var paused = false;
var running = false;

// 1 = slow, 10 = super fast
var speed = 1;
var waitBetweenSteps = 250;
var animationTime = 10;

function setupRunner() {
    runner = new Worker('runner/runner.js');
    runner.onmessage = receiveCommand;
}

async function receiveCommand(e) {
    var command = e.data.command;

    //console.log(`Received command >${command}<`);
    let sleepTime = 200;

    switch (command) {
        case "moveForward":
            await level.roomba.moveForward();
            break;
        case "turnLeft":
            await level.roomba.turnLeft();
            break;
        case "turnRight":
            await level.roomba.turnRight();
            break;
        case "error":
            await logConsole(e.data.message)
            exit();
            break;
        case "warning":
            await logConsole(e.data.message);
            sleepTime = 0;
            break;
        case "exit":
            exit();
            break;
    }

    let newLevelState = level.data();

    await sleep(sleepTime);

    // Paused?
    while (paused === true) {
        await sleep(100);
    }

    let message = { type: "stateUpdate", level: newLevelState }
    //console.log(`Finished with command ${command}`);
    runner.postMessage(message);
}

function exit() {
    logConsole("Program finished.");
    runner.terminate();
}

async function run() {
    paused = false;
    setupRunner();

    let asyncCode = makeCommandsAsync(editor.getValue());

    let message = { type: "run", code: asyncCode, level: level.data() }
    runner.postMessage(message);

    running = true;
    document.getElementById("runBtn").setAttribute("disabled", "");
    document.getElementById("togglePauseBtn").removeAttribute("disabled");

    logConsole("Starting program.");
}


function togglePause() {
    paused = !paused;

    if (paused === true) {
        document.getElementById("togglePauseBtn").textContent = "Resume"
    }
    else {
        document.getElementById("togglePauseBtn").textContent = "Pause"
    }
}

async function reset() {
    runner.terminate();
    clearLog();
    level = await loadLevel(levelNo);
    document.getElementById("runBtn").removeAttribute("disabled");
}

function keyPressed() {
    //console.log(keyCode);
    switch (keyCode) {
        case 39:
            level.roomba.setDirection("right");
            level.roomba.moveForward()
            break;
        case 37:
            level.roomba.setDirection("left");
            level.roomba.moveForward()
            break;
        case 38:
            level.roomba.setDirection("up");
            level.roomba.moveForward()
            break;
        case 40:
            level.roomba.setDirection("down");
            level.roomba.moveForward()
            break;
    }
}

var awaitCalls = [];
var asyncFunctionDeclarations = [];
function makeCommandsAsync(code) {
    //let asyncCode = "async function start() {\n";
    let asyncCode = code;
    //asyncCode += "\n}";

    asyncFunctionDeclarations = [];
    let parsed = esprima.parse(asyncCode, { range: true, loc: true }, checkNode);

    // First, replace all function declarations with "async" version
    asyncFunctionDeclarations.sort((a, b) => { return b.end - a.end }).forEach(n => {
        asyncCode = asyncCode.slice(0, n.start) + "async " + asyncCode.slice(n.start);
    });

    console.dir(asyncCode);

    // Parse again
    awaitCalls = [];
    parsed = esprima.parse(asyncCode, { range: true, loc: true }, checkNode);

    // Replace all calls with the "await" version
    awaitCalls.sort((a, b) => { return b.end - a.end }).forEach(n => {
        asyncCode = asyncCode.slice(0, n.start) + "await " + asyncCode.slice(n.start);
    });

    console.dir(asyncCode);

    return asyncCode;
}


function checkNode(node, meta) {

    if (node.type === "CallExpression") {
        //console.dir(node.callee.name);
        if (typeof node.callee.name !== "undefined") {
            awaitCalls.push({
                start: meta.start.offset,
                end: meta.end.offset
            });
        }
    }
    else if (node.type === "FunctionDeclaration") {
        if (node.async === false) {
            console.dir(node);
            asyncFunctionDeclarations.push({
                start: meta.start.offset,
                end: meta.end.offset
            });
        }
    }
}