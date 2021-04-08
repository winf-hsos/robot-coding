var level;
let levelNo = "001";
let speed = document.getElementById("speedRange").value;

var editor = ace.edit("editor");

//editor.setTheme("ace/theme/twilight");
editor.setTheme("ace/theme/textmate");
editor.session.setMode("ace/mode/javascript");
editor.setOption("highlightActiveLine", true);
editor.setOption("enableBasicAutocompletion", true);
editor.setOption("enableLiveAutocompletion", true);

editor.setOptions({
    fontSize: "16pt"
});


let initialCode = "function start() {\n\t while(frontIsClear()) {\n       moveForward();\n }\n turnLeft();\n start();\n}"
editor.insert(initialCode);
/*
editor.insert("function start() {\n\t")
editor.insert("moveForward();\n")
editor.insert("}")
*/
editor.resize();

var Range = ace.require('ace/range').Range;
//editor.session.addMarker(new Range(2, 1, 2, 14), "myMarker", "text");
//editor.session.addMarker(new Range(pos.startLine, pos.startCol, pos.endLine, pos.endCol), "myMarker", "text", true);


async function setup() {

    // Mit der Funktion createCanvas können wir eine neue Zeichenfläche erstellen
    var canvas = createCanvas(510, 510);

    // Wir wollen die Zeichenfläche an eine bestimmte Stelle im HTML-Baum platzieren
    canvas.parent('canvas');
    background("#ffffff");
    level = await loadLevel(levelNo);
}


async function loadLevel(levelNo) {
    return fetch(`levels/level_${levelNo}.json`)
        .then(response => response.json())
        .then(async data => {

            let loadedLevel = new Level(data);
            logConsole(`Finished loading level ${levelNo}`);
            return loadedLevel;

        });
}


function speedChanged() {
    speed = document.getElementById("speedRange").value;
}