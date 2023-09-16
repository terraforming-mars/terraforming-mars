import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AppliedScience} from './AppliedScience';
import {CeresTechMarket} from './CeresTechMarket';
import {ColonyTradeHub} from './ColonyTradeHub';
import {Ecotec} from './Ecotec';
import {IshtarExpedition} from './IshtarExpedition';
import {L1TradeTerminal} from './L1TradeTerminal';
import {NirgalEnterprises} from '../prelude2/NirgalEnterprises';
import {NobelPrize} from './NobelPrize';
import {OldMiningColony} from './OldMiningColony';
import {PalladinShipping} from './PalladinShipping';
import {RedAppeasement} from './RedAppeasement';
import {Sagitta} from './Sagitta';
import {SummitLogistics} from './SummitLogistics';

export const PRELUDE2_CARD_MANIFEST = new ModuleManifest({
  // TODO(kberg): make 'prelude2' by 2024-04-01
  module: 'promo',
  projectCards: {
    [CardName.ISHTAR_EXPEDITION]: {Factory: IshtarExpedition, compatibility: 'venus'},
    [CardName.SUMMIT_LOGISTICS]: {Factory: SummitLogistics, compatibility: 'turmoil'},
    [CardName.CERES_TECH_MARKET]: {Factory: CeresTechMarket, compatibility: 'colonies'},
    [CardName.RED_APPEASEMENT]: {Factory: RedAppeasement, compatibility: 'turmoil'},
    [CardName.L1_TRADE_TERMINAL]: {Factory: L1TradeTerminal, compatibility: 'colonies'},
  },

  preludeCards: {
    [CardName.APPLIED_SCIENCE]: {Factory: AppliedScience},
    [CardName.NOBEL_PRIZE]: {Factory: NobelPrize},
    [CardName.COLONY_TRADE_HUB]: {Factory: ColonyTradeHub, compatibility: 'colonies'},
    [CardName.OLD_MINING_COLONY]: {Factory: OldMiningColony, compatibility: 'colonies'},
    // [CardName.FOCUSED_ORGANIZATION]: {Factory: FocusedOrganization},
  },

  corporationCards: {
    [CardName.NIRGAL_ENTERPRISES]: {Factory: NirgalEnterprises},
    [CardName.PALLADIN_SHIPPING]: {Factory: PalladinShipping},
    [CardName.SAGITTA]: {Factory: Sagitta},
    [CardName.ECOTEC]: {Factory: Ecotec},
    // [CardName.SPIRE]: {Factory: Spire},
  },
});
