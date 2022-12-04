import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';

// import {Apollo} from './Apollo';
// import {Asimov} from './Asimov';
// import {Bjorn} from './Bjorn';
// import {Caesar} from './Caesar';
// import {Clarke} from './Clarke';
// import {Duncan} from './Duncan';
// import {Ender} from './Ender';
// import {Faraday} from './Faraday';
// import {Floyd} from './Floyd';
// import {Gaia} from './Gaia';
// import {Gordon} from './Gordon';
// import {Greta} from './Greta';
import {HAL9000} from './HAL9000';
// import {Huan} from './Huan';
// import {Ingrid} from './Ingrid';
// import {Jansson} from './Jansson';
// import {Karen} from './Karen';
// import {Lowell} from './Lowell';
// import {Maria} from './Maria';
// import {Musk} from './Musk';
// import {Naomi} from './Naomi';
// import {Neil} from './Neil';
// import {Oscar} from './Oscar';
// import {Petra} from './Petra';
// import {Quill} from './Quill';
// import {Rogers} from './Rogers';
// import {Ryu} from './Ryu';
// import {Stefan} from './Stefan';
// import {Tate} from './Tate';
// import {Ulrich} from './Ulrich';
// import {VanAllen} from './VanAllen';
// import {Will} from './Will';
// import {Xavier} from './Xavier';
// import {Yvonne} from './Yvonne';
// import {Zan} from './Zan';

export const LEADER_CARD_MANIFEST = new ModuleManifest({
  module: 'leader',
  // module: GameModule.Leader,
  leaderCards: [
    // {cardName: CardName.APOLLO, Factory: Apollo, compatibility: GameModule.Moon},
    // {cardName: CardName.ASIMOV, Factory: Asimov},
    // {cardName: CardName.BJORN, Factory: Bjorn},
    // {cardName: CardName.CAESAR, Factory: Caesar, compatibility: GameModule.Ares},
    // {cardName: CardName.CLARKE, Factory: Clarke},
    // {cardName: CardName.DUNCAN, Factory: Duncan},
    // {cardName: CardName.ENDER, Factory: Ender},
    // {cardName: CardName.FARADAY, Factory: Faraday},
    // {cardName: CardName.FLOYD, Factory: Floyd},
    // {cardName: CardName.GAIA, Factory: Gaia, compatibility: GameModule.Ares},
    // {cardName: CardName.GORDON, Factory: Gordon},
    // {cardName: CardName.GRETA, Factory: Greta},
    {cardName: CardName.HAL9000, Factory: HAL9000},
    // {cardName: CardName.HUAN, Factory: Huan, compatibility: GameModule.Colonies},
    // {cardName: CardName.INGRID, Factory: Ingrid},
    // {cardName: CardName.JANSSON, Factory: Jansson},
    // {cardName: CardName.KAREN, Factory: Karen, compatibility: GameModule.Prelude},
    // {cardName: CardName.LOWELL, Factory: Lowell, compatibility: GameModule.Prelude},
    // {cardName: CardName.MARIA, Factory: Maria, compatibility: GameModule.Colonies},
    // {cardName: CardName.MUSK, Factory: Musk},
    // {cardName: CardName.NAOMI, Factory: Naomi, compatibility: GameModule.Colonies},
    // {cardName: CardName.NEIL, Factory: Neil, compatibility: GameModule.Moon},
    // {cardName: CardName.OSCAR, Factory: Oscar, compatibility: GameModule.Turmoil},
    // {cardName: CardName.PETRA, Factory: Petra, compatibility: GameModule.Turmoil},
    // {cardName: CardName.QUILL, Factory: Quill, compatibility: GameModule.Venus},
    // {cardName: CardName.ROGERS, Factory: Rogers, compatibility: GameModule.Venus},
    // {cardName: CardName.RYU, Factory: Ryu},
    // {cardName: CardName.STEFAN, Factory: Stefan},
    // {cardName: CardName.TATE, Factory: Tate},
    // {cardName: CardName.ULRICH, Factory: Ulrich},
    // {cardName: CardName.VAN_ALLEN, Factory: VanAllen},
    // {cardName: CardName.WILL, Factory: Will, compatibility: GameModule.Venus},
    // {cardName: CardName.XAVIER, Factory: Xavier, compatibility: GameModule.Prelude},
    // {cardName: CardName.YVONNE, Factory: Yvonne, compatibility: GameModule.Colonies},
    // {cardName: CardName.ZAN, Factory: Zan, compatibility: GameModule.Turmoil},
  ],
});
