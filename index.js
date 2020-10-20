
const compiler = require("vue-template-compiler")
const fs = require("fs");
const file = fs.readFileSync("./src/components/GameEnd.ts").toString();

const lines = file.split("\n");

let foundEnd = false;
let foundStart = false;
let templateString = "";
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("template: `")) {
        console.log("FOUND START");
        foundStart = true;
        templateString = lines[i];
    } else if (foundStart && foundEnd === false) {
        if (lines[i].trim().endsWith("`")) {
            foundEnd = true;
        }
        templateString += lines[i];
    }
}

templateString = templateString.trim();
templateString = templateString.substring("template: ".length);

const foo = eval(templateString);
const result = compiler.compile(foo);

fs.writeFileSync("./src/components/GameEnd.ts", file.replace("'{{REPLACER}}'", result.render));

