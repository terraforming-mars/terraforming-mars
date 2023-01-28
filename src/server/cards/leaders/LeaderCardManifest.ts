import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';

// import {Apollo} from './Apollo';
// import {Asimov} from './Asimov';
import {Bjorn} from './Bjorn';
// import {Caesar} from './Caesar';
import {Clarke} from './Clarke';
// import {Duncan} from './Duncan';
import {Ender} from './Ender';
// import {Faraday} from './Faraday';
import {Floyd} from './Floyd';
// import {Gaia} from './Gaia';
// import {Gordon} from './Gordon';
// import {Greta} from './Greta';
import {HAL9000} from './HAL9000';
// import {Huan} from './Huan';
// import {Ingrid} from './Ingrid';
// import {Jansson} from './Jansson';
import {Karen} from './Karen';
// import {Lowell} from './Lowell';
// import {Maria} from './Maria';
import {Naomi} from './Naomi';
// import {Neil} from './Neil';
// import {Oscar} from './Oscar';
// import {Petra} from './Petra';
// import {Quill} from './Quill';
// import {Rogers} from './Rogers';
// import {Ryu} from './Ryu';
// import {Stefan} from './Stefan';
// import {Sweeney} from './Sweeney';
// import {Tate} from './Tate';
import {Ulrich} from './Ulrich';
// import {VanAllen} from './VanAllen';
// import {Will} from './Will';
// import {Xavier} from './Xavier';
// import {Yvonne} from './Yvonne';
// import {Zan} from './Zan';


export const LEADER_CARD_MANIFEST = new ModuleManifest({
  module: 'leader',
  leaderCards: {
    // [CardName.APOLLO]: {Factory: Apollo, compatibility: 'moon'},
    // [CardName.ASIMOV]: {Factory: Asimov},
    [CardName.BJORN]: {Factory: Bjorn},
    // [CardName.CAESAR]: {Factory: Caesar, compatibility: 'ares'},
    [CardName.CLARKE]: {Factory: Clarke},
    // [CardName.DUNCAN]: {Factory: Duncan},
    [CardName.ENDER]: {Factory: Ender},
    // [CardName.FARADAY]: {Factory: Faraday},
    [CardName.FLOYD]: {Factory: Floyd},
    // [CardName.GAIA]: {Factory: Gaia, compatibility: 'ares'},
    // [CardName.GORDON]: {Factory: Gordon},
    // [CardName.GRETA]: {Factory: Greta},
    [CardName.HAL9000]: {Factory: HAL9000},
    // [CardName.HUAN]: {Factory: Huan, compatibility: 'colonies'},
    // [CardName.INGRID]: {Factory: Ingrid},
    // [CardName.JANSSON]: {Factory: Jansson},
    [CardName.KAREN]: {Factory: Karen, compatibility: 'prelude'},
    // [CardName.LOWELL]: {Factory: Lowell, compatibility: 'prelude'},
    // [CardName.MARIA]: {Factory: Maria, compatibility: 'colonies'},
    [CardName.NAOMI]: {Factory: Naomi, compatibility: 'colonies'},
    // [CardName.NEIL]: {Factory: Neil, compatibility: 'moon'},
    // [CardName.OSCAR]: {Factory: Oscar, compatibility: 'turmoil'},
    // [CardName.PETRA]: {Factory: Petra, compatibility: 'turmoil'},
    // [CardName.QUILL]: {Factory: Quill, compatibility: 'venus'},
    // [CardName.ROGERS]: {Factory: Rogers, compatibility: 'venus'},
    // [CardName.RYU]: {Factory: Ryu},
    // [CardName.STEFAN]: {Factory: Stefan},
    // [CardName.SWEENEY]: {Factory: Sweeney},
    // [CardName.TATE]: {Factory: Tate},
    [CardName.ULRICH]: {Factory: Ulrich},
    // [CardName.VANALLEN]: {Factory: VanAllen},
    // [CardName.WILL]: {Factory: Will, compatibility: 'venus'},
    // [CardName.XAVIER]: {Factory: Xavier, compatibility: 'prelude'},
    // [CardName.YVONNE]: {Factory: Yvonne, compatibility: 'colonies'},
    // [CardName.ZAN]: {Factory: Zan, compatibility: 'turmoil'},
  },
});
