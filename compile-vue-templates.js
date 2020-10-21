
const templates = [{
    file: "./src/components/GameEnd",
    scope: [
        "getEndGamePlayerColorClass",
        "getSortedPlayers",
        "isSoloGame",
        "player",
    ]
}];

const compiler = require("vue-template-compiler")
const fs = require("fs");


let file = fs.readFileSync("./src/components/GameEnd.ts").toString();

const lines = file.split("\n");

let foundEnd = false;
let foundStart = false;
let methodStart = false;
let methodEnd = false;
let templateString = "";
const methods = [
    "player",
    "getEndGamePlayerColorClass",
    "getSortedPlayers",
    "isSoloGame"
];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("methods:")) {
        lines.splice(i + 1, 0, "templateCheck: function () { {{REPLACER}} },");
    }
    if (lines[i].trim().startsWith("template: `")) {
        foundStart = true;
        templateString = lines[i];
    } else if (foundStart && foundEnd === false) {
        if (lines[i].trim().endsWith("`")) {
            foundEnd = true;
        }
        templateString += lines[i];
    }
}
lines.unshift("declare const _c: any;");
lines.unshift("declare const _e: any;");
lines.unshift("declare const _m: any;");
lines.unshift("declare const _s: any;");
lines.unshift("declare const _v: any;");
lines.unshift("declare function _l<T>(arg1: Array<T>, arg2: (item2: T) => any): any;");

file = lines.join("\n");

templateString = templateString.trim();
templateString = templateString.substring("template: ".length);

const foo = eval(templateString);
let result = compiler.compile(foo).render;
result = result.substring("with(this){".length);
result = result.substring(0, result.length - 1);

const header = `/**
 * GENERATED FILE FOR TYPE CHECKING VUE TEMPLATES
 * DO NOT EDIT. CREATED BY compile-vue-templates
 */
`;

let start = "";
methods.forEach((method) => {
    start += "const " + method + " = this." + method + ";"
});

result = start + result;

fs.writeFileSync("./src/components/GameEndVue.ts", header + file.replace("{{REPLACER}}", result));

