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
import {ColonialOne} from './ColonialOne';
import {HydrogenBombardment} from './HydrogenBombardment';
import {VitalColony} from './VitalColony';
import {StrategicBasePlanning} from './StrategicBasePlanning';
import {NitrateReducers} from './NitrateReducers';
import {ExperiencedMartians} from './ExperiencedMartians';
import {TradeInfrastructure} from './TradeInfrastructure';
import {GeothermalVent} from './GeothermalVent';
import {AccumulatedKnowledge} from './AccumulatedKnowledge';
import {BotanicalHarvest} from './BotanicalHarvest';
import {MartianLumberYard} from './MartianLumberYard';
import {FortifiedOutpost} from './FortifiedOutpost';

export const COMMUNITY_CARD_MANIFEST = new CardManifest({
  module: GameModule.Community,
  projectCards: [],
  corporationCards: [
    {cardName: CardName.AGRICOLA_INC, Factory: AgricolaInc},
    {cardName: CardName.PROJECT_WORKSHOP, Factory: ProjectWorkshop},
    {cardName: CardName.INCITE, Factory: Incite},
    {cardName: CardName.PLAYWRIGHTS, Factory: Playwrights},
    {cardName: CardName.MIDAS, Factory: Midas},
    {cardName: CardName.COLONIAL_ONE, Factory: ColonialOne},
  ],
  preludeCards: [
    {cardName: CardName.RESEARCH_GRANT, Factory: ResearchGrant},
    {
      cardName: CardName.VALUABLE_GASES,
      Factory: ValuableGases,
      compatibility: GameModule.Venus,
    },
    {
      cardName: CardName.VENUS_FIRST,
      Factory: VenusFirst,
      compatibility: GameModule.Venus,
    },
    {
      cardName: CardName.AEROSPACE_MISSION,
      Factory: AerospaceMission,
      compatibility: GameModule.Colonies,
    },
    {
      cardName: CardName.TRADE_ADVANCE,
      Factory: TradeAdvance,
      compatibility: GameModule.Colonies,
    },
    {
      cardName: CardName.POLITICAL_UPRISING,
      Factory: PoliticalUprising,
      compatibility: GameModule.Turmoil,
    },
    {
      cardName: CardName.BY_ELECTION,
      Factory: ByElection,
      compatibility: GameModule.Turmoil,
    },
    {
      cardName: CardName.HYDROGEN_BOMBARDMENT,
      Factory: HydrogenBombardment,
      compatibility: GameModule.Venus,
    },
    {
      cardName: CardName.VITAL_COLONY,
      Factory: VitalColony,
      compatibility: GameModule.Colonies,
    },
    {
      cardName: CardName.STRATEGIC_BASE_PLANNING,
      Factory: StrategicBasePlanning,
      compatibility: GameModule.Colonies,
    },
    {
      cardName: CardName.NITRATE_REDUCERS,
      Factory: NitrateReducers,
      compatibility: GameModule.Venus,
    },
    {
      cardName: CardName.EXPERIENCED_MARTIANS,
      Factory: ExperiencedMartians,
      compatibility: GameModule.Turmoil,
    },
    {
      cardName: CardName.TRADE_INFRASTRUCTURE,
      Factory: TradeInfrastructure,
      compatibility: GameModule.Colonies,
    },
    {
      cardName: CardName.GEOTHERMAL_VENT,
      Factory: GeothermalVent,
    },
    {
      cardName: CardName.ACCUMULATED_KNOWLEDGE,
      Factory: AccumulatedKnowledge,
    },
    {
      cardName: CardName.BOTANICAL_HARVEST,
      Factory: BotanicalHarvest,
    },
    {
      cardName: CardName.MARTIAN_LUMBER_YARD,
      Factory: MartianLumberYard,
    },
    {
      cardName: CardName.FORTIFIED_OUTPOST,
      Factory: FortifiedOutpost,
    },
  ],
});
