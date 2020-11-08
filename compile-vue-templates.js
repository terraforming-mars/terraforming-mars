
/**
 * Provide a mock vue so we can interact with
 * the components from node
 */
const fs = require("fs");
const beautify = require("js-beautify").js;
const compiler = require("vue-template-compiler");
const vue = require.resolve("vue");
const dialogPolyfill = require.resolve("dialog-polyfill");

global.window = {
    navigator: {
        userAgent: ""
    }
};
require.cache[dialogPolyfill] = {
    exports: {
        default: {}
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
    require("./dist/src/components/Award").Award,
    []
);
checkComponent(
    "src/components/Board",
    require("./dist/src/components/Board").Board,
    ["constants"]
);
checkComponent(
    "src/components/BoardSpace",
    require("./dist/src/components/BoardSpace").BoardSpace,
    []
);
checkComponent(
    "src/components/CardsFilter",
    require("./dist/src/components/CardsFilter").CardsFilter,
    ["selectedCardNames", "foundCardNames", "searchTerm"]
);
checkComponent(
    "src/components/ColoniesFilter",
    require("./dist/src/components/ColoniesFilter").ColoniesFilter,
    ["allColonies", "officialColonies", "communityColonies", "selectedColonies"]
);
checkComponent(
    "src/components/Colony",
    require("./dist/src/components/Colony").Colony,
    ["PLUTO", "GANYMEDE"]
);
checkComponent(
    "src/components/CorporationsFilter",
    require("./dist/src/components/CorporationsFilter").CorporationsFilter,
    ["cardsByModuleMap", "customCorporationsList", "selectedCorporations", "corpsByModule"]
);
checkComponent(
    "src/components/DebugUI",
    require("./dist/src/components/DebugUI").DebugUI,
    ["filterText"]
);
checkComponent(
    "src/components/GameHome",
    require("./dist/src/components/GameHome").GameHome,
    []
);
checkComponent(
    "src/components/GameEnd",
    require("./dist/src/components/GameEnd").GameEnd,
    []
);
checkComponent(
    "src/components/LoadGameForm",
    require("./dist/src/components/LoadGameForm").LoadGameForm,
    ["gameId"]
);
checkComponent(
    "src/components/LogPanel",
    require("./dist/src/components/LogPanel").LogPanel,
    ["cards", "messages"]
);
checkComponent(
    "src/components/Milestone",
    require("./dist/src/components/Milestone").Milestone,
    []
);
checkComponent(
    "src/components/OtherPlayer",
    require("./dist/src/components/OtherPlayer").OtherPlayer,
    []
);
checkComponent(
    "src/components/PlayerHome",
    require("./dist/src/components/PlayerHome").PlayerHome,
    []
);
checkComponent(
    "src/components/Preferences",
    require("./dist/src/components/Preferences").Preferences,
    [
        "ui", "hide_corporation", "hide_hand", "hide_cards", "hide_awards_and_milestones", "hide_tag_overview",
        "hide_turnorder", "hide_corporation_names", "small_cards", "remove_background", "magnify_cards",
        "magnify_card_descriptions", "show_alerts", "hide_ma_scores", "hide_non_blue_cards", "hide_log",
        "lang", "langs", "enable_sounds"
    ]
);
checkComponent(
    "src/components/SelectAmount",
    require("./dist/src/components/SelectAmount").SelectAmount,
    ["amount"]
);
checkComponent(
    "src/components/SelectCard",
    require("./dist/src/components/SelectCard").SelectCard,
    ["cards"]
);
checkComponent(
    "src/components/SelectColony",
    require("./dist/src/components/SelectColony").SelectColony,
    ["selectedColony"]
);
checkComponent(
    "src/components/SelectHowToPay",
    require("./dist/src/components/SelectHowToPay").SelectHowToPay,
    ["cost", "heat", "megaCredits", "steel", "titanium", "microbes", "floaters", "warning"]
);
checkComponent(
    "src/components/SelectHowToPayForCard",
    require("./dist/src/components/SelectHowToPayForCard").SelectHowToPayForCard,
    ["card", "cost", "heat", "megaCredits", "steel", "titanium", "microbes", "floaters", "warning"]
);
checkComponent(
    "src/components/SelectOption",
    require("./dist/src/components/SelectOption").SelectOption,
    []
);
checkComponent(
    "src/components/SelectPartyPlayer",
    require("./dist/src/components/SelectPartyPlayer").SelectPartyPlayer,
    ["selectedPlayer"]
);
checkComponent(
    "src/components/SelectPlayer",
    require("./dist/src/components/SelectPlayer").SelectPlayer,
    ["selectedPlayer"]
);
checkComponent(
    "src/components/SelectPlayerRow",
    require("./dist/src/components/SelectPlayerRow").SelectPlayerRow,
    []
);
checkComponent(
    "src/components/SelectProductionToLose",
    require("./dist/src/components/SelectProductionToLose").SelectProductionToLose,
    ["megacredits", "steel", "titanium", "plants", "energy", "heat", "warning"]
);
checkComponent(
    "src/components/ShiftAresGlobalParameters",
    require("./dist/src/components/ShiftAresGlobalParameters").ShiftAresGlobalParameters,
    ["hazardData", "lowOceanDelta", "highOceanDelta", "temperatureDelta", "oxygenDelta", "ADJUSTMENT_RANGE"]
);
checkComponent(
    "src/components/StackedCards",
    require("./dist/src/components/StackedCards").StackedCards,
    []
);
checkComponent(
    "src/components/StartScreen",
    require("./dist/src/components/StartScreen").StartScreen,
    []
);
checkComponent(
    "src/components/Tag",
    require("./dist/src/components/Tag").Tag,
    []
);
checkComponent(
    "src/components/TagCount",
    require("./dist/src/components/TagCount").TagCount,
    []
);
checkComponent(
    "src/components/Turmoil",
    require("./dist/src/components/Turmoil").Turmoil,
    []
);
checkComponent(
    "src/components/overview/PlayerInfo",
    require("./dist/src/components/overview/PlayerInfo").PlayerInfo,
    []
);
checkComponent(
    "src/components/overview/PlayerResource",
    require("./dist/src/components/overview/PlayerResource").PlayerResource,
    []
);
checkComponent(
    "src/components/overview/PlayerResources",
    require("./dist/src/components/overview/PlayerResources").PlayerResources,
    ["resources"]
);
checkComponent(
    "src/components/overview/PlayersOverview",
    require("./dist/src/components/overview/PlayersOverview").PlayersOverview,
    []
);
checkComponent(
    "src/components/overview/PlayerStatus",
    require("./dist/src/components/overview/PlayerStatus").PlayerStatus,
    []
);
checkComponent(
    "src/components/overview/PlayerTags",
    require("./dist/src/components/overview/PlayerTags").PlayerTags,
    []
);

function checkComponent(name, component, dataProperties) {

    const methodNames = component.methods === undefined ? [] : Object.keys(component.methods);

    if (Array.isArray(component.props)) {
        throw new Error(`props must define types for component ${name}`);
    }

    const propertyNames = component.props === undefined ? [] : Object.keys(component.props);
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
    result = result.replace(/function\(\$event\)/g, "function($event: VueDomEvent)");

    // strip 'with' lacking typescript support
    result = result.substring("with(this){".length);
    result = result.substring(0, result.length - 1);

    // make easier to read and debug
    result = beautify(result);

    if (result.indexOf("this") !== -1) {
        throw new Error(`don't use this inside template string for ${name}`);
    }

    // append scope since we stripped 'with'
    let scope = "";
    dataProperties.forEach(function (dataProperty) {
        scope += `let ${dataProperty} = this.${dataProperty};\n`;
    });

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
    lines.unshift("declare function _e(): void;");

    // seems to be indexOf
    lines.unshift("declare function _i<T>(arg1: Array<T>, arg2: T): number;");
    lines.unshift("declare const _m: any;");
    lines.unshift("declare function _n(arg: string): number;");
    lines.unshift("declare function _q<T>(arg1: T, arg2: T): string;");
    lines.unshift("declare function _s(arg: number | string | undefined): string;");
    lines.unshift("declare function _t(arg: string): unknown;");
    lines.unshift("declare function _v(arg: string): unknown;");
    lines.unshift("interface VueDomEventTarget { checked: boolean, composing: boolean, value: string };");
    lines.unshift("interface VueDomEvent { preventDefault: () => void; target: VueDomEventTarget; };");
    lines.unshift("declare function $forceUpdate(): void");
    lines.unshift("declare function $set(arg1: any, key: string, value: string): void;");
    // seems to be array looper iterating function needs to pass along type information
    lines.unshift("declare function _l(arg1: number, arg2: (item2: number, idx: number) => any): any;");
    lines.unshift("declare function _l<T>(arg1: Array<T>, arg2: (item2: T, idx: number) => any): any;");
    file = lines.join("\n");

    fs.writeFileSync(`./dist/${name}Vue.ts`, file);
    console.log(`generated Vue typed template file for ${name}`);
}

