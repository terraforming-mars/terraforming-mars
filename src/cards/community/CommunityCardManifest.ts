import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {AgricolaInc} from './AgricolaInc';
import {Incite} from './Incite';
import {Playwrights} from './Playwrights';
import {ProjectWorkshop} from './ProjectWorkshop';
import {ResearchGrant} from './ResearchGrant';
import {ValuableGases} from './ValuableGases';
import {VenusFirst} from './VenusFirst';
import {AerospaceMission} from './AerospaceMission';
import {TradeAdvance} from './TradeAdvance';
import {PoliticalUprising} from './PoliticalUprising';
import {ByElection} from './ByElection';
import {Midas} from './Midas';

export const COMMUNITY_CARD_MANIFEST = new CardManifest({
  module: GameModule.Community,
  projectCards: [],
  corporationCards: [
    CardManifest.dynamicFactory(CardName.AGRICOLA_INC, AgricolaInc),
    CardManifest.dynamicFactory(CardName.PROJECT_WORKSHOP, ProjectWorkshop),
    CardManifest.dynamicFactory(CardName.INCITE, Incite, GameModule.Turmoil),
    CardManifest.staticFactory(CardName.PLAYWRIGHTS, new Playwrights()),
    CardManifest.dynamicFactory(CardName.MIDAS, Midas),
  ],
  preludeCards: [
    CardManifest.dynamicFactory(CardName.RESEARCH_GRANT, ResearchGrant),
    CardManifest.dynamicFactory(CardName.VALUABLE_GASES, ValuableGases, GameModule.Venus),
    CardManifest.dynamicFactory(CardName.VENUS_FIRST, VenusFirst, GameModule.Venus),
    CardManifest.dynamicFactory(CardName.AEROSPACE_MISSION, AerospaceMission, GameModule.Colonies),
    CardManifest.dynamicFactory(CardName.TRADE_ADVANCE, TradeAdvance, GameModule.Colonies),
    CardManifest.dynamicFactory(CardName.POLITICAL_UPRISING, PoliticalUprising, GameModule.Turmoil),
    CardManifest.dynamicFactory(CardName.BY_ELECTION, ByElection, GameModule.Turmoil),
  ],
});
