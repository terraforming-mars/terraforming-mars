
/**
 * Provide a mock vue so we can interact with
 * the components from node
 */
const fs = require('fs');
const beautify = require('js-beautify').js;
const compiler = require('vue-template-compiler');
const vue = require.resolve('vue');
const dialogPolyfill = require.resolve('dialog-polyfill');

global.window = {
  navigator: {
    userAgent: '',
  },
};
require.cache[dialogPolyfill] = {
  exports: {
    default: {},
  },
};
require.cache[vue] = {
  exports: {
    default: {
      component: function(arg1, arg2) {
        return arg2;
      },
    },
  },
};

checkComponent(
  'src/components/Award',
  require('./build/src/components/Award').Award,
  [],
);
checkComponent(
  'src/components/Board',
  require('./build/src/components/Board').Board,
  ['constants'],
);
checkComponent(
  'src/components/BoardSpace',
  require('./build/src/components/BoardSpace').BoardSpace,
  [],
);
checkComponent(
  'src/components/card/CardCost',
  require('./build/src/components/card/CardCost').CardCost,
  [],
);
checkComponent(
  'src/components/card/CardProductionBoxComponent',
  require('./build/src/components/card/CardProductionBoxComponent').CardProductionBoxComponent,
  [],
);
checkComponent(
  'src/components/CardsFilter',
  require('./build/src/components/CardsFilter').CardsFilter,
  ['selectedCardNames', 'foundCardNames', 'searchTerm'],
);
checkComponent(
  'src/components/ColoniesFilter',
  require('./build/src/components/ColoniesFilter').ColoniesFilter,
  ['allColonies', 'officialColonies', 'communityColonies', 'selectedColonies'],
);
checkComponent(
  'src/components/Colony',
  require('./build/src/components/Colony').Colony,
  ['PLUTO', 'GANYMEDE'],
);
checkComponent(
  'src/components/common/ConfirmDialog',
  require('./build/src/components/common/ConfirmDialog').ConfirmDialog,
  ['hide'],
);
checkComponent(
  'src/components/CorporationsFilter',
  require('./build/src/components/CorporationsFilter').CorporationsFilter,
  ['cardsByModuleMap', 'customCorporationsList', 'selectedCorporations', 'corpsByModule'],
);
checkComponent(
  'src/components/DebugUI',
  require('./build/src/components/DebugUI').DebugUI,
  ['filterText', 'filterDescription', 'sortById', 'base', 'corporateEra', 'prelude', 'venusNext', 'colonies', 'turmoil', 'community', 'ares', 'promo', 'moon'],
);
checkComponent(
  'src/components/GameHome',
  require('./build/src/components/GameHome').GameHome,
  [],
);
checkComponent(
  'src/components/GameEnd',
  require('./build/src/components/GameEnd').GameEnd,
  [],
);
checkComponent(
  'src/components/LoadGameForm',
  require('./build/src/components/LoadGameForm').LoadGameForm,
  ['gameId', 'rollbackCount'],
);
checkComponent(
  'src/components/LogPanel',
  require('./build/src/components/LogPanel').LogPanel,
  ['cards', 'messages'],
);
checkComponent(
  'src/components/Milestone',
  require('./build/src/components/Milestone').Milestone,
  [],
);
checkComponent(
  'src/components/moon/MoonBoard',
  require('./build/src/components/moon/MoonBoard').MoonBoard,
  [],
);
checkComponent(
  'src/components/moon/MoonSpace',
  require('./build/src/components/moon/MoonSpace').MoonSpace,
  [],
);
checkComponent(
  'src/components/OtherPlayer',
  require('./build/src/components/OtherPlayer').OtherPlayer,
  [],
);
checkComponent(
  'src/components/PlayerHome',
  require('./build/src/components/PlayerHome').PlayerHome,
  [],
);
checkComponent(
  'src/components/overview/PlayerInfo',
  require('./build/src/components/overview/PlayerInfo').PlayerInfo,
  [],
);
checkComponent(
  'src/components/overview/PlayerResource',
  require('./build/src/components/overview/PlayerResource').PlayerResource,
  [],
);
checkComponent(
  'src/components/overview/PlayerResources',
  require('./build/src/components/overview/PlayerResources').PlayerResources,
  ['resources'],
);
checkComponent(
  'src/components/overview/PlayersOverview',
  require('./build/src/components/overview/PlayersOverview').PlayersOverview,
  [],
);
checkComponent(
  'src/components/overview/PlayerStatus',
  require('./build/src/components/overview/PlayerStatus').PlayerStatus,
  [],
);
checkComponent(
  'src/components/overview/PlayerTags',
  require('./build/src/components/overview/PlayerTags').PlayerTags,
  [],
);
checkComponent(
  'src/components/overview/PlayerTimer',
  require('./build/src/components/overview/PlayerTimer').PlayerTimer,
  ['timerText'],
);
checkComponent(
  'src/components/Preferences',
  require('./build/src/components/Preferences').Preferences,
  [
    'ui', 'hide_corporation', 'hide_hand', 'hide_cards', 'hide_awards_and_milestones', 'hide_tag_overview',
    'hide_turnorder', 'hide_corporation_names', , 'hide_top_bar', 'small_cards', 'remove_background', 'magnify_cards',
    'magnify_card_descriptions', 'show_alerts', 'hide_ma_scores', 'hide_non_blue_cards', 'hide_log',
    'lang', 'langs', 'enable_sounds', 'smooth_scrolling', 'hide_tile_confirmation', 'show_card_number', 'show_discount_on_cards',
    'learner_mode',
  ],
);
checkComponent(
  'src/components/SelectAmount',
  require('./build/src/components/SelectAmount').SelectAmount,
  ['amount'],
);
checkComponent(
  'src/components/SelectCard',
  require('./build/src/components/SelectCard').SelectCard,
  ['cards', 'warning'],
);
checkComponent(
  'src/components/SelectColony',
  require('./build/src/components/SelectColony').SelectColony,
  ['selectedColony'],
);
checkComponent(
  'src/components/SelectHowToPay',
  require('./build/src/components/SelectHowToPay').SelectHowToPay,
  ['cost', 'heat', 'megaCredits', 'steel', 'titanium', 'microbes', 'floaters', 'warning'],
);
checkComponent(
  'src/components/SelectHowToPayForProjectCard',
  require('./build/src/components/SelectHowToPayForProjectCard').SelectHowToPayForProjectCard,
  ['cardName', 'card', 'cards', 'cost', 'tags', 'heat', 'megaCredits', 'steel', 'titanium', 'microbes', 'floaters', 'warning'],
);
checkComponent(
  'src/components/SelectInitialCards',
  require('./build/src/components/SelectInitialCards').SelectInitialCards,
  ['selectedCorporation'],
);
checkComponent(
  'src/components/SelectOption',
  require('./build/src/components/SelectOption').SelectOption,
  [],
);
checkComponent(
  'src/components/SelectPartyPlayer',
  require('./build/src/components/SelectPartyPlayer').SelectPartyPlayer,
  ['selectedPlayer'],
);
checkComponent(
  'src/components/SelectPlayer',
  require('./build/src/components/SelectPlayer').SelectPlayer,
  ['selectedPlayer'],
);
checkComponent(
  'src/components/SelectPlayerRow',
  require('./build/src/components/SelectPlayerRow').SelectPlayerRow,
  [],
);
checkComponent(
  'src/components/SelectProductionToLose',
  require('./build/src/components/SelectProductionToLose').SelectProductionToLose,
  ['megacredits', 'steel', 'titanium', 'plants', 'energy', 'heat', 'warning'],
);
checkComponent(
  'src/components/ShiftAresGlobalParameters',
  require('./build/src/components/ShiftAresGlobalParameters').ShiftAresGlobalParameters,
  ['hazardData', 'lowOceanDelta', 'highOceanDelta', 'temperatureDelta', 'oxygenDelta', 'ADJUSTMENT_RANGE'],
);
checkComponent(
  'src/components/SortableCards',
  require('./build/src/components/SortableCards').SortableCards,
  [],
);
checkComponent(
  'src/components/StackedCards',
  require('./build/src/components/StackedCards').StackedCards,
  [],
);
checkComponent(
  'src/components/StartScreen',
  require('./build/src/components/StartScreen').StartScreen,
  [],
);
checkComponent(
  'src/components/Tag',
  require('./build/src/components/Tag').Tag,
  [],
);
checkComponent(
  'src/components/TagCount',
  require('./build/src/components/TagCount').TagCount,
  [],
);
checkComponent(
  'src/components/TopBar',
  require('./build/src/components/TopBar').TopBar,
  ['componentKey'],
);
checkComponent(
  'src/components/Turmoil',
  require('./build/src/components/Turmoil').Turmoil,
  [],
);
checkComponent(
  'src/components/help/Help',
  require('./build/src/components/help/Help').Help,
  [],
);
checkComponent(
  'src/components/help/HelpIconology',
  require('./build/src/components/help/HelpIconology').HelpIconology,
  [],
);
checkComponent(
  'src/components/help/HelpPhases',
  require('./build/src/components/help/HelpPhases').HelpPhases,
  [],
);
checkComponent(
  'src/components/help/HelpStandardProjects',
  require('./build/src/components/help/HelpStandardProjects').HelpStandardProjects,
  [],
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

  let result = compiler.compile(template, {
    warn: true,
  });

  if (result.errors.length > 0) {
    console.error(result.errors); // needed for debugging
    throw new Error(`errors found while parsing template for ${name}`, result.errors);
  }

  if (result.tips.length > 0) {
    console.log(result.tips); // needed for debugging
    throw new Error(`tips found while parsing template for ${name}`, result.tips);
  }

  result = result.render;

  // provide type information for $event argument
  result = result.replace(/function\(\$event\)/g, 'function($event: VueDomEvent)');

  // strip 'with' lacking typescript support
  result = result.substring('with(this){'.length);
  result = result.substring(0, result.length - 1);

  // make easier to read and debug
  result = beautify(result);

  // append scope since we stripped 'with'
  let scope = '';
  dataProperties.forEach(function(dataProperty) {
    scope += `let ${dataProperty} = this.${dataProperty};\n`;
  });

  propertyNames.forEach(function(propertyName) {
    scope += `const ${propertyName} = this.${propertyName};\n`;
  });
  methodNames.forEach(function(methodName) {
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
  const lines = file.split('\n');
  let i = 0;
  // insert line to run through tsc with compiled template
  for (; i < lines.length; i++) {
    if (lines[i].trim() === 'methods: {') {
      lines.splice(i + 1, 0, `checker: function() { ${result} },`);
      break;
    }
  }

  if (i === lines.length) {
    throw new Error(`must provide line with 'methods: {' for inserting checker for ${name}`);
  }

  // append types for minified functions
  lines.unshift('declare const _c: any;');
  lines.unshift('declare function _e(): void;');

  // seems to be indexOf
  lines.unshift('declare function _i<T>(arg1: Array<T>, arg2: T): number;');
  lines.unshift('declare const _m: any;');
  lines.unshift('declare function _n(arg: string): number;');
  lines.unshift('declare function _q<T>(arg1: T, arg2: T): string;');
  lines.unshift('declare function _s(arg: number | string | undefined): string;');
  lines.unshift('declare function _t(arg: string): unknown;');
  lines.unshift('declare function _v(arg: string): unknown;');
  lines.unshift('interface VueDomEventTarget { checked: boolean, composing: boolean, value: string };');
  lines.unshift('interface VueDomEvent { preventDefault: () => void; target: VueDomEventTarget; };');
  lines.unshift('declare function $forceUpdate(): void');
  lines.unshift('declare function $set(arg1: any, key: string, value: string): void;');
  // seems to be array looper iterating function needs to pass along type information
  lines.unshift('declare function _l(arg1: number, arg2: (item2: number, idx: number) => any): any;');
  lines.unshift('declare function _l<T>(arg1: {[x: string]: T}, args: (item2: T, idx: number) => any): any;');
  lines.unshift('declare function _l<T>(arg1: Array<T>, arg2: (item2: T, idx: number) => any): any;');
  file = lines.join('\n');

  fs.writeFileSync(`./build/${name}Vue.ts`, file);
  console.log(`generated Vue typed template file for ${name}`);
}

