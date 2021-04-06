var level;
let levelNo = "001";

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

editor.insert("moveForward();\n");
editor.insert("moveForward();\n");
editor.insert("turnLeft();\n");
editor.insert("moveForward()");
editor.resize();


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
