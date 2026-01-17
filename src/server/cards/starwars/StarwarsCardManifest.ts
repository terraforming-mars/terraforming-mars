import {CardName} from '@/common/cards/CardName';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {ToscheStation} from '@/server/cards/starwars/ToscheStation';
import {CloudCity} from '@/server/cards/starwars/CloudCity';
import {TradeEmbargo} from '@/server/cards/starwars/TradeEmbargo';
import {CloneTroopers} from '@/server/cards/starwars/CloneTroopers';
import {BeholdTheEmperor} from '@/server/cards/starwars/BeholdTheEmperor';
import {ForestMoon} from '@/server/cards/starwars/ForestMoon';
import {TakondaCastle} from '@/server/cards/starwars/TakondaCastle';
import {ReySkywalker} from '@/server/cards/starwars/ReySkywalker';
import {ToolWithTheFirstOrder} from '@/server/cards/starwars/ToolWithTheFirstOrder';

export const STAR_WARS_CARD_MANIFEST = new ModuleManifest({
  module: 'starwars',
  projectCards: {
    [CardName.TRADE_EMBARGO]: {Factory: TradeEmbargo, compatibility: 'colonies'},
    [CardName.CLONE_TROOPERS]: {Factory: CloneTroopers},
    [CardName.BEHOLD_THE_EMPEROR]: {Factory: BeholdTheEmperor, compatibility: 'turmoil'},
    [CardName.TOSCHE_STATION]: {Factory: ToscheStation},
    [CardName.CLOUD_CITY]: {Factory: CloudCity, compatibility: 'venus'},
    [CardName.FOREST_MOON]: {Factory: ForestMoon},
    [CardName.TAKONDA_CASTLE]: {Factory: TakondaCastle},
    [CardName.TOOL_WITH_THE_FIRST_ORDER]: {Factory: ToolWithTheFirstOrder},
    [CardName.REY_SKYWALKER]: {Factory: ReySkywalker},
  },
});
