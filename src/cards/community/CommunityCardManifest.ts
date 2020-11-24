import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {AgricolaInc} from './corporations/AgricolaInc';
import {Incite} from './corporations/Incite';
import {Playwrights} from './corporations/Playwrights';
import {ProjectWorkshop} from './corporations/ProjectWorkshop';
import {ResearchGrant} from './preludes/ResearchGrant';
import {ValuableGases} from './preludes/ValuableGases';
import {VenusFirst} from './preludes/VenusFirst';
import {AerospaceMission} from './preludes/AerospaceMission';
import {TradeAdvance} from './preludes/TradeAdvance';
import {PoliticalUprising} from './preludes/PoliticalUprising';
import {ByElection} from './preludes/ByElection';
import {Midas} from './corporations/Midas';
import {ColonialOne} from './corporations/ColonialOne';
import {HydrogenBombardment} from './preludes/HydrogenBombardment';
import {VitalColony} from './preludes/VitalColony';
import {StrategicBasePlanning} from './preludes/StrategicBasePlanning';
import {NitrateReducers} from './preludes/NitrateReducers';
import {ExperiencedMartians} from './preludes/ExperiencedMartians';
import {TradeInfrastructure} from './preludes/TradeInfrastructure';
import {GeothermalVent} from './preludes/GeothermalVent';
import {AccumulatedKnowledge} from './preludes/AccumulatedKnowledge';
import {BotanicalHarvest} from './preludes/BotanicalHarvest';
import {MartianLumberYard} from './preludes/MartianLumberYard';
import {FortifiedOutpost} from './preludes/FortifiedOutpost';

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
