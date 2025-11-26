import {CardName} from '@/common/cards/CardName';
import {ModuleManifest} from '@/server/cards/ModuleManifest';

import {Apollo} from '@/server/cards/ceos/Apollo';
import {Asimov} from '@/server/cards/ceos/Asimov';
import {Bjorn} from '@/server/cards/ceos/Bjorn';
import {Caesar} from '@/server/cards/ceos/Caesar';
import {Clarke} from '@/server/cards/ceos/Clarke';
import {Duncan} from '@/server/cards/ceos/Duncan';
import {Ender} from '@/server/cards/ceos/Ender';
import {Faraday} from '@/server/cards/ceos/Faraday';
import {Floyd} from '@/server/cards/ceos/Floyd';
import {Gaia} from '@/server/cards/ceos/Gaia';
import {Gordon} from '@/server/cards/ceos/Gordon';
import {Greta} from '@/server/cards/ceos/Greta';
import {HAL9000} from '@/server/cards/ceos/HAL9000';
import {Huan} from '@/server/cards/ceos/Huan';
import {Ingrid} from '@/server/cards/ceos/Ingrid';
import {Jansson} from '@/server/cards/ceos/Jansson';
import {Karen} from '@/server/cards/ceos/Karen';
import {Lowell} from '@/server/cards/ceos/Lowell';
import {Maria} from '@/server/cards/ceos/Maria';
import {Musk} from '@/server/cards/ceos/Musk';
import {Naomi} from '@/server/cards/ceos/Naomi';
import {Neil} from '@/server/cards/ceos/Neil';
import {Oscar} from '@/server/cards/ceos/Oscar';
import {Petra} from '@/server/cards/ceos/Petra';
import {Quill} from '@/server/cards/ceos/Quill';
import {Rogers} from '@/server/cards/ceos/Rogers';
import {Ryu} from '@/server/cards/ceos/Ryu';
import {Shara} from '@/server/cards/ceos/Shara';
import {Stefan} from '@/server/cards/ceos/Stefan';
import {Tate} from '@/server/cards/ceos/Tate';
import {Ulrich} from '@/server/cards/ceos/Ulrich';
import {VanAllen} from '@/server/cards/ceos/VanAllen';
import {Will} from '@/server/cards/ceos/Will';
import {Xavier} from '@/server/cards/ceos/Xavier';
import {Xu} from '@/server/cards/ceos/Xu';
import {Yvonne} from '@/server/cards/ceos/Yvonne';
import {Zan} from '@/server/cards/ceos/Zan';


import {CoLeadership} from '@/server/cards/ceos/CoLeadership';

export const CEO_CARD_MANIFEST = new ModuleManifest({
  module: 'ceo',
  ceoCards: {
    [CardName.APOLLO]: {Factory: Apollo, compatibility: 'moon'},
    [CardName.ASIMOV]: {Factory: Asimov},
    [CardName.BJORN]: {Factory: Bjorn},
    [CardName.CAESAR]: {Factory: Caesar, compatibility: 'ares'},
    [CardName.CLARKE]: {Factory: Clarke},
    [CardName.DUNCAN]: {Factory: Duncan},
    [CardName.ENDER]: {Factory: Ender},
    [CardName.FARADAY]: {Factory: Faraday},
    [CardName.FLOYD]: {Factory: Floyd},
    [CardName.GAIA]: {Factory: Gaia, compatibility: 'ares'},
    [CardName.GORDON]: {Factory: Gordon},
    [CardName.GRETA]: {Factory: Greta},
    [CardName.HAL9000]: {Factory: HAL9000},
    [CardName.HUAN]: {Factory: Huan, compatibility: 'colonies'},
    [CardName.INGRID]: {Factory: Ingrid},
    [CardName.JANSSON]: {Factory: Jansson},
    [CardName.KAREN]: {Factory: Karen, compatibility: 'prelude'},
    [CardName.LOWELL]: {Factory: Lowell},
    [CardName.MARIA]: {Factory: Maria, compatibility: 'colonies'},
    [CardName.MUSK]: {Factory: Musk},
    [CardName.NAOMI]: {Factory: Naomi, compatibility: 'colonies'},
    [CardName.NEIL]: {Factory: Neil, compatibility: 'moon'},
    [CardName.OSCAR]: {Factory: Oscar, compatibility: 'turmoil'},
    [CardName.PETRA]: {Factory: Petra, compatibility: 'turmoil'},
    [CardName.QUILL]: {Factory: Quill, compatibility: 'venus'},
    [CardName.ROGERS]: {Factory: Rogers, compatibility: 'venus'},
    [CardName.RYU]: {Factory: Ryu},
    [CardName.SHARA]: {Factory: Shara, compatibility: 'pathfinders'},
    [CardName.STEFAN]: {Factory: Stefan},
    [CardName.TATE]: {Factory: Tate},
    [CardName.ULRICH]: {Factory: Ulrich},
    [CardName.VANALLEN]: {Factory: VanAllen},
    [CardName.WILL]: {Factory: Will, compatibility: 'venus'},
    [CardName.XAVIER]: {Factory: Xavier, compatibility: 'prelude'},
    [CardName.XU]: {Factory: Xu, compatibility: 'venus'},
    [CardName.YVONNE]: {Factory: Yvonne, compatibility: 'colonies'},
    [CardName.ZAN]: {Factory: Zan, compatibility: 'turmoil'},
  },
  preludeCards: {
    [CardName.CO_LEADERSHIP]: {Factory: CoLeadership},
  },
});
