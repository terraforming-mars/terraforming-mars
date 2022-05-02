import {CardName} from '../../common/cards/CardName';
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
import {CuriosityII} from './CuriosityII';
import {ExecutiveOrder} from './ExecutiveOrder';

export const COMMUNITY_CARD_MANIFEST = new CardManifest({
  module: 'community',
  projectCards: [],
  corporationCards: [
    {cardName: CardName.AGRICOLA_INC, Factory: AgricolaInc},
    {cardName: CardName.PROJECT_WORKSHOP, Factory: ProjectWorkshop},
    {cardName: CardName.INCITE, Factory: Incite, compatibility: 'turmoil'},
    {cardName: CardName.PLAYWRIGHTS, Factory: Playwrights},
    {cardName: CardName.CURIOSITY_II, Factory: CuriosityII},
    {cardName: CardName.MIDAS, Factory: Midas},
  ],
  preludeCards: [
    {cardName: CardName.RESEARCH_GRANT, Factory: ResearchGrant},
    {
      cardName: CardName.VALUABLE_GASES,
      Factory: ValuableGases,
      compatibility: 'venus',
    },
    {
      cardName: CardName.VENUS_FIRST,
      Factory: VenusFirst,
      compatibility: 'venus',
    },
    {
      cardName: CardName.AEROSPACE_MISSION,
      Factory: AerospaceMission,
      compatibility: 'colonies',
    },
    {
      cardName: CardName.TRADE_ADVANCE,
      Factory: TradeAdvance,
      compatibility: 'colonies',
    },
    {
      cardName: CardName.POLITICAL_UPRISING,
      Factory: PoliticalUprising,
      compatibility: 'turmoil',
    },
    {
      cardName: CardName.BY_ELECTION,
      Factory: ByElection,
      compatibility: 'turmoil',
    },
    {cardName: CardName.EXECUTIVE_ORDER, Factory: ExecutiveOrder, compatibility: 'turmoil'},
  ],
});
