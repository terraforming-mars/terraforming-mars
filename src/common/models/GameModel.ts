import {GameOptionsModel} from './GameOptionsModel';
import {ColonyModel} from './ColonyModel';
import {Color} from '../Color';
import {TurmoilModel} from './TurmoilModel';
import {ClaimedMilestoneModel} from './ClaimedMilestoneModel';
import {FundedAwardModel} from './FundedAwardModel';
import {Phase} from '../Phase';
import {AresData} from '../ares/AresData';
import {SpaceModel} from './SpaceModel';
import {MoonModel} from './MoonModel';
import {PathfindersModel} from './PathfindersModel';
import {SpectatorId} from '../Types';
import {ColonyName} from '../colonies/ColonyName';
import {GlobalParameter} from '../GlobalParameter';

// Common data about a game not assocaited with a player (eg the temperature.)
export type GameModel = {
  aresData: AresData | undefined;
  awards: Array<FundedAwardModel>;
  colonies: Array<ColonyModel>;
  discardedColonies: Array<ColonyName>;
  deckSize: number;
  expectedPurgeTimeMs: number;
  experimentalReset?: boolean;
  gameAge: number;
  gameOptions: GameOptionsModel;
  generation: number;
  globalsPerGeneration: Array<Partial<Record<GlobalParameter, number>>>,
  isSoloModeWin: boolean;
  lastSoloGeneration: number,
  milestones: Array<ClaimedMilestoneModel>;
  moon: MoonModel | undefined;
  oceans: number;
  oxygenLevel: number;
  passedPlayers: Array<Color>;
  pathfinders: PathfindersModel | undefined;
  phase: Phase;
  spaces: Array<SpaceModel>;
  spectatorId?: SpectatorId;
  step: number;
  temperature: number;
  isTerraformed: boolean;
  turmoil: TurmoilModel | undefined;
  undoCount: number;
  venusScaleLevel: number;
}
