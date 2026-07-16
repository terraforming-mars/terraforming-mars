import {AerospaceMission} from './AerospaceMission';
import {AgricolaInc} from './AgricolaInc';
import {Athena} from './Athena';
import {ByElection} from './ByElection';
import {CardName} from '../../../common/cards/CardName';
import {CuriosityII} from './CuriosityII';
import {Eris} from './Eris';
import {ExecutiveOrder} from './ExecutiveOrder';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {Incite} from './Incite';
import {JunkVentures} from './JunkVentures';
import {LeadershipSummit} from './LeadershipSummit';
import {Midas} from './Midas';
import {ModuleManifest} from '../ModuleManifest';
import {Playwrights} from './Playwrights';
import {PoliticalUprising} from './PoliticalUprising';
import {ProjectWorkshop} from './ProjectWorkshop';
import {ResearchGrant} from './ResearchGrant';
import {SpecialDesignProxy} from './SpecialDesignProxy';
import {TradeAdvance} from './TradeAdvance';
import {UnitedNationsMissionOne} from './UnitedNationsMissionOne';
import {ValuableGases} from './ValuableGases';

export const COMMUNITY_CARD_MANIFEST = new ModuleManifest({
  module: 'community',
  corporationCards: {
    [CardName.AGRICOLA_INC]: {Factory: AgricolaInc},
    [CardName.PROJECT_WORKSHOP]: {Factory: ProjectWorkshop},
    [CardName.INCITE]: {Factory: Incite, compatibility: 'turmoil'},
    [CardName.PLAYWRIGHTS]: {Factory: Playwrights},
    [CardName.CURIOSITY_II]: {Factory: CuriosityII},
    [CardName.MIDAS]: {Factory: Midas},
    [CardName.UNITED_NATIONS_MISSION_ONE]: {Factory: UnitedNationsMissionOne},
    [CardName.JUNK_VENTURES]: {Factory: JunkVentures},
    [CardName.ERIS]: {Factory: Eris, compatibility: 'ares'},
    [CardName.ATHENA]: {Factory: Athena, compatibility: 'ares'},
  },
  preludeCards: {
    [CardName.RESEARCH_GRANT]: {Factory: ResearchGrant},
    [CardName.VALUABLE_GASES]: {Factory: ValuableGases, compatibility: 'venus'},
    [CardName.AEROSPACE_MISSION]: {Factory: AerospaceMission, compatibility: 'colonies'},
    [CardName.TRADE_ADVANCE]: {Factory: TradeAdvance, compatibility: 'colonies'},
    [CardName.POLITICAL_UPRISING]: {Factory: PoliticalUprising, compatibility: 'turmoil'},
    [CardName.BY_ELECTION]: {Factory: ByElection, compatibility: 'turmoil'},
    [CardName.EXECUTIVE_ORDER]: {Factory: ExecutiveOrder, compatibility: 'turmoil'},
  },
  projectCards: {
    [CardName.SPECIAL_DESIGN_PROXY]: {Factory: SpecialDesignProxy, instantiate: false},
  },
  globalEvents: {
    [GlobalEventName.LEADERSHIP_SUMMIT]: {Factory: LeadershipSummit},
  },
});
