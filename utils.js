function coordsToPixel(fieldX, fieldY, size) {
    let margin = 5;
    return [margin + 25 + 50 * (fieldX - 1) - size / 2, margin + 25 + 50 * (fieldY - 1) - size / 2];
}

function logConsole(text, outputId = "consoleTextArea") {
    var output = document.querySelector("#" + outputId);

    if (text instanceof Object) {
        text = JSON.stringify(text, null, 2);
    }

    if (text !== "") {
        output.value += text + "\n";

        // Also print to developer console
        console.info(text);
    }
}

function clearLog(outputId = "consoleTextArea") {
    var output = document.querySelector("#" + outputId);
    output.value = "";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}