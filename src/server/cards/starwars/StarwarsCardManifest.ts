import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {ToscheStation} from './ToscheStation';
import {CloudCity} from './CloudCity';
import {TradeEmbargo} from './TradeEmbargo';
import {CloneTroopers} from './CloneTroopers';
import {BeholdTheEmperor} from './BeholdTheEmperor';
import {ForestMoon} from './ForestMoon';
import {TakondaCastle} from './TakondaCastle';
import {ReySkywalker} from './ReySkywalker';
import {ToolWithTheFirstOrder} from './ToolWithTheFirstOrder';

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
