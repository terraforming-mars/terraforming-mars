
/**
 * Provide a mock vue so we can interact with
 * the components from node
 */
const fs = require("fs");
const compiler = require("vue-template-compiler")
const vue = require.resolve("vue");
global.window = {
    navigator: {
        userAgent: ""
    }
};
require.cache[vue] = {
    exports: {
        default: {
            component: function (arg1, arg2) {
                return arg2;
            }
        }
    }
};

checkComponent(
    "src/components/Award",
    require("./dist/src/components/Award").Award
);
checkComponent(
    "src/components/GameEnd",
    require("./dist/src/components/GameEnd").GameEnd
);
checkComponent(
    "src/components/Milestone",
    require("./dist/src/components/Milestone").Milestone
);
checkComponent(
    "src/components/OtherPlayer",
    require("./dist/src/components/OtherPlayer").OtherPlayer
);
checkComponent(
    "src/components/SelectOption",
    require("./dist/src/components/SelectOption").SelectOption
);
checkComponent(
    "src/components/Tag",
    require("./dist/src/components/Tag").Tag
);
checkComponent(
    "src/components/TagCount",
    require("./dist/src/components/TagCount").TagCount
);

function checkComponent(name, component) {

    const methodNames = Object.keys(component.methods);

    if (methodNames.length === 0) {
        throw new Error(`must provide methods for component ${name}`);
    }

    if (Array.isArray(component.props)) {
        throw new Error(`props must define types for component ${name}`);
    }

    const propertyNames = Object.keys(component.props);
    const template = component.template;

    if (component.template === undefined) {
        throw new Error(`no template for component ${name}`);
    }

    let result = compiler.compile(template);

    if (result.errors.length > 0) {
        throw new Error(`errors found while parsing template for ${name}`, result.errors);
    }

    if (result.tips.length > 0) {
        throw new Error(`tips found while parsing template for ${name}`, result.tips);
    }

    result = result.render;

    // provide type information for $event argument
    result = result.replace(/function\(\$event\)/g, "function($event: Event)");

    // strip 'with' lacking typescript support
    result = result.substring("with(this){".length);
    result = result.substring(0, result.length - 1);

    // append scope since we stripped 'with'
    let scope = "";
    propertyNames.forEach(function (propertyName) {
        scope += `const ${propertyName} = this.${propertyName};\n`;
    });
    methodNames.forEach(function (methodName) {
        scope += `const ${methodName} = this.${methodName};\n`;
    });

    // add mix-ins
    if (Array.isArray(component.mixins)) {
        for (const mixin of component.mixins) {
            const methods = Object.keys(mixin.methods);
            for (const method of methods) {
                scope += `const ${method} = ${mixin.name}.methods.${method};\n`;
            }
        }
    }

    result = scope + result;

    let file = fs.readFileSync(`${name}.ts`).toString();
    const lines = file.split("\n");
    let i = 0;
    // insert line to run through tsc with compiled template
    for (; i < lines.length; i++) {
        if (lines[i].trim() === "methods: {") {
            lines.splice(i + 1, 0, `checker: function () { ${result} },`);
            break;
        }
    }

    if (i === lines.length) {
        throw new Error(`must provide line with 'methods: {' for inserting checker for ${name}`);
    }

    // append types for minified functions
    lines.unshift("declare const _c: any;");
    lines.unshift("declare const _e: any;");
    lines.unshift("declare const _m: any;");
    lines.unshift("declare const _s: any;");
    lines.unshift("declare const _v: any;");
    // iterating function needs to pass along type information
    lines.unshift("declare function _l<T>(arg1: Array<T>, arg2: (item2: T) => any): any;");
    file = lines.join("\n");

    fs.writeFileSync(`./dist/${name}Vue.ts`, file);
    console.log(`generated Vue typed template file for ${name}`);
}

