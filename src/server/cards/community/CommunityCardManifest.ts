import {AerospaceMission} from '@/server/cards/community/AerospaceMission';
import {AgricolaInc} from '@/server/cards/community/AgricolaInc';
import {Athena} from '@/server/cards/community/Athena';
import {ByElection} from '@/server/cards/community/ByElection';
import {CardName} from '@/common/cards/CardName';
import {CuriosityII} from '@/server/cards/community/CuriosityII';
import {Eris} from '@/server/cards/community/Eris';
import {ExecutiveOrder} from '@/server/cards/community/ExecutiveOrder';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {Incite} from '@/server/cards/community/Incite';
import {JunkVentures} from '@/server/cards/community/JunkVentures';
import {LeadershipSummit} from '@/server/cards/community/LeadershipSummit';
import {Midas} from '@/server/cards/community/Midas';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {Playwrights} from '@/server/cards/community/Playwrights';
import {PoliticalUprising} from '@/server/cards/community/PoliticalUprising';
import {ProjectWorkshop} from '@/server/cards/community/ProjectWorkshop';
import {ResearchGrant} from '@/server/cards/community/ResearchGrant';
import {SpecialDesignProxy} from '@/server/cards/community/SpecialDesignProxy';
import {TradeAdvance} from '@/server/cards/community/TradeAdvance';
import {UnitedNationsMissionOne} from '@/server/cards/community/UnitedNationsMissionOne';
import {ValuableGases} from '@/server/cards/community/ValuableGases';

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
