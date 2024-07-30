document.getElementById('convertButton').addEventListener('click', function() {
    const rubberDuckyScript = document.getElementById('rubberDuckyScript').value;
    const arduinoScript = convertToArduino(rubberDuckyScript);
    document.getElementById('arduinoScript').value = arduinoScript;
});

function convertToArduino(script) {
    if (!script.trim()) {
        return 'Error: No script provided';
    }

    const lines = script.split('\n');
    let arduinoScript = `/* Converted Arduino Nano Script */\n\n`;
    arduinoScript += `#include <Keyboard.h>\n\n`;
    arduinoScript += `void setup() {\n`;
    arduinoScript += `  // initialize the keyboard library:\n`;
    arduinoScript += `  Keyboard.begin();\n`;

    lines.forEach(line => {
        if (line.startsWith('DELAY')) {
            let delayTime = line.split(' ')[1];
            if (delayTime) {
                arduinoScript += `  delay(${delayTime});\n`;
            } else {
                arduinoScript += `  // Error: DELAY command missing time value\n`;
            }
        } else if (line.startsWith('STRING')) {
            let stringToType = line.substring(7).trim();
            if (stringToType) {
                for (let char of stringToType) {
                    arduinoScript += `  Keyboard.write('${char}');\n`;
                }
            } else {
                arduinoScript += `  // Error: STRING command missing text\n`;
            }
        } else if (line.startsWith('ENTER')) {
            arduinoScript += `  Keyboard.write(KEY_RETURN);\n`;
        } else if (line.startsWith('GUI')) {
            arduinoScript += `  Keyboard.press(KEY_LEFT_GUI);\n`;
            arduinoScript += `  delay(100);\n`;
            arduinoScript += `  Keyboard.release(KEY_LEFT_GUI);\n`;
        } else if (line.trim() === '') {
            // Skip empty lines
        } else {
            arduinoScript += `  // Error: Unknown command "${line}"\n`;
        }
    });

    arduinoScript += `  // end keyboard control\n`;
    arduinoScript += `  Keyboard.end();\n`;
    arduinoScript += `}\n\n`;

    arduinoScript += `void loop() {\n`;
    arduinoScript += `  // nothing to do here\n`;
    arduinoScript += `}\n`;

    arduinoScript += `\n/* End of Script */\n`;
    return arduinoScript;
}

